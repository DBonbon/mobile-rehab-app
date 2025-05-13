# Create this file: src/teki/management/commands/setup_postgis.py

from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Sets up PostGIS extension'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            cursor.execute("CREATE EXTENSION IF NOT EXISTS postgis;")
            self.stdout.write(self.style.SUCCESS('Successfully created PostGIS extension'))