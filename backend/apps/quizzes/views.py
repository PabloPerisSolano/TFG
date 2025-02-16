from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Quiz, Question, Answer
from .serializers import QuizSerializer, QuestionSerializer, AnswerSerializer


class QuizListCreateView(generics.ListCreateAPIView):
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Quiz.objects.filter(user_id=user_id).only('id', 'title', 'description')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class QuizDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Quiz.objects.filter(user_id=user_id).prefetch_related('questions__answers')


class QuestionListCreateView(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        quiz_id = self.kwargs['quiz_id']
        return Question.objects.filter(quiz_id=quiz_id, quiz__user_id=user_id).select_related('quiz')

    def perform_create(self, serializer):
        user_id = self.kwargs['user_id']
        quiz_id = self.kwargs['quiz_id']
        quiz = get_object_or_404(
            Quiz, id=quiz_id, user_id=user_id)  # Manejo seguro
        serializer.save(quiz=quiz)


class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        quiz_id = self.kwargs['quiz_id']
        return Question.objects.filter(quiz_id=quiz_id, quiz__user_id=user_id).select_related('quiz')


class AnswerListCreateView(generics.ListCreateAPIView):
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        question_id = self.kwargs['question_id']
        return Answer.objects.filter(question_id=question_id, question__quiz__user_id=user_id).select_related('question')

    def perform_create(self, serializer):
        user_id = self.kwargs['user_id']
        question_id = self.kwargs['question_id']
        question = get_object_or_404(
            Question, id=question_id, quiz__user_id=user_id)  # Manejo seguro
        serializer.save(question=question)


class AnswerDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        question_id = self.kwargs['question_id']
        return Answer.objects.filter(question_id=question_id, question__quiz__user_id=user_id).select_related('question')
