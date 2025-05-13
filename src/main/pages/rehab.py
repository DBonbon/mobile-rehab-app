from wagtail.models import PageManager
from wagtail_headless_preview.models import HeadlessPreviewMixin
from django.db import models
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel, InlinePanel
from modelcluster.fields import ParentalKey
from wagtail.models import Orderable
from .base import BasePage
from django.conf import settings
from wagtail.snippets.models import register_snippet

class RehabPage(HeadlessPreviewMixin, BasePage):
    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.RehabPageSerializer"
    pass
"""from django.utils.translation import gettext_lazy as _
from wagtail.models import PageManager
from wagtail_headless_preview.models import HeadlessPreviewMixin
from django.db import models
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel, InlinePanel
from modelcluster.fields import ParentalKey
from wagtail.models import Orderable
from .base import BasePage
from django.conf import settings
from wagtail.snippets.models import register_snippet

class RehabPage(HeadlessPreviewMixin, BasePage):
    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.RehabPageSerializer"

    description = RichTextField()
    point_value = models.PositiveIntegerField()
    recommended_frequency = models.PositiveIntegerField(help_text="Recommended times per day")

    content_panels = BasePage.content_panels + [
        FieldPanel('title', classname="full"),
        FieldPanel('description'),
        FieldPanel('point_value'),
        FieldPanel('recommended_frequency'),
        InlinePanel('exercise_progress', label="Progress Records"),
        InlinePanel('exercise_achievements', label="Achievements"),
        InlinePanel('exercise_support_messages', label="Support Messages"),
    ]
    objects: PageManager

    class Meta:
        verbose_name = _("Rehab")


#Snippets

#support message
@register_snippet
class SupportMessage(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender.username} to {self.recipient.username} on {self.timestamp}"

class ExercisePageSupportMessage(Orderable):
      page = ParentalKey(ExercisePage, on_delete=models.CASCADE, related_name='exercise_support_messages')
      support_message = models.ForeignKey('gamification.SupportMessage', on_delete=models.CASCADE)

      panels = [
          FieldPanel('support_message'),
      ]
         
class ExercisePageProgress(Orderable):
      page = ParentalKey(ExercisePage, on_delete=models.CASCADE, related_name='exercise_progress')
      progress = models.ForeignKey('gamification.Progress', on_delete=models.CASCADE)

      panels = [
          FieldPanel('progress'),
      ]

#Progress
@register_snippet
class Progress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    exercise_page = models.ForeignKey(ExercisePage, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    times_completed = models.PositiveIntegerField(default=0)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.exercise_page.title} on {self.date}"

#Acheivement
@register_snippet     
class Achievement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total_points = models.PositiveIntegerField(default=0)
    milestone = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.milestone}"

class ExercisePageAchievement(Orderable):
      page = ParentalKey(ExercisePage, on_delete=models.CASCADE, related_name='exercise_achievements')
      achievement = models.ForeignKey('gamification.Achievement', on_delete=models.CASCADE)

      panels = [
          FieldPanel('achievement'),
      ]"""