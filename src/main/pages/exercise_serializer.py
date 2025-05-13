from . import ExercisePage
from .base_serializer import BasePageSerializer


class ExercisePageSerializer(BasePageSerializer):
    class Meta:
        model = ExercisePage
        fields = BasePageSerializer.Meta.fields

