import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BaseQuizzCreate } from "@/components";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Label,
  Textarea,
} from "@/components/ui";
import { ROUTES, API_ROUTES, MIN_QUIZ_TIME, MAX_QUIZ_TIME } from "@/constants";
import { useAuthFetch } from "@/hooks";

export default function QuizzGenerator() {
  const MIN_QUESTIONS_GENERATION = 1;
  const MAX_QUESTIONS_GENERATION = 20;
  const MIN_OPTIONS_GENERATION = 2;
  const MAX_OPTIONS_GENERATION = 4;

  const navigate = useNavigate();
  const fetchWithAuth = useAuthFetch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publicar, setPublicar] = useState(false);
  const [tiempo, setTiempo] = useState(60);
  const [category, setCategory] = useState("");
  const [num_preguntas, setNumPreguntas] = useState(1);
  const [num_opciones, setNumOpciones] = useState(2);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateQuiz = async (e) => {
    e.preventDefault();

    if (!title || !prompt) {
      toast.error("Por favor, completa todos los campos obligatorios.");
      return;
    }

    if (!category) {
      toast.error("Debe seleccionar una categoría.");
      return;
    }

    if (isNaN(num_preguntas) || isNaN(num_opciones) || isNaN(tiempo)) {
      toast.error("Todos los campos numéricos deben tener un valor válido.");
      return;
    }

    if (
      num_preguntas < MIN_QUESTIONS_GENERATION ||
      num_preguntas > MAX_QUESTIONS_GENERATION
    ) {
      toast.error(
        `El número de preguntas debe estar entre ${MIN_QUESTIONS_GENERATION} y ${MAX_QUESTIONS_GENERATION}.`
      );
      return;
    }

    if (
      num_opciones < MIN_OPTIONS_GENERATION ||
      num_opciones > MAX_OPTIONS_GENERATION
    ) {
      toast.error(
        `El número de opciones debe estar entre ${MIN_OPTIONS_GENERATION} y ${MAX_OPTIONS_GENERATION}.`
      );
      return;
    }

    if (tiempo < MIN_QUIZ_TIME || tiempo > MAX_QUIZ_TIME) {
      toast.error(
        `El tiempo debe estar entre ${MIN_QUIZ_TIME} y ${MAX_QUIZ_TIME} minutos.`
      );
      return;
    }

    if (prompt.length < 20) {
      toast.error("El texto debe tener al menos 20 caracteres.");
      return;
    }

    setLoading(true);

    const quizData = {
      title,
      description,
      time_limit: tiempo * 60,
      public: publicar,
      category,
      prompt,
      num_preguntas,
      num_opciones,
    };

    const res = await fetchWithAuth(API_ROUTES.QUIZ_GENERATOR, {
      method: "POST",
      body: JSON.stringify(quizData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      toast.error("Error de creación", {
        description: errorData.error,
      });
      return;
    }

    toast.success("Cuestionario creado exitosamente");

    navigate(ROUTES.MY_QUIZZES);

    setLoading(false);
  };

  return (
    <form className="mx-auto max-w-2xl" onSubmit={handleCreateQuiz}>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Generar Cuestionario
          </CardTitle>
          <CardDescription>
            Genera un cuestionario mediante inteligencia artificial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <BaseQuizzCreate
            title={title}
            onTitleChange={(e) => setTitle(e.target.value)}
            description={description}
            onDescriptionChange={(e) => setDescription(e.target.value)}
            tiempo={tiempo}
            onTiempoChange={(e) => setTiempo(Number(e.target.value))}
            publicar={publicar}
            onPublicarChange={(checked) => setPublicar(checked)}
            onCategoryChange={(value) => setCategory(value)}
          />

          <section className="flex flex-row gap-5">
            <article>
              <Label className="font-semibold">Nº Preguntas</Label>
              <Input
                type="number"
                min={MIN_QUESTIONS_GENERATION}
                max={MAX_QUESTIONS_GENERATION}
                value={num_preguntas}
                onChange={(e) => {
                  setNumPreguntas(Number(e.target.value));
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
                  setNumOpciones(Number(e.target.value));
                }}
              />
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
              <>
                <Loader2 className="animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles />
                Generar Cuestionario
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
