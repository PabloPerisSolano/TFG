import { Trash2, CirclePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EditableField } from "@/components";
import { DialogConfirm, DialogOneInput } from "@/components/dialogs";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui";
import { API_ROUTES } from "@/constants";
import { useAuthFetch } from "@/hooks";

export const CardQuestionDetail = ({
  quizId,
  question,
  questionNumber,
  onUpdateQuestion,
  onDeleteQuestion,
}) => {
  const fetchWithAuth = useAuthFetch();
  const [answers, setAnswers] = useState(question.answers || []);

  const handleAddAnswer = async (newAnswerText) => {
    if (!newAnswerText.trim()) {
      toast.error("La respuesta no puede estar vacía.");
      return;
    }

    const res = await fetchWithAuth(
      API_ROUTES.USER_QUIZ_QUESTION_ANSWERS(quizId, question.id),
      {
        method: "POST",
        body: JSON.stringify({ text: newAnswerText, is_correct: false }),
      }
    );

    if (!res.ok) {
      toast.error("Error al añadir la respuesta");
      return;
    }

    const data = await res.json();

    setAnswers((prevAnswers) => [...prevAnswers, data]);

    toast.success("Respuesta añadida");
  };

  const handleUpdateAnswer = async (answerId, updatedAnswerText, isCorrect) => {
    if (!updatedAnswerText.trim()) {
      toast.error("La respuesta no puede estar vacía.");
      return;
    }

    const res = await fetchWithAuth(
      API_ROUTES.USER_QUIZ_QUESTION_ANSWER_DETAIL(
        quizId,
        question.id,
        answerId
      ),
      {
        method: "PATCH",
        body: JSON.stringify({
          text: updatedAnswerText,
          is_correct: isCorrect,
        }),
      }
    );

    if (!res.ok) {
      toast.error("Error al actualizar la respuesta");
      return;
    }

    const data = await res.json();

    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.id === answerId
          ? { ...answer, text: data.text, is_correct: data.is_correct }
          : answer
      )
    );

    toast.success("Respuesta actualizada");
  };

  const handleDeleteAnswer = async (answerId) => {
    const res = await fetchWithAuth(
      API_ROUTES.USER_QUIZ_QUESTION_ANSWER_DETAIL(
        quizId,
        question.id,
        answerId
      ),
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      toast.error("Error al eliminar la respuesta");
      return;
    }

    setAnswers((prevAnswers) =>
      prevAnswers.filter((answer) => answer.id !== answerId)
    );

    toast.success("Respuesta eliminada");
  };

  const handleChangeCorrectAnswer = (selectedAnswerId) => {
    const selectedId = Number(selectedAnswerId);
    const prevCorrectAnswer = answers.find((a) => a.is_correct);

    // Solo actúa si cambió la selección
    if (prevCorrectAnswer?.id !== selectedId) {
      // Paso 1: Desmarcar la anterior respuesta correcta (si existía)
      if (prevCorrectAnswer) {
        handleUpdateAnswer(prevCorrectAnswer.id, prevCorrectAnswer.text, false);
      }

      // Paso 2: Marcar la nueva respuesta como correcta
      const newCorrectAnswer = answers.find((a) => a.id === selectedId);
      if (newCorrectAnswer) {
        handleUpdateAnswer(newCorrectAnswer.id, newCorrectAnswer.text, true);
      }
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="text-sm sm:text-lg">
        <CardTitle className="flex items-center">
          <span className="mr-2">{questionNumber}.</span>
          <EditableField
            value={question.text}
            onUpdate={(updatedText) => onUpdateQuestion(updatedText)}
          />
        </CardTitle>
        <CardAction className="flex items-center gap-2">
          <DialogConfirm
            title="¿Seguro que quieres eliminar esta pregunta?"
            description="Se eliminará la pregunta y sus respuestas."
            onConfirm={onDeleteQuestion}
            triggerButton={
              <Button variant="destructive" className="flex items-center">
                <Trash2 />
                <span className="hidden sm:inline">Eliminar Pregunta</span>
              </Button>
            }
          />
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul>
          <RadioGroup
            defaultValue={
              answers.find((a) => a.is_correct)?.id.toString() || ""
            }
            onValueChange={handleChangeCorrectAnswer}
          >
            {answers.map((answer, answerIndex) => (
              <li key={answer.id} className="flex items-center gap-1">
                <DialogConfirm
                  title="¿Seguro que quieres eliminar esta respuesta?"
                  description="Se eliminará permanentemente la respuesta."
                  onConfirm={() => handleDeleteAnswer(answer.id)}
                  triggerButton={
                    <Button variant="ghost" size="icon">
                      <Trash2 className=" text-red-500" />
                    </Button>
                  }
                />
                <RadioGroupItem value={answer.id.toString()} />
                <span className="text-sm sm:text-lg">
                  {String.fromCharCode(97 + answerIndex)})
                </span>
                <EditableField
                  value={answer.text}
                  className="text-sm sm:text-lg"
                  onUpdate={(updatedText) =>
                    handleUpdateAnswer(
                      answer.id,
                      updatedText,
                      answer.is_correct
                    )
                  }
                />
              </li>
            ))}
          </RadioGroup>
        </ul>
      </CardContent>
      <CardFooter>
        <DialogOneInput
          dialogTitle="Nueva Respuesta"
          inputPlaceholder="Escriba la nueva opción de respuesta..."
          onSave={(newAnswerText) => handleAddAnswer(newAnswerText)}
        >
          <Button>
            <CirclePlus /> Añadir Opción
          </Button>
        </DialogOneInput>
      </CardFooter>
    </Card>
  );
};
