# Generated by Django 3.1.3 on 2021-01-31 10:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0018_auto_20210131_1347'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='comments',
            field=models.JSONField(default={'comments': []}, verbose_name='Комментарии'),
        ),
        migrations.AlterField(
            model_name='post',
            name='comments',
            field=models.JSONField(default={'comments': []}, verbose_name='Комментарии'),
        ),
    ]