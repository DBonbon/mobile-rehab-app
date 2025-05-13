from django.core.management.base import BaseCommand
from wagtail.models import Locale, Site, Page

class Command(BaseCommand):
    help = "Ensure English and French locales exist and link the site root"

    def handle(self, *args, **options):
        default_locale = 'en'
        fallback_locale = 'fr'

        root_page = Page.get_first_root_node()
        site = Site.objects.first()

        if not site:
            self.stderr.write("❌ No Site found.")
            return

        # Create locales if missing
        for lang_code in [default_locale, fallback_locale]:
            locale, created = Locale.objects.get_or_create(language_code=lang_code)
            if created:
                self.stdout.write(f"✅ Created locale: {lang_code}")
            else:
                self.stdout.write(f"✔ Locale '{lang_code}' already exists")

        # Ensure the root page is associated
        if site.root_page != root_page:
            site.root_page = root_page
            site.save()
            self.stdout.write("🔗 Site root page updated to root node.")

        self.stdout.write("🎉 Locale and site setup complete.")
