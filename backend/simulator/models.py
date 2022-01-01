from django.db import models, connection

class AdmInfoSim(models.Model):
    adm_date        = models.DateTimeField(blank=True)
    patientid       = models.IntegerField(blank=True)
    sex             = models.CharField(max_length=3, null=True, blank=True)
    age_adm         = models.IntegerField(null=True, blank=True)
    dept            = models.CharField(max_length=20, null=True, blank=True)
    value_datetime  = models.DateTimeField(null=True,blank=True)   # adm_date와 동일
    new_datetime    = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return str(self.patientid)

    @classmethod
    def truncate(cls):
        with connection.cursor() as cursor:
            cursor.execute(f'TRUNCATE TABLE {cls._meta.db_table}')


class DischargeInfoSim(models.Model):
    patientid       = models.IntegerField(blank=True)
    adm_date        = models.DateTimeField(blank=True)
    discharge_date  = models.DateTimeField(blank=True)
    value_datetime  = models.DateTimeField(null=True, blank=True)   # discharge_date와 동일
    new_datetime    = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return str(self.patientid)

    @classmethod
    def truncate(cls):
        with connection.cursor() as cursor:
            cursor.execute(f'TRUNCATE TABLE {cls._meta.db_table}')


class VitalSim(models.Model):
    patientid       = models.IntegerField(blank=True)
    key             = models.CharField(max_length=30, null=True, blank=True)
    value           = models.CharField(max_length=30, null=True, blank=True)
    value_datetime  = models.DateTimeField(blank=True)
    new_datetime    = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{str(self.patientid)} - {str(self.value_datetime)} - {self.vital_key}"

    @classmethod
    def truncate(cls):
        with connection.cursor() as cursor:
            cursor.execute(f'TRUNCATE TABLE {cls._meta.db_table}')


class LabSim(models.Model):
    patientid       = models.IntegerField(blank=True)
    key             = models.CharField(max_length=30, null=True, blank=True)
    value           = models.CharField(max_length=30, null=True, blank=True)
    value_datetime  = models.DateTimeField(blank=True)
    new_datetime    = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{str(self.patientid)} - {str(self.value_datetime)} - {self.lab_key}"

    @classmethod
    def truncate(cls):
        with connection.cursor() as cursor:
            cursor.execute(f'TRUNCATE TABLE {cls._meta.db_table}')


class SimStatus(models.Model):
    key             = models.CharField(max_length=30, null=True, blank=True)
    value           = models.CharField(max_length=200, null=True, blank=True)
    updated         = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.key
