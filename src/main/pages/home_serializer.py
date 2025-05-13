from .base_serializer import BasePageSerializer
from . import HomePage
from wagtail.models import Page
from rest_framework import serializers
from wagtail.rich_text import expand_db_html

class ChildPageSerializer(serializers.ModelSerializer):
    """ Serializer for child pages """
    class Meta:
        model = Page
        fields = ['id', 'title', 'url', 'full_url']  # Add any other fields you need

class HomePageSerializer(BasePageSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = HomePage
        fields = BasePageSerializer.Meta.fields + [
            #'intro',
            #'body',
            'children',  # Add 'children' to fields
        ]
    def get_children(self, obj):
        """ Returns the child pages of the homepage """
        children = obj.get_children().live().in_menu()  # Get only live pages that are in the menu
        return ChildPageSerializer(children, many=True).data
