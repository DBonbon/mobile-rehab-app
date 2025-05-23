# Generated by Django 5.0.7 on 2025-04-14 12:05

import wagtail.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0002_alter_battlepage_description_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="battlepage",
            name="description",
            field=wagtail.fields.RichTextField(),
        ),
        migrations.AlterField(
            model_name="battlepage",
            name="point_value",
            field=models.PositiveIntegerField(),
        ),
        migrations.AlterField(
            model_name="battlepage",
            name="recommended_frequency",
            field=models.PositiveIntegerField(help_text="Recommended times per day"),
        ),
        migrations.AlterField(
            model_name="task",
            name="difficulty",
            field=models.CharField(
                choices=[("easy", "Easy"), ("medium", "Medium"), ("hard", "Hard")],
                default="medium",
                max_length=20,
            ),
        ),
    ]
