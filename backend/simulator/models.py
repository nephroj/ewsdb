from django.db import models, connection

class HospInfoSim(models.Model):
    adm_date        = models.IntegerField(blank=True)
    studyid         = models.IntegerField(blank=True)
    key             = models.CharField(max_length=20, blank=True)
    value           = models.CharField(max_length=100, blank=True)
    value_datetime  = models.DateTimeField(blank=True)  
    new_datetime    = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.studyid)

    @classmethod
    def truncate(cls):
        with connection.cursor() as cursor:
            cursor.execute(f'TRUNCATE TABLE {cls._meta.db_table}')


class VitalSim(models.Model):
    studyid         = models.IntegerField(blank=True)
    key             = models.CharField(max_length=20, blank=True)
    value           = models.CharField(max_length=100, blank=True)
    value_datetime  = models.DateTimeField(blank=True)
    new_datetime    = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{str(self.studyid)} - {str(self.value_datetime)} - {self.key}"

    @classmethod
    def truncate(cls):
        with connection.cursor() as cursor:
            cursor.execute(f'TRUNCATE TABLE {cls._meta.db_table}')


class LabSim(models.Model):
    studyid         = models.IntegerField(blank=True)
    key             = models.CharField(max_length=20, blank=True)
    value           = models.CharField(max_length=100, blank=True)
    value_datetime  = models.DateTimeField(blank=True)
    new_datetime    = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{str(self.studyid)} - {str(self.value_datetime)} - {self.key}"

    @classmethod
    def truncate(cls):
        with connection.cursor() as cursor:
            cursor.execute(f'TRUNCATE TABLE {cls._meta.db_table}')


class SimStatus(models.Model):
    key             = models.CharField(max_length=30, blank=True)
    value           = models.CharField(max_length=30, blank=True)
    updated         = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.key

    @classmethod
    def truncate(cls):
        with connection.cursor() as cursor:
            cursor.execute(f'TRUNCATE TABLE {cls._meta.db_table}')
