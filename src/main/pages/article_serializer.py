from rest_framework import serializers
from wagtail.rich_text import expand_db_html
from fields.fields import TagField, CategoryField

from .base_serializer import BasePageSerializer
from . import ArticlePage
from wagtail.models import Page
from wagtail_footnotes.models import Footnote
from wagtail.rich_text import expand_db_html

class FootnoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Footnote
        fields = ["uuid", "text", "id",]

class ChildPageSerializer(serializers.ModelSerializer):
    """ Serializer for child pages """
    class Meta:
        model = Page
        fields = ['id', 'title', 'url', 'full_url']  # Add any other fields you need

class ArticlePageSerializer(BasePageSerializer):
    tags = TagField()
    categories = CategoryField()
    children = serializers.SerializerMethodField()  # Add SerializerMethodField
    footnotes = serializers.SerializerMethodField()

    class Meta:
        model = ArticlePage
        fields = BasePageSerializer.Meta.fields + [
            "intro",
            "body",
            "children",  # Add 'children' to fields
            "tags",
            "categories",
            "footnotes",
        ]

    def get_children(self, obj):
        """ Returns the child pages of the article page """
        children = obj.get_children().live().in_menu()  # Get only live pages that are in the menu
        return ChildPageSerializer(children, many=True).data

    def get_footnotes(self, obj):
        """ Returns the footnotes associated with the article page """
        footnotes = obj.footnotes.all()  # Query all related footnotes
        return FootnoteSerializer(footnotes, many=True).data

    def get_children(self, obj):
        """ Returns the child pages of the authors page """
        children = obj.get_children().live().in_menu()  # Get only live pages that are in the menu
        return ChildPageSerializer(children, many=True).data
