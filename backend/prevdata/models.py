from django.db import models

class AdmInfo(models.Model):
    adm_date        = models.DateTimeField(blank=True)
    patientid       = models.IntegerField(blank=True)
    sex             = models.CharField(max_length=3, null=True, blank=True)
    age_adm         = models.IntegerField(null=True, blank=True)
    dept            = models.CharField(max_length=20, null=True, blank=True)
    value_datetime  = models.DateTimeField(null=True, blank=True)   # adm_date와 동일

    def __str__(self):
        return f"{str(self.patientid)} - {str(self.adm_date)}"


class DischargeInfo(models.Model):
    patientid       = models.IntegerField(blank=True)
    adm_date        = models.DateTimeField(blank=True)
    discharge_date  = models.DateTimeField(blank=True)
    value_datetime  = models.DateTimeField(null=True, blank=True)   # discharge_date와 동일

    def __str__(self):
        return f"{str(self.patientid)} - {str(self.discharge_date)}"


class Vital(models.Model):
    patientid       = models.IntegerField(blank=True)
    key       = models.CharField(max_length=30, null=True, blank=True)
    value           = models.CharField(max_length=30, null=True, blank=True)
    value_datetime  = models.DateTimeField(blank=True)

    def __str__(self):
        return f"{str(self.patientid)} - {str(self.value_datetime)} - {self.vital_key}"


class Lab(models.Model):
    patientid       = models.IntegerField(blank=True)
    key       = models.CharField(max_length=30, null=True, blank=True)
    value           = models.CharField(max_length=30, null=True, blank=True)
    value_datetime  = models.DateTimeField(blank=True)

    def __str__(self):
        return f"{str(self.patientid)} - {str(self.value_datetime)} - {self.lab_key}"