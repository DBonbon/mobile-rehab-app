# main/views/game_views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models
from django.shortcuts import get_object_or_404
from ..models import UserProfile, Achievement, SupportMessage, Progress
from ..game_serializers import (
    UserProfileSerializer, UserProfileSummarySerializer, UserProfileUpdateSerializer,
    AchievementSerializer, SupportMessageSerializer, SupportMessageCreateSerializer,
    ProgressSerializer
)

# UserProfile ViewSet
class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return UserProfile.objects.all()
        return UserProfile.objects.filter(user=user)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return UserProfileSummarySerializer
        elif self.action in ['update', 'partial_update']:
            return UserProfileUpdateSerializer
        return UserProfileSerializer
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        profile = get_object_or_404(UserProfile, user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

# Achievement ViewSet
class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [permissions.IsAuthenticated]

# SupportMessage ViewSet
class SupportMessageViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return SupportMessage.objects.all()
        return SupportMessage.objects.filter(
            models.Q(recipient=user) | 
            models.Q(sender=user) | 
            models.Q(is_public=True)
        )
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return SupportMessageCreateSerializer
        return SupportMessageSerializer

# Progress ViewSet
class ProgressViewSet(viewsets.ModelViewSet):
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Progress.objects.all()
        return Progress.objects.filter(user=user)
    
    @action(detail=False, methods=['get'])
    def my_progress(self, request):
        progress = Progress.objects.filter(user=request.user).first()
        if progress:
            serializer = ProgressSerializer(progress)
            return Response(serializer.data)
        return Response({})