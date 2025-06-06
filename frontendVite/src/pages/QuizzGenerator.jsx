import { Loader2, Sparkles, LetterText, FileText } from "lucide-react";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
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
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateQuiz = async (e) => {
    e.preventDefault();

    if (!title) {
      toast.error("Por favor, completa el título.");
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

    let isPdf = !!pdfFile;

    if (!isPdf) {
      if (!prompt) {
        toast.error("Por favor, completa el texto del prompt.");
        return;
      }
      if (prompt.length < 20) {
        toast.error("El texto del prompt debe tener al menos 20 caracteres.");
        return;
      }
    }

    if (isPdf && !pdfFile) {
      toast.error("Debes seleccionar un archivo PDF.");
      return;
    }

    let body;

    if (isPdf) {
      body = new FormData();
      body.append("title", title);
      body.append("description", description);
      body.append("time_limit", tiempo * 60);
      body.append("public", publicar);
      body.append("category", category);
      body.append("num_preguntas", num_preguntas);
      body.append("num_opciones", num_opciones);
      body.append("pdf", pdfFile);
    } else {
      body = JSON.stringify({
        title,
        description,
        time_limit: tiempo * 60,
        public: publicar,
        category,
        num_preguntas,
        num_opciones,
        prompt,
      });
    }

    setLoading(true);

    const res = await fetchWithAuth(API_ROUTES.QUIZ_GENERATOR, {
      method: "POST",
      body,
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

          <Tabs defaultValue="pdf">
            <TabsList>
              <TabsTrigger value="pdf">
                <FileText /> PDF
              </TabsTrigger>
              <TabsTrigger value="text">
                <LetterText /> Texto
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pdf">
              <Card>
                <CardHeader>
                  <CardTitle>Generar a partir de PDF</CardTitle>
                  <CardDescription>
                    Genera preguntas a partir del contenido de un archivo PDF.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Label>Selecciona un archivo PDF</Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setPdfFile(e.target.files[0])}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="text">
              <Card>
                <CardHeader>
                  <CardTitle>Generar a partir de texto</CardTitle>
                  <CardDescription>
                    Genera preguntas a partir del texto proporcionado.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Label className="font-semibold">Texto</Label>
                  <Textarea
                    placeholder="Escribe el texto del cual se generarán las preguntas..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="h-28"
                    required
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
