from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

from rest_framework import routers
from prevdata.views import *
from simulator.views import *

router = routers.DefaultRouter()
router.register('hospinfo', HospInfoViewSet, basename='hospinfo')
router.register('vital', VitalViewSet, basename='vital')
router.register('lab', LabViewSet, basename='lab')
router.register('hospinfosim', HospInfoSimViewSet, basename='hospinfosim')
router.register('vitalsim', VitalSimViewSet, basename='vitalsim')
router.register('labsim', LabSimViewSet, basename='labsim')

urlpatterns = [
    # Reactjs
    re_path('^$', TemplateView.as_view(template_name='react.html')),

    # API
    path('api/', include(router.urls)),
    path('api/simulator/', SimulatorAPI.as_view(), name="simulator"),
    path('api/simstatus/', SimStatusAPIView.as_view(), name="simstatus"),
    path('api/datainfo/', DataInfoAPIView.as_view(), name="datainfo"),   
    path('api/auth/', include('dj_rest_auth.urls')),

    # Admin
    path('admin/', admin.site.urls),

    # Other function
    path('sim-initial/', simstatus_initialize, name="sim_initial"),

    # 그 외 모든 url은 Reactjs로 보냄
    re_path(r'^(?:.*)/?$', TemplateView.as_view(template_name='react.html')),   
]


