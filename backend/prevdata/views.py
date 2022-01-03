from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication, BasicAuthentication, SessionAuthentication
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Avg, Max, Min

from .serializers import *
from .models import HospInfo, Vital, Lab
from ewsdb.utils import sim_status_update


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

    def get(self, request, format=None):
        adminfo = HospInfo.objects.all().aggregate(Min("adm_date"), Max("adm_date"))
        adm_query = HospInfo.objects.all().values("adm_date", "studyid")
        adm__count = len(set([str(query["adm_date"]) + str(query["studyid"]) for query in adm_query]))
        adminfo["adm__count"] = adm__count
        studyid_query = HospInfo.objects.all().values("studyid")
        studyid__count = len(set([query["studyid"] for query in studyid_query]))
        adminfo["studyid__count"] = studyid__count
        return Response(adminfo)
        
    def post(self, request, format=None):
        action = request.data["action"]
        if action == "update":
            try:
                # 입원 기간
                adminfo = HospInfo.objects.all().aggregate(Min("adm_date"), Max("adm_date"))

                # 입원 수
                adm_query = HospInfo.objects.all().values("adm_date", "studyid")
                adm__count = len(set([str(query["adm_date"]) + str(query["studyid"]) for query in adm_query]))
                adminfo["adm__count"] = adm__count

                # 환자 수
                studyid_query = HospInfo.objects.all().values("studyid")
                studyid__count = len(set([query["studyid"] for query in studyid_query]))
                adminfo["studyid__count"] = studyid__count

                # 전체 vital sign 행수
                vs_query = Vital.objects.all().values("studyid")
                adminfo["vital__count"] = len(vs_query)

                # 전체 lab data 행수
                lab_query = Lab.objects.all().values("studyid")
                adminfo["lab__count"] = len(lab_query)

                sim_status_update(adminfo.keys(), adminfo.values())
                return Response("풀링 데이터 현황 업데이트에 성공하였습니다.")
                
            except:
                return Response("업데이트에 실패하였습니다.")
        else:
            return Response("정확한 명령을 전달해 주세요.")