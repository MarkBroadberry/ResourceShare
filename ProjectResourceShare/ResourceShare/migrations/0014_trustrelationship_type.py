# Generated by Django 3.2.12 on 2024-02-25 17:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ResourceShare', '0013_trustrelationship'),
    ]

    operations = [
        migrations.AddField(
            model_name='trustrelationship',
            name='type',
            field=models.TextField(default='No Type Specified', max_length=512),
        ),
    ]
