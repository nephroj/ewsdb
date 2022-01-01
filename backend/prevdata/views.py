from rest_framework import viewsets
from rest_framework.authentication import BasicAuthentication, SessionAuthentication
from rest_framework import permissions

from .serializers import *
from .models import AdmInfo, DischargeInfo, Vital, Lab


class AdmInfoViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = AdmInfo.objects.all()
    serializer_class = AdmInfoSerializer


class DischargeInfoViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = DischargeInfo.objects.all()
    serializer_class = DischargeInfoSerializer


class VitalViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Vital.objects.all()
    serializer_class = VitalSerializer


class LabViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Lab.objects.all()
    serializer_class = LabSerializer