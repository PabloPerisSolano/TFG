"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_BASE_URL } from "@/config/config";
import { Button } from "@/components/ui/button";
import { showServerErrorToast } from "@/utils/toastUtils";
import { useAuth } from "@/context/auth-context";

export default function QuizDetailsPage() {
  const { isLoggedIn, user } = useAuth();
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !quizId) return;

    const fetchQuiz = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const res = await fetch(
          `${API_BASE_URL}users/${user.id}/quizzes/${quizId}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!res.ok) throw new Error("Error al obtener el cuestionario");

        const data = await res.json();
        setQuiz(data);
      } catch (error) {
        showServerErrorToast();
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [user, quizId]);

  if (!isLoggedIn) return <p>Debes iniciar sesión para ver este contenido.</p>;
  if (loading) return <p>Cargando...</p>;
  if (!quiz) return <p>No se encontró el cuestionario.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{quiz.title}</h1>
      <p className="text-gray-600">{quiz.description}</p>

      <Button className="mt-4">Realizar cuestionario</Button>
    </div>
  );
}
