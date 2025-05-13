import os
from typing import Optional

from utils.env import get_env, get_env_bool  # NOQA: F401


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Version, be sure to bump this with each release (please follow semver.org)
APP_VERSION = "0.1.0"

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = get_env("SECRET_KEY", required=True)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# This is when debug is off, else django wont allow you to visit the site
ALLOWED_HOSTS = get_env("ALLOWED_HOSTS", required=True).split(",")

INTERNAL_IPS = ["127.0.0.1"]


# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sitemaps",
    "django.contrib.gis",
    # Third party apps
    "wagtail.embeds",
    "wagtail.sites",
    "wagtail.users",
    "wagtail.snippets",
    "wagtail.documents",
    "wagtail.images",
    "wagtail.admin",
    #"wagtailmedia",
    "wagtail.search",
    "wagtail",
    "wagtail.contrib.forms",
    "wagtail.contrib.redirects",
    "wagtail.contrib.routable_page",
    "wagtail.contrib.settings",
    "modelcluster",
    "taggit",
    "wagtail_meta_preview",
    "wagtail_headless_preview",
    "rest_framework",
    'rest_framework.authtoken',
    'corsheaders',

    # Project specific apps
    "teki",
    "sitesettings",
    'customuser.apps.CustomUserConfig',
    "customimage",
    "customdocument",
    "main",
    "nextjs",
    "fields",
    "wagtail_localize",
    "wagtail_localize.locales",
    'wagtail_footnotes',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "teki.urls"
APPEND_SLASH = True

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            "templates",
            os.path.join(BASE_DIR, 'customuser', 'templates'),
            ],
        "OPTIONS": {
            "debug": DEBUG,
            "loaders": [
                "django.template.loaders.filesystem.Loader",
                "django.template.loaders.app_directories.Loader",
            ],
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.template.context_processors.i18n",
                "django.template.context_processors.media",
                "django.template.context_processors.static",
                "django.template.context_processors.tz",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "wagtail.contrib.settings.context_processors.settings",
                # Project specific
                "teki.context_processors.settings_context_processor",
            ],
        },
    }
]

WSGI_APPLICATION = "teki.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases
# Using PostgreSQL
DATABASES = {
    "default": {
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "NAME": get_env("DATABASE_NAME", required=True),
        "USER": get_env("DATABASE_USER", required=True),
        "PASSWORD": get_env("DATABASE_PASSWORD", required=True),
        "HOST": get_env("DATABASE_HOST", required=True),
        "PORT": int(get_env("DATABASE_PORT", default="5432")),
    }
}

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = "django.db.models.AutoField"


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"  # NOQA
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},  # NOQA
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},  # NOQA
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"  # NOQA
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/
TIME_ZONE = "Europe/Paris"
LANGUAGE_CODE = "en"
SITE_ID = 1
USE_I18N = True
USE_TZ = True
LOCALE_PATHS = [os.path.join(BASE_DIR, "locale")]

WAGTAIL_I18N_ENABLED = True
WAGTAIL_CONTENT_LANGUAGES = LANGUAGES = [
    # Any language you whish to support
    ('en', "English"),
    ('fr', "French"),
    ('he', "Hebrew"),
    ('de', "German"),
    ('jp', "Japanese"),
]

# Email
DEFAULT_FROM_EMAIL = get_env("DEFAULT_FROM_EMAIL", default="noreply@example.com")
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.example.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@example.com'
EMAIL_HOST_PASSWORD = 'your-password'
# DEFAULT_FROM_EMAIL = 'Your Site <your-email@example.com>'

# Auth
AUTH_USER_MODEL = "customuser.User"

# Wagtail
WAGTAIL_SITE_NAME = "Company-Project"
WAGTAILIMAGES_IMAGE_MODEL = "customimage.CustomImage"
WAGTAILDOCS_DOCUMENT_MODEL = "customdocument.CustomDocument"
WAGTAIL_ALLOW_UNICODE_SLUGS = False

WAGTAILSEARCH_BACKENDS = {
    "default": {
        "BACKEND": "wagtail.search.backends.database",
    }
}

WAGTAILIMAGES_FORMAT_CONVERSIONS = {
    "png": "jpeg",
    "webp": "webp",
}

# Uploaded media
MEDIA_URL = "/wt/media/"
MEDIA_ROOT = get_env("MEDIA_PATH", required=True)


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

# Static URL to use when referring to static files located in STATIC_ROOT.
STATIC_URL = "/wt/static/"

# The absolute path to the directory where collectstatic will collect static
# files for deployment. Example: "/var/www/example.com/static/"I
STATIC_ROOT = get_env("STATIC_PATH", required=True)

# This setting defines the additional locations the staticfiles will traverse
STATICFILES_DIRS = (
    # "/home/special.polls.com/polls/static",
    # "/home/polls.com/polls/static",
)

# Prevent content type sniffing
SECURE_CONTENT_TYPE_NOSNIFF = True

# Admin
ADMIN_URL = "wt/admin/"

# NextJS
WAGTAIL_HEADLESS_PREVIEW = {
    "CLIENT_URLS": {
        "default": "/api/preview/",
    }
}

# Sentry
SENTRY_DSN: Optional[str] = None
SENTRY_ENVIRONMENT: Optional[str] = None

# Add detailed logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'wagtail': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'main': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'customuser': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}


# auth forms related settings
# Frontend URL for email links
FRONTEND_URL = 'http://localhost:8081'   # Change to your production URL in production

# Add these to your Django settings

# If using CORS for cross-domain requests
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8081",
    "http://localhost:3000",
    # Add any other frontend URLs
]

# CSRF settings
CSRF_COOKIE_SAMESITE = 'Lax'  # Use 'None' if your frontend is on a different domain
CSRF_COOKIE_HTTPONLY = False  # Set to False so JavaScript can access the cookie
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:8081",
    "http://localhost:3000",
    # Add any other frontend URLs
]

# Session settings
SESSION_COOKIE_SAMESITE = 'Lax'  # Use 'None' if your frontend is on a different domain

# If your frontend is on a different domain and you need SameSite=None
# make sure to also set Secure=True
if not DEBUG:
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',  # Change to allow GET requests
    ],
}




