# EWSDB 설치

## NGINX 파일 작성

도메인 이름이 "ews.example.com"이라고 가정함

`nginx/nginx_443.conf`

```
upstream web {
    ip_hash;
    server web:8000;
}

# Web
server {
    listen 80;
    server_name ews.example.com;

    location / {
        return 301 https://ews.example.com$request_uri;
    }
}
server {
    listen 443 ssl;
    server_name ews.example.com;

    ssl_certificate        /etc/letsencrypt/live/ews.example.com/fullchain.pem;
    ssl_certificate_key    /etc/letsencrypt/live/ews.example.com/privkey.pem;

    location /favicon.ico {
        access_log off;
        log_not_found off;
    }

    location /static/ {
        alias /static/;
    }

    location / {
        proxy_pass         http://web/;
        proxy_redirect     off;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## django.env 파일 작성

`backend/django.env`

```
DEV=0
SECRET_KEY=[secret key]
DEBUG=0
SITE_ID=1
HTTPS=1
DJANGO_ALLOWED_HOSTS=ews.example.com

# MYSQL
MYSQL_DATABASE=ewsdb
MYSQL_USER=[username]
MYSQL_PASSWORD=[user_password]
MYSQL_ROOT_PASSWORD=[root_password]
MYSQL_HOST=mysql
MYSQL_PORT=3306
```

## Docker-compose

docker-compose 실행하여 최종적으로 서버 구동

```
docker-compose up --build -d
```

## 참고: Letsencrypt 인증서 발급 및 갱신

### 인증서 발급

도메인 이름이 "ews.example.com"이라고 가정함

```
sudo docker run -it --rm --name certbot \
  -v '/etc/letsencrypt:/etc/letsencrypt' \
  -v '/var/lib/letsencrypt:/var/lib/letsencrypt' \
  certbot/certbot certonly \
  -d 'ews.example.com' --manual --preferred-challenges dns \
  --server https://acme-v02.api.letsencrypt.org/directory
```

### 인증서 갱신

인증서 갱신을 위해 crontab에 갱신을 위한 script 추가함

```
28 15 * * 7 docker run -it --rm --name certbot -v '/etc/letsencrypt:/etc/letsencrypt' -v '/var/lib/letsencrypt:/var/lib/letsencrypt' certbot/certbot renew --manual --preferred-challenges dns --server https://acme-v02.api.letsencrypt.org/directory --noninteractive
```
