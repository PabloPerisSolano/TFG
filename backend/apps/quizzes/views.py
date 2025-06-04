import json

from decouple import config
from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from openai import APIConnectionError, APIError, OpenAI
from rest_framework import generics, permissions, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

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


class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Permitir acceso de solo lectura para cualquier solicitud
        if request.method in permissions.SAFE_METHODS:
            return True

        # Verificar si el objeto es un Quiz
        if isinstance(obj, Quiz):
            return obj.author == request.user

        # Verificar si el objeto es una Question
        if isinstance(obj, Question):
            return obj.quiz.author == request.user

        # Verificar si el objeto es una Answer
        if isinstance(obj, Answer):
            return obj.question.quiz.author == request.user

        return False


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 20  # Tamaño de página por defecto
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
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]

    def get_object(self):
        quiz_id = self.kwargs["quiz_id"]

        quiz = get_object_or_404(
            Quiz.objects.prefetch_related(
                Prefetch("questions", queryset=Question.objects.order_by("id")),
                Prefetch("questions__answers", queryset=Answer.objects.order_by("id")),
            ),
            id=quiz_id,
            author=self.request.user,
        )

        return quiz


class QuestionListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        quiz_id = self.kwargs["quiz_id"]
        return Question.objects.filter(
            quiz_id=quiz_id, quiz__author=self.request.user
        ).order_by("id")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return QuestionCreateSerializer
        return QuestionListSerializer

    def perform_create(self, serializer):
        quiz_id = self.kwargs["quiz_id"]
        quiz = get_object_or_404(Quiz, id=quiz_id, author=self.request.user)
        serializer.save(quiz=quiz)


class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuestionDetailSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]

    def get_object(self):
        quiz_id = self.kwargs["quiz_id"]
        question_id = self.kwargs["question_id"]

        question = get_object_or_404(
            Question.objects.prefetch_related(
                Prefetch("answers", queryset=Answer.objects.order_by("id"))
            ),
            id=question_id,
            quiz_id=quiz_id,
            quiz__author=self.request.user,
        )

        return question


class AnswerListCreateView(generics.ListCreateAPIView):
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        question_id = self.kwargs["question_id"]
        return Answer.objects.filter(
            question_id=question_id, question__quiz__author=self.request.user
        ).order_by("id")

    def perform_create(self, serializer):
        question_id = self.kwargs["question_id"]
        question = get_object_or_404(
            Question, id=question_id, quiz__author=self.request.user
        )
        serializer.save(question=question)


class AnswerDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]

    def get_object(self):
        question_id = self.kwargs["question_id"]
        answer_id = self.kwargs["answer_id"]

        answer = get_object_or_404(
            Answer,
            id=answer_id,
            question_id=question_id,
            question__quiz__author=self.request.user,
        )

        return answer


class GeneratorView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        title = request.data.get("title")
        description = request.data.get("description", "")
        public = request.data.get("public", False)
        time_limit = request.data.get("time_limit", 3600)
        category = request.data.get("category")

        num_preguntas = request.data.get("num_preguntas")
        num_opciones = request.data.get("num_opciones")
        prompt = request.data.get("prompt")

        MIN_QUESTIONS = 1
        MAX_QUESTIONS = 20
        MIN_OPTIONS = 2
        MAX_OPTIONS = 4

        if (
            not title
            or not category
            or not num_preguntas
            or not num_opciones
            or not prompt
        ):
            return Response(
                {
                    "error": "title, category, num_preguntas, num_opciones y prompt son obligatorios"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if (
            not isinstance(num_preguntas, int)
            or num_preguntas < MIN_QUESTIONS
            or num_preguntas > MAX_QUESTIONS
        ):
            return Response(
                {
                    "error": f"num_preguntas debe ser un entero entre {MIN_QUESTIONS} y {MAX_QUESTIONS}"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if (
            not isinstance(num_opciones, int)
            or num_opciones < MIN_OPTIONS
            or num_opciones > MAX_OPTIONS
        ):
            return Response(
                {
                    "error": f"num_opciones debe ser un entero entre {MIN_OPTIONS} y {MAX_OPTIONS}"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            openai_api_key = config("OPENROUTER_API_KEY")

            if not openai_api_key:
                return Response(
                    {"error": "API key no encontrada en las variables de entorno"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            client = OpenAI(
                api_key=openai_api_key, base_url="https://openrouter.ai/api/v1"
            )

            response = client.chat.completions.create(
                model="deepseek/deepseek-chat:free",
                messages=[
                    {
                        "role": "system",
                        "content": "Eres un generador de cuestionarios tipo test. A partir de un texto dado, generas un número dado de preguntas y un número dado de respuestas en JSON.",
                    },
                    {
                        "role": "user",
                        "content": f"""Genera {num_preguntas} preguntas con {num_opciones} respuestas en JSON a partir de este texto. La respuesta correcta is_correct no debe ser siempre la primera. Formato:
                        [
                            {{
                                "text": "Pregunta",
                                "answers": [
                                    {{"text": "Respuesta correcta", "is_correct": true}},
                                    {{"text": "Respuesta incorrecta", "is_correct": false}}
                                ]
                            }}, 
                            {{...}}
                        ]
                        Texto: {prompt}""",
                    },
                ],
                stream=False,
            )
            questions_json = response.choices[0].message.content.strip()

            if questions_json.startswith("```json"):
                questions_json = questions_json[7:-3].strip()
            elif questions_json.startswith("```"):
                questions_json = questions_json[3:-3].strip()

            try:
                questions_data = json.loads(questions_json)

                if not isinstance(questions_data, list):
                    return Response(
                        {
                            "error": "Formato inválido: Se esperaba una lista de questions"
                        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
                for question in questions_data:
                    if "text" not in question or "answers" not in question:
                        return Response(
                            {
                                "error": "Formato inválido: Cada question debe tener 'text' y 'answers'"
                            },
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        )
            except json.JSONDecodeError:
                return Response(
                    {"error": "Error al parsear la respuesta de OpenAI"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            # Creamos el quiz utilizando el QuizCreateSerializer
            quiz_data = {
                "title": title,
                "description": description,
                "public": public,
                "time_limit": time_limit,
                "category": category,
                "questions": questions_data,
            }

            quiz_serializer = QuizCreateSerializer(data=quiz_data)

            if quiz_serializer.is_valid():
                quiz = quiz_serializer.save(author=self.request.user)
                quiz_detail_serializer = QuizDetailSerializer(quiz)
                return Response(
                    quiz_detail_serializer.data, status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    {"error": quiz_serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except APIConnectionError as e:
            return Response(
                {"error": f"Fallo al conectarse con OpenAI API: {str(e)}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except APIError as e:
            return Response(
                {"error": f"OpenAI API error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
