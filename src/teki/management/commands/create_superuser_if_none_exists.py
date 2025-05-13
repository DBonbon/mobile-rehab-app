from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
import os


class Command(BaseCommand):
    """
    Create superuser if none exists.
    Supports both CLI args and env vars:
    - DJANGO_SUPERUSER_USERNAME
    - DJANGO_SUPERUSER_PASSWORD
    - DJANGO_SUPERUSER_EMAIL
    """

    def add_arguments(self, parser):
        parser.add_argument("--user", required=False)
        parser.add_argument("--password", required=False)
        parser.add_argument("--email", required=False)

    def handle(self, *args, **options):
        User = get_user_model()

        if User.objects.exists():
            return

        username = options["user"] or os.getenv("DJANGO_SUPERUSER_USERNAME")
        password = options["password"] or os.getenv("DJANGO_SUPERUSER_PASSWORD")
        email = options["email"] or os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@example.com")

        if not username or not password:
            self.stderr.write("❌ Missing username or password (via args or env).")
            return

        User.objects.create_superuser(username=username, password=password, email=email)
        self.stdout.write(f'✅ Superuser "{username}" created.')
