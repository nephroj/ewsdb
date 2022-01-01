from rest_framework import serializers
from .models import SimStatus

class SimStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = SimStatus
        fields = '__all__'
