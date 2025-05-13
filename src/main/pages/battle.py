# src/main/pages/battle.py
# main/pages/battle.py
from django.utils.translation import gettext_lazy as _
from wagtail.models import PageManager
from wagtail_headless_preview.models import HeadlessPreviewMixin
from django.db import models
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel, InlinePanel, MultiFieldPanel, ObjectList
from modelcluster.fields import ParentalKey

from wagtail.models import Orderable
from .base import BasePage
from django.conf import settings
from wagtail.snippets.models import register_snippet
from django import forms
from django.utils import timezone
from django.core.exceptions import ValidationError

# main/models.py
from ..tasks import Task  # Import the Task model

# Your other models...
PATH_TYPE_CHOICES = [
    ('straight', 'Straight'),
    ('bumpy', 'Bumpy'),
    ('zigzag', 'Zigzag'),
    ('curvy', 'Curvy'),
]
class BattlePage(HeadlessPreviewMixin, BasePage):
    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.BattlePageSerializer"

    description = RichTextField(null=True)
    point_value = models.PositiveIntegerField(null=True)
    recommended_frequency = models.PositiveIntegerField(help_text="Recommended times per day", null=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    # Terrain field - Adding the new FK to TerrainType
    terrain = models.ForeignKey(
        'TerrainType',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='battle_pages',
        help_text="Select the terrain type for this battle"
    )

    bg_color = models.CharField(max_length=7, default="#ffffff")
    bg_color2 = models.CharField(max_length=7, default="#ffffff")  # stores hex color string
    path_type = models.CharField(
        max_length=10,
        choices=PATH_TYPE_CHOICES,
        default='straight',
        help_text="Visual style of the battle path."
    )

    content_panels = BasePage.content_panels + [
        MultiFieldPanel([
            FieldPanel('title', classname="full"),
            FieldPanel('description'),
            FieldPanel('point_value'),
            FieldPanel('recommended_frequency'),
            FieldPanel('start_date'),
            FieldPanel('end_date'),
        ], heading="General"),

        # Planning and tasks section
        MultiFieldPanel([
            InlinePanel('task_instances', label="Tasks"),
        ], heading="Plan & Tasks"),

        # Battlefield styling section
        MultiFieldPanel([
            FieldPanel('terrain'),  # Added terrain field
            FieldPanel('path_type'),
            # Gradient sub-section
            MultiFieldPanel([
                FieldPanel("bg_color", widget=forms.TextInput(attrs={"type": "color"})),
                FieldPanel("bg_color2", widget=forms.TextInput(attrs={"type": "color"})),
            ], heading="Gradient Background"),
        ], heading="Battlefield Styling"),
    ]

    objects: PageManager

    class Meta:
        verbose_name = _("Battle")

# This connects Tasks to Battle Pages
class BattleTaskInstance(Orderable):  # Must inherit from Orderable
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('assigned', 'Assigned'),
        ('completed', 'Completed')
    ]

    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='task_instances')

    # ✅ MUST BE ParentalKey, not ForeignKey
    battle_page = ParentalKey('main.BattlePage', on_delete=models.CASCADE, related_name='task_instances')

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='task_instances'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')

    repeat_at_hour = models.PositiveIntegerField(null=True, blank=True)
    scheduled_date = models.DateField(null=True, blank=True)
    assigned_date = models.DateTimeField(null=True, blank=True)
    completed_date = models.DateTimeField(null=True, blank=True)
    validated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='validated_task_instances'
    )

    def clean(self):
        if self.task.repeat_daily or self.task.repeat_weekly:
            if self.repeat_at_hour is None:
                raise ValidationError("repeat_at_hour is required for repeating tasks.")
        else:
            self.repeat_at_hour = None
            self.scheduled_date = None

    def assign_user(self, user):
        if self.status == 'available':
            self.user = user
            self.status = 'assigned'
            self.assigned_date = timezone.now()
            self.save()

    def complete(self, validator=None):
        if self.status == 'assigned':
            self.status = 'completed'
            self.completed_date = timezone.now()
            self.validated_by = validator
            self.save()
