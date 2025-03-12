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
import { FaAward, FaUpload, FaCheck, FaTimes } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TakeQuizPage() {
  const { isLoggedIn } = useAuth();
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [results, setResults] = useState([]);

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
    const newResults = quiz.questions.map((question) => {
      const correctAnswer = question.answers.find((a) => a.is_correct);
      const selectedAnswer = question.answers.find(
        (a) => a.id.toString() === answers[question.id]
      );
      const isCorrect = answers[question.id] === correctAnswer?.id.toString();
      if (isCorrect) {
        newScore += 1;
      }
      return {
        ...question,
        isCorrect,
        correctAnswer: correctAnswer?.text,
        selectedAnswer: selectedAnswer?.text,
      };
    });
    setScore(newScore);
    setResults(newResults);
    setShowResultDialog(true);
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

      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="sm:max-w-[700px] text-black">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center">
              <FaAward className="mr-2" />
              Tu puntuación: {score} / {quiz.questions.length}
            </DialogTitle>
            <DialogDescription className="text-center">
              Corrección de las respuestas:
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[450px]">
            <div className="space-y-4">
              {results.map((result, index) => (
                <Card key={result.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="mr-2">{index + 1}.</span>
                      <span className="text-lg font-semibold">
                        {result.text}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.isCorrect ? (
                      <article className="flex items-center space-x-2">
                        <FaCheck className="text-green-500" />
                        <span>{result.correctAnswer}</span>
                      </article>
                    ) : (
                      <article>
                        <div className="flex items-center space-x-2">
                          <FaTimes className="text-red-500" />
                          <span>{result.selectedAnswer}</span>
                        </div>
                        Respuesta correcta: {result.correctAnswer}
                      </article>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
