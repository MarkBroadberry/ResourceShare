# Generated by Django 3.2.12 on 2024-02-15 20:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ResourceShare', '0011_auto_20240213_1608'),
    ]

    operations = [
        migrations.CreateModel(
            name='SavedResource',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('saved_at', models.DateTimeField(auto_now_add=True)),
                ('resource', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ResourceShare.resource')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
