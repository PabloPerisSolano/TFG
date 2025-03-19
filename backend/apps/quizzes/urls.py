from django.urls import path, include
from .views import (
    PublicQuizListView, PublicQuizDetailView,
    UserQuizListCreateView, UserQuizDetailView,
    QuestionListCreateView, QuestionDetailView,
    AnswerListCreateView, AnswerDetailView,
    GeneratorView,
)

urlpatterns = [
    path('public/', include([
        path('', PublicQuizListView.as_view(), name='public-quiz-list'),
        path('<int:quiz_id>/', PublicQuizDetailView.as_view(),
             name='public-quiz-detail'),
    ])),

    path('me/', include([
        path('', UserQuizListCreateView.as_view(),
             name='user-quiz-list-create'),
        path('<int:quiz_id>/', UserQuizDetailView.as_view(),
             name='user-quiz-detail'),

        path('<int:quiz_id>/questions/', include([
            path('', QuestionListCreateView.as_view(),
                 name='question-list-create'),
            path('<int:question_id>/', QuestionDetailView.as_view(),
                 name='question-detail'),

            path('<int:question_id>/answers/', include([
                path('', AnswerListCreateView.as_view(),
                     name='answer-list-create'),
                path('<int:answer_id>/', AnswerDetailView.as_view(),
                     name='answer-detail'),
            ])),
        ])),

        path('generator/', GeneratorView.as_view(), name='generator'),
    ])),
]
