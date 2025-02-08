"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/config/config";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export default function UserQuizzes() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}quizzes/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setQuizzes(data);
        } else {
          console.error("Failed to fetch quizzes");
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [user]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h2>Tus Cuestionarios</h2>
      {quizzes.length > 0 ? (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz.id}>{quiz.title}</li>
          ))}
        </ul>
      ) : (
        <div>
          <p>No tienes ningún cuestionario todavía.</p>
          <Link href="/creator">
            <div className="btn btn-primary inline-flex items-center">
              <FaPlus className="mr-2" /> {/* Icono de plus */}
              <span>Crear un nuevo cuestionario</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
