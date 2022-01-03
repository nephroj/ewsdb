from django.forms.models import model_to_dict
from django.utils import timezone
from django.db.models import Min
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, viewsets
from rest_framework.authentication import BasicAuthentication, SessionAuthentication, TokenAuthentication
from datetime import datetime, timedelta
from threading import Thread
import time
import math

from prevdata.models import HospInfo, Vital, Lab
from .models import HospInfoSim, VitalSim, LabSim, SimStatus
from .serializers import (
    HospInfoSimSerializer,
    VitalSimSerializer, LabSimSerializer
)
from ewsdb.utils import sim_status_update, sim_status_get


# 입원 데이터 상 첫 날짜 골라내기
def data_first_time():
    adm_date_min_int = HospInfo.objects.all().aggregate(Min("adm_date"))["adm_date__min"]
    adm_date_min  = datetime.strptime(str(adm_date_min_int), "%Y%m%d")
    # adm_date_min = adm_date_min_text[0:4] + "-" + adm_date_min_text[4:6] + "-" + adm_date_min_text[6:8]
    return str(adm_date_min)

# Simulator main function
def stack_data(speed, from_prev=1):
    # 사용될 models
    PREV_MODELS = [HospInfo, Vital, Lab]
    SIM_MODELS = [HospInfoSim, VitalSim, LabSim]

    # first_time을 데이터 첫 입원 날짜로 지정
    first_time = data_first_time()

    # 시작 전 simulation table을 TRUNCATE 시행 후 시작
    for SimModel in SIM_MODELS:
        SimModel.truncate()

    # 이전 종료된 value_datetime 시각(sim_data_last_time)부터 시작할 지 확인
    if from_prev:
        sim_data_last_time_q = sim_status_get("sim_data_last_time", first_time)
        sim_data_last_time = datetime.strptime(sim_data_last_time_q, "%Y-%m-%d %H:%M:%S")
        sim_data_start_time = sim_data_last_time
    else:
        sim_data_start_time = first_time
    
    sim_status_update("sim_data_start_time", sim_data_start_time)
    sim_start_time = timezone.now().replace(microsecond=0)
    sim_start_time_text = datetime.strftime(sim_start_time, "%Y-%m-%d %H:%M:%S")
    sim_status_update("sim_start_time", sim_start_time_text)

    # 시작 전 SimStatus를 초기화하고 시작
    update_list = [
        ["avg_save_time", 1],
        ["sim_start_time", sim_start_time],
        ["sim_data_last_time", sim_data_last_time],  
        ["sim_last_time", ""],
        ["sim_data_duration", 0],
        ["sim_duration", 0],    
        ["sim_speed", 0], 
        ["sim_hosp_n", 0],
        ["sim_vital_n", 0],
        ["sim_lab_n", 0],      
    ]
    keys = [item[0] for item in update_list]
    values = [item[1] for item in update_list]
    sim_status_update(keys, values)

    # 현재 simulation 시행 상태 확인 - simulation은 하나만 시행되어야 함
    is_active_query = SimStatus.objects.get(key="is_active") 
    is_active = is_active_query.value

    # 외부에서 SimStatus의 is_active를 0으로 변경시키면 종료됨
    n = 0
    sec = 0
    data_n = [0, 0, 0]
    unit_data_start_time = sim_data_start_time
    unit_data_last_time = unit_data_start_time + timedelta(seconds=speed)    
    while is_active:
        unit_start_time = timezone.now().replace(microsecond=0)        
        
        print(f'{unit_data_start_time} - {unit_data_last_time}')

        for i, (PrevModel, SimModel) in enumerate(zip(PREV_MODELS, SIM_MODELS)):
            new_queryset = PrevModel.objects.filter(value_datetime__gte=unit_data_start_time, value_datetime__lt=unit_data_last_time)

            print("save start:\t", timezone.now().replace(microsecond=0))
            new_dicts = [SimModel(**item, new_datetime=timezone.now()) for item in new_queryset.values()]
            SimModel.objects.bulk_create(new_dicts)
            data_n[i] += len(new_dicts)
            print("save end:\t", timezone.now().replace(microsecond=0), PrevModel, len(new_dicts))  

        unit_data_start_time = unit_data_last_time
        unit_data_last_time = unit_data_start_time + timedelta(seconds=speed)
        unit_end_time = timezone.now().replace(microsecond=0)
        time_spent = unit_end_time - unit_start_time
        time_spent = time_spent.seconds + time_spent.microseconds/1000000
        n += 1
        sec += time_spent
        print(data_n)
        print(f'{time_spent} | {sec/n}')
        print("---------------")
        is_active = int(SimStatus.objects.get(key="is_active").value)
        if int(is_active):
            sim_duration = (unit_end_time-sim_start_time).seconds
            sim_data_duration = (unit_data_last_time-sim_data_start_time).seconds
            sim_speed = sim_data_duration/sim_duration
            update_list = [
                ["avg_save_time", round(sec/n, 3)],
                ["sim_data_last_time", unit_data_start_time],  
                ["sim_last_time", unit_end_time],
                ["sim_data_duration", math.floor(sim_data_duration/60)],
                ["sim_duration", math.floor(sim_duration/60)],    
                ["sim_speed", round(sim_speed)], 
                ["sim_hosp_n", data_n[0]],
                ["sim_vital_n", data_n[1]],
                ["sim_lab_n", data_n[2]],      
            ]
            keys = [item[0] for item in update_list]
            values = [item[1] for item in update_list]
            sim_status_update(keys, values)
 
    # # 실행 마친 후에도 simulation table을 TRUNCATE
    # for SimModel in SIM_MODELS:
    #     SimModel.truncate()


class SimulatorAPI(APIView):
    authentication_classes = (TokenAuthentication, BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        operation = request.data["operation"]
        is_active_value = sim_status_get("is_active", 0)

        if operation == "start":
            speed = request.data["speed"]
            from_prev = request.data["from_prev"]
            proc = Thread(target=stack_data, args=(speed, from_prev)) 
            if int(is_active_value):
                result_text = "이미 simulation 시행 중입니다."
            else:
                sim_status_update("is_active", 1)
                proc.start()
                result_text = "simulation이 시작되었습니다."

        elif operation == "stop": 
            if int(is_active_value):      
                sim_status_update("is_active", 0)
                result_text = "simulation이 중단되었습니다."
            else:
                result_text = "시행 중인 simulation이 없습니다."
        else:
            result_text = "명령 전달 실패"
        return Response(result_text)


# Rest Framework Viewsets
class SimStatusAPIView(APIView):
    authentication_classes = (TokenAuthentication, BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        qs = SimStatus.objects.all()
        items = [model_to_dict(item) for item in qs]
        return Response(items)

class HospInfoSimViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (TokenAuthentication, BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = HospInfoSim.objects.all()
    serializer_class = HospInfoSimSerializer

class VitalSimViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (TokenAuthentication, BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = VitalSim.objects.all()
    serializer_class = VitalSimSerializer

class LabSimViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (TokenAuthentication, BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = LabSim.objects.all()
    serializer_class = LabSimSerializer