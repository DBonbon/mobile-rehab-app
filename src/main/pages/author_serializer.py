from . import AuthorPage
from .base_serializer import BasePageSerializer
from rest_framework import serializers
from wagtail.models import Page
from wagtail.rich_text import expand_db_html

class ChildPageSerializer(serializers.ModelSerializer):
    """ Serializer for child pages """
    class Meta:
        model = Page
        fields = ['id', 'title', 'url', 'full_url']  # Add any other fields you need

class AuthorPageSerializer(BasePageSerializer):
    class Meta:
        model = AuthorPage
        fields = BasePageSerializer.Meta.fields

    def get_children(self, obj):
        """ Returns the child pages of the authors page """
        children = obj.get_children().live().in_menu()  # Get only live pages that are in the menu
        return ChildPageSerializer(children, many=True).data
