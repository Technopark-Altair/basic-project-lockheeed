# Generated by Django 3.1.3 on 2020-12-26 17:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0008_auto_20201226_1412'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='type',
            field=models.CharField(default='article', max_length=7),
        ),
    ]
