import {
  CircleAlert,
  Plus,
  Trash2,
  CirclePlus,
  ClipboardCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { DialogOneInput, DialogConfirm, EditableField } from "@/components";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  RadioGroup,
  RadioGroupItem,
  Switch,
} from "@/components/ui";
import { API_ROUTES, MAX_QUIZ_TIME, MIN_QUIZ_TIME } from "@/config";
import { useAuthFetch } from "@/hooks";

export const CardQuizzDetail = ({ quiz, onQuizUpdate }) => {
  const fetchWithAuth = useAuthFetch();

  const handleUpdateQuiz = async (field, updatedValue) => {
    if (field === "time_limit") {
      if (
        isNaN(updatedValue) ||
        updatedValue < MIN_QUIZ_TIME ||
        updatedValue > MAX_QUIZ_TIME
      ) {
        toast.error("Error al modificar el tiempo", {
          description: `El tiempo debe ser un número entre ${MIN_QUIZ_TIME} y ${MAX_QUIZ_TIME} minutos.`,
        });
        return;
      }

      updatedValue = updatedValue * 60;
    }

    const res = await fetchWithAuth(API_ROUTES.USER_QUIZ_DETAIL(quiz.id), {
      method: "PATCH",
      body: JSON.stringify({ [field]: updatedValue }),
    });

    if (!res.ok) {
      toast.error("Error al modificar el cuestionario", {
        description: "No se ha podido modificar el cuestionario.",
      });
      return;
    }

    const updatedQuiz = await res.json();
    onQuizUpdate(updatedQuiz);

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

    const res = fetchWithAuth(API_ROUTES.USER_QUIZ_QUESTIONS(quiz.id), {
      method: "POST",
      body: JSON.stringify({ text: newQuestionText, answers: [] }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error("Error al añadir la pregunta");
      return;
    }

    onQuizUpdate((prevQuiz) => ({
      ...prevQuiz,
      questions: [...prevQuiz.questions, data],
    }));

    toast.success("Pregunta añadida");
  };

  const handleUpdateQuestion = async (questionId, updatedText) => {
    const res = await fetchWithAuth(
      API_ROUTES.USER_QUIZ_QUESTION_DETAIL(quiz.id, questionId),
      {
        method: "PATCH",
        body: JSON.stringify({ text: updatedText }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error("Error al actualizar la pregunta");
      return;
    }

    onQuizUpdate((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.map((q) =>
        q.id === questionId ? data : q
      ),
    }));

    toast.success("Pregunta actualizada");
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

    onQuizUpdate((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.filter((q) => q.id !== questionId),
    }));

    toast.success("Pregunta eliminada");
  };

  const handleAddAnswer = async (questionId, newAnswerText) => {
    if (!newAnswerText.trim()) {
      toast.error("La respuesta no puede estar vacía.");
      return;
    }

    const res = await fetchWithAuth(
      API_ROUTES.USER_QUIZ_QUESTION_ANSWERS(quiz.id, questionId),
      {
        method: "POST",
        body: JSON.stringify({ text: newAnswerText, is_correct: false }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error("Error al añadir la respuesta");
      return;
    }

    onQuizUpdate((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: [...q.answers, data],
            }
          : q
      ),
    }));

    toast.success("Respuesta añadida");
  };

  const handleUpdateAnswer = async (
    questionId,
    answerId,
    updatedAnswerText,
    isCorrect
  ) => {
    const res = await fetchWithAuth(
      API_ROUTES.USER_QUIZ_QUESTION_ANSWER_DETAIL(
        quiz.id,
        questionId,
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

    const data = await res.json();

    if (!res.ok) {
      toast.error("Error al actualizar la respuesta");
      return;
    }

    onQuizUpdate((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) => (a.id === answerId ? data : a)),
            }
          : q
      ),
    }));

    toast.success("Respuesta actualizada");
  };

  const handleDeleteAnswer = async (questionId, answerId) => {
    const res = await fetchWithAuth(
      API_ROUTES.USER_QUIZ_QUESTION_ANSWER_DETAIL(
        quiz.id,
        questionId,
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

    onQuizUpdate((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.filter((a) => a.id !== answerId),
            }
          : q
      ),
    }));
    toast.success("Respuesta eliminada");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <EditableField
              value={quiz.title}
              onUpdate={(updatedValue) =>
                handleUpdateQuiz("title", updatedValue)
              }
              className="text-3xl font-bold"
            />
          </CardTitle>
          <CardDescription>
            {quiz.description.trim() === "" ? (
              <label>Descripción:</label>
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
          <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
      <div className="mx-auto p-4 max-w-3xl space-y-8">
        <section className="flex justify-between ">
          <article className="space-y-2">
            <EditableField
              value={quiz.title}
              onUpdate={(updatedValue) =>
                handleUpdateQuiz("title", updatedValue)
              }
              className="text-3xl font-bold"
            />
            <div className="flex items-center space-x-2">
              {quiz.description.trim() === "" ? (
                <label>Descripción:</label>
              ) : null}
              <EditableField
                value={quiz.description}
                onUpdate={(updatedValue) =>
                  handleUpdateQuiz("description", updatedValue)
                }
                className="text-lg"
                isTextarea={true}
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="font-semibold">Duración en minutos: </label>
              <EditableField
                value={quiz.time_limit / 60}
                type="number"
                onUpdate={(updatedValue) =>
                  handleUpdateQuiz("time_limit", updatedValue)
                }
              />
            </div>
          </article>
          <article className="flex flex-col items-center space-y-2">
            <Link href={`/quizzes/${quiz.id}/take`}>
              <Button variant="secondary">
                <ClipboardCheck />
                Evaluar
              </Button>
            </Link>
            <div className="flex items-center space-x-2 bg-slate-400 p-2 rounded-2xl">
              <label className="text-sm text-white font-bold">Publicar</label>
              <Switch
                checked={quiz.public}
                onCheckedChange={(checked) =>
                  handleUpdateQuiz("public", checked)
                }
              />
            </div>
          </article>
        </section>
        <section>
          {quiz.questions.length === 0 ? (
            <article className="flex items-center space-x-2">
              <CircleAlert />
              <p>No hay preguntas en este cuestionario.</p>
            </article>
          ) : (
            quiz.questions.map((question, questionIndex) => (
              <Card key={question.id} className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="mr-2">{questionIndex + 1}.</span>
                    <EditableField
                      value={question.text}
                      onUpdate={(updatedText) =>
                        handleUpdateQuestion(question.id, updatedText)
                      }
                      className="text-lg font-semibold"
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <RadioGroup
                      value={
                        question.answers
                          .find((a) => a.is_correct)
                          ?.id.toString() || ""
                      }
                      onValueChange={(selectedAnswerId) => {
                        question.answers.forEach((answer) => {
                          handleUpdateAnswer(
                            question.id,
                            answer.id,
                            answer.text,
                            answer.id === Number(selectedAnswerId)
                          );
                        });
                      }}
                    >
                      {question.answers.map((answer, answerIndex) => (
                        <li
                          key={answer.id}
                          className="flex items-center space-x-2"
                        >
                          <DialogConfirm
                            title="¿Seguro que quieres eliminar esta respuesta?"
                            description="Se eliminará permanentemente la respuesta."
                            onConfirm={() =>
                              handleDeleteAnswer(question.id, answer.id)
                            }
                            triggerButton={
                              <Button variant="ghost" size="icon">
                                <Trash2 className="w-5 h-5 text-red-500" />
                              </Button>
                            }
                          />
                          <RadioGroupItem value={answer.id.toString()} />
                          <span>{String.fromCharCode(97 + answerIndex)})</span>
                          <EditableField
                            value={answer.text}
                            onUpdate={(updatedText) =>
                              handleUpdateAnswer(
                                question.id,
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
                <CardFooter className="justify-between">
                  <DialogOneInput
                    dialogTitle="Nueva Respuesta"
                    inputPlaceholder="Escriba la nueva opción de respuesta..."
                    onSave={(newQuestionText) =>
                      handleAddAnswer(question.id, newQuestionText)
                    }
                  >
                    <Button>
                      <CirclePlus /> Añadir Opción
                    </Button>
                  </DialogOneInput>

                  <DialogConfirm
                    title="¿Seguro que quieres eliminar esta pregunta?"
                    description="Se eliminará permanentemente la pregunta."
                    onConfirm={() => handleDeleteQuestion(question.id)}
                    triggerButton={
                      <Button variant="destructive">
                        <Trash2 /> Eliminar Pregunta
                      </Button>
                    }
                  />
                </CardFooter>
              </Card>
            ))
          )}
        </section>
        <section className="flex justify-center">
          <DialogOneInput
            dialogTitle="Nueva Pregunta"
            inputPlaceholder="Escriba la nueva pregunta..."
            onSave={(newQuestionText) => handleAddQuestion(newQuestionText)}
          >
            <Button className="w-full max-w-xl mb-4" variant="secondary">
              <Plus /> Añadir pregunta
            </Button>
          </DialogOneInput>
        </section>
      </div>
    </>
  );
};
