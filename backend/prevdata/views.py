from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication, BasicAuthentication, SessionAuthentication
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Max, Min
from django.forms.models import model_to_dict
import psutil

from .serializers import *
from .models import HospInfo, Vital, Lab, DataStatus
from ewsdb.utils import status_update


class HospInfoViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (TokenAuthentication, BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = HospInfo.objects.all()
    serializer_class = HospInfoSerializer


class VitalViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (TokenAuthentication, BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Vital.objects.all()
    serializer_class = VitalSerializer


class LabViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (TokenAuthentication, BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Lab.objects.all()
    serializer_class = LabSerializer


class DataInfoAPIView(APIView):
    authentication_classes = (TokenAuthentication, BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)

    def save_data_info(self):
        # 입원 기간
        adminfo = HospInfo.objects.all().aggregate(Min("adm_date"), Max("adm_date"))
        adminfo["adm_date_min"] = adminfo.pop("adm_date__min")
        adminfo["adm_date_max"] = adminfo.pop("adm_date__max")

        # 입원 수
        adm_query = HospInfo.objects.all().values("adm_date", "studyid")
        adm__count = len(set([str(query["adm_date"]) + str(query["studyid"]) for query in adm_query]))
        adminfo["adm_count"] = adm__count

        # 환자 수
        studyid_query = HospInfo.objects.all().values("studyid")
        studyid__count = len(set([query["studyid"] for query in studyid_query]))
        adminfo["studyid_count"] = studyid__count

        # 전체 vital sign 행수                
        adminfo["vital_count"] = Vital.objects.all().count()

        # 전체 lab data 행수
        adminfo["lab_count"] = Lab.objects.all().count()
        
        # 새로운 데이터에 대한 dict를 전달 받아 업데이트
        status_update(DataStatus, adminfo)
    

    def get(self, request, format=None):
        try:
            data_status = model_to_dict(DataStatus.objects.get(pk=1))   
        except:
            self.save_data_info()
            data_status = model_to_dict(DataStatus.objects.get(pk=1))      
        return Response(data_status)
        
    def post(self, request, format=None):
        action = request.data["action"]
        if action == "update":
            try:
                self.save_data_info()                
                return Response("풀링 데이터 현황 업데이트에 성공하였습니다.")                
            except:
                return Response("업데이트에 실패하였습니다.")
        else:
            return Response("정확한 명령을 전달해 주세요.")

    
class ServerInfoAPIView(APIView):
    authentication_classes = (TokenAuthentication, BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)

    def get_hardware_info(self):
        def get_size(bytes, suffix="B"):
            factor = 1024
            for unit in ["", "K", "M", "G", "T", "P"]:
                if bytes < factor:
                    return f"{bytes:.1f} {unit}{suffix}"
                bytes /= factor

        cpufreq = psutil.cpu_freq()
        svmem = psutil.virtual_memory()
        partition = psutil.disk_partitions()[0]
        partition_usage = psutil.disk_usage(partition.mountpoint)
        disk_io = psutil.disk_io_counters()

        hardware_info = {
            "cpu_cores": psutil.cpu_count(logical=False), 
            "cpu_threads": psutil.cpu_count(logical=True), 
            "cpu_min_freq": cpufreq.min,
            "cpu_max_freq": cpufreq.max,
            "cpu_current_freq": cpufreq.current,
            "cpu_usage": psutil.cpu_percent(),
            "ram_total": svmem.total / 1024**3,
            "ram_used": svmem.used /1024**3,
            "ram_available": svmem.available /1024**3,
            "ram_used_perc": svmem.percent,
            "disk_device": partition.device,
            "disk_mountpoint": partition.mountpoint,
            "disk_fstype": partition.fstype,
            "disk_total": partition_usage.total /1024**3,
            "disk_used": partition_usage.used /1024**3,
            "disk_available": partition_usage.free /1024**3,
            "disk_used_perc": partition_usage.percent,
            "disk_io_read": disk_io.read_bytes /1024**3,
            "disk_io_write": disk_io.write_bytes /1024**3
        }
        return(hardware_info)
    
    def get(self, request, format=None):
        hardware_info = self.get_hardware_info()
        return Response(hardware_info)


class SimLogAPIView(APIView):
    authentication_classes = (TokenAuthentication, BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)

    def get_sim_log(self):
        f = open("log/simulator.log", "r")
        texts = f.readlines()
        sim_log = {n: text for n, text in enumerate(texts)}
        return(texts)
    
    def get(self, request, format=None):
        sim_log = self.get_sim_log()
        return Response(sim_log)    