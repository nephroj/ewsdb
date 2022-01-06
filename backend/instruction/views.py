from rest_framework import generics, permissions

from .models import Instruction
from .serializers import InstructionListSerializer, InstructionDetailSerializer


class InstructionListAPIView(generics.ListAPIView):
    queryset            = Instruction.objects.all()
    serializer_class    = InstructionListSerializer
    permission_classes  = [permissions.IsAuthenticated]
    lookup_field        = 'markid'

class InstructionCreateAPIView(generics.CreateAPIView):
    queryset            = Instruction.objects.all()
    serializer_class    = InstructionDetailSerializer
    permission_classes  = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class InstructionDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset            = Instruction.objects.all()
    serializer_class    = InstructionDetailSerializer
    lookup_field        = 'markid'
    permission_classes  = [permissions.IsAuthenticated]