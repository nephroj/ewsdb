from rest_framework import serializers
from .models import SimStatus, AdmInfoSim, DischargeInfoSim, VitalSim, LabSim

class SimStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = SimStatus
        fields = '__all__'

class AdmInfoSimSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdmInfoSim
        fields = '__all__'

class DischargeInfoSimSerializer(serializers.ModelSerializer):
    class Meta:
        model = DischargeInfoSim
        fields = '__all__'

class VitalSimSerializer(serializers.ModelSerializer):
    class Meta:
        model = VitalSim
        fields = '__all__'

class LabSimSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabSim
        fields = '__all__'