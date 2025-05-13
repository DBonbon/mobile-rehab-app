from django.utils.translation import gettext_lazy as _
from wagtail.models import PageManager
from wagtail_headless_preview.models import HeadlessPreviewMixin

from .base import BasePage

class AuthorPage(HeadlessPreviewMixin, BasePage):
    parent_page_types = ['AuthorsPage']
    subpage_types = ['ArticlePage',]

    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.AuthorPageSerializer"

    objects: PageManager

    class Meta:
        verbose_name = _("Author")
