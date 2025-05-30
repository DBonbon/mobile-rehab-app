# Generated by Django 5.0.7 on 2025-05-03 10:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0024_taskinstance_battle_task_page_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="battletaskpage",
            name="active_from",
        ),
        migrations.RemoveField(
            model_name="battletaskpage",
            name="active_until",
        ),
        migrations.RemoveField(
            model_name="battletaskpage",
            name="day_of_week",
        ),
        migrations.RemoveField(
            model_name="battletaskpage",
            name="repeat_daily",
        ),
        migrations.RemoveField(
            model_name="battletaskpage",
            name="repeat_weekly",
        ),
        migrations.AddField(
            model_name="battlepage",
            name="end_date",
            field=models.DateField(
                blank=True,
                help_text="Leave empty for single-day battles",
                null=True,
                verbose_name="End Date",
            ),
        ),
        migrations.AddField(
            model_name="battlepage",
            name="start_date",
            field=models.DateField(null=True, verbose_name="Start Date"),
        ),
        migrations.AddField(
            model_name="task",
            name="active_from",
            field=models.DateField(
                blank=True, help_text="Date when this task becomes available", null=True
            ),
        ),
        migrations.AddField(
            model_name="task",
            name="active_until",
            field=models.DateField(
                blank=True,
                help_text="Date when this task is no longer available",
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="task",
            name="day_of_week",
            field=models.IntegerField(
                blank=True,
                choices=[
                    (0, "Monday"),
                    (1, "Tuesday"),
                    (2, "Wednesday"),
                    (3, "Thursday"),
                    (4, "Friday"),
                    (5, "Saturday"),
                    (6, "Sunday"),
                ],
                help_text="If weekly, which day it should be available",
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="task",
            name="repeat_daily",
            field=models.BooleanField(
                default=False, help_text="Whether this task repeats daily"
            ),
        ),
        migrations.AddField(
            model_name="task",
            name="repeat_weekly",
            field=models.BooleanField(
                default=False, help_text="Whether this task repeats weekly"
            ),
        ),
    ]
