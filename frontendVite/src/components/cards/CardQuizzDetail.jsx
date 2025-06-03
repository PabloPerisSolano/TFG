import {
  CircleAlert,
  Plus,
  ClipboardCheck,
  BadgeCheck,
  BadgeMinus,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { DialogOneInput, EditableField } from "@/components";
import { CardQuestionDetail } from "@/components/cards/CardQuestionDetail";
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  Switch,
} from "@/components/ui";
import { API_ROUTES, MAX_QUIZ_TIME, MIN_QUIZ_TIME } from "@/config";
import { useAuthFetch } from "@/hooks";

export const CardQuizzDetail = ({ quiz, onQuizUpdate }) => {
  const fetchWithAuth = useAuthFetch();
  const [questions, setQuestions] = useState(quiz.questions || []);

  const handleUpdateQuiz = async (field, updatedValue) => {
    if (field === "time_limit") {
      if (
        isNaN(updatedValue) ||
        updatedValue < MIN_QUIZ_TIME ||
        updatedValue > MAX_QUIZ_TIME
      ) {
        toast.error(
          `El tiempo debe ser un número entre ${MIN_QUIZ_TIME} y ${MAX_QUIZ_TIME} minutos.`
        );
        return;
      }

      updatedValue = updatedValue * 60;
    } else if (field === "title" && !updatedValue.trim()) {
      toast.error("El título no puede estar vacío.");
      return;
    }

    const res = await fetchWithAuth(API_ROUTES.USER_QUIZ_DETAIL(quiz.id), {
      method: "PATCH",
      body: JSON.stringify({ [field]: updatedValue }),
    });

    if (!res.ok) {
      toast.error("Error al modificar el cuestionario");
      return;
    }

    const data = await res.json();

    onQuizUpdate(data);

    if (field === "public") {
      toast.success("Cuestionario actualizado", {
        description: `El cuestionario ahora es ${
          updatedValue ? "público" : "privado"
        }.`,
      });
    } else {
      toast.success("Cuestionario actualizado");
    }
  };

  const handleAddQuestion = async (newQuestionText) => {
    if (!newQuestionText.trim()) {
      toast.error("La pregunta no puede estar vacía.");
      return;
    }

    const res = await fetchWithAuth(API_ROUTES.USER_QUIZ_QUESTIONS(quiz.id), {
      method: "POST",
      body: JSON.stringify({ text: newQuestionText, answers: [] }),
    });

    if (!res.ok) {
      toast.error("Error al añadir la pregunta");
      return;
    }

    const data = await res.json();

    setQuestions((prevQuestions) => [...prevQuestions, data]);

    toast.success("Pregunta añadida");
  };

  const handleDeleteQuestion = async (questionId) => {
    const res = await fetchWithAuth(
      API_ROUTES.USER_QUIZ_QUESTION_DETAIL(quiz.id, questionId),
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      toast.error("Error al eliminar la pregunta");
      return;
    }

    setQuestions((prevQuestions) =>
      prevQuestions.filter((q) => q.id !== questionId)
    );

    toast.success("Pregunta eliminada");
  };

  const handleUpdateQuestion = async (questionId, updatedText) => {
    if (!updatedText.trim()) {
      toast.error("La pregunta no puede estar vacía.");
      return;
    }

    const res = await fetchWithAuth(
      API_ROUTES.USER_QUIZ_QUESTION_DETAIL(quiz.id, questionId),
      {
        method: "PATCH",
        body: JSON.stringify({ text: updatedText }),
      }
    );

    if (!res.ok) {
      toast.error("Error al actualizar la pregunta");
      return;
    }

    const data = await res.json();

    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId ? { ...q, text: data.text } : q
      )
    );

    toast.success("Pregunta actualizada");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <EditableField
            value={quiz.title}
            onUpdate={(updatedValue) => handleUpdateQuiz("title", updatedValue)}
            className="text-3xl font-bold"
          />
        </CardTitle>
        <CardDescription className="flex">
          {quiz.description.trim() === "" ? (
            <label className="text-lg">No hay descripción</label>
          ) : null}
          <EditableField
            value={quiz.description}
            onUpdate={(updatedValue) =>
              handleUpdateQuiz("description", updatedValue)
            }
            className="text-lg"
            isTextarea={true}
          />
        </CardDescription>
        <CardAction>
          <Link to={`/quizzes/${quiz.id}/take`}>
            <Button variant="outline">
              <ClipboardCheck />
              <span className="hidden sm:inline">Evaluar</span>
            </Button>
          </Link>
        </CardAction>
        <div className="flex flex-col gap-2">
          <section className="flex items-center gap-2">
            <label className="font-semibold">Duración en minutos: </label>
            <EditableField
              value={quiz.time_limit / 60}
              type="number"
              onUpdate={(updatedValue) =>
                handleUpdateQuiz("time_limit", updatedValue)
              }
            />
          </section>
          <section className="flex items-center gap-2">
            {quiz.public ? (
              <Badge className="bg-green-700 font-bold">
                <BadgeCheck />
                Público
              </Badge>
            ) : (
              <Badge variant="destructive">
                <BadgeMinus />
                Privado
              </Badge>
            )}
            <Switch
              checked={quiz.public}
              onCheckedChange={(checked) => handleUpdateQuiz("public", checked)}
            />
          </section>
        </div>
      </CardHeader>
      <CardContent>
        {questions.length === 0 ? (
          <article className="flex items-center gap-2 justify-center">
            <CircleAlert />
            <p>No hay preguntas en este cuestionario.</p>
          </article>
        ) : (
          questions.map((question, index) => (
            <CardQuestionDetail
              key={question.id}
              quizId={quiz.id}
              question={question}
              questionNumber={index + 1}
              onUpdateQuestion={(updatedText) =>
                handleUpdateQuestion(question.id, updatedText)
              }
              onDeleteQuestion={() => handleDeleteQuestion(question.id)}
            />
          ))
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <DialogOneInput
          dialogTitle="Nueva Pregunta"
          inputPlaceholder="Escriba la nueva pregunta..."
          onSave={(newQuestionText) => handleAddQuestion(newQuestionText)}
        >
          <Button className="max-w-lg w-full">
            <Plus /> Añadir pregunta
          </Button>
        </DialogOneInput>
      </CardFooter>
    </Card>
  );
};
