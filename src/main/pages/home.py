# src/main/pages/home.py
from django.utils.translation import gettext_lazy as _
from wagtail.models import PageManager
from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.fields import RichTextField, StreamField
from wagtail.admin.panels import FieldPanel, InlinePanel, MultiFieldPanel, FieldRowPanel
from main.blocks.blocks import BodyBlock, HomePageStoryBlock

from .base import BasePage

class HomePage(HeadlessPreviewMixin, BasePage):
    #intro = RichTextField(blank=True, null=True, verbose_name=_("Intro"))

    #body = StreamField(HomePageStoryBlock())#StreamField(BodyBlock(), use_json_field=True, default=list)
    
    content_panels = BasePage.content_panels + [
        #FieldPanel("intro"),
        #FieldPanel('body'),
    ]
    
    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.HomePageSerializer"

    objects: PageManager

    class Meta:
        verbose_name = _("Home")
