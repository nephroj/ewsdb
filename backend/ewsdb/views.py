
from rest_framework.authentication import TokenAuthentication, BasicAuthentication, SessionAuthentication
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
import logging
import psutil
import re
from .utils import get_client_ip


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


class ViewLogAPIView(APIView):
    authentication_classes = (TokenAuthentication, BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)

    def get_sim_log(self):
        f = open("log/simulator.log", "r")
        texts = f.readlines()
        def log_cleaner(text):            
            re_clean = "\s+(\w+)\s+[|]\s+(\d+[.]\d+[.]\d+[.]\d+)\s+[|]"
            cleaned = re.sub("\n", "", text)
            cleaned = re.sub(re_clean, "", cleaned)
            return(cleaned)
        cleaned_texts = [log_cleaner(text) for text in texts][::-1][0:20]
        return(cleaned_texts)        

    def get_error_log(self):
        f = open("log/error.log", "r")
        texts = f.readlines()
        start_with_date = re.compile("^\d{4}[-]\d{2}[-]\d{2}\s\d{2}[:]")
        cleaned_texts = [re.sub("\n", "", text) for text in texts if bool(start_with_date.match(text))][::-1][0:20]
        return(cleaned_texts)

    def get(self, request, format=None):
        sim_log = self.get_sim_log()
        error_log = self.get_error_log()
        return Response({"sim_log":sim_log, "error_log": error_log})    


class SetLoggingAPIView(APIView):
    authentication_classes = (TokenAuthentication, BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        level = request.data["level"]
        message = request.data["message"]
        logger = logging.getLogger("ewsdb")

        if level == "INFO":
            logger.info(f'{request.user} | {get_client_ip(request)} | {message}')
            return Response("INFO log를 기록하였습니다.")
        elif level == "WARNING":
            logger.warning(f'{request.user} | {get_client_ip(request)} | {message}')
            return Response("WARNING log를 기록하였습니다.")
        elif level == "ERROR":
            logger.error(f'{request.user} | {get_client_ip(request)} | {message}')
            return Response("ERROR log를 기록하였습니다.")
        elif level == "CRITICAL":
            logger.critical(f'{request.user} | {get_client_ip(request)} | {message}')  
            return Response("CRITICAL log를 기록하였습니다.")   
        else:
            return Response("Level을 정확히 전달해 주세요.")       