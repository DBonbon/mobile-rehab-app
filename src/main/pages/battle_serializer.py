# main/pages/battle_serializer.py
from rest_framework import serializers
from wagtail.models import Page
from wagtail.rich_text import expand_db_html
from .base_serializer import BasePageSerializer
from . import BattlePage

class BattlePageSerializer(BasePageSerializer):
    """
    Serializer for BattlePage model
    """
    class Meta:
        model = BattlePage
        fields = BasePageSerializer.Meta.fields + [
            'description',
            'point_value',
            'recommended_frequency',
            'terrain',
            'start_date',
            'end_date',
            'bg_color',
            'bg_color2',
            'path_type',
        ]
   
    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        # Add terrain data if it exists
        if instance.terrain:
            from django.apps import apps
            TerrainType = apps.get_model('main', 'TerrainType')
            
            terrain_data = {
                'id': instance.terrain.id,
                'name': instance.terrain.name,
                'description': instance.terrain.description,
                'identifier': instance.terrain.identifier,
            }
            
            data['terrain'] = terrain_data
       
        # Add related battle tasks data
        data['task_instances'] = self.get_task_instances(instance)
       
        return data
   
    def get_task_instances(self, instance):
        # Use apps.get_model to avoid circular imports
        from django.apps import apps
        Task = apps.get_model('main', 'Task')
        
        tasks = []
        for relation in instance.task_instances.all():
            task_data = {
                'id': relation.id,
                'status': relation.status,
                'task': {
                    'id': relation.task.id,
                    'title': relation.task.title,
                    'description': relation.task.description,
                    'point_value': relation.task.point_value,
                    'difficulty': relation.task.difficulty,
                    #'status': relation.task.status,
                }
            }
            
            # Remove the assigned_user and assigned_date references
            tasks.append(task_data)
        
        return tasks