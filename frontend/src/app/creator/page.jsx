"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import PleaseLogin from "@/components/please-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2 } from "lucide-react";
import { FaPlus, FaPlusCircle, FaSave, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL, TRANSITION_DURATION } from "@/config/config";
import {
  showServerErrorToast,
  showSuccessToast,
  showErrorToast,
} from "@/utils/toastUtils";
import ConfirmDialog from "@/components/confirm-dialog";

export default function CreatorPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", answers: ["", ""], correctIndex: 0 },
  ]);

  if (!isLoggedIn) {
    return <PleaseLogin />;
  }

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

  const handleSaveQuiz = async () => {
    try {
      const quizData = {
        title,
        description,
        questions: questions.map((q) => ({
          text: q.question,
          answers: q.answers.map((ans, index) => ({
            text: ans,
            is_correct: index === q.correctIndex,
          })),
        })),
      };

      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(`${API_BASE_URL}quizzes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(quizData),
      });

      if (response.ok) {
        showSuccessToast({
          title: "Cuestionario creado",
          description: "El cuestionario se ha guardado correctamente.",
        });

        setTimeout(() => {
          router.push("/quizzes");
        }, TRANSITION_DURATION);
      } else {
        showErrorToast({
          title: "Error de creación",
          description: "Rellena adecuadamente los campos.",
        });
      }
    } catch (error) {
      showServerErrorToast();
    }
  };

  return (
    <div className="p-4">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Crear Cuestionario
          </CardTitle>
          <CardDescription>
            Crea un cuestionario con preguntas y respuestas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <section>
            <Label className="font-semibold">Título</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Escribe el título del cuestionario..."
            />
          </section>
          <section>
            <Label className="font-semibold">Descripción</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Escibe una descripción del cuestionario..."
            />
          </section>
          <section className="space-y-5">
            {questions.map((q, index) => (
              <div key={index} className="space-y-5 p-4 border rounded-md">
                <article>
                  <Label className="font-semibold">Pregunta {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(index)}
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </Button>
                  <Input
                    value={q.question}
                    onChange={(e) => updateQuestion(index, e.target.value)}
                    placeholder="Escribe tu pregunta..."
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
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAnswer(index, ansIndex)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </RadioGroup>
                </article>

                <Button variant="outline" onClick={() => addAnswer(index)}>
                  <FaPlusCircle />
                  Añadir Respuesta
                </Button>
              </div>
            ))}
          </section>

          <Button onClick={addQuestion}>
            <FaPlus />
            Añadir Pregunta
          </Button>
        </CardContent>
        <CardFooter className="flex justify-end">
          <ConfirmDialog
            title="¿Seguro que quieres perder el progreso de creación?"
            description="Al confirmar, no se guardará la información del cuestionario."
            onConfirm={() => router.push("/quizzes")}
            triggerButton={
              <Button variant="outline" className="mr-2">
                <FaTimes /> Cancelar
              </Button>
            }
          />

          <Button onClick={handleSaveQuiz}>
            <FaSave /> Guardar Cuestionario
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
