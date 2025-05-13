from typing import List
from rest_framework import serializers
from wagtail import fields
from wagtail.admin.templatetags.wagtailuserbar import wagtailuserbar
from wagtail.api.v2 import serializers as wagtail_serializers
from wagtail.models import Locale
from sitesettings.models import SiteSetting
from sitesettings.serializers import SiteSettingSerializer
from ..serializers import SeoSerializer
from .locale_serializer import LocaleSerializer  # Import the new serializer
from . import BasePage

class BasePageSerializer(serializers.ModelSerializer):
    serializer_field_mapping = (
        serializers.ModelSerializer.serializer_field_mapping.copy()
    )
    serializer_field_mapping.update(
        {fields.StreamField: wagtail_serializers.StreamField}
    )

    # Existing fields
    seo = serializers.SerializerMethodField()
    site_setting = serializers.SerializerMethodField()
    wagtail_userbar = serializers.SerializerMethodField()
    
    # Replace language_code and translations with enhanced fields
    available_locales = serializers.SerializerMethodField()
    current_locale = serializers.SerializerMethodField()
    translations = serializers.SerializerMethodField()

    class Meta:
        model = BasePage
        fields: List[str] = [
            "title",
            "last_published_at",
            "seo_title",
            "search_description",
            "seo",
            "site_setting",
            "wagtail_userbar",
            "available_locales",
            "current_locale",
            "translations"
        ]

    # Existing methods remain unchanged
    def get_seo(self, page):
        return SeoSerializer(page).data

    def get_site_setting(self, page):
        site_setting = SiteSetting.for_site(page.get_site())
        return SiteSettingSerializer(site_setting).data

    def get_wagtail_userbar(self, page):
        request = self.context.get("request", None)
        if not request:
            return None
        in_preview_panel = getattr(request, "in_preview_panel", False)
        if in_preview_panel:
            return None
        if not hasattr(request, "user"):
            return None
        html = wagtailuserbar({"request": request, "self": page})
        if not html:
            return None
        return {
            "html": html,
        }

    # New and updated locale-related methods
    def get_available_locales(self, page):
        """Return all available locales for the site"""
        return LocaleSerializer(Locale.objects.all(), many=True).data

    def get_current_locale(self, page):
        """Return the current page's locale"""
        return LocaleSerializer(page.locale).data

    def get_translations(self, page):
        """Enhanced translations method with more metadata"""
        translations = page.get_translations(inclusive=False)
        return [{
            "title": translation.title,
            "url": translation.get_full_url(),
            "language_code": translation.locale.language_code,
            "is_live": translation.live
        } for translation in translations]