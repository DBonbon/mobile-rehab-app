from django.utils.translation import gettext_lazy as _
from wagtail.models import PageManager
from wagtail_headless_preview.models import HeadlessPreviewMixin

from .base import BasePage


class DashboardPage(HeadlessPreviewMixin, BasePage):
    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.DashboardPageSerializer"
    parent_page_types = ['HomePage']

    objects: PageManager

    class Meta:
        verbose_name = _("Dashboard")
