from pathlib import Path
import os
import environ


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Load environ file
env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False),
    DEV=(bool, False)
)
# reading .env file
environ.Env.read_env(
    env_file=os.path.join(BASE_DIR, 'django.env')
)

# SECURITY WARNING: keep the secret key used in production secret!
# SECURITY WARNING: don't run with debug turned on in production!
SECRET_KEY = env("SECRET_KEY") 
DEBUG = int(env("DEBUG", default=0))
ALLOWED_HOSTS = env("DJANGO_ALLOWED_HOSTS").split(" ")
SITE_ID = int(env("SITE_ID", default=1))

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'dj_rest_auth',
    
    'prevdata',
    'simulator',
    'instruction',

]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'ewsdb.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'ewsdb.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env("MYSQL_DATABASE"),
        'USER': env("MYSQL_USER"), 
        'PASSWORD': env("MYSQL_PASSWORD"),
        'HOST': env("MYSQL_HOST"), 
        'PORT': env("MYSQL_PORT"), 
    }
}  

# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'ko-kr'
TIME_ZONE = 'Asia/Seoul'
USE_I18N = True

# LANGUAGE_CODE = 'en-us'
# TIME_ZONE = 'UTC'
# USE_I18N = True
# USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'staticfiles'), 
]
if not int(env("DEV")): 
    STATIC_ROOT = os.path.join(os.path.dirname(BASE_DIR), 'static')


# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


## Email
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'


# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 100,
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (   
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DATETIME_FORMAT': "%Y-%m-%d %H:%M:%S", 
}

## CORS settings
CSRF_TRUSTED_ORIGINS = env("CSRF_TRUSTED_ORIGINS").split(" ")

CORS_URLS_REGEX = r'^/api.*'
CORS_ORIGIN_ALLOW_ALL = False
CORS_ALLOW_CREDENTIALS = True
CORS_ORIGIN_WHITELIST = env("CSRF_TRUSTED_ORIGINS").split(" ")


## Logging
FILE_SIMULATOR = os.path.join(BASE_DIR, 'log/simulator.log')
FILE_EWSDB = os.path.join(BASE_DIR, 'log/ewsdb.log')
FILE_ERROR = os.path.join(BASE_DIR, 'log/error.log')
 
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse',
        },
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
    },

    'formatters': {
        'verbose': {
            'format': "%(asctime)s (%(levelname)s) %(message)s",
            'datefmt': "%Y-%m-%d %H:%M:%S",
            # 'format': "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s",
            # 'datefmt': "%d/%b/%Y %H:%M:%S"
        },
    },
 
    'handlers': {
        # 개발 환경에서 console 출력
        'console': {
            'level': 'INFO',
            'formatter': 'verbose',
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
        },
        # Error or Warning 상황은 error.log 파일에 기록
        'file_error': {
            'level': 'WARNING',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': FILE_ERROR,
            'formatter': 'verbose',
            'maxBytes': 1024 * 1024 * 10,
            'backupCount': 5,
            'encoding': 'utf-8',
        },
        # web 전반적인 log 기록
        'file_ewsdb': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': FILE_EWSDB,
            'formatter': 'verbose',
            'maxBytes': 1024 * 1024 * 10,
            'backupCount': 5,
            'encoding': 'utf-8',
        },
        # Simulator 작동은 simulator.log에 기록
        'file_simulator': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': FILE_SIMULATOR,
            'formatter': 'verbose',
            'maxBytes': 1024 * 1024 * 10,
            'backupCount': 5,
            'encoding': 'utf-8',
        },
    },
 
    'loggers': {
        'django': {
            'handlers': ['console', 'file_error'],
            'propagate': False,
        },
        'simulator': {
            'handlers': ['file_simulator'],
            'propagate': False,
            'level': os.getenv('DJANGO_LOG_LEVEL', 'DEBUG'),
        },   
        'ewsdb': {
            'handlers': ['file_ewsdb'],
            'propagate': False,
            'level': os.getenv('DJANGO_LOG_LEVEL', 'DEBUG'),
        },   
    }
}