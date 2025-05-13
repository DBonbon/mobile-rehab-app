from django.core.management.base import BaseCommand
from wagtail.models import Page, Site, Locale
from main.models import HomePage


class Command(BaseCommand):
    """
    Replaces the default Wagtail root page with a HomePage,
    updates the Site object, and ensures everything is published and correct.
    """

    def handle(self, *args, **options):
        # Get the default site (create if none)
        site = Site.objects.first()
        if not site:
            self.stderr.write("❌ No Site object found.")
            return

        # Get the root page (usually the Wagtail 'root')
        wagtail_root = Page.get_first_root_node()

        # Check if we already have a custom HomePage
        home_page = wagtail_root.get_children().type(HomePage).first()

        if not home_page:
            self.stdout.write("➕ Creating a new HomePage under the root...")
            home_page = HomePage(title="Home Page", slug="home-page")
            wagtail_root.add_child(instance=home_page)
            home_page.save_revision().publish()
            self.stdout.write("✅ HomePage created and published.")
        else:
            self.stdout.write("✔ Existing HomePage found.")

        # Link HomePage as the site's root
        site.root_page = home_page
        site.hostname = "teki-wagtail.onrender.com"
        site.port = 443  # You can also use '' or 80 depending on your needs
        site.is_default_site = True
        site.save()
        self.stdout.write("🔗 Site object updated with new root and hostname.")

        # Optional: link default Locale (if not already linked)
        default_locale = Locale.objects.filter(language_code="en").first()
        if default_locale and home_page.locale_id != default_locale.id:
            home_page.locale = default_locale
            home_page.save()
            self.stdout.write("🌐 Linked HomePage to default locale (en).")

        self.stdout.write("🎉 Wagtail root page replacement complete.")
