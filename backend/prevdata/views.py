from rest_framework import viewsets
from rest_framework.authentication import BasicAuthentication, SessionAuthentication
from rest_framework import permissions

from .serializers import *
from .models import AdmInfo, DischargeInfo, Vital, Lab


class AdmInfoViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = AdmInfo.objects.filter(id__gt=0)
    serializer_class = AdmInfoSerializer


class DischargeInfoViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = DischargeInfo.objects.filter(id__gt=0)
    serializer_class = DischargeInfoSerializer


class VitalViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Vital.objects.filter(id__gt=0)
    serializer_class = VitalSerializer


class LabViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Lab.objects.filter(id__gt=0)
    serializer_class = LabSerializer