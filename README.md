# EWSDB 설치

## NGINX 파일 작성

도메인 이름이 "example.com"이라고 가정함

```
cp nginx_80.conf ./nginx
vim nginx/nginx_80.conf
```

`nginx_80.conf` 파일 내 example.com 부분을 실제 도메인 이름으로 바꿈

## django.env 파일 작성

```
vim backend/django.env
```

```
DEV=0
SECRET_KEY=[secret key]
DEBUG=0
SITE_ID=1
HTTPS=1
DJANGO_ALLOWED_HOSTS=example.com
CSRF_TRUSTED_ORIGINS=https://example.com http://localhost:3000 http://localhost:8000

# MYSQL
MYSQL_DATABASE=ewsdb
MYSQL_USER=[username]
MYSQL_PASSWORD=[user_password]
MYSQL_ROOT_PASSWORD=[root_password]
MYSQL_HOST=mysql
MYSQL_PORT=3306
```

## Docker-compose

docker-compose.yml 파일 수정

example.com 부분을 실제 도메인 이름으로 바꿈

```
vim docker-compose.yml
```

docker-compose 실행하여 최종적으로 서버 구동

```
docker compose up --build -d
```

## Letsencrypt 인증서 발급

```
docker compose up certbot
```

혹은

```
docker compose run certbot certonly --webroot --webroot-path /var/www/certbot/ -d example.com
```

## Letsencrypt 인증서 갱신

인증서 갱신을 위해 crontab에 갱신을 위한 script 추가함

```
28 15 * * 7 docker compose -f /home/user/website/ewsdb/docker-compose.yml up certbot
```

## NGINX 파일 수정

```
rm nginx/nginx_80.conf
cp nginx_443.conf ./nginx
vim nginx/nginx_443.conf
```

`nginx_43.conf` 파일 내 example.com 부분을 실제 도메인 이름으로 바꿈
