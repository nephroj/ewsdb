from rest_framework import serializers
from .models import AdmInfo, DischargeInfo, Vital, Lab

class AdmInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdmInfo
        fields = '__all__'


class DischargeInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DischargeInfo
        fields = '__all__'

class VitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vital
        fields = '__all__'


class LabSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lab
        fields = '__all__'