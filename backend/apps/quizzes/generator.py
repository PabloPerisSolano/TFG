# generator.py
import json
import textwrap

import fitz
from decouple import config
from openai import OpenAI

MIN_QUESTIONS = 1
MAX_QUESTIONS = 20
MIN_OPTIONS = 2
MAX_OPTIONS = 4
MIN_PROMPT_LENGTH = 100
MAX_PROMPT_LENGTH = 50000000


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
    def parse_page_range(page_range_str):
        """
        Convierte un string como "1-3,5,7-9" en una lista de números de página [1,2,3,5,7,8,9]
        Args:
            page_range_str: String con el rango de páginas (ej: "1-3,5,7-9")
        Returns:
            Lista de números de página ordenados y sin duplicados, o None si el string está vacío
        """

        if not page_range_str or not page_range_str.strip():
            return None

        pages = []
        for part in page_range_str.split(","):
            part = part.strip()
            if "-" in part:
                start_end = part.split("-")
                if len(start_end) != 2:
                    continue
                try:
                    start, end = map(int, start_end)
                    pages.extend(range(start, end + 1))
                except ValueError:
                    continue
            else:
                try:
                    pages.append(int(part))
                except ValueError:
                    continue

        return sorted(set(pages)) if pages else None

    @staticmethod
    def extract_text_from_pdf(pdf_file, selected_pages=None):
        if hasattr(pdf_file, "read"):
            doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
        else:
            doc = fitz.open(pdf_file)

        extracted_text = ""

        if selected_pages is None:
            selected_pages = range(1, len(doc) + 1)

        for page_num in selected_pages:
            page_index = page_num - 1
            if 0 <= page_index < len(doc):
                page = doc[page_index]
                page_text = page.get_text()
                extracted_text += f"\n--- Página {page_num} ---\n{page_text.strip()}\n"

        return extracted_text

    @staticmethod
    def call_openai_api(
        num_preguntas,
        num_opciones,
        idioma,
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
                    "content": textwrap.dedent(
                        """\
                        Genera tests educativos como ARRAY JSON. Reglas:
                        1. Estructura EXACTA:
                        [
                            {
                                "text": "Pregunta",
                                "answers": [
                                    {"text": "Opción", "is_correct": boolean},
                                    ... (según num_opciones)
                                ]
                            },
                            ... (según num_preguntas)
                        ]
                        - Prohibido usar objetos contenedores. El JSON debe ser solo un array.
                        - Una opción correcta por pregunta, en posición aleatoria.
                        - Opciones incorrectas deben ser plausibles y relacionadas.
                        - Si el texto carece de sentido o no permite generar preguntas relevantes, devuelve [].

                        2. Las preguntas deben ser relevantes al texto, cubriendo conceptos clave.

                        Ejemplo:
                        [
                            {
                                "text": "¿Qué es Python?",
                                "answers": [
                                    {"text": "Lenguaje de programación", "is_correct": true},
                                    {"text": "Serpiente", "is_correct": false}
                                ]
                            }
                        ]
                        """
                    ),
                },
                {
                    "role": "user",
                    "content": textwrap.dedent(
                        f"""\
                        Genera {num_preguntas} preguntas con {num_opciones} opciones cada una, escritas en idioma {idioma} y basadas en este texto:
                        ---  
                        {prompt}
                        ---
                        Recuerda:
                        - Devuelve solo un ARRAY JSON válido (sin objetos contenedores).
                        - Una opción correcta por pregunta (la opción correcta no debe ser siempre la misma).
                        """
                    ),
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
