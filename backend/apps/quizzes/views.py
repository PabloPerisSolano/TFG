from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Quiz, Question, Answer
from .serializers import QuizDetailSerializer, QuizListSerializer, QuestionDetailSerializer, QuestionListSerializer, AnswerSerializer
from django.db.models import Prefetch


class QuizListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Quiz.objects.filter(user_id=user_id).order_by('id')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return QuizDetailSerializer
        return QuizListSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class QuizDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuizDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Quiz.objects.filter(user_id=user_id).prefetch_related(
            Prefetch('questions', queryset=Question.objects.order_by('id')),
            Prefetch('questions__answers',
                     queryset=Answer.objects.order_by('id'))
        )


class QuestionListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        quiz_id = self.kwargs['quiz_id']
        return Question.objects.filter(quiz_id=quiz_id, quiz__user_id=user_id)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return QuestionDetailSerializer
        return QuestionListSerializer

    def perform_create(self, serializer):
        user_id = self.kwargs['user_id']
        quiz_id = self.kwargs['quiz_id']
        quiz = get_object_or_404(
            Quiz, id=quiz_id, user_id=user_id)
        serializer.save(quiz=quiz)


class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuestionDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        quiz_id = self.kwargs['quiz_id']
        return Question.objects.filter(quiz_id=quiz_id, quiz__user_id=user_id).prefetch_related('answers')


class AnswerListCreateView(generics.ListCreateAPIView):
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        question_id = self.kwargs['question_id']
        return Answer.objects.filter(question_id=question_id, question__quiz__user_id=user_id)

    def perform_create(self, serializer):
        user_id = self.kwargs['user_id']
        question_id = self.kwargs['question_id']
        question = get_object_or_404(
            Question, id=question_id, quiz__user_id=user_id)
        serializer.save(question=question)


class AnswerDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        question_id = self.kwargs['question_id']
        return Answer.objects.filter(question_id=question_id, question__quiz__user_id=user_id)
