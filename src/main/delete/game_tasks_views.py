# main/views/game_tasks_views.py
# main/views/game_tasks_views.py

from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status

from .base import BaseNextJsViewSet
from main.tasks import Task, UserTask
from main.pages.battle import BattlePageTask  # Adjust path if needed
from main.game_serializers import (
    TaskSerializer,
    UserTaskSerializer,
    UserTaskCreateSerializer,
    BattlePageTaskSerializer
)

class TaskViewSet(BaseNextJsViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    # permission_classes = [permissions.IsAuthenticated]  # handled in base

    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get BattlePageTasks not assigned to the current user and available today"""
        user = request.user

        assigned_battle_task_ids = UserTask.objects.filter(
            user=user
        ).values_list('battle_page_task_id', flat=True)

        available_battle_tasks = BattlePageTask.objects.exclude(id__in=assigned_battle_task_ids)

        today_available_battle_tasks = [
            bt for bt in available_battle_tasks if bt.is_available_today()
        ]

        serializer = BattlePageTaskSerializer(today_available_battle_tasks, many=True)
        return Response(serializer.data)

class UserTaskViewSet(BaseNextJsViewSet):
    """
    API endpoint for managing user tasks
    
    list:
    Return a list of the current user's tasks
    
    retrieve:
    Return a single user task
    
    create:
    Assign a task to the current user
    
    complete:
    Mark a task as completed
    
    by_status:
    Filter tasks by status (available, assigned, completed)
    """
    serializer_class = UserTaskSerializer
    #permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return tasks for the current user"""
        return UserTask.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'create':
            return UserTaskCreateSerializer
        return UserTaskSerializer
    
    def get_serializer_context(self):
        """Add request to serializer context"""
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark a task as completed"""
        user_task = self.get_object()
    
        if user_task.status == 'completed':
            return Response(
                {"error": "Task is already completed"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Complete the task
        user_task.complete(validator=request.user)
    
        # Update user profile if it exists
        try:
            profile = request.user.userprofile
            # Access the point value through battle_page_task.task now
            profile.total_points += user_task.battle_page_task.task.point_value
            profile.save()
        except AttributeError:
            pass  # No profile to update
        
        serializer = self.get_serializer(user_task)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_status(self, request):
        """Get tasks filtered by status"""
        status_filter = request.query_params.get('status', 'assigned')
        
        # Validate status parameter
        if status_filter not in [s[0] for s in UserTask.STATUS_CHOICES]:
            return Response(
                {"error": "Invalid status parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        tasks = UserTask.objects.filter(
            user=request.user,
            status=status_filter
        )
        
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)