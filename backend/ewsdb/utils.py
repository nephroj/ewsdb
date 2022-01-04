from datetime import datetime
from django.db.models import Min, Max

from prevdata.models import HospInfo


# 입원 데이터 상 첫 날짜 골라내기
def get_first_time():
    adm_date_min_int = HospInfo.objects.all().aggregate(Min("adm_date"))["adm_date__min"]
    adm_date_min  = datetime.strptime(str(adm_date_min_int), "%Y%m%d")
    return adm_date_min


# 입원 데이터 상 마지막 날짜 골라내기
def get_last_time():
    adm_date_max_int = HospInfo.objects.all().aggregate(Max("adm_date"))["adm_date__max"]
    adm_date_max  = datetime.strptime(str(adm_date_max_int), "%Y%m%d")
    return adm_date_max


# 새로운 데이터에 대한 dict를 전달 받아 Model을 업데이트
def status_update(Model, dict_data):
    old_obj = Model.objects.all()               
    if len(old_obj) == 0:              # 완전 처음 생성
        new_data = dict()
        fields = [fields.name for fields in Model._meta.fields] 
        for field in fields:
            field_type = Model._meta.get_field(field).get_internal_type()
            if field in dict_data.keys():
                new_data[field] = dict_data[field]
            elif field == "id":
                new_data["id"] = 1
            elif field_type in ["IntegerField", "FloatField", "BigIntegerField"]:
                new_data[field] = 0  
            elif field_type == "DateTimeField":
                new_data[field] = get_first_time()
            elif field_type == "DateField":
                new_data[field] = get_first_time().date() 
            else:
                new_data[field] = "" 
    else:                               # 이전 데이터가 있으면 업데이트
        new_data = old_obj.values()[0]
        for key, value in dict_data.items():
            new_data[key] = value

    new_obj = Model(**new_data)
    new_obj.save() 

# 데이터 불러오기 - 데이터가 아예 없는 상황이면 initial 값을 지정
def status_get(Model, key, initial):
    try:
        data = Model.objects.all().values()[0]
        value = data[key]
    except:
        status_update(Model, {key: initial})
        value = initial
    return value



# # SimStatus에 key, value 값을 update - 이 전에 없었으면 새로 생성
# def sim_status_update(keys, values):
#     if isinstance(keys, str):
#         try:
#             query = SimStatus.objects.get(key=keys)
#             query.value = values
#             query.save()   
#         except:
#             new_data = SimStatus(key=keys, value=values)
#             new_data.save()
#     else:
#         for key, value in zip(keys, values):
#             try:
#                 query = SimStatus.objects.get(key=key)
#                 query.value = value
#                 query.save()   
#             except:
#                 new_data = SimStatus(key=key, value=value)
#                 new_data.save()


# # SimStatus에서 key 값에 따른 value를 불러옴 - 만약 key가 없다면 초기값 입력해서 저장
# def sim_status_get(key, initial):
#     try:
#         query = SimStatus.objects.get(key=key)
#         return(query.value) 
#     except:
#         new_data = SimStatus(key=key, value=initial)
#         new_data.save()
#         return(str(initial))