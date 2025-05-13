from rest_framework import serializers
from . import DashboardPage
from .base_serializer import BasePageSerializer

class DashboardPageSerializer(BasePageSerializer):
    tasks = serializers.SerializerMethodField()

    class Meta:
        model = DashboardPage
        fields = BasePageSerializer.Meta.fields + ['tasks']  # Add 'tasks' field

    def get_tasks(self, obj):
        # Lazy import to avoid circular imports
        from main.tasks import Task  # Import Task model inside the method
        from main.game_serializers import TaskSerializer  # Import TaskSerializer inside the method
        
        # Retrieve all tasks or add your filtering logic here
        tasks = Task.objects.all()
        
        # Serialize tasks and return
        return TaskSerializer(tasks, many=True).data
