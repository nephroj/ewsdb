from django.db import models

class HospInfo(models.Model):
    adm_date        = models.IntegerField(blank=True)
    studyid         = models.IntegerField(blank=True)
    key             = models.CharField(max_length=20, blank=True)
    value           = models.CharField(max_length=100, blank=True)
    value_datetime  = models.DateTimeField(blank=True)  

    def __str__(self):
        return f"{str(self.studyid)} - {str(self.adm_date)}"


class Vital(models.Model):
    studyid         = models.IntegerField(blank=True)
    key             = models.CharField(max_length=20, blank=True)
    value           = models.CharField(max_length=100, blank=True)
    value_datetime  = models.DateTimeField(blank=True)

    def __str__(self):
        return f"{str(self.studyid)} - {str(self.value_datetime)} - {self.vital_key}"


class Lab(models.Model):
    studyid         = models.IntegerField(blank=True)
    key             = models.CharField(max_length=20, blank=True)
    value           = models.CharField(max_length=100, blank=True)
    value_datetime  = models.DateTimeField(blank=True)

    def __str__(self):
        return f"{str(self.studyid)} - {str(self.value_datetime)} - {self.lab_key}"