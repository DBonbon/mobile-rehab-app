# Generated by Django 5.0.7 on 2025-05-10 22:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0030_battlepage_end_date_battlepage_start_date"),
    ]

    operations = [
        migrations.AddField(
            model_name="task",
            name="est_time",
            field=models.IntegerField(blank=True, default=10, null=True),
        ),
    ]
