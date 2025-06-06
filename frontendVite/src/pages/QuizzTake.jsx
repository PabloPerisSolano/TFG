import {
  Timer,
  MonitorUp,
  Check,
  X,
  CircleAlert,
  LoaderCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { DialogScore } from "@/components/dialogs";
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui";
import { API_ROUTES } from "@/constants";
import { useAuthFetch } from "@/hooks";

export default function TakeQuizPage() {
  const fetchWithAuth = useAuthFetch();
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [myAnswers, setMyAnswers] = useState({});
  const [results, setResults] = useState({});
  const [isDialogScoreOpen, setIsDialogScoreOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [displayTime, setDisplayTime] = useState("0:00");
  const timerRef = useRef({ id: null, remaining: 0 });
  const myAnswersRef = useRef({});

  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      const res = await fetchWithAuth(API_ROUTES.QUIZZ_TAKE(quizId));

      if (!res.ok) {
        setLoading(false);
        clearTimeout(timerRef.current.id);

        if (res.status === 404) {
          toast.error("Cuestionario no encontrado");
          return;
        }

        if (res.status === 403) {
          toast.error("No tienes permiso para acceder a este cuestionario");
          return;
        }

        toast.error("Error al cargar el cuestionario");
        return;
      }

      const data = await res.json();
      setQuiz(data);

      setLoading(false);
    };

    fetchQuiz();

    const timerId = timerRef.current.id;

    return () => {
      clearTimeout(timerId);
    };
  }, [quizId]);

  useEffect(() => {
    if (quiz && quiz.time_limit) {
      startTimer(quiz.time_limit);
    }
  }, [quiz]);

  const startTimer = (time) => {
    clearTimeout(timerRef.current.id);

    timerRef.current.remaining = time;
    updateDisplayTime(time);

    if (time <= 0) {
      handleSubmit();
      return;
    }

    timerRef.current.id = setTimeout(() => {
      startTimer(time - 1);
    }, 1000);
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const updateDisplayTime = (seconds) => {
    setDisplayTime(formatTime(seconds));
  };

  const handleAnswerChange = (questionId, answerId) => {
    const updatedAnswers = { ...myAnswersRef.current, [questionId]: answerId };
    myAnswersRef.current = updatedAnswers;
    setMyAnswers(updatedAnswers);

    // Verificar respuesta inmediatamente
    const question = quiz.questions.find((q) => q.id === questionId);
    const correctAnswer = question.answers.find((a) => a.is_correct);
    const isCorrect = answerId === correctAnswer?.id.toString();

    setResults((prev) => ({
      ...prev,
      [questionId]: {
        isCorrect,
        selectedAnswer: answerId,
        correctAnswer: correctAnswer?.id.toString(),
      },
    }));
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    clearTimeout(timerRef.current.id);

    const answers = myAnswersRef.current;
    let score = 0;

    quiz.questions.forEach((question) => {
      const questionId = question.id;
      const userAnswer = answers[questionId];

      if (userAnswer) {
        const correctAnswer = question.answers
          .find((a) => a.is_correct)
          ?.id.toString();
        if (userAnswer === correctAnswer) {
          score++;
        }
      }
    });

    setScore(score);
    setIsDialogScoreOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <section className="flex items-center gap-2 justify-center">
        <CircleAlert />
        <p className="font-bold">Error al cargar el cuestionario.</p>
      </section>
    );
  }

  if (quiz.num_questions === 0) {
    return (
      <section className="flex items-center gap-2 justify-center">
        <CircleAlert />
        <p className="font-bold">Este cuestionario no tiene preguntas.</p>
      </section>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const questionResult = results[currentQuestion.id];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{quiz.title}</CardTitle>
          <CardDescription>
            Autor: {quiz.author}
            {". "}
            {quiz.description}
          </CardDescription>
          <CardAction
            className={`flex font-bold ${
              isDialogScoreOpen
                ? "animate-none"
                : timerRef.current.remaining > 60
                ? "animate-pulse"
                : timerRef.current.remaining <= 60 &&
                  timerRef.current.remaining > 0
                ? "animate-bounce text-red-600"
                : "animate-none"
            }`}
          >
            <Timer className="-mt-0.5" />
            {displayTime}
          </CardAction>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="text-sm sm:text-lg font-bold">
                  <CardTitle>
                    {currentQuestionIndex + 1}. {currentQuestion.text}
                  </CardTitle>
                  <CardAction className="border p-1 rounded-lg">
                    {currentQuestionIndex + 1}/{quiz.questions.length}
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={myAnswers[currentQuestion.id] || ""}
                    onValueChange={(value) =>
                      handleAnswerChange(currentQuestion.id, value)
                    }
                  >
                    {currentQuestion.answers.map((answer, answerIndex) => {
                      const isSelected =
                        myAnswers[currentQuestion.id] === answer.id.toString();
                      const isCorrect = answer.is_correct;
                      const showFeedback =
                        questionResult && (isSelected || isCorrect);

                      return (
                        <article
                          key={answer.id}
                          className={`flex items-center gap-1 p-2 rounded ${
                            showFeedback
                              ? isCorrect
                                ? "bg-green-100"
                                : isSelected
                                ? "bg-red-100"
                                : ""
                              : ""
                          }`}
                        >
                          <RadioGroupItem
                            value={answer.id.toString()}
                            disabled={questionResult}
                          />
                          <span>{String.fromCharCode(97 + answerIndex)})</span>
                          <span>{answer.text}</span>
                          {showFeedback && (
                            <span className="ml-auto">
                              {isCorrect ? (
                                <Check className="text-green-500" />
                              ) : isSelected ? (
                                <X className="text-red-500" />
                              ) : null}
                            </span>
                          )}
                        </article>
                      );
                    })}
                  </RadioGroup>
                </CardContent>
                {questionResult && (
                  <CardFooter className="flex justify-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex justify-center p-3 rounded-md w-full sm:w-sm ${
                        questionResult.isCorrect
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {questionResult.isCorrect ? (
                        <div className="flex gap-2">
                          <Check />
                          <span>¡Respuesta correcta!</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 items-center">
                          <div className="flex gap-2">
                            <X />
                            <span>Respuesta incorrecta</span>
                          </div>

                          <p>
                            La opción correcta es{" "}
                            <strong>
                              {(() => {
                                const correctIndex =
                                  currentQuestion.answers.findIndex(
                                    (a) => a.is_correct
                                  );
                                return correctIndex !== -1
                                  ? String.fromCharCode(97 + correctIndex) + ")"
                                  : "";
                              })()}
                            </strong>
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft /> Anterior
          </Button>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <Button onClick={handleSubmit}>
              <MonitorUp /> Enviar respuestas
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              Siguiente <ChevronRight />
            </Button>
          )}
        </CardFooter>
      </Card>

      <DialogScore
        score={score}
        maxScore={quiz.num_questions}
        open={isDialogScoreOpen}
        onOpenChange={setIsDialogScoreOpen}
      />
    </>
  );
}
