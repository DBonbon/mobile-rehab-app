from . import RehabPage
from .base_serializer import BasePageSerializer


class RehabPageSerializer(BasePageSerializer):
    class Meta:
        model = RehabPage
        fields = BasePageSerializer.Meta.fields

