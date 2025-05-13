from django.apps import AppConfig
from django.db.models.signals import post_migrate

class CustomUserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'customuser'

    def ready(self):
        import customuser.signals
