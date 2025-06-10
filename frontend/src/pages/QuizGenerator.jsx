import { Loader2, Sparkles, LetterText, FileText, Trash2 } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BaseQuizCreate, SelectorIdioma } from "@/components";
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
  Separator,
} from "@/components/ui";
import { ROUTES, API_ROUTES, MIN_QUIZ_TIME, MAX_QUIZ_TIME } from "@/constants";
import { useAuthFetch } from "@/hooks";

export default function QuizGenerator() {
  const MIN_QUESTIONS_GENERATION = 1;
  const MAX_QUESTIONS_GENERATION = 20;
  const MIN_OPTIONS_GENERATION = 2;
  const MAX_OPTIONS_GENERATION = 4;
  const MIN_PROMPT_LENGTH = 100;

  const navigate = useNavigate();
  const fetchWithAuth = useAuthFetch();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publicar, setPublicar] = useState(false);
  const [tiempo, setTiempo] = useState(60);
  const [category, setCategory] = useState("");
  const [num_preguntas, setNumPreguntas] = useState(1);
  const [num_opciones, setNumOpciones] = useState(2);
  const [prompt, setPrompt] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [tab, setTab] = useState("pdf");
  const [pageRange, setPageRange] = useState("");
  const [idioma, setIdioma] = useState("Español");
  const fileInputRef = useRef(null);

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

    let isPdf = tab === "pdf";
    let isText = tab === "text";

    if (isText) {
      if (!prompt) {
        toast.error("Por favor, completa el texto del prompt.");
        return;
      }
      if (prompt.length < MIN_PROMPT_LENGTH) {
        toast.error(
          `El texto del prompt debe tener al menos ${MIN_PROMPT_LENGTH} caracteres.`
        );
        return;
      }
    }

    if (isPdf && !pdfFile) {
      toast.error("Debes seleccionar un archivo PDF.");
      return;
    }

    if (isPdf && pdfFile) {
      if (
        pageRange.trim() &&
        !/^(\d+\s*(-\s*\d+)?)(\s*,\s*\d+\s*(-\s*\d+)?)*$/.test(pageRange.trim())
      ) {
        toast.error("Formato de rango de páginas inválido", {
          description:
            "Usa formato como: 1-3, 5, 7-9 o vacío para todas las páginas.",
        });
        return;
      }
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
      body.append("idioma", idioma);
      body.append("pdf", pdfFile);
      if (pageRange.trim()) {
        body.append("page_range", pageRange.trim());
      }
    } else if (isText) {
      body = JSON.stringify({
        title,
        description,
        time_limit: tiempo * 60,
        public: publicar,
        category,
        num_preguntas,
        num_opciones,
        idioma,
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
      setLoading(false);
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
            Genera un cuestionario tipo test mediante inteligencia artificial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <BaseQuizCreate
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

          <Separator className="my-8" />

          <section className="flex flex-col sm:flex-row sm:justify-between gap-5">
            <div className="flex gap-10">
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
            </div>

            <article>
              <Label className="font-semibold">Idioma</Label>
              <SelectorIdioma
                value={idioma}
                onValueChange={(value) => setIdioma(value)}
              />
            </article>
          </section>

          <Tabs
            value={tab}
            onValueChange={(value) => {
              setTab(value);
              if (value === "pdf") {
                setPrompt("");
              } else if (value === "text") {
                setPdfFile(null);
                setPageRange("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }
            }}
          >
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
                <CardContent className="space-y-5">
                  <section>
                    <Label>Selecciona un archivo PDF</Label>
                    <Input
                      type="file"
                      accept=".pdf"
                      ref={fileInputRef}
                      onChange={(e) => setPdfFile(e.target.files[0])}
                    />
                  </section>

                  <section>
                    <Label>Rango de páginas (opcional)</Label>
                    <Input
                      type="text"
                      placeholder="Ej: 1-3, 5, 7-9 (vacío para todas)"
                      value={pageRange}
                      onChange={(e) => setPageRange(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Especifica qué páginas procesar (ej: 1-3, 5, 7-9)
                    </p>
                  </section>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      setPdfFile(null);
                      setPageRange("");
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    <Trash2 /> Quitar archivo
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="text">
              <Card>
                <CardHeader>
                  <CardTitle>Generar a partir de texto plano</CardTitle>
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
                    className="h-48"
                    required
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
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
          {loading && (
            <p className="text-sm text-muted-foreground mt-2">
              Este proceso puede tardar unos minutos dependiendo del tamaño del
              PDF o del texto...
            </p>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}
