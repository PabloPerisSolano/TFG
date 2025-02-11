"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/config/config";
import Link from "next/link";
import { FaPlusCircle, FaExclamationTriangle } from "react-icons/fa";
import { Button } from "@/components/ui/button";

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
      {quizzes.length > 0 ? (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz.id}>{quiz.title}</li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <FaExclamationTriangle className="text-6xl mb-4" />
          <p className="text-xl font-semibold mb-4">
            No tienes ningún cuestionario todavía.
          </p>
          <Link href="/creator">
            <Button variant="secondary" className="w-full">
              <FaPlusCircle />
              <span>Crear un nuevo cuestionario</span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
