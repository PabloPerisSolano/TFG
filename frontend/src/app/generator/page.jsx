"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import PleaseLogin from "@/components/please-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL, MIN_QUIZ_TIME, MAX_QUIZ_TIME } from "@/config/config";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateQuizPage() {
  const MIN_QUESTIONS_GENERATION = 1;
  const MAX_QUESTIONS_GENERATION = 20;
  const MIN_OPTIONS_GENERATION = 2;
  const MAX_OPTIONS_GENERATION = 4;

  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publicar, setPublicar] = useState(false);
  const [tiempo, setTiempo] = useState(60);
  const [num_preguntas, setNumPreguntas] = useState(1);
  const [num_opciones, setNumOpciones] = useState(2);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isLoggedIn) {
    return <PleaseLogin />;
  }

  const handleCreateQuiz = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const quizData = {
        title,
        description,
        time_limit: tiempo * 60,
        public: publicar,
        prompt,
        num_preguntas,
        num_opciones,
      };

      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(`${API_BASE_URL}quizzes/me/generator/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(quizData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showErrorToast({
          title: "Error de creación",
          description: errorData.error,
        });
        return;
      }

      showSuccessToast({
        title: "Cuestionario creado exitosamente",
        description:
          "El cuestionario se ha guardado correctamente en tus cuestionarios.",
      });

      router.push("/quizzes");
    } catch (err) {
      showServerErrorToast();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Card className="mx-auto max-w-3xl">
        <form onSubmit={handleCreateQuiz}>
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
                    required
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
                    min={MIN_QUESTIONS_GENERATION}
                    max={MAX_QUESTIONS_GENERATION}
                    value={num_preguntas}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setNumPreguntas(
                        value > MAX_QUESTIONS_GENERATION
                          ? MAX_QUESTIONS_GENERATION
                          : value
                      );
                    }}
                  />
                </article>
                <article>
                  <Label className="font-semibold">Nº Opciones</Label>
                  <Input
                    type="number"
                    min={MIN_OPTIONS_GENERATION}
                    max={MAX_OPTIONS_GENERATION}
                    value={num_opciones}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setNumOpciones(
                        value > MAX_OPTIONS_GENERATION
                          ? MAX_OPTIONS_GENERATION
                          : value
                      );
                    }}
                  />
                </article>
              </section>
            </div>
            <section className="flex items-center space-x-14">
              <article>
                <Label className="font-semibold">
                  Límite de Tiempo (minutos)
                </Label>
                <Input
                  type="number"
                  min={MIN_QUIZ_TIME}
                  max={MAX_QUIZ_TIME}
                  value={tiempo}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setTiempo(value > MAX_QUIZ_TIME ? MAX_QUIZ_TIME : value);
                  }}
                />
              </article>
              <article className="flex items-center space-x-2 ">
                <Checkbox
                  checked={publicar}
                  onCheckedChange={(set) => setPublicar(set)}
                />
                <Label className="font-semibold">Publicar</Label>
              </article>
            </section>
            <section>
              <Label className="font-semibold">Texto</Label>
              <Textarea
                placeholder="Escribe el texto del cual se generarán las preguntas..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-28"
                required
              />
            </section>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="animate-spin" />
                  <label>Generando</label>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <FaMagic />
                  <label>Generar Cuestionario</label>
                </div>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
