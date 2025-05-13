from django.utils.translation import gettext_lazy as _
from wagtail.models import PageManager
from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.admin.panels import FieldPanel, InlinePanel, MultiFieldPanel, FieldRowPanel
from wagtail.fields import RichTextField, StreamField
from wagtail.models import PageManager
from wagtail_headless_preview.models import HeadlessPreviewMixin
from main.blocks.blocks import BodyBlock
from .base import BasePage
from django.db import models
from modelcluster.fields import ParentalManyToManyField, ParentalKey
from wagtail.fields import RichTextField, StreamField
import datetime
from wagtail.search import index
from taggit.models import Tag as TaggitTag
from taggit.models import TaggedItemBase
from modelcluster.models import ClusterableModel
from wagtail.models import Orderable, Page, TranslatableMixin, Site
from wagtail.contrib.routable_page.models import RoutablePageMixin, route
from modelcluster.contrib.taggit import ClusterTaggableManager
from wagtail.snippets.models import register_snippet
from django.conf import settings
from django_extensions.db.fields import AutoSlugField

class ArticlePage(HeadlessPreviewMixin, BasePage):
    parent_page_types = ['AuthorPage']
    subpage_types = []

    intro = RichTextField(blank=True, null=True, verbose_name=_("Intro"))
    body = StreamField(BodyBlock(), use_json_field=True, default=list)
    tags = ClusterTaggableManager(through="ArticlePageTag", blank=True)
    language = models.CharField(max_length=10,
                                choices=settings.LANGUAGES,
                                default=settings.LANGUAGE_CODE)
    post_date = models.DateTimeField(
        verbose_name="Article date", default=datetime.datetime.today)

    content_panels = BasePage.content_panels + [
        FieldPanel("intro"),
        FieldPanel('body'),
        FieldPanel('language', help_text='original language of the article'),
        InlinePanel("categories", label="Select from savima predefined categories"),
        FieldPanel("tags"),
        InlinePanel('footnotes', label='Footnotes'),
    ]

    settings_panels = Page.settings_panels + [
        FieldPanel("post_date"),
    ]

    search_fields = Page.search_fields + [
        index.SearchField('title'),
        index.SearchField('intro'),
    ]

    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.ArticlePageSerializer"

    objects: PageManager

    class Meta:
        verbose_name = _("Article")

#Tags
class ArticlePageTag(TaggedItemBase):
    content_object = ParentalKey('ArticlePage', on_delete=models.CASCADE, related_name='tagged_items')


@register_snippet
class Tag(TaggitTag):
    class Meta:
        proxy = True

class ArticlePageCategory(models.Model):
    page = ParentalKey(
        "ArticlePage",
        on_delete=models.CASCADE,
        related_name="categories"
    )
    category = models.ForeignKey(
        "Category",
        on_delete=models.CASCADE,
        related_name="post_pages"
    )

    panels = [
        FieldPanel("category"),
    ]

    class Meta:
        unique_together = ("page", "category")
