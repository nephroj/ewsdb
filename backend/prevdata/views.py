from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication, BasicAuthentication, SessionAuthentication
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Avg, Max, Min

from .serializers import *
from .models import HospInfo, Vital, Lab


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