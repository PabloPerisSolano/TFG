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
MAX_PROMPT_LENGTH = 2000


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
