# Generated by Django 3.1.3 on 2021-01-29 21:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0012_auto_20210130_0000'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='rated_posts',
            field=models.JSONField(blank=True, default=dict, verbose_name='Оцененые посты'),
        ),
    ]
