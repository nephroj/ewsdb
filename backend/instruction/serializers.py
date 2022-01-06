from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import serializers

from .models import Instruction

User = get_user_model()


class UserPublicSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False, allow_blank=True, read_only=True)
    class Meta:
        model = User
        fields = [
            'username',  
            'first_name',
            'last_name',
            ]
    

class InstructionDetailSerializer(serializers.ModelSerializer):
    url     = serializers.HyperlinkedIdentityField(
        view_name='instruction:detail',
        lookup_field='markid'
    )
    user    = UserPublicSerializer(read_only=True)
    
    class Meta:
        model = Instruction
        fields = [
            'url',
            'markid',
            'user',
            'title',
            'content',
            'updated',
            'timestamp',
        ]

class InstructionListSerializer(serializers.ModelSerializer):
    url     = serializers.HyperlinkedIdentityField(
        view_name='instruction:detail',
        lookup_field='markid'
    )
    
    class Meta:
        model = Instruction
        fields = [
            'url',
            'markid',
            'title',
        ]