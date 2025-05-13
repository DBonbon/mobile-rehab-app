from . import CategoriesPage
from .base_serializer import BasePageSerializer
from . import CategoriesPage, CategorySerializer, ArticlePage
from rest_framework import serializers
from django.apps import apps  # Import to dynamically get ArticlePage model
from wagtail.models import Page
from wagtail.rich_text import expand_db_html
from django.utils.translation import get_language

class ChildPageSerializer(serializers.ModelSerializer):
    """ Serializer for child pages """
    class Meta:
        model = Page
        fields = ['id', 'title', 'url', 'full_url']  # Add any other fields you need

class ArticleSerializer(serializers.ModelSerializer):
    full_path = serializers.SerializerMethodField()
    class Meta:
        model = ArticlePage  # Dynamically get ArticlePage model
        fields = ['title', 'intro', 'slug', 'full_path', 'seo_og_url']
    
    def get_full_path(self, obj):
        return obj.url  # This will generate the full path after the homepage

class CategoriesPageSerializer(BasePageSerializer):
    categories = serializers.SerializerMethodField()
    articles = serializers.SerializerMethodField()
    
    class Meta:
        model = CategoriesPage
        fields = BasePageSerializer.Meta.fields + ["intro", "sidebar_title", "sidebar_extend_btn", "sidebar_collapse_btn", "categories", "articles"]
    
    def get_categories(self, obj):
        # Retrieve categories from the context
        categories = self.context.get("categories", [])
        return CategorySerializer(categories, many=True).data
    
    def get_articles(self, obj):
        # Get current language using Django's translation utility
        current_locale = get_language()
        
        # Alternatively, safely try to get from request
        if not current_locale and "request" in self.context:
            current_locale = getattr(self.context["request"], 'LANGUAGE_CODE', None)
        
        # Retreive article pages
        ArticlePage = apps.get_model('main', 'ArticlePage')
        
        # Filter by locale if language code is available
        if current_locale:
            articles = ArticlePage.objects.filter(locale__language_code=current_locale)
        else:
            # Fallback - get all articles if language not determined
            articles = ArticlePage.objects.all()
            
        return ArticleSerializer(articles, many=True).data

class CategoryDetailSerializer(BasePageSerializer):  # Inheriting from BasePageSerializer directly
    category = serializers.SerializerMethodField()
    articles = serializers.SerializerMethodField()
    
    class Meta:
        model = CategoriesPage  # Set model to CategoriesPage for SEO-related fields
        fields = BasePageSerializer.Meta.fields + ['category', 'articles']  # Inherit and extend fields
    
    def get_category(self, _page):
        category = self.context["category"]
        return CategorySerializer(category).data
    
    def get_articles(self, _page):
        category = self.context["category"]
        
        # Get current language using Django's translation utility
        current_locale = get_language()
        
        # Alternatively, safely try to get from request
        if not current_locale and "request" in self.context:
            current_locale = getattr(self.context["request"], 'LANGUAGE_CODE', None)
        
        # Get article model
        ArticlePage = apps.get_model('main', 'ArticlePage')
        
        # Filter by locale if language code is available
        if current_locale:
            articles = ArticlePage.objects.filter(
                categories__category=category,
                locale__language_code=current_locale
            )
        else:
            # Fallback - get articles only filtered by category if language not determined
            articles = ArticlePage.objects.filter(categories__category=category)
            
        return ArticleSerializer(articles, many=True).data