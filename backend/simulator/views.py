from django.shortcuts import render
from django.forms.models import model_to_dict
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, viewsets
from rest_framework.authentication import BasicAuthentication, SessionAuthentication
import datetime
from threading import Thread

from prevdata.models import AdmInfo, DischargeInfo, Vital, Lab
from .models import AdmInfoSim, DischargeInfoSim, VitalSim, LabSim, SimStatus
from .serializers import (
    SimStatusSerializer, AdmInfoSimSerializer, DischargeInfoSimSerializer, 
    VitalSimSerializer, LabSimSerializer
)


def stack_data(speed, from_prev=1):
    # 사용될 models
    PREV_MODELS = [AdmInfo, DischargeInfo, Vital, Lab]
    SIM_MODELS = [AdmInfoSim, DischargeInfoSim, VitalSim, LabSim]

    # 시작 전 simulation table을 TRUNCATE 시행 후 시작
    for SimModel in SIM_MODELS:
        SimModel.truncate()

    # 이전 종료된 value_datetime 시각(time_last)부터 시작할 지 확인
    if from_prev:
        time_last_value = SimStatus.objects.get(key="time_last").value
        time_last = datetime.datetime.strptime(time_last_value, "%Y-%m-%d %H:%M:%S")
        start_time = time_last
    else:
        start_time = datetime.datetime(2018, 1, 1, 0, 0, 0)
    end_time = start_time + datetime.timedelta(seconds=speed)

    # 현재 simulation 시행 상태 확인 - simulation은 하나만 시행되어야 함
    is_active_query = SimStatus.objects.get(key="is_active") 
    is_active = is_active_query.value

    # 외부에서 SimStatus의 is_active를 0으로 변경시키면 종료됨
    while is_active:
        run_starttime = datetime.datetime.now()
        print(start_time, run_starttime)

        for PrevModel, SimModel in zip(PREV_MODELS, SIM_MODELS):
            new_query = PrevModel.objects.filter(value_datetime__gte=start_time, value_datetime__lt=end_time)
            new_dicts = [model_to_dict(item) for item in new_query]
            print(PrevModel, len(new_dicts))

            for new_dict in new_dicts:
                new_dict["new_datetime"] = timezone.now()
                model = SimModel(**new_dict)
                model.save()
        
        start_time = start_time + datetime.timedelta(seconds=speed)
        end_time = end_time + datetime.timedelta(seconds=speed)
        is_active = int(SimStatus.objects.get(key="is_active").value)

        run_endtime = datetime.datetime.now()
        time_spent = run_endtime - run_starttime
        print(end_time, run_endtime, time_spent)
    # 마지막 start_time을 SimStatus의 time_last에 기록해 둠
    time_last_query = SimStatus.objects.get(key="time_last")
    time_last_query.value = start_time
    time_last_query.save()
    

class SimulatorAPI(APIView):
    authentication_classes = (BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        operation = request.data["operation"]
        is_active_query = SimStatus.objects.get(key="is_active")

        if operation == "start":
            speed = request.data["speed"]
            from_prev = request.data["from_prev"]
            proc = Thread(target=stack_data, args=(speed, from_prev)) 
            if int(is_active_query.value):
                result_text = "이미 simulation 시행 중입니다."
            else:
                is_active_query.value = 1
                is_active_query.save()
                proc.start()
                result_text = "simulation이 시작되었습니다."

        elif operation == "stop": 
            if int(is_active_query.value):         
                is_active_query.value = 0
                is_active_query.save() 
                result_text = "simulation이 중단되었습니다."
            else:
                result_text = "시행 중인 simulation이 없습니다."
        else:
            result_text = "명령 전달 실패"
        return Response(result_text)

from django.http import HttpResponse
def simstatus_initialize(request):
    time1 = SimStatus(key="time_last", value=datetime.datetime(2018, 1, 1, 0, 0, 0))
    time1.save()
    isactive1 = SimStatus(key="is_active", value=0)
    isactive1.save()
    return(HttpResponse("Initialize SimStatus successively!"))

class SimStatusViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = SimStatus.objects.all()
    serializer_class = SimStatusSerializer

class AdmInfoSimViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = AdmInfoSim.objects.all()
    serializer_class = AdmInfoSimSerializer

class DischargeInfoSimViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = DischargeInfoSim.objects.all()
    serializer_class = DischargeInfoSimSerializer

class VitalSimViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = VitalSim.objects.all()
    serializer_class = VitalSimSerializer

class LabSimViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = LabSim.objects.all()
    serializer_class = LabSimSerializer