import { Trash2, Plus, CirclePlus, Save } from "lucide-react";
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
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui";
import { API_ROUTES, ROUTES, MIN_QUIZ_TIME, MAX_QUIZ_TIME } from "@/constants";
import { useAuthFetch } from "@/hooks";

export default function QuizzCreator() {
  const navigate = useNavigate();
  const fetchWithAuth = useAuthFetch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tiempo, setTiempo] = useState(60);
  const [publicar, setPublicar] = useState(false);
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", answers: ["", ""], correctIndex: 0 },
  ]);

  const handleSaveQuiz = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("El título no puede estar vacío.");
      return;
    }

    if (tiempo < MIN_QUIZ_TIME || tiempo > MAX_QUIZ_TIME) {
      toast.error(
        `El tiempo debe ser un número entre ${MIN_QUIZ_TIME} y ${MAX_QUIZ_TIME} minutos.`
      );
      return;
    }

    if (!category) {
      toast.error("Debe seleccionar una categoría.");
      return;
    }

    // Validar que todas las preguntas tengan enunciado
    if (questions.length > 0 && questions.some((q) => !q.question.trim())) {
      toast.error("Todas las preguntas deben tener enunciado.");
      return;
    }

    // Validar que todas las respuestas tengan texto
    if (
      questions.length > 0 &&
      questions.some((q) => q.answers.some((ans) => !ans.trim()))
    ) {
      toast.error("Todas las respuestas deben tener texto.");
      return;
    }

    const quizData = {
      title,
      description,
      time_limit: tiempo * 60,
      public: publicar,
      category,
      questions: questions.map((q) => ({
        text: q.question,
        answers: q.answers.map((ans, index) => ({
          text: ans,
          is_correct: index === q.correctIndex,
        })),
      })),
    };

    const res = await fetchWithAuth(API_ROUTES.USER_QUIZ_LIST_CREATE, {
      method: "POST",
      body: JSON.stringify(quizData),
    });

    if (!res.ok) {
      toast.error("Error de creación");
      return;
    }

    toast.success("Cuestionario creado");
    navigate(ROUTES.MY_QUIZZES);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", answers: ["", ""], correctIndex: 0 },
    ]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const updateQuestion = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const addAnswer = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].answers.push("");
    setQuestions(updatedQuestions);
  };

  const removeAnswer = (qIndex, aIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].answers = updatedQuestions[qIndex].answers.filter(
      (_, i) => i !== aIndex
    );
    setQuestions(updatedQuestions);
  };

  return (
    <form className="mx-auto max-w-3xl" onSubmit={handleSaveQuiz}>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Crear Cuestionario
          </CardTitle>
          <CardDescription>
            Crea un cuestionario con preguntas y respuestas
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

          <section className="space-y-5">
            {questions.map((q, index) => (
              <div key={index} className="space-y-5 p-4 border rounded-md">
                <article>
                  <div className="flex items-center">
                    <Label className="font-semibold">
                      Pregunta {index + 1}
                    </Label>
                    <Button
                      variant="ghost"
                      type="button"
                      size="icon"
                      onClick={() => removeQuestion(index)}
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </Button>
                  </div>
                  <Input
                    value={q.question}
                    onChange={(e) => updateQuestion(index, e.target.value)}
                    placeholder="Escribe tu pregunta..."
                    required
                  />
                </article>
                <article>
                  <Label className="font-semibold">
                    Seleccione la respuesta correcta
                  </Label>
                  <RadioGroup
                    value={q.correctIndex.toString()}
                    onValueChange={(value) => {
                      const updatedQuestions = [...questions];
                      updatedQuestions[index].correctIndex = parseInt(value);
                      setQuestions(updatedQuestions);
                    }}
                  >
                    {q.answers.map((ans, ansIndex) => (
                      <div
                        key={ansIndex}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem value={ansIndex.toString()} />
                        <span>{String.fromCharCode(97 + ansIndex)})</span>
                        <Input
                          value={ans}
                          onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[index].answers[ansIndex] =
                              e.target.value;
                            setQuestions(updatedQuestions);
                          }}
                          placeholder={`Respuesta ${ansIndex + 1}...`}
                          required
                        />
                        <Button
                          variant="ghost"
                          type="button"
                          size="icon"
                          onClick={() => removeAnswer(index, ansIndex)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </RadioGroup>
                </article>

                <Button
                  variant="outline"
                  type="button"
                  onClick={() => addAnswer(index)}
                >
                  <CirclePlus />
                  Añadir Respuesta
                </Button>
              </div>
            ))}
          </section>

          <section className="flex flex-col items-center">
            <Button
              type="button"
              variant="outline"
              className="w-full max-w-lg"
              onClick={addQuestion}
            >
              <Plus />
              Añadir Pregunta
            </Button>
          </section>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">
            <Save /> Guardar Cuestionario
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
