# Generated by Django 3.1.3 on 2021-01-29 21:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0011_auto_20210119_1829'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='title',
            field=models.CharField(max_length=62, unique=True, verbose_name='Заголовок'),
        ),
    ]