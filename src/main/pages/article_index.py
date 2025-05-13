from django.utils.translation import gettext_lazy as _
from wagtail.models import PageManager
from wagtail_headless_preview.models import HeadlessPreviewMixin

from .base import BasePage


class ArticleIndexPage(HeadlessPreviewMixin, BasePage):
    parent_page_types = ['HomePage']
    subpage_types = []

    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.ArticleIndexPageSerializer"

    objects: PageManager

    class Meta:
        verbose_name = _("ArticleIndex")
