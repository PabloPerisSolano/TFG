# apps/quizzes/serializers.py
from rest_framework import serializers
from .models import Quiz, Question, Answer


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text', 'is_correct']
        read_only_fields = ['id']


class QuestionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text']


class QuestionDetailSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'answers']
        read_only_fields = ['id']


class QuestionCreateSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, required=False)

    class Meta:
        model = Question
        fields = ['id', 'text', 'answers']
        read_only_fields = ['id']

    def create(self, validated_data):
        answers_data = validated_data.pop('answers', [])
        question = Question.objects.create(**validated_data)

        if answers_data:
            answers = [Answer(question=question, **answer_data)
                       for answer_data in answers_data]
            Answer.objects.bulk_create(answers)

        return question


class QuizListSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()

    class Meta:
        model = Quiz
        fields = ['id', 'author', 'title', 'description',
                  'public', 'time_limit', 'created_at', 'num_questions']


class QuizDetailSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    questions = QuestionDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'author', 'title', 'description',
                  'public', 'time_limit', 'created_at', 'num_questions', 'questions']
        read_only_fields = ['id', 'author',
                            'created_at', 'num_questions']


class QuizCreateSerializer(serializers.ModelSerializer):
    questions = QuestionCreateSerializer(many=True, required=False)
    description = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Quiz

        fields = ['id', 'author', 'title', 'description',
                  'public', 'time_limit', 'created_at', 'num_questions', 'questions']

        read_only_fields = ['id', 'author', 'created_at', 'num_questions']

    def create(self, validated_data):
        questions_data = validated_data.pop('questions', [])
        quiz = Quiz.objects.create(**validated_data)

        questions = []
        answers = []

        for question_data in questions_data:
            answers_data = question_data.pop('answers', [])
            question = Question(quiz=quiz, **question_data)
            questions.append(question)

            for answer_data in answers_data:
                answers.append(Answer(question=question, **answer_data))

        if questions:
            Question.objects.bulk_create(questions)
        if answers:
            Answer.objects.bulk_create(answers)

        return quiz
