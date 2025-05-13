# serializers/locale_serializer.py
from rest_framework import serializers
from wagtail.models import Locale
from django.conf import settings

class LocaleSerializer(serializers.ModelSerializer):
    language_name = serializers.SerializerMethodField()

    class Meta:
        model = Locale
        fields = ['language_code', 'language_name']

    def get_language_name(self, obj):
        for code, name in settings.WAGTAIL_CONTENT_LANGUAGES:
            if code == obj.language_code:
                return name
        return obj.language_code