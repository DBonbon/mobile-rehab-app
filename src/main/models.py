# main/models.py
from .pages import *  # NOQA: F403
from django.db import models
from django.conf import settings
from wagtail.snippets.models import register_snippet
from modelcluster.models import ClusterableModel
from django.utils.translation import gettext_lazy as _
from modelcluster.fields import ParentalKey
from wagtail.models import Orderable
from wagtail.admin.panels import FieldPanel, InlinePanel
# Game role choices
GAME_ROLES = (
    ('fighter', 'Fighter'),
    ('toolholder', 'Tool Holder'),
)

@register_snippet
class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='game_profile'
    )
    
    role = models.CharField(
        max_length=20,
        choices=GAME_ROLES,
        default='fighter',
        help_text="Role in the rehabilitation game"
    )
    
    total_points = models.PositiveIntegerField(default=0, help_text="Total points earned")
    battles_completed = models.PositiveIntegerField(default=0, help_text="Number of completed battles")
    current_streak = models.PositiveIntegerField(default=0, help_text="Current consecutive days active")
    longest_streak = models.PositiveIntegerField(default=0, help_text="Longest consecutive days active")
    last_active = models.DateField(null=True, blank=True, help_text="Last date user was active")
    
    supported_fighters = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        blank=True,
        related_name='supporting_toolholders',
        help_text="Fighters this ToolHolder is supporting (only relevant for ToolHolder role)"
    )
    
    panels = [
        FieldPanel('user'),
        FieldPanel('role'),
        FieldPanel('total_points'),
        FieldPanel('battles_completed'),
        FieldPanel('current_streak'),
        FieldPanel('longest_streak'),
        FieldPanel('last_active'),
        FieldPanel('supported_fighters'),
    ]
    
    def __str__(self):
        return f"{self.user.username}'s Profile ({self.get_role_display()})"
    
    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"

@register_snippet
class TerrainType(models.Model):
    name = models.CharField(max_length=100)  # Mountain, Sea, Forest, etc.
    description = models.TextField(blank=True)
    identifier = models.SlugField(
        max_length=100,
        unique=True,
        help_text="Unique identifier to load the correct styling in Next.js (e.g., 'mountain', 'ocean')"
    )

    panels = [
        FieldPanel('name'),
        FieldPanel('description'),
        FieldPanel('identifier'),
    ]

    def __str__(self):
        return self.name

@register_snippet
class Achievement(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    point_threshold = models.PositiveIntegerField(help_text="Points required to earn this achievement")
    icon = models.CharField(max_length=100, blank=True, help_text="CSS class or identifier for the achievement icon")
    
    # Add this new field to track which users have earned this achievement
    users = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through='UserAchievement',
        related_name='achievements',
        blank=True
    )
    
    panels = [
        FieldPanel('title'),
        FieldPanel('description'),
        FieldPanel('point_threshold'),
        FieldPanel('icon'),
    ]
    
    def __str__(self):
        return f"{self.title} ({self.point_threshold} points)"

# Create a through model to store when a user earned an achievement
class UserAchievement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    achievement = models.ForeignKey('Achievement', on_delete=models.CASCADE)
    date_earned = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'achievement')
        
    def __str__(self):
        return f"{self.user.username} earned {self.achievement.title}"
    
@register_snippet
class SupportMessage(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='sent_support_messages'
    )
    # Add this new field
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_support_messages',
        null=True,
        blank=True,
        help_text="Recipient user. Leave blank for public messages."
    )
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_public = models.BooleanField(
        default=False, 
        help_text="If checked, this message will be visible to all users"
    )
    
    panels = [
        FieldPanel('sender'),
        FieldPanel('recipient'),
        FieldPanel('message'),
        FieldPanel('is_public'),
    ]
    
    def __str__(self):
        return f"Message from {self.sender.username} on {self.timestamp.strftime('%Y-%m-%d')}"

@register_snippet
class Progress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    points_earned = models.PositiveIntegerField(default=0)
    name = models.CharField(max_length=255, blank=True)
    last_updated = models.DateTimeField(auto_now=True)

    panels = [
        FieldPanel('name'),
        FieldPanel('user'),
        FieldPanel('points_earned'),     
    ]

    def save(self, *args, **kwargs):
        # Only set a default name if it's empty
        if not self.name:
            self.name = f"{self.user.username} - {self.points_earned} points"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
