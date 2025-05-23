# Generated by Django 5.0.7 on 2025-04-21 13:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0016_remove_usertask_battle_page_remove_usertask_task_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="battlepagetask",
            name="active_from",
            field=models.DateField(
                blank=True, help_text="Date when this task becomes available", null=True
            ),
        ),
        migrations.AddField(
            model_name="battlepagetask",
            name="active_until",
            field=models.DateField(
                blank=True,
                help_text="Date when this task is no longer available",
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="battlepagetask",
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
            model_name="battlepagetask",
            name="repeat_daily",
            field=models.BooleanField(
                default=False, help_text="Whether this task repeats daily"
            ),
        ),
        migrations.AddField(
            model_name="battlepagetask",
            name="repeat_weekly",
            field=models.BooleanField(
                default=False, help_text="Whether this task repeats weekly"
            ),
        ),
    ]
