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
import { showErrorToast, showServerErrorToast } from "@/utils/toastUtils";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import PleaseLogin from "@/components/please-login";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FaAward, FaUpload } from "react-icons/fa";

export default function TakeQuizPage() {
  const { isLoggedIn } = useAuth();
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const res = await fetch(`${API_BASE_URL}quizzes/${quizId}/`, {
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

  const handleAnswerChange = (questionId, answerId) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answerId,
    }));
  };

  const handleSubmit = () => {
    let newScore = 0;
    quiz.questions.forEach((question) => {
      const correctAnswer = question.answers.find((a) => a.is_correct);
      if (answers[question.id] === correctAnswer?.id.toString()) {
        newScore += 1;
      }
    });
    setScore(newScore);
    console.log("Respuestas enviadas:", answers);
    console.log("Puntuación:", score);
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
      <section className="space-y-2">
        <h1 className="text-3xl font-bold">{quiz.title}</h1>
      </section>

      <section>
        {quiz.questions.map((question, questionIndex) => (
          <Card key={question.id} className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2">{questionIndex + 1}.</span>
                <span className="text-lg font-semibold">{question.text}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                onValueChange={(value) =>
                  handleAnswerChange(question.id, value)
                }
              >
                {question.answers.map((answer, answerIndex) => (
                  <article
                    key={answer.id}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem value={answer.id.toString()} />
                    <span>{String.fromCharCode(97 + answerIndex)})</span>
                    <span>{answer.text}</span>
                  </article>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="flex justify-center">
        <Button onClick={handleSubmit} className="w-full max-w-xl">
          <FaUpload /> Enviar respuestas
        </Button>
      </section>

      {score !== null && (
        <section className="bg-gray-100 p-4 rounded-md ">
          <p className=" text-black text-2xl font-bold flex items-center justify-center">
            <FaAward />
            Tu puntuación: {score} / {quiz.questions.length}
          </p>
        </section>
      )}
    </div>
  );
}
