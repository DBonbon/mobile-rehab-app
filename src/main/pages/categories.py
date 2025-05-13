from django.utils.translation import gettext_lazy as _
from django.shortcuts import get_object_or_404
from wagtail.models import PageManager
from rest_framework import serializers
from rest_framework.request import Request
from rest_framework.response import Response
from wagtail.contrib.routable_page.models import RoutablePageMixin, route
from wagtail_headless_preview.models import HeadlessPreviewMixin
from django.db import models
from wagtail.models import Orderable, Page
from django.http import HttpResponse, JsonResponse
from wagtail.admin.panels import FieldPanel
from wagtail.snippets.models import register_snippet
from django_extensions.db.fields import AutoSlugField
from wagtail.search import index
from wagtail.fields import RichTextField, StreamField
import datetime
from django.apps import apps  # Import Django's apps utility to dynamically get the ArticlePage model
from django.conf import settings
from .base import BasePage

class CategoriesPage(HeadlessPreviewMixin, RoutablePageMixin, BasePage):
    parent_page_types = ['HomePage']
    subpage_types = []

    intro = RichTextField(blank=True, help_text="Describe the page, briefly")
    post_date = models.DateTimeField(
        verbose_name="Article date", default=datetime.datetime.today)
    sidebar_title = models.TextField(blank=True, help_text="Categories, Tags, etc'")
    sidebar_extend_btn = models.TextField(blank=True, help_text="Add text to extend the sidebar, ex: View More")
    sidebar_collapse_btn = models.TextField(blank=True, help_text="Add text to collapse the sidebar, ex: Show Less")

    content_panels = Page.content_panels + [
        FieldPanel('sidebar_title'),
        FieldPanel('intro'),
        FieldPanel('sidebar_extend_btn'),
        FieldPanel('sidebar_collapse_btn'),
    ]

    settings_panels = Page.settings_panels + [
        FieldPanel("post_date"),
    ]

    search_fields = Page.search_fields + [
        index.SearchField('title'),
        # index.SearchField('POS'),
    ]

    extra_panels = BasePage.extra_panels

    serializer_class = "main.pages.CategoriesPageSerializer"

    @route(r'^$')
    def index_route(self, request, *args, **kwargs):
        # Query all Category instances
        categories = Category.objects.all()

        # Include categories in the context for the serializer
        context = {
            "request": request,
            "categories": categories  # Raw queryset for dynamic retrieval
        }
        data = self.get_component_data(context=context)

        # Determine the response type based on the request
        response_cls = Response if isinstance(request, Request) else JsonResponse
        return response_cls(data)

    @route(r'^test-reply/$')
    def test_route_reply(self, request, *args, **kwargs):
        response_cls = Response if isinstance(request, Request) else HttpResponse
        return response_cls("test route reply")

    # categories_page.py

    @route(r'^(?P<category_slug>[\w-]+)/$')
    def category_detail(self, request, category_slug=None, *args, **kwargs):
        # Fetch the category by its slug
        category = get_object_or_404(Category, slug=category_slug)

        # Basic context for testing purposes
        context = {
            "request": request,
            "category": category
        }

        # Serialize component data with the simplified CategoryDetailSerializer
        data = self.get_component_data(
            context=context,
            component_name="CategoryDetail",
            serializer_cls="main.pages.CategoryDetailSerializer",
        )

        # Determine the response type based on the request
        response_cls = Response if isinstance(request, Request) else JsonResponse
        return response_cls(data)

    objects: PageManager

    class Meta:
        verbose_name = _("Categories")

@register_snippet
class Category(models.Model):
    name = models.CharField(max_length=255, help_text="The category name")
    slug = AutoSlugField(populate_from="name", editable=True)

    panels = [FieldPanel("name")]

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name', 'slug']
