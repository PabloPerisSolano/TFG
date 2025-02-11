"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import PleaseLogin from "@/components/please-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";

export default function CreatorPage() {
  const { isLoggedIn } = useAuth();
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

  const updateQuestion = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const updateAnswerCount = (index, count) => {
    const updatedQuestions = [...questions];
    const newAnswers = new Array(parseInt(count)).fill("");
    updatedQuestions[index].answers = newAnswers;
    updatedQuestions[index].correctIndex = 0;
    setQuestions(updatedQuestions);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Crear Cuestionario</h1>
      <Card>
        <CardContent className="p-4 space-y-4">
          <Label>Título</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título del cuestionario"
          />
          <Label>Descripción</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción del cuestionario"
          />
          {questions.map((q, index) => (
            <div key={index} className="space-y-2 border p-4 rounded-md">
              <Label>Pregunta {index + 1}</Label>
              <Input
                value={q.question}
                onChange={(e) => updateQuestion(index, e.target.value)}
                placeholder="Escribe tu pregunta"
              />
              <Label>Número de respuestas</Label>
              <Select
                value={q.answers.length.toString()}
                onValueChange={(value) => updateAnswerCount(index, value)}
              >
                <SelectTrigger className="w-full">
                  Número de respuestas
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label>Opciones de respuesta</Label>
              <RadioGroup
                value={q.correctIndex.toString()}
                onValueChange={(value) => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[index].correctIndex = parseInt(value);
                  setQuestions(updatedQuestions);
                }}
              >
                {q.answers.map((ans, ansIndex) => (
                  <div key={ansIndex} className="flex items-center space-x-2">
                    <RadioGroupItem value={ansIndex.toString()} />
                    <Input
                      value={ans}
                      onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[index].answers[ansIndex] =
                          e.target.value;
                        setQuestions(updatedQuestions);
                      }}
                      placeholder={`Respuesta ${ansIndex + 1}`}
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
          <Button onClick={addQuestion}>Añadir Pregunta</Button>
          <Button className="w-full">Guardar Cuestionario</Button>
        </CardContent>
      </Card>
    </div>
  );
}
