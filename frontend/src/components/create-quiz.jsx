"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config/config";
import { useAuth } from "@/context/AuthContext";

export default function CreateQuiz() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([{ question: "", answer: "" }]);
  const [error, setError] = useState("");

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", answer: "" }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}quizzes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ title, description, questions }),
      });

      if (!response.ok) {
        setError("Error al crear el cuestionario.");
        return;
      }

      router.push("/quizzes");
    } catch (error) {
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div>
      <h2>Crear un nuevo cuestionario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Título</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <h3>Preguntas</h3>
          {questions.map((q, index) => (
            <div key={index}>
              <label htmlFor={`question-${index}`}>Pregunta</label>
              <input
                id={`question-${index}`}
                type="text"
                value={q.question}
                onChange={(e) =>
                  handleQuestionChange(index, "question", e.target.value)
                }
                required
              />
              <label htmlFor={`answer-${index}`}>Respuesta</label>
              <input
                id={`answer-${index}`}
                type="text"
                value={q.answer}
                onChange={(e) =>
                  handleQuestionChange(index, "answer", e.target.value)
                }
                required
              />
            </div>
          ))}
          <button type="button" onClick={handleAddQuestion}>
            Añadir pregunta
          </button>
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Crear cuestionario</button>
      </form>
    </div>
  );
}
