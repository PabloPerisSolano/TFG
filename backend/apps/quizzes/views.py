from .serializers import QuizDetailSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Quiz, Question, Answer
from .serializers import QuizDetailSerializer, QuizListSerializer, QuestionDetailSerializer, QuestionListSerializer, AnswerSerializer
from django.db.models import Prefetch
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from openai import OpenAI, APIConnectionError, APIError
import json
from dotenv import load_dotenv
import os


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

    def create(self, request, *args, **kwargs):
        user_id = self.kwargs['user_id']
        quiz_id = self.kwargs['quiz_id']
        quiz = get_object_or_404(Quiz, id=quiz_id, user_id=user_id)

        data = request.data

        if isinstance(data, list):
            questions = []
            answers_to_create = []

            for question_data in data:
                answers_data = question_data.pop('answers', [])
                question = Question(quiz=quiz, **question_data)
                questions.append(question)

                for answer_data in answers_data:
                    answers_to_create.append(
                        Answer(question=question, **answer_data))

            Question.objects.bulk_create(questions)
            Answer.objects.bulk_create(answers_to_create)

            return Response({"message": "Questions and answers created successfully"}, status=status.HTTP_201_CREATED)
        else:
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        user_id = self.kwargs['user_id']
        quiz_id = self.kwargs['quiz_id']
        quiz = get_object_or_404(Quiz, id=quiz_id, user_id=user_id)
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


class GeneratorView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        text = request.data.get('text')
        numPreguntas = request.data.get('numPreguntas')
        numOpciones = request.data.get('numOpciones')

        MIN_QUESTIONS = 1
        MAX_QUESTIONS = 20
        MIN_OPTIONS = 2
        MAX_OPTIONS = 4

        if not text or not numPreguntas or not numOpciones:
            return Response({"error": "Text, numPreguntas and numOpciones are required"}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(numPreguntas, int) or numPreguntas < MIN_QUESTIONS or numPreguntas > MAX_QUESTIONS:
            return Response({"error": f"numPreguntas must be an integer between {MIN_QUESTIONS} and {MAX_QUESTIONS}"}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(numOpciones, int) or numOpciones < MIN_OPTIONS or numOpciones > MAX_OPTIONS:
            return Response({"error": f"numOpciones must be an integer between {MIN_OPTIONS} and {MAX_OPTIONS}"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            load_dotenv()

            openai_api_key = os.getenv("OPENROUTER_API_KEY")

            if not openai_api_key:
                return Response({"error": "API key not found in environment variables"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            client = OpenAI(api_key=openai_api_key,
                            base_url="https://openrouter.ai/api/v1")

            response = client.chat.completions.create(
                model="deepseek/deepseek-chat:free",
                messages=[
                    {
                        "role": "system",
                        "content": "Eres un generador de cuestionarios tipo test. A partir de un texto dado, generas un número dado de preguntas y un número dado de respuestas en JSON."
                    },
                    {
                        "role": "user",
                        "content": f"""Genera {numPreguntas} preguntas con {numOpciones} respuestas en JSON a partir de este texto. La respuesta correcta is_correct no debe ser siempre la primera. Formato:
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
                        Texto: {text}"""
                    }
                ],
                stream=False
            )
            questions_json = response.choices[0].message.content.strip()

            if questions_json.startswith('```json'):
                questions_json = questions_json[7:-3].strip()
            elif questions_json.startswith('```'):
                questions_json = questions_json[3:-3].strip()

            try:
                questions_data = json.loads(questions_json)
                if not isinstance(questions_data, list):
                    return Response({"error": "Invalid format: Expected a list of questions"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                for question in questions_data:
                    if "text" not in question or "answers" not in question:
                        return Response({"error": "Invalid format: Each question must have 'text' and 'answers'"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except json.JSONDecodeError:
                return Response({"error": "Failed to parse OpenAI response"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({"questions": questions_data}, status=status.HTTP_200_OK)

        except APIConnectionError as e:
            return Response({"error": f"Failed to connect to OpenAI API: {str(e)}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except APIError as e:
            return Response({"error": f"OpenAI API error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
