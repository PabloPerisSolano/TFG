from django.urls import path
from .views import QuizListCreateView, QuizDetailView, QuestionListCreateView, QuestionDetailView, AnswerListCreateView, AnswerDetailView, GeneratorView

urlpatterns = [
    path('', QuizListCreateView.as_view(), name='quiz-list-create'),
    path('<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'),

    path('<int:quiz_id>/questions/', QuestionListCreateView.as_view(),
         name='question-list-create'),
    path('<int:quiz_id>/questions/<int:pk>/',
         QuestionDetailView.as_view(), name='question-detail'),

    path('<int:quiz_id>/questions/<int:question_id>/answers/',
         AnswerListCreateView.as_view(), name='answer-list-create'),
    path('<int:quiz_id>/questions/<int:question_id>/answers/<int:pk>/',
         AnswerDetailView.as_view(), name='answer-detail'),

    path('generator/', GeneratorView.as_view(), name='generator'),
]
