# Generated by Django 5.0.7 on 2025-04-21 20:31

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0017_battlepagetask_active_from_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="usertask",
            name="battle_page_task",
        ),
        migrations.AddField(
            model_name="usertask",
            name="battle_page",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="user_tasks",
                to="main.battlepage",
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="usertask",
            name="task",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="user_assignments",
                to="main.task",
            ),
            preserve_default=False,
        ),
    ]
