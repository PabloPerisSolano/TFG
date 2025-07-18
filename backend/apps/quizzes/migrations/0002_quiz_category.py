# Generated by Django 5.1.5 on 2025-06-03 17:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("quizzes", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="quiz",
            name="category",
            field=models.CharField(
                choices=[
                    ("SCIENCE", "Ciencia"),
                    ("GEOGRAPHY", "Geografía"),
                    ("HISTORY", "Historia"),
                    ("SPORTS", "Deportes"),
                    ("MUSIC", "Música"),
                    ("ART", "Arte"),
                    ("TECH", "Tecnología"),
                    ("LANGUAGE", "Idiomas"),
                    ("LITERATURE", "Literatura"),
                    ("MATH", "Matemáticas"),
                    ("CINEMA", "Cine/TV"),
                    ("HEALTH", "Salud/Bienestar"),
                    ("OTHER", "Otros"),
                ],
                default="OTHER",
                max_length=50,
            ),
        ),
    ]
