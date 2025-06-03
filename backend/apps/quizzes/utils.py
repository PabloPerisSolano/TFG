from django.db.models.functions import Lower


def filter_and_order_quizzes(queryset, params):
    # Filtrado por título
    if title_term := params.get("title"):
        queryset = queryset.filter(title__icontains=title_term)

    # Filtrado por visibilidad (solo para UserQuizListCreateView)
    if public_param := params.get("public"):
        public = public_param.lower() == "true"
        queryset = queryset.filter(public=public)

    # Filtrado por categoría
    if category := params.get("category"):
        queryset = queryset.filter(category=category)

    # Ordenamiento dinámico
    sort_by = params.get("sort_by")
    sort_order = params.get("sort_order", "desc")

    if sort_by == "title":
        if sort_order == "asc":
            queryset = queryset.order_by(Lower("title"))
        else:
            queryset = queryset.order_by(Lower("title").desc())

    elif sort_by in ["created", "questions"]:
        order_fields = {
            "created": "created_at",
            "questions": "num_questions",
        }
        sort_field = order_fields.get(sort_by, "created_at")
        if sort_order == "asc":
            queryset = queryset.order_by(sort_field)
        else:
            queryset = queryset.order_by(f"-{sort_field}")

    elif sort_by == "category":
        if sort_order == "asc":
            queryset = queryset.order_by("category")
        else:
            queryset = queryset.order_by("-category")

    else:
        # Orden por defecto
        queryset = queryset.order_by("-created_at")

    return queryset
