from django.forms.models import model_to_dict
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, viewsets
from rest_framework.authentication import BasicAuthentication, SessionAuthentication, TokenAuthentication
from datetime import datetime, timedelta
from threading import Thread
import time
import math

from prevdata.models import HospInfo, Vital, Lab
from .models import HospInfoSim, VitalSim, LabSim, SimStats
from .serializers import (
    HospInfoSimSerializer,
    VitalSimSerializer, LabSimSerializer
)
from ewsdb.utils import status_update, status_get, get_first_time, get_last_time


# Simulator main function
def stack_data(speed, from_prev=1):

    # 사용될 models
    PREV_MODELS = [HospInfo, Vital, Lab]
    SIM_MODELS = [HospInfoSim, VitalSim, LabSim]

    # first_time을 데이터 첫 입원 날짜로 지정
    first_time = get_first_time()
    last_time = get_last_time()

    # 시작 전 simulation table을 TRUNCATE 시행 후 시작
    for SimModel in SIM_MODELS:
        SimModel.truncate()

    # 이전 종료된 value_datetime 시각(sim_data_last_time)부터 시작할 지 확인
    if from_prev:
        sim_data_last_time = status_get(SimStats, "sim_data_last_time", first_time)
        sim_data_start_time = sim_data_last_time
    else:
        sim_data_start_time = first_time    

    sim_start_time = timezone.now().replace(microsecond=0)

    # 시작 전 SimStats를 초기화하고 시작
    update_list = {
        "avg_save_time": 0,
        "sim_start_time": sim_start_time,
        "sim_last_time": sim_start_time,
        "sim_data_start_time": sim_data_start_time,
        "sim_data_last_time": sim_data_start_time,  
        "sim_data_duration": 0,
        "sim_duration": 0,    
        "sim_speed": 0, 
        "sim_hosp_n": 0,
        "sim_vital_n": 0,
        "sim_lab_n": 0,        
    }    
    status_update(SimStats, update_list)

    # 현재 simulation 시행 상태 확인 - simulation은 하나만 시행되어야 함
    is_active = SimStats.objects.get(id=1).is_active 

    # 외부에서 SimStats의 is_active를 0으로 변경시키면 종료됨
    n = 0
    sec = 0
    data_n = [0, 0, 0]
    unit_data_start_time = sim_data_start_time
    unit_data_last_time = unit_data_start_time + timedelta(seconds=speed) 
       
    while is_active and unit_data_start_time <= last_time:
        unit_start_time = timezone.now()  
        unit_n = []
        
        for i, (PrevModel, SimModel) in enumerate(zip(PREV_MODELS, SIM_MODELS)):
            new_queryset = PrevModel.objects.filter(value_datetime__gte=unit_data_start_time, value_datetime__lt=unit_data_last_time)
            new_dicts = [SimModel(**item) for item in new_queryset.values()]
            SimModel.objects.bulk_create(new_dicts)
            unit_n.append(len(new_dicts))
            data_n[i] += len(new_dicts)  

        unit_data_start_time = unit_data_last_time
        unit_data_last_time = unit_data_start_time + timedelta(seconds=speed)
        unit_end_time = timezone.now()
        time_spent = unit_end_time - unit_start_time
        time_spent = time_spent.seconds + time_spent.microseconds/1000000
        n += 1
        sec += time_spent
        print(unit_data_last_time, unit_n, f'{round(time_spent, 3)} | {round(sec/n, 3)}')
        print("---------------")
        is_active = SimStats.objects.get(id=1).is_active
        if is_active:
            sim_duration = (unit_end_time-sim_start_time).seconds
            sim_data_duration = (unit_data_last_time-sim_data_start_time).seconds
            sim_speed = sim_data_duration/sim_duration
            update_list = {
                "avg_save_time": round(sec/n, 3),
                "sim_data_last_time": unit_data_start_time.replace(microsecond=0),  
                "sim_last_time": unit_end_time.replace(microsecond=0),
                "sim_data_duration": math.floor(sim_data_duration/60),
                "sim_duration": math.floor(sim_duration/60),    
                "sim_speed": round(sim_speed), 
                "sim_hosp_n": data_n[0],
                "sim_vital_n": data_n[1],
                "sim_lab_n": data_n[2],      
            }
            status_update(SimStats, update_list)
 

class SimulatorAPI(APIView):
    authentication_classes = (TokenAuthentication, BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        operation = request.data["operation"]
        is_active_value = status_get(SimStats, "is_active", 0)

        if operation == "start":
            speed = request.data["speed"]
            from_prev = request.data["from_prev"]
            proc = Thread(target=stack_data, args=(speed, from_prev)) 
            if int(is_active_value):
                result_text = "이미 simulation 시행 중입니다."
            else:
                status_update(SimStats, {"is_active": 1})
                proc.start()
                result_text = "simulation이 시작되었습니다."

        elif operation == "stop": 
            if int(is_active_value):      
                status_update(SimStats, {"is_active": 0})
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
        items = SimStats.objects.filter(id=1).values()[0]
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