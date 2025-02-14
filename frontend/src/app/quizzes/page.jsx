"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import PleaseLogin from "@/components/please-login";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/config/config";
import { showServerErrorToast, showErrorToast } from "@/utils/toastUtils";
import { FaTrashAlt, FaEye, FaPlusCircle, FaSort } from "react-icons/fa";
import { Input } from "@/components/ui/input";

export default function QuizzesPage() {
  const { isLoggedIn, user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    if (!user) {
      setQuizzes([]);
      return;
    }

    const fetchQuizzes = async () => {
      // Obtener el token de acceso
      const accessToken = localStorage.getItem("accessToken");

      try {
        const res = await fetch(`${API_BASE_URL}users/${user.id}/quizzes/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          showErrorToast({
            title: "Error al obtener cuestionarios",
            description: "No se pudieron obtener los cuestionarios.",
          });
          return;
        }

        const data = await res.json();
        setQuizzes(data);
      } catch (error) {
        showServerErrorToast();
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [user]);

  if (!isLoggedIn) {
    return <PleaseLogin />;
  }

  // Filtrar por título
  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenar por fecha de creación o por ID
  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
  });

  // Función para eliminar un cuestionario
  const handleDelete = async (quizId) => {
    const accessToken = localStorage.getItem("accessToken");

    // Confirmar la eliminación
    const confirmDelete = window.confirm(
      "¿Seguro que quieres eliminar este cuestionario?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}users/${user.id}/quizzes/${quizId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) {
        showErrorToast({
          title: "Error al eliminar",
          description: "No se pudo eliminar el cuestionario.",
        });
        return;
      }

      // Actualizar el estado quitando el cuestionario eliminado
      setQuizzes((prevQuizzes) =>
        prevQuizzes.filter((quiz) => quiz.id !== quizId)
      );

      showSuccessToast({
        title: "Eliminado",
        description: "El cuestionario se eliminó correctamente.",
      });
    } catch (error) {
      showServerErrorToast();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mis Cuestionarios</h1>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center bg-white rounded-3xl p-3">
          <p className="mb-4 font-bold text-gray-800">
            Todavía no tienes ningún cuestionario creado.
          </p>
          <Link href="/creator">
            <Button>
              <FaPlusCircle />
              Crear cuestionario
            </Button>
          </Link>
        </div>
      ) : (
        <div>
          <section className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              <FaSort />
              Ordenar {sortOrder === "asc" ? "↓" : "↑"}
            </Button>
          </section>

          <section className="space-y-4">
            {sortedQuizzes.map((quiz, index) => (
              <Card key={quiz.id}>
                <CardHeader>
                  <CardTitle>
                    {index + 1}. {quiz.title}
                  </CardTitle>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardFooter className="justify-end space-x-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(quiz.id)}
                  >
                    <FaTrashAlt /> Eliminar
                  </Button>
                  <Button>
                    <FaEye /> Ver detalles
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </section>
        </div>
      )}
    </div>
  );
}
