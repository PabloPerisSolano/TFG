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
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
} from "@/components/ui";
import { API_ROUTES } from "@/constants";
import { useAuthFetch } from "@/hooks";

export default function TakeQuizPage() {
  const { quizId } = useParams();
  const fetchWithAuth = useAuthFetch();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [displayTime, setDisplayTime] = useState("0:00");
  const timerRef = useRef({ id: null, remaining: 0 });
  const quizRef = useRef();

  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      const res = await fetchWithAuth(API_ROUTES.QUIZZ_TAKE(quizId));

      if (!res.ok) {
        setLoading(false);

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

      quizRef.current = data;
      startTimer(data.time_limit);

      setLoading(false);
    };

    fetchQuiz();

    return () => {
      if (timerRef.current.id) {
        clearTimeout(timerRef.current.id);
      }
    };
  }, [quizId]);

  const startTimer = (time) => {
    if (timerRef.current.id) {
      clearTimeout(timerRef.current.id);
    }

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
    const newAnswers = { ...answers, [questionId]: answerId };
    setAnswers(newAnswers);

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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!quizRef.current?.questions) {
      toast.error("El cuestionario no está disponible");
      return;
    }

    const score = Object.values(results).filter((r) => r.isCorrect).length;
    toast.success(
      `Quiz completado! Puntuación: ${score}/${quiz.questions.length}`
    );
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
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold">{quiz.title}</CardTitle>
        <CardDescription>{quiz.description}</CardDescription>
        <CardAction
          className={`flex gap-1 font-bold text-lg rounded-lg p-1.5 text-secondary transition-all duration-300 ${
            timerRef.current.remaining <= 10 ? "bg-red-600" : "bg-primary"
          }`}
          style={{
            animation: `timer-flash linear infinite ${
              timerRef.current.remaining > 10
                ? "2s"
                : timerRef.current.remaining <= 10 &&
                  timerRef.current.remaining > 0
                ? "1s"
                : "none"
            }`,
          }}
        >
          {" "}
          <Timer />
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
                  value={answers[currentQuestion.id] || ""}
                  onValueChange={(value) =>
                    handleAnswerChange(currentQuestion.id, value)
                  }
                >
                  {currentQuestion.answers.map((answer, answerIndex) => {
                    const isSelected =
                      answers[currentQuestion.id] === answer.id.toString();
                    const isCorrect = answer.is_correct;
                    const showFeedback =
                      questionResult && (isSelected || isCorrect);

                    return (
                      <article
                        key={answer.id}
                        className={`flex items-center space-x-2 p-2 rounded ${
                          showFeedback
                            ? isCorrect
                              ? "bg-green-50"
                              : isSelected
                              ? "bg-red-50"
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
              <CardFooter className="flex flex-col">
                {questionResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-md ${
                      questionResult.isCorrect
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                    }`}
                  >
                    {questionResult.isCorrect ? (
                      <div className="flex items-center">
                        <Check className="mr-2" />
                        <span>¡Respuesta correcta!</span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center">
                          <X className="mr-2" />
                          <span>Respuesta incorrecta</span>
                        </div>
                        <p className="mt-2">
                          La respuesta correcta es:{" "}
                          <strong>
                            {
                              currentQuestion.answers.find((a) => a.is_correct)
                                ?.text
                            }
                          </strong>
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </CardFooter>
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

        {isLastQuestion ? (
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
  );
}
