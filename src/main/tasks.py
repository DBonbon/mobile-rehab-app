# .src/main/tasks.py
from django.db import models
from wagtail.admin.panels import FieldPanel
from wagtail.snippets.models import register_snippet
from django.conf import settings
from django.utils import timezone

# In tasks.py
@register_snippet
class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    point_value = models.PositiveIntegerField(default=1)
    difficulty = models.CharField(
        max_length=20,
        choices=[('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')],
        default='medium'
    )

    # Recurrence control fields
    repeat_daily = models.BooleanField(default=False)
    repeat_weekly = models.BooleanField(default=False)
    active_from = models.DateField(null=True, blank=True)
    active_until = models.DateField(null=True, blank=True)
    est_time = models.IntegerField(null=True, blank=True, default=10)
    day_of_week = models.CharField(
        max_length=10,
        blank=True,
        choices=[
            ('mon', 'Monday'),
            ('tue', 'Tuesday'),
            ('wed', 'Wednesday'),
            ('thu', 'Thursday'),
            ('fri', 'Friday'),
            ('sat', 'Saturday'),
            ('sun', 'Sunday')
        ]
    )

    panels = [
        FieldPanel('title'),
        FieldPanel('description'),
        FieldPanel('point_value'),
        FieldPanel('difficulty'),
        FieldPanel('repeat_daily'),
        FieldPanel('repeat_weekly'),
        FieldPanel('active_from'),
        FieldPanel('active_until'),
        FieldPanel('day_of_week'),
        FieldPanel('est_time'),
    ]

    def __str__(self):
        return self.title
