from simulator.models import SimStatus


# SimStatus에 key, value 값을 update - 이 전에 없었으면 새로 생성
def sim_status_update(keys, values):
    if isinstance(keys, str):
        try:
            query = SimStatus.objects.get(key=keys)
            query.value = values
            query.save()   
        except:
            new_data = SimStatus(key=keys, value=values)
            new_data.save()
    else:
        for key, value in zip(keys, values):
            try:
                query = SimStatus.objects.get(key=key)
                query.value = value
                query.save()   
            except:
                new_data = SimStatus(key=key, value=value)
                new_data.save()


# SimStatus에서 key 값에 따른 value를 불러옴 - 만약 key가 없다면 초기값 입력해서 저장
def sim_status_get(key, initial):
    try:
        query = SimStatus.objects.get(key=key)
        return(query.value) 
    except:
        new_data = SimStatus(key=key, value=initial)
        new_data.save()
        return(str(initial))