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
import {
  showServerErrorToast,
  showErrorToast,
  showSuccessToast,
} from "@/utils/toastUtils";
import {
  FaTrashAlt,
  FaEye,
  FaPlusCircle,
  FaSort,
  FaClipboardCheck,
} from "react-icons/fa";
import { Input } from "@/components/ui/input";
import ConfirmDialog from "@/components/confirm-dialog";
import { Switch } from "@/components/ui/switch";

export default function QuizzesPage() {
  const { isLoggedIn } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchQuizzes = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const res = await fetch(`${API_BASE_URL}quizzes/me/`, {
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
  }, []);

  if (!isLoggedIn) {
    return <PleaseLogin />;
  }

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);

    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const handleDelete = async (quizId) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`${API_BASE_URL}quizzes/me/${quizId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        showErrorToast({
          title: "Error al eliminar",
          description: "No se pudo eliminar el cuestionario.",
        });
        return;
      }

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

  const handleTogglePublic = async (quizId, isPublic) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`${API_BASE_URL}quizzes/me/${quizId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ public: isPublic }),
      });

      if (!res.ok) {
        showErrorToast({
          title: "Error al actualizar",
          description: "No se pudo actualizar el estado del cuestionario.",
        });
        return;
      }

      setQuizzes((prevQuizzes) =>
        prevQuizzes.map((quiz) =>
          quiz.id === quizId ? { ...quiz, public: isPublic } : quiz
        )
      );

      showSuccessToast({
        title: "Cuestionario actualizado",
        description: `El cuestionario ahora es ${
          isPublic ? "público" : "privado"
        }.`,
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
              className="bg-white text-gray-800"
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
                  <div className="space-y-2">
                    <section className="flex items-center justify-between">
                      <CardTitle>
                        {index + 1}. {quiz.title}
                      </CardTitle>
                      <article className="flex items-center space-x-2 bg-slate-400 p-2 rounded-2xl">
                        <label className="text-sm text-white font-bold">
                          Publicar
                        </label>
                        <Switch
                          checked={quiz.public}
                          onCheckedChange={(checked) =>
                            handleTogglePublic(quiz.id, checked)
                          }
                        />
                      </article>
                    </section>

                    <CardDescription>{quiz.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="text-sm ">
                  <ul className="list-disc list-inside">
                    <li>
                      <label className="font-semibold">Autor:</label>{" "}
                      {quiz.author}
                    </li>
                    <li>
                      <label className="font-semibold">Tiempo:</label>{" "}
                      {quiz.time_limit / 60} minutos
                    </li>
                    <li>
                      <label className="font-semibold">
                        Número de preguntas:
                      </label>{" "}
                      {quiz.num_questions}
                    </li>
                    <li>
                      <label className="font-semibold">
                        Fecha de creación:
                      </label>{" "}
                      {new Date(quiz.created_at).toLocaleDateString()}
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="justify-end space-x-2">
                  <ConfirmDialog
                    title="¿Seguro que quieres eliminar este cuestionario?"
                    description="Se eliminará permanentemente el cuestionario."
                    onConfirm={() => handleDelete(quiz.id)}
                    triggerButton={
                      <Button
                        variant="destructive"
                        className="flex items-center"
                      >
                        <FaTrashAlt />
                        <span className="hidden sm:inline">Eliminar</span>
                      </Button>
                    }
                  />
                  <Link href={`/quizzes/${quiz.id}`}>
                    <Button>
                      <FaEye /> Ver detalles
                    </Button>
                  </Link>
                  <Link href={`/quizzes/${quiz.id}/take`}>
                    <Button>
                      <FaClipboardCheck /> Evaluar
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </section>
        </div>
      )}
    </div>
  );
}
