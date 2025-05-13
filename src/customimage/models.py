from django.conf import settings
from wagtail.images.models import AbstractImage, AbstractRendition, Image
from django.db import models

class CustomImage(AbstractImage):
    # Add any extra fields to image here

    @property
    def full_url(self):
        try:
            # Use the original rendition to get the URL
            original_rendition = self.get_rendition('original')
            url = original_rendition.url

            if hasattr(settings, "WAGTAILADMIN_BASE_URL") and url.startswith("/"):
                # Prepend WAGTAILADMIN_BASE_URL to form the full URL
                return settings.WAGTAILADMIN_BASE_URL + url
            return url
        except Exception:
            return None

    # Define which fields should appear in the admin form
    admin_form_fields = Image.admin_form_fields  # This ensures Wagtail's default fields are used

class CustomRendition(AbstractRendition):
    image = models.ForeignKey(
        CustomImage, on_delete=models.CASCADE, related_name="renditions"
    )

    class Meta:
        unique_together = (("image", "filter_spec", "focal_point_key"),)
