# Generated by Django 3.2.12 on 2024-02-13 16:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ResourceShare', '0010_auto_20240213_1554'),
    ]

    operations = [
        migrations.RenameField(
            model_name='customuser',
            old_name='downloadCount',
            new_name='download_count',
        ),
        migrations.RenameField(
            model_name='customuser',
            old_name='trustRating',
            new_name='trust_rating',
        ),
    ]
