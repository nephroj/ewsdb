from django.shortcuts import render
from django.forms.models import model_to_dict
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, viewsets
from rest_framework.authentication import BasicAuthentication, SessionAuthentication, TokenAuthentication
from datetime import datetime, timedelta
from threading import Thread

from prevdata.models import HospInfo, Vital, Lab
from .models import HospInfoSim, VitalSim, LabSim, SimStatus
from .serializers import (
    HospInfoSimSerializer,
    VitalSimSerializer, LabSimSerializer
)

import time
def stack_data(speed, from_prev=1):
    # 사용될 models
    PREV_MODELS = [HospInfo, Vital, Lab]
    SIM_MODELS = [HospInfoSim, VitalSim, LabSim]

    # 시작 전 simulation table을 TRUNCATE 시행 후 시작
    for SimModel in SIM_MODELS:
        SimModel.truncate()

    # 이전 종료된 value_datetime 시각(time_last)부터 시작할 지 확인
    if from_prev:
        time_last_query = SimStatus.objects.get(key="time_last")
        time_last = datetime.strptime(time_last_query.value, "%Y-%m-%d %H:%M:%S")
        start_time = time_last
    else:
        start_time = datetime(2018, 1, 1, 0, 0)
    start_time_query = SimStatus.objects.get(key="start_time")
    start_time_query.value = start_time
    start_time_query.save()
    end_time = start_time + timedelta(seconds=speed)

    # 현재 simulation 시행 상태 확인 - simulation은 하나만 시행되어야 함
    is_active_query = SimStatus.objects.get(key="is_active") 
    is_active = is_active_query.value

    # 외부에서 SimStatus의 is_active를 0으로 변경시키면 종료됨
    n = 0
    sec = 0
    while is_active:
        run_starttime = datetime.now()
        print(f'{start_time} : {run_starttime}')

        for PrevModel, SimModel in zip(PREV_MODELS, SIM_MODELS):
            new_queryset = PrevModel.objects.filter(value_datetime__gte=start_time, value_datetime__lt=end_time)

            print("save start:\t", timezone.now())
            new_dicts = [SimModel(**item, new_datetime=timezone.now()) for item in new_queryset.values()]
            SimModel.objects.bulk_create(new_dicts)
            print("save end:\t", timezone.now(), PrevModel, len(new_dicts))  

        start_time = end_time
        end_time = start_time + timedelta(seconds=speed)
        is_active = int(SimStatus.objects.get(key="is_active").value)

        run_endtime = datetime.now()
        time_spent = run_endtime - run_starttime
        time_spent = time_spent.seconds + time_spent.microseconds/1000000
        n += 1
        sec += time_spent
        print(f'{end_time} : {run_endtime} : {time_spent} | {sec/n}')

        # 한 번의 저장에 소요되는 시간을 SimStatus에 저장함
        avg_save_time = SimStatus.objects.get(key="avg_save_time")
        avg_save_time.value = sec/n
        avg_save_time.save()

        # 마지막 start_time을 SimStatus의 time_last에 기록해 둠
        time_last_query = SimStatus.objects.get(key="time_last")
        time_last_query.value = start_time
        time_last_query.save()
    

class SimulatorAPI(APIView):
    authentication_classes = (TokenAuthentication, BasicAuthentication, SessionAuthentication)
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
    SimStatus.truncate()
    initial_simstatus = [
        SimStatus(key="time_last", value=datetime(2018, 1, 1, 0, 0)),
        SimStatus(key="start_time", value=datetime(2018, 1, 1, 0, 0)),
        SimStatus(key="is_active", value=0),
        SimStatus(key="avg_save_time", value=0),
    ]
    SimStatus.objects.bulk_create(initial_simstatus)
    return(HttpResponse("Initialize SimStatus successively!"))


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