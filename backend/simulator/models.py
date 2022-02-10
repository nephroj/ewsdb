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
    is_active            = models.IntegerField(blank=True)
    sim_start_time       = models.DateTimeField(blank=True)
    sim_last_time        = models.DateTimeField(blank=True)
    sim_duration         = models.IntegerField(blank=True)
    sim_data_start_time  = models.DateTimeField(blank=True)
    sim_data_last_time   = models.DateTimeField(blank=True)
    sim_data_duration    = models.IntegerField(blank=True)
    avg_save_time        = models.FloatField(blank=True)
    sim_speed            = models.IntegerField(blank=True)
    sim_hosp_n           = models.IntegerField(blank=True)
    sim_vital_n          = models.IntegerField(blank=True)
    sim_lab_n            = models.IntegerField(blank=True)

    @classmethod
    def truncate(cls):
        with connection.cursor() as cursor:
            cursor.execute(f'TRUNCATE TABLE {cls._meta.db_table}')    

class SimSettings(models.Model):
    sim_speed        = models.IntegerField(blank=True)
    sim_start_date   = models.DateField(blank=True)   
    sim_start_radio  = models.CharField(max_length=20, blank=True)

    @classmethod
    def truncate(cls):
        with connection.cursor() as cursor:
            cursor.execute(f'TRUNCATE TABLE {cls._meta.db_table}') 