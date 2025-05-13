# customuser/signals.py

from django.db.models.signals import post_migrate, post_save
from django.contrib.auth.models import Group
from django.dispatch import receiver
from django.conf import settings
from django.apps import apps

@receiver(post_migrate)
def create_user_groups(sender, **kwargs):
    if sender.name == 'customuser':
        Group.objects.get_or_create(name='Fighter')
        Group.objects.get_or_create(name='ToolHolder')

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def assign_user_to_group(sender, instance, created, **kwargs):
    if created:
        fighter_group = Group.objects.get(name='Fighter')
        toolholder_group = Group.objects.get(name='ToolHolder')

        if instance.groups.filter(name='Fighter').exists():
            instance.groups.remove(toolholder_group)
        else:
            instance.groups.add(toolholder_group)
