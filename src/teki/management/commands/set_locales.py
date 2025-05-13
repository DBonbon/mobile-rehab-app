from django.core.management.base import BaseCommand
from wagtail.models import Locale, Site, Page

class Command(BaseCommand):
    help = "Ensure at least English and French locales are set up"

    def handle(self, *args, **options):
        default_locale = 'en'
        fallback_locale = 'fr'

        root_page = Page.get_first_root_node()
        site = Site.objects.first()

        if not site:
            self.stderr.write("❌ No Site found. Cannot set locales.")
            return

        if not Locale.objects.filter(language_code=default_locale).exists():
            Locale.objects.create(language_code=default_locale)
            self.stdout.write(f"✅ Created locale: {default_locale}")
        else:
            self.stdout.write(f"✔ Locale '{default_locale}' already exists")

        if not Locale.objects.filter(language_code=fallback_locale).exists():
            Locale.objects.create(language_code=fallback_locale)
            self.stdout.write(f"✅ Created locale: {fallback_locale}")
        else:
            self.stdout.write(f"✔ Locale '{fallback_locale}' already exists")

        # Just ensuring site has a root page set (often required by wagtail-nextjs)
        if not site.root_page:
            site.root_page = root_page
            site.save()
            self.stdout.write("🔗 Site root page was not set — now linked to root.")

        self.stdout.write("🎉 Locale setup complete.")
