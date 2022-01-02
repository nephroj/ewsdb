from rest_framework import serializers
from .models import HospInfo, Vital, Lab

class HospInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HospInfo
        fields = '__all__'


class VitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vital
        fields = '__all__'


class LabSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lab
        fields = '__all__'