# syntax = docker/dockerfile:1.2
# Dockerfile in Django root directory 

# Pull python image
FROM python:3.8.10

# # Node.js 설치
# RUN apt-get update
# RUN apt-get install curl
# RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
# RUN apt-get install -y nodejs

# container directory for django codes
WORKDIR /usr/src/app

# copy files to /usr/src/app
# COPY . .

# install required packages (Django)
COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN pip install gunicorn
RUN pip install python-memcached

# port
EXPOSE 8000

# gunicorn
WORKDIR /usr/src/app
#CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "aaadir.wsgi:application"]
