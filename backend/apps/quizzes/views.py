from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Quiz, Question, Answer
from .serializers import QuizSerializer, QuestionSerializer, AnswerSerializer


class QuizListCreateView(generics.ListCreateAPIView):
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Quiz.objects.filter(user_id=user_id)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class QuizDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Quiz.objects.filter(user_id=user_id)


class QuestionListCreateView(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        quiz_id = self.kwargs['quiz_id']
        # Asegurarse de que el quiz pertenezca al usuario
        Quiz.objects.filter(id=quiz_id, user_id=user_id).exists()  # Validación
        return Question.objects.filter(quiz_id=quiz_id)

    def perform_create(self, serializer):
        user_id = self.kwargs['user_id']
        quiz_id = self.kwargs['quiz_id']
        # Asegurarse de que el quiz pertenezca al usuario
        quiz = Quiz.objects.get(id=quiz_id, user_id=user_id)
        serializer.save(quiz=quiz)


class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        quiz_id = self.kwargs['quiz_id']
        return Question.objects.filter(quiz_id=quiz_id, quiz__user_id=user_id)


class AnswerListCreateView(generics.ListCreateAPIView):
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        question_id = self.kwargs['question_id']
        # Asegurarse de que la pregunta pertenezca a un quiz del usuario
        Question.objects.filter(
            id=question_id, quiz__user_id=user_id).exists()  # Validación
        return Answer.objects.filter(question_id=question_id)

    def perform_create(self, serializer):
        user_id = self.kwargs['user_id']
        question_id = self.kwargs['question_id']
        # Asegurarse de que la pregunta pertenezca a un quiz del usuario
        question = Question.objects.get(id=question_id, quiz__user_id=user_id)
        serializer.save(question=question)


class AnswerDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        question_id = self.kwargs['question_id']
        return Answer.objects.filter(question_id=question_id, question__quiz__user_id=user_id)
