"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/config/config";
import {
  showErrorToast,
  showSuccessToast,
  showServerErrorToast,
} from "@/utils/toastUtils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FaMagic } from "react-icons/fa";

export default function CreateQuizPage() {
  const { isLoggedIn, user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [numPreguntas, setNumPreguntas] = useState(2);
  const [numOpciones, setNumOpciones] = useState(2);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateQuiz = async () => {
    setLoading(true);

    try {
      if (!title || !description || !text) {
        showErrorToast({
          title: "Campos incompletos",
          description: "Por favor, completa todos los campos.",
        });
        return;
      }

      const accessToken = localStorage.getItem("accessToken");

      // Paso 1: Crear el cuestionario
      const quizResponse = await fetch(
        `${API_BASE_URL}users/${user.id}/quizzes/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title,
            description,
            questions: [],
          }),
        }
      );

      if (!quizResponse.ok) {
        const errorData = await quizResponse.json();
        showErrorToast({
          title: "Error de creación",
          description: errorData.message || "Rellena adecuadamente los campos.",
        });
        return;
      }

      const quizData = await quizResponse.json();

      // Paso 2: Generar preguntas
      const questionsResponse = await fetch(
        `${API_BASE_URL}users/${user.id}/quizzes/generator/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ numPreguntas, numOpciones, text }),
        }
      );

      if (!questionsResponse.ok) {
        const errorData = await questionsResponse.json();
        showErrorToast({
          title: "Error al generar preguntas",
          description:
            errorData.message ||
            "Se ha producido un error al generar las preguntas.",
        });

        await fetch(`${API_BASE_URL}users/${user.id}/quizzes/${quizData.id}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return;
      }

      const { questions } = await questionsResponse.json();

      // Paso 3: Agregar las preguntas al cuestionario
      const res3 = await fetch(
        `${API_BASE_URL}users/${user.id}/quizzes/${quizData.id}/questions/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(questions),
        }
      );

      if (!res3.ok) {
        const errorData = await res3.json();
        showErrorToast({
          title: "Error al agregar preguntas",
          description:
            errorData.message ||
            "Se ha producido un error al agregar las preguntas.",
        });

        await fetch(`${API_BASE_URL}users/${user.id}/quizzes/${quizData.id}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return;
      }

      showSuccessToast({
        title: "Cuestionario creado exitosamente",
        description:
          "El cuestionario se ha guardado correctamente en tus cuestionarios.",
      });

      setTitle("");
      setDescription("");
      setText("");
      setNumPreguntas(2);
      setNumOpciones(2);
    } catch (err) {
      showServerErrorToast();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Generar Cuestionario
          </CardTitle>
          <CardDescription>
            Genera un cuestionario mediante inteligencia artificial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex space-x-16">
            <section className="w-1/2 space-y-5">
              <article>
                <Label className="font-semibold">Título</Label>
                <Input
                  placeholder="Escribe el título del cuestionario..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </article>
              <article>
                <Label className="font-semibold">Descripción</Label>
                <Textarea
                  placeholder="Escibe una descripción del cuestionario..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </article>
            </section>
            <section className=" space-y-5">
              <article>
                <Label className="font-semibold">Nº Preguntas</Label>
                <Input
                  type="number"
                  min="2"
                  max="20"
                  value={numPreguntas}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setNumPreguntas(value > 20 ? 20 : value);
                  }}
                />
              </article>
              <article>
                <Label className="font-semibold">Nº Opciones</Label>
                <Input
                  type="number"
                  min="2"
                  max="4"
                  value={numOpciones}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setNumOpciones(value > 4 ? 4 : value);
                  }}
                />
              </article>
            </section>
          </div>
          <section>
            <Label className="font-semibold">Texto</Label>
            <Textarea
              placeholder="Escribe el texto del cual se generarán las preguntas..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="h-28"
            />
          </section>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleCreateQuiz}
            disabled={loading}
            className="w-full"
          >
            <FaMagic />
            {loading ? "Generando..." : "Generar Cuestionario"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
