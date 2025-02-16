# apps/quizzes/serializers.py
from rest_framework import serializers
from .models import Quiz, Question, Answer


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text', 'is_correct']


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'answers']


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'questions']

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        quiz = Quiz.objects.create(**validated_data)

        questions = []
        answers = []

        for question_data in questions_data:
            answers_data = question_data.pop('answers')
            question = Question(quiz=quiz, **question_data)
            questions.append(question)

            for answer_data in answers_data:
                answers.append(Answer(question=question, **answer_data))

        # Inserta todas las preguntas de una vez
        Question.objects.bulk_create(questions)
        # Inserta todas las respuestas de una vez
        Answer.objects.bulk_create(answers)

        return quiz
