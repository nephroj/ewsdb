from rest_framework import serializers
from .models import HospInfoSim, VitalSim, LabSim

class HospInfoSimSerializer(serializers.ModelSerializer):
    class Meta:
        model = HospInfoSim
        fields = '__all__'

class VitalSimSerializer(serializers.ModelSerializer):
    class Meta:
        model = VitalSim
        fields = '__all__'

class LabSimSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabSim
        fields = '__all__'