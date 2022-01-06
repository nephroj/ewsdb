from django.urls import path, re_path

from .views import (
    InstructionDetailAPIView,
    InstructionListAPIView,
    InstructionCreateAPIView,
)

app_name = 'instruction'
urlpatterns = [
    path('list/', InstructionListAPIView.as_view(), name='list'),
    path('create/', InstructionCreateAPIView.as_view(), name='create'),
    path('list/<int:markid>/', InstructionDetailAPIView.as_view(), name='detail'),

]
