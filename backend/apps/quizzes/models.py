from django.conf import settings
from django.db import models


class Quiz(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="quizzes"
    )
    title = models.CharField(max_length=255)
    description = models.TextField(default="")
    public = models.BooleanField(default=False)
    time_limit = models.PositiveIntegerField(default=3600)  # Tiempo límite en segundos
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def num_questions(self):
        return self.questions.count()  # Propiedad calculada

    def __str__(self):
        return self.title


class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    text = models.CharField(max_length=255)

    def __str__(self):
        return self.text


class Answer(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="answers"
    )
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text
