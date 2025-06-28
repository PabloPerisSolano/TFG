import random

from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .generator import QuizGenerator
from .models import Answer, Question, Quiz
from .serializers import (
    AnswerSerializer,
    QuestionCreateSerializer,
    QuestionDetailSerializer,
    QuestionListSerializer,
    QuizCreateSerializer,
    QuizDetailSerializer,
    QuizListSerializer,
)
from .utils import filter_and_order_quizzes


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 6  # Tamaño de página por defecto
    page_size_query_param = "page_size"


class PublicQuizListView(generics.ListAPIView):
    serializer_class = QuizListSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset = Quiz.objects.filter(public=True)
        return filter_and_order_quizzes(queryset, self.request.query_params)


class PublicQuizDetailView(generics.RetrieveAPIView):
    serializer_class = QuizDetailSerializer

    def get_object(self):
        quiz_id = self.kwargs["quiz_id"]
        return get_object_or_404(Quiz, id=quiz_id, public=True)


class UserQuizListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination
    serializer_class = QuizListSerializer

    def get_queryset(self):
        queryset = Quiz.objects.filter(author=self.request.user)
        return filter_and_order_quizzes(queryset, self.request.query_params)

    def get_serializer_class(self):
        if self.request.method == "POST":
            return QuizCreateSerializer
        return self.serializer_class

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class UserQuizDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuizDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        quiz_id = self.kwargs["quiz_id"]

        quiz = get_object_or_404(
            Quiz.objects.prefetch_related(
                Prefetch("questions", queryset=Question.objects.order_by("id")),
                Prefetch("questions__answers", queryset=Answer.objects.order_by("id")),
            ),
            author=self.request.user,
            id=quiz_id,
        )

        return quiz


class QuestionListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        quiz_id = self.kwargs["quiz_id"]
        return Question.objects.filter(
            quiz__author=self.request.user, quiz_id=quiz_id
        ).order_by("id")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return QuestionCreateSerializer
        return QuestionListSerializer

    def perform_create(self, serializer):
        quiz_id = self.kwargs["quiz_id"]
        quiz = get_object_or_404(Quiz, author=self.request.user, id=quiz_id)
        serializer.save(quiz=quiz)


class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuestionDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        quiz_id = self.kwargs["quiz_id"]
        question_id = self.kwargs["question_id"]

        question = get_object_or_404(
            Question.objects.prefetch_related(
                Prefetch("answers", queryset=Answer.objects.order_by("id"))
            ),
            quiz__author=self.request.user,
            quiz_id=quiz_id,
            id=question_id,
        )

        return question


class AnswerListCreateView(generics.ListCreateAPIView):
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        quiz_id = self.kwargs["quiz_id"]
        question_id = self.kwargs["question_id"]

        return Answer.objects.filter(
            question__quiz__author=self.request.user,
            question__quiz_id=quiz_id,
            question_id=question_id,
        ).order_by("id")

    def perform_create(self, serializer):
        quiz_id = self.kwargs["quiz_id"]
        question_id = self.kwargs["question_id"]

        question = get_object_or_404(
            Question,
            quiz__author=self.request.user,
            quiz_id=quiz_id,
            id=question_id,
        )
        serializer.save(question=question)


class AnswerDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        quiz_id = self.kwargs["quiz_id"]
        question_id = self.kwargs["question_id"]
        answer_id = self.kwargs["answer_id"]

        answer = get_object_or_404(
            Answer,
            question__quiz__author=self.request.user,
            question__quiz_id=quiz_id,
            question_id=question_id,
            id=answer_id,
        )

        return answer


class QuizTakeView(generics.RetrieveAPIView):
    serializer_class = QuizDetailSerializer

    def get_object(self):
        quiz_id = self.kwargs["quiz_id"]
        quiz = get_object_or_404(Quiz, id=quiz_id)
        # Si es público, cualquiera puede verlo
        if quiz.public:
            return quiz
        # Si es privado, solo el autor puede verlo
        if not self.request.user.is_authenticated or quiz.author != self.request.user:
            raise PermissionDenied(
                "No tienes permiso para acceder a este quiz privado."
            )
        return quiz


class GeneratorView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            pdf_file = request.FILES.get("pdf")
            required_fields = [
                "title",
                "category",
                "num_preguntas",
                "num_opciones",
                "idioma",
            ]

            # prompt solo es obligatorio si no hay pdf
            if not all(field in data for field in required_fields) or (
                not pdf_file and "prompt" not in data
            ):
                return Response(
                    {
                        "error": "Faltan campos obligatorios: "
                        + ", ".join(required_fields)
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Validar categoría
            category = data["category"]
            valid_categories = [choice[0] for choice in Quiz.CATEGORY_CHOICES]
            if category not in valid_categories:
                return Response(
                    {
                        "error": f"Categoría inválida. Debe ser una de: {', '.join(valid_categories)}"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            num_preguntas = int(data["num_preguntas"])
            num_opciones = int(data["num_opciones"])
            idioma = data.get("idioma", "Español")

            # Obtener el texto a procesar
            if pdf_file:
                page_range = data.get("page_range", "")
                selected_pages = (
                    QuizGenerator.parse_page_range(page_range) if pdf_file else None
                )
                prompt = QuizGenerator.extract_text_from_pdf(pdf_file, selected_pages)
            else:
                prompt = data["prompt"]

            QuizGenerator.validate_generation_params(
                num_preguntas, num_opciones, prompt
            )

            openai_response = QuizGenerator.call_openai_api(
                num_preguntas, num_opciones, idioma, prompt
            )

            questions_data = QuizGenerator.parse_openai_response(openai_response)

            for pregunta in questions_data:
                random.shuffle(pregunta["answers"])

            quiz_data = {
                "title": data["title"],
                "description": data.get("description", ""),
                "public": data.get("public", False),
                "time_limit": data.get("time_limit", 3600),
                "category": data["category"],
                "questions": questions_data,
            }

            quiz_serializer = QuizCreateSerializer(data=quiz_data)

            if quiz_serializer.is_valid():
                quiz = quiz_serializer.save(author=self.request.user)
                return Response(
                    QuizDetailSerializer(quiz).data, status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    quiz_serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": f"Error en la generación: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
