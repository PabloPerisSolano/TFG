# generator.py
import json

import fitz
from decouple import config
from openai import APIConnectionError, APIError, OpenAI
from rest_framework import status

MIN_QUESTIONS = 1
MAX_QUESTIONS = 20
MIN_OPTIONS = 2
MAX_OPTIONS = 4
MIN_PROMPT_LENGTH = 20
MAX_PROMPT_LENGTH = 500000


class QuizGenerator:

    @staticmethod
    def validate_generation_params(num_preguntas, num_opciones, prompt):
        if not isinstance(num_preguntas, int) or not isinstance(num_opciones, int):
            raise ValueError(
                "Los parámetros num_preguntas y num_opciones deben ser números enteros"
            )

        if num_preguntas < MIN_QUESTIONS or num_preguntas > MAX_QUESTIONS:
            raise ValueError(
                f"num_preguntas debe estar entre {MIN_QUESTIONS} y {MAX_QUESTIONS}"
            )

        if num_opciones < MIN_OPTIONS or num_opciones > MAX_OPTIONS:
            raise ValueError(
                f"num_opciones debe estar entre {MIN_OPTIONS} y {MAX_OPTIONS}"
            )

        if not prompt or not isinstance(prompt, str):
            raise ValueError("El prompt debe ser una cadena de texto no vacía")

        if len(prompt) < MIN_PROMPT_LENGTH:
            raise ValueError(
                f"El prompt debe tener al menos {MIN_PROMPT_LENGTH} caracteres"
            )

        if len(prompt) > MAX_PROMPT_LENGTH:
            raise ValueError(
                f"El prompt no puede exceder los {MAX_PROMPT_LENGTH} caracteres"
            )

    @staticmethod
    def extract_text_from_pdf(pdf_file):
        if hasattr(pdf_file, "read"):
            doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
        else:
            doc = fitz.open(pdf_file)

        extracted_text = ""
        for i, page in enumerate(doc):
            page_text = page.get_text()
            extracted_text += f"\n--- Página {i + 1} ---\n{page_text.strip()}\n"
        return extracted_text

    @staticmethod
    def call_openai_api(
        num_preguntas,
        num_opciones,
        prompt,
    ):
        openai_api_key = config("OPENROUTER_API_KEY")

        if not openai_api_key:
            raise Exception("API key no configurada")

        client = OpenAI(api_key=openai_api_key, base_url="https://openrouter.ai/api/v1")

        response = client.chat.completions.create(
            model="deepseek/deepseek-chat-v3-0324:free",
            messages=[
                {
                    "role": "system",
                    "content": """Eres un generador de cuestionarios educativos. Genera preguntas tipo test en formato ARRAY JSON con estas reglas:
                        1. Estructura exacta: DEBES devolver un ARRAY de objetos, incluso para una sola pregunta. No añadas ningún texto, explicación ni comentario fuera del ARRAY JSON. Solo devuelve el ARRAY JSON.
                        2. Sigue estrictamente este formato (nombres de claves deben coincidir).
                        [
                            {
                                "text": "Texto de la pregunta",
                                "answers": [
                                    {"text": "Opción 1", "is_correct": true/false},
                                    {"text": "Opción 2", "is_correct": true/false},
                                    ... (según num_opciones)
                                ]
                            },
                            ... (según num_preguntas)
                        ]
                        3. Calidad: 
                            - Preguntas relevantes al texto, cubriendo conceptos clave.
                            - Respuestas incorrectas plausibles y relacionadas.
                        4. Correctas aleatorias: La opción correcta no debe estar siempre en la misma posición.
                        5. Una correcta por pregunta: Solo una respuesta por pregunta con `is_correct: true`.
                        6. El valor de `is_correct` debe ser booleano (`true` o `false`), no string ni número.
                        7. El ARRAY JSON debe ser válido para `json.loads` en Python.

                        Ejemplo:
                        [
                            {
                                "text": "¿Qué es Python?",
                                "answers": [
                                    {"text": "Un lenguaje de programación", "is_correct": true},
                                    {"text": "Una serpiente", "is_correct": false},
                                    {"text": "Un framework web", "is_correct": false}
                                ]
                            },
                            ...
                        ]""",
                },
                {
                    "role": "user",
                    "content": f"""Genera {num_preguntas} preguntas con {num_opciones} opciones cada una, basadas en este texto:
                        ---  
                        {prompt}
                        ---
                        Recuerda: 1 correcta por pregunta, posición aleatoria y ARRAY JSON válido.""",
                },
            ],
            stream=False,
        )

        return response.choices[0].message.content.strip()

    @staticmethod
    def parse_openai_response(response_text):
        if response_text.startswith("```json"):
            response_text = response_text[7:-3].strip()
        elif response_text.startswith("```"):
            response_text = response_text[3:-3].strip()

        try:
            questions_data = json.loads(response_text)
            if not isinstance(questions_data, list):
                raise ValueError("Formato inválido: Se esperaba una lista de preguntas")
            return questions_data
        except json.JSONDecodeError:
            raise ValueError("Error al parsear la respuesta de OpenAI")
