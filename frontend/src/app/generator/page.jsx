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
  const { isLoggedIn } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [public, setPublic] = useState(false);
  const [time_limit, setTimeLimit] = useState(3600);
  const [numPreguntas, setNumPreguntas] = useState(1);
  const [numOpciones, setNumOpciones] = useState(2);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateQuiz = async () => {
    setLoading(true);

    try {
      if (!title || !prompt) {
        showErrorToast({
          title: "Campos incompletos",
          description: "Por favor, completa todos los campos.",
        });
        return;
      }

      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(`${API_BASE_URL}quizzes/me/generator/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title,
          description,
          public,
          time_limit,
          prompt,
          numPreguntas,
          numOpciones,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showErrorToast({
          title: "Error de creación",
          description: errorData.message || "Rellena adecuadamente los campos.",
        });
        return;
      }

      setTitle("");
      setDescription("");
      setPublic(false);
      setTimeLimit(3600);
      setNumPreguntas(1);
      setNumOpciones(2);
      setPrompt("");

      showSuccessToast({
        title: "Cuestionario creado exitosamente",
        description:
          "El cuestionario se ha guardado correctamente en tus cuestionarios.",
      });

      setTimeout(() => {
        router.push("/quizzes");
      }, TRANSITION_DURATION);
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
                  min="1"
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
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
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
