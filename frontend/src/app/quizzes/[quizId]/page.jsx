"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_BASE_URL } from "@/config/config";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  showServerErrorToast,
  showErrorToast,
  showSuccessToast,
} from "@/utils/toastUtils";
import { useAuth } from "@/context/auth-context";
import PleaseLogin from "@/components/please-login";
import EditableField from "@/components/editable-field";
import {
  FaExclamationCircle,
  FaPlus,
  FaTrashAlt,
  FaPlusCircle,
  FaExclamationTriangle,
  FaReply,
  FaClipboardCheck,
} from "react-icons/fa";
import ConfirmDialog from "@/components/confirm-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AddItemDialog from "@/components/add-item-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function QuizDetailsPage() {
  const { isLoggedIn } = useAuth();
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const res = await fetch(`${API_BASE_URL}quizzes/me/${quizId}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!res.ok) {
          showErrorToast({
            title: "Error buscando el cuestionario",
            description: "No se ha encontrado el cuestionario.",
          });
          return;
        }

        const data = await res.json();
        setQuiz(data);
      } catch (error) {
        showServerErrorToast();
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleUpdateQuiz = async (field, updatedValue) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`${API_BASE_URL}quizzes/me/${quizId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: updatedValue }),
      });

      if (!res.ok) {
        showErrorToast({
          title: "Error al modificar el cuestionario",
          description: "No se ha podido modificar el cuestionario.",
        });
        return;
      }

      const updatedQuiz = await res.json();
      setQuiz(updatedQuiz);
      showSuccessToast({
        title: "Cuestionario actualizado",
        description: "El cuestionario se ha actualizado correctamente.",
      });
    } catch (error) {
      showServerErrorToast();
    }
  };

  const handleAddQuestion = async (newQuestionText) => {
    if (!newQuestionText.trim()) return;

    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await fetch(
        `${API_BASE_URL}quizzes/me/${quizId}/questions/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: newQuestionText, answers: [] }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        showErrorToast({
          title: "Error al añadir la pregunta",
          description: "No se pudo añadir la pregunta.",
        });
        return;
      }

      const newQuestion = await res.json();
      setQuiz((prevQuiz) => ({
        ...prevQuiz,
        questions: [...prevQuiz.questions, newQuestion],
      }));

      showSuccessToast({
        title: "Pregunta añadida",
        description: "La nueva pregunta se ha añadido correctamente.",
      });
    } catch (error) {
      showServerErrorToast();
    }
  };

  const handleUpdateQuestion = async (questionId, updatedText) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await fetch(
        `${API_BASE_URL}quizzes/me/${quizId}/questions/${questionId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: updatedText }),
        }
      );

      if (!res.ok) {
        showErrorToast({
          title: "Error al actualizar la pregunta",
          description: "No se pudo actualizar la pregunta.",
        });
        return;
      }

      const updatedQuestion = await res.json();
      setQuiz((prevQuiz) => ({
        ...prevQuiz,
        questions: prevQuiz.questions.map((q) =>
          q.id === questionId ? updatedQuestion : q
        ),
      }));
      showSuccessToast({
        title: "Pregunta actualizada",
        description: "La pregunta se ha actualizado correctamente.",
      });
    } catch (error) {
      showServerErrorToast();
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await fetch(
        `${API_BASE_URL}quizzes/me/${quizId}/questions/${questionId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) {
        showErrorToast({
          title: "Error al eliminar la pregunta",
          description: "No se pudo eliminar la pregunta.",
        });
        return;
      }

      setQuiz((prevQuiz) => ({
        ...prevQuiz,
        questions: prevQuiz.questions.filter((q) => q.id !== questionId),
      }));
      showSuccessToast({
        title: "Pregunta eliminada",
        description: "La pregunta se ha eliminado correctamente.",
      });
    } catch (error) {
      showServerErrorToast();
    }
  };

  const handleAddAnswer = async (questionId, newAnswerText) => {
    if (!newAnswerText.trim()) return;

    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await fetch(
        `${API_BASE_URL}quizzes/me/${quizId}/questions/${questionId}/answers/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: newAnswerText, is_correct: false }),
        }
      );

      if (!res.ok) {
        showErrorToast({
          title: "Error al añadir la respuesta",
          description: "No se pudo añadir la respuesta.",
        });
        return;
      }

      const newAnswer = await res.json();
      setQuiz((prevQuiz) => ({
        ...prevQuiz,
        questions: prevQuiz.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                answers: [...q.answers, newAnswer],
              }
            : q
        ),
      }));
      showSuccessToast({
        title: "Respuesta añadida",
        description: "La nueva respuesta se ha añadido correctamente.",
      });
    } catch (error) {
      showServerErrorToast();
    }
  };

  const handleUpdateAnswer = async (
    questionId,
    answerId,
    updatedAnswerText,
    isCorrect
  ) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await fetch(
        `${API_BASE_URL}quizzes/me/${quizId}/questions/${questionId}/answers/${answerId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: updatedAnswerText,
            is_correct: isCorrect,
          }),
        }
      );

      if (!res.ok) {
        showErrorToast({
          title: "Error al actualizar la respuesta",
          description: "No se pudo actualizar la respuesta.",
        });
        return;
      }

      const updatedAnswer = await res.json();
      setQuiz((prevQuiz) => ({
        ...prevQuiz,
        questions: prevQuiz.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                answers: q.answers.map((a) =>
                  a.id === answerId ? updatedAnswer : a
                ),
              }
            : q
        ),
      }));
      showSuccessToast({
        title: "Respuesta actualizada",
        description: "La respuesta se ha actualizado correctamente.",
      });
    } catch (error) {
      showServerErrorToast();
    }
  };

  const handleDeleteAnswer = async (questionId, answerId) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await fetch(
        `${API_BASE_URL}quizzes/me/${quizId}/questions/${questionId}/answers/${answerId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) {
        showErrorToast({
          title: "Error al eliminar la respuesta",
          description: "No se pudo eliminar la respuesta.",
        });
        return;
      }

      setQuiz((prevQuiz) => ({
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
      showSuccessToast({
        title: "Respuesta eliminada",
        description: "La respuesta se ha eliminado correctamente.",
      });
    } catch (error) {
      showServerErrorToast();
    }
  };

  if (!isLoggedIn) return <PleaseLogin />;
  if (loading)
    return (
      <div className="mx-auto space-y-4 max-w-3xl mt-10">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  if (!quiz)
    return (
      <div className="mx-auto flex flex-col items-center space-y-4 mt-4">
        <section className="items-center flex space-x-2">
          <FaExclamationTriangle />
          <p className="font-bold">No se ha encontrado el cuestionario.</p>
        </section>
        <Link href="/quizzes">
          <Button>
            <FaReply />
            Volver a mis cuestionarios
          </Button>
        </Link>
      </div>
    );

  return (
    <div className="mx-auto p-4 max-w-3xl space-y-8">
      <section className="flex justify-between ">
        <article className="space-y-2">
          <EditableField
            value={quiz.title}
            field="title"
            onUpdate={(updatedValue) => handleUpdateQuiz("title", updatedValue)}
            className="text-3xl font-bold"
          />

          <EditableField
            value={quiz.description}
            field="description"
            onUpdate={(updatedValue) =>
              handleUpdateQuiz("description", updatedValue)
            }
            className="text-lg"
            isTextarea={true}
          />
        </article>
        <article>
          <Link href={`/quizzes/${quiz.id}/take`}>
            <Button variant="secondary">
              <FaClipboardCheck />
              Evaluar
            </Button>
          </Link>
        </article>
      </section>
      <section>
        {quiz.questions.length === 0 ? (
          <article className="flex items-center space-x-2">
            <FaExclamationCircle />
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
                        <ConfirmDialog
                          title="¿Seguro que quieres eliminar esta respuesta?"
                          description="Se eliminará permanentemente la respuesta."
                          onConfirm={() =>
                            handleDeleteAnswer(question.id, answer.id)
                          }
                          triggerButton={
                            <Button variant="ghost" size="icon">
                              <FaTrashAlt className="w-5 h-5 text-red-500" />
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
                <AddItemDialog
                  dialogTitle="Nueva Respuesta"
                  inputPlaceholder="Escriba la nueva opción de respuesta..."
                  onSave={(newQuestionText) =>
                    handleAddAnswer(question.id, newQuestionText)
                  }
                >
                  <Button>
                    <FaPlusCircle /> Añadir Opción
                  </Button>
                </AddItemDialog>

                <ConfirmDialog
                  title="¿Seguro que quieres eliminar esta pregunta?"
                  description="Se eliminará permanentemente la pregunta."
                  onConfirm={() => handleDeleteQuestion(question.id)}
                  triggerButton={
                    <Button variant="destructive">
                      <FaTrashAlt /> Eliminar Pregunta
                    </Button>
                  }
                />
              </CardFooter>
            </Card>
          ))
        )}
      </section>
      <section className="flex justify-center">
        <AddItemDialog
          dialogTitle="Nueva Pregunta"
          inputPlaceholder="Escriba la nueva pregunta..."
          onSave={(newQuestionText) => handleAddQuestion(newQuestionText)}
        >
          <Button className="w-full max-w-xl mb-4" variant="secondary">
            <FaPlus /> Añadir pregunta
          </Button>
        </AddItemDialog>
      </section>
    </div>
  );
}
