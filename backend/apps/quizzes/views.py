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
from openai import OpenAI
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


class GeneratorView(APIView):
    permission_classes = [IsAuthenticated]  # 👈 Asegura autenticación

    def post(self, request, *args, **kwargs):
        text = request.data.get('text')
        if not text:
            return Response({"error": "Text is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            load_dotenv()

            # Obtener la API key desde las variables de entorno
            openai_api_key = os.getenv("OPENROUTER_API_KEY")
            client = OpenAI(api_key=openai_api_key,
                            base_url="https://openrouter.ai/api/v1")

            response = client.chat.completions.create(
                model="deepseek/deepseek-r1:free",
                messages=[
                    {
                        "role": "system",
                        "content": "Eres un generador de cuestionarios. A partir de un texto dado, generas preguntas y respuestas en JSON."
                    },
                    {
                        "role": "user",
                        "content": f"""A partir del siguiente texto, genera un cuestionario en formato JSON con preguntas y respuestas. 
                        El formato debe ser:
                        {{
                          "title": "Título del cuestionario",
                          "description": "Descripción del cuestionario",
                          "questions": [
                            {{
                              "text": "Pregunta 1",
                              "answers": [
                                {{
                                  "text": "Respuesta correcta",
                                  "is_correct": true
                                }},
                                {{
                                  "text": "Respuesta incorrecta 1",
                                  "is_correct": false
                                }},
                                {{
                                  "text": "Respuesta incorrecta 2",
                                  "is_correct": false
                                }}
                              ]
                            }}
                          ]
                        }}

                        Texto: {text}"""
                    }
                ],
                stream=False
            )

            quiz_json = response.choices[0].message.content.strip()
            if quiz_json.startswith('```json') and quiz_json.endswith('```'):
                quiz_json = quiz_json[7:-3].strip()
            print(quiz_json)

            try:
                quiz_data = json.loads(quiz_json)
            except json.JSONDecodeError:
                return Response({"error": "Failed to parse OpenAI response"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Asociamos el quiz al usuario autenticado
            serializer = QuizDetailSerializer(
                data=quiz_data, context={"request": request})
            if serializer.is_valid():
                # 👈 Guardamos el usuario en la BD
                serializer.save(user=request.user)
                return Response({"message": "Quiz created successfully", "quiz": serializer.data}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
