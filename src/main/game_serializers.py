from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile, Achievement, UserAchievement, SupportMessage, Progress
from main.tasks import Task
from main.models import BattleTaskInstance

User = get_user_model()

# Basic User serializer for embedding in other serializers
class GameUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'display_name', 'photo', 'role'
        ]
        read_only_fields = ['id', 'username', 'email']

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'title', 'description', 'point_threshold', 'icon']

class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)
    
    class Meta:
        model = UserAchievement
        fields = ['achievement', 'date_earned']

class SupportMessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_display_name = serializers.CharField(source='sender.display_name', read_only=True, allow_null=True)
    recipient_username = serializers.CharField(source='recipient.username', read_only=True, allow_null=True)
    
    class Meta:
        model = SupportMessage
        fields = [
            'id', 'sender', 'sender_username', 'sender_display_name',
            'recipient', 'recipient_username', 'message', 
            'timestamp', 'is_public'
        ]
        read_only_fields = ['sender', 'timestamp']

class ProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progress
        fields = ['id', 'user', 'points_earned', 'last_updated']
        read_only_fields = ['user', 'last_updated']

class UserProfileSerializer(serializers.ModelSerializer):
    user = GameUserSerializer(read_only=True)
    user_achievements = serializers.SerializerMethodField()
    sent_messages = serializers.SerializerMethodField()
    received_messages = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'role', 'total_points', 'battles_completed',
            'current_streak', 'longest_streak', 'last_active',
            'user_achievements', 'sent_messages', 'received_messages', 
            'progress'
        ]
        read_only_fields = ['id', 'user']
    
    def get_user_achievements(self, obj):
        user_achievements = UserAchievement.objects.filter(user=obj.user)
        return UserAchievementSerializer(user_achievements, many=True).data
    
    def get_sent_messages(self, obj):
        messages = obj.user.sent_support_messages.all()
        return SupportMessageSerializer(messages, many=True).data
    
    def get_received_messages(self, obj):
        messages = obj.user.received_support_messages.all()
        return SupportMessageSerializer(messages, many=True).data
    
    def get_progress(self, obj):
        progress = Progress.objects.filter(user=obj.user).first()
        if progress:
            return ProgressSerializer(progress).data
        return None

class UserProfileSummarySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    display_name = serializers.CharField(source='user.display_name', read_only=True, allow_null=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'username', 'display_name', 'role', 
            'total_points', 'battles_completed'
        ]
        read_only_fields = ['id', 'username']

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'role', 'total_points', 'battles_completed',
            'current_streak', 'longest_streak', 'last_active',
            'supported_fighters'
        ]

class SupportMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportMessage
        fields = ['recipient', 'message', 'is_public']
    
    def create(self, validated_data):
        user = self.context['request'].user
        return SupportMessage.objects.create(sender=user, **validated_data)
    
# main/game_serializers.py (add these to your existing serializers)


"""class TaskSerializer(serializers.ModelSerializer):
    #Serializer for the basic Task model
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'point_value', 'difficulty']
"""
# Add this to your game_serializers.py

class TaskInstanceSerializer(serializers.ModelSerializer):
    task_title = serializers.CharField(source='task.title', read_only=True)
    task_description = serializers.CharField(source='task.description', read_only=True)
    battle_title = serializers.CharField(source='battle_page.title', read_only=True)
    battle_date = serializers.CharField(source='battle_page.start_date', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    task_point_value = serializers.IntegerField(source='task.point_value', read_only=True)
    task_est_time = serializers.IntegerField(source='task.est_time', read_only=True)
    task_difficulty = serializers.CharField(source='task.difficulty', read_only=True)
    class Meta:
        model = BattleTaskInstance
        fields = [
            'id', 'task_title', 'task_description', 'battle_title',
            'username', 'task_point_value', 'task_difficulty', 'task_est_time', 'battle_date', 'status', 'assigned_date', 'completed_date',
            'scheduled_date', 'repeat_at_hour'
        ]

class TaskInstanceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BattleTaskInstance
        fields = ['id', 'task', 'battle_page', 'repeat_at_hour', 'scheduled_date']

    def create(self, validated_data):
        validated_data['status'] = 'available'
        return BattleTaskInstance.objects.create(**validated_data)

