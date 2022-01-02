from rest_framework import serializers
from .models import SimStatus, HospInfoSim, VitalSim, LabSim

class SimStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = SimStatus
        fields = '__all__'

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