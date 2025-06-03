// import { useParams } from "next/navigation";
// import { useEffect, useState, useRef } from "react";
// import {
//   FaAward,
//   FaUpload,
//   FaCheck,
//   FaTimes,
//   FaExclamationTriangle,
// } from "react-icons/fa";
// import PleaseLogin from "@/components/please-login";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Skeleton } from "@/components/ui/skeleton";
// import { API_BASE_URL } from "@/config/config";
// import { useAuth } from "@/context/auth-context";
// import { showErrorToast, showServerErrorToast } from "@/utils/toastUtils";

// export default function TakeQuizPage() {
//   const { quizId } = useParams();
//   const [quiz, setQuiz] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [answers, setAnswers] = useState({});
//   const [score, setScore] = useState(null);
//   const [showResultDialog, setShowResultDialog] = useState(false);
//   const [results, setResults] = useState([]);
//   const [displayTime, setDisplayTime] = useState("0:00");
//   const timerRef = useRef({ id: null, remaining: 0 });
//   const isSubmitting = useRef(false);
//   const quizRef = useRef();

//   useEffect(() => {
//     if (!quizId) return;

//     const fetchQuiz = async () => {
//       const accessToken = localStorage.getItem("accessToken");

//       try {
//         const res = await fetch(`${API_BASE_URL}quizzes/me/${quizId}/`, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         if (!res.ok) {
//           showErrorToast({
//             title: "Error buscando el cuestionario",
//             description: "No se ha encontrado el cuestionario.",
//           });
//           return;
//         }

//         const data = await res.json();

//         setQuiz(data);
//         quizRef.current = data;
//         startTimer(data.time_limit);
//       } catch (error) {
//         showErrorToast({
//           title: "Error al cargar cuestionario",
//           description: error.message,
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuiz();

//     return () => {
//       if (timerRef.current.id) {
//         clearTimeout(timerRef.current.id);
//       }
//     };
//   }, [quizId]);

//   const startTimer = (time) => {
//     if (timerRef.current.id) {
//       clearTimeout(timerRef.current.id);
//     }

//     timerRef.current.remaining = time;
//     updateDisplayTime(time);

//     if (time <= 0) {
//       if (quizRef.current?.questions) {
//         handleSubmit();
//       }
//       return;
//     }

//     timerRef.current.id = setTimeout(() => {
//       startTimer(time - 1);
//     }, 1000);
//   };

//   const formatTime = (totalSeconds) => {
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;

//     // Formato HH:MM:SS (ej: 01:05:30)
//     if (hours > 0) {
//       return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
//         .toString()
//         .padStart(2, "0")}`;
//     }

//     // Formato MM:SS (ej: 15:30)
//     return `${minutes}:${seconds.toString().padStart(2, "0")}`;
//   };

//   const updateDisplayTime = (seconds) => {
//     setDisplayTime(formatTime(seconds));
//   };

//   const handleAnswerChange = (questionId, answerId) => {
//     setAnswers((prevAnswers) => ({
//       ...prevAnswers,
//       [questionId]: answerId,
//     }));
//   };

//   const handleSubmit = () => {
//     if (isSubmitting.current || !quizRef.current?.questions) return;
//     isSubmitting.current = true;

//     if (!quizRef.current?.questions) {
//       showErrorToast({
//         title: "Error al enviar respuestas",
//         description: "El cuestionario no está disponible",
//       });
//       return;
//     }

//     let newScore = 0;

//     const newResults = quizRef.current.questions.map((question) => {
//       const selectedAnswer = question.answers.find(
//         (a) => a.id.toString() === answers[question.id]
//       );

//       const correctAnswer = question.answers.find((a) => a.is_correct);

//       const isCorrect = answers[question.id] === correctAnswer?.id.toString();

//       if (isCorrect) {
//         newScore += 1;
//       }

//       return {
//         ...question,
//         selectedAnswer: selectedAnswer?.text,
//         correctAnswer: correctAnswer?.text,
//         isCorrect,
//       };
//     });

//     setScore(newScore);
//     setResults(newResults);
//     setShowResultDialog(true);
//     clearTimeout(timerRef.current.id);
//   };

//   if (loading)
//     return (
//       <div className="mx-auto space-y-4 max-w-3xl mt-10">
//         <Skeleton className="h-32 w-full" />
//         <Skeleton className="h-32 w-full" />
//         <Skeleton className="h-32 w-full" />
//       </div>
//     );
//   if (!quiz)
//     return (
//       <div className="mx-auto flex flex-col items-center space-y-4 mt-4">
//         <section className="items-center flex space-x-2">
//           <FaExclamationTriangle />
//           <p className="font-bold">No se ha encontrado el cuestionario.</p>
//         </section>
//       </div>
//     );

//   return (
//     <div className="mx-auto p-4 max-w-3xl space-y-8">
//       <section className="flex justify-between items-center">
//         <article>
//           <h1 className="text-3xl font-bold">{quiz.title}</h1>
//           <label className="font-semibold">Autor:</label> {quiz.author}
//         </article>
//         <article>
//           <div className="flex space-x-2">
//             <label className="font-semibold">Tiempo restante:</label>
//             <p
//               className={
//                 timerRef.current.remaining <= 10 ? "text-red-500 font-bold" : ""
//               }
//             >
//               {displayTime}
//             </p>
//           </div>
//           <label className="font-semibold">Nº preguntas:</label>{" "}
//           {quiz.num_questions}
//         </article>
//       </section>

//       <section>
//         {quiz.questions.map((question, questionIndex) => (
//           <Card key={question.id} className="mt-4">
//             <CardHeader>
//               <CardTitle className="text-lg">
//                 {questionIndex + 1}. {question.text}
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <RadioGroup
//                 onValueChange={(value) =>
//                   handleAnswerChange(question.id, value)
//                 }
//               >
//                 {question.answers.map((answer, answerIndex) => (
//                   <article
//                     key={answer.id}
//                     className="flex items-center space-x-2"
//                   >
//                     <RadioGroupItem value={answer.id.toString()} />
//                     <span>{String.fromCharCode(97 + answerIndex)})</span>
//                     <span>{answer.text}</span>
//                   </article>
//                 ))}
//               </RadioGroup>
//             </CardContent>
//           </Card>
//         ))}
//       </section>

//       <section className="flex justify-center">
//         <Button onClick={handleSubmit} className="w-full max-w-xl">
//           <FaUpload /> Enviar respuestas
//         </Button>
//       </section>

//       <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
//         <DialogContent className="sm:max-w-[700px] text-black">
//           <DialogHeader>
//             <DialogTitle className="flex items-center justify-center text-2xl">
//               <FaAward className="mr-2" />
//               Resultado: {score} / {quiz.questions.length}
//             </DialogTitle>
//             <DialogDescription>Revisión de las respuestas</DialogDescription>
//           </DialogHeader>
//           <ScrollArea className="max-h-[450px]">
//             <div className="space-y-4">
//               {results.map((result, index) => (
//                 <Card key={result.id}>
//                   <CardHeader>
//                     <CardTitle className="flex items-center">
//                       <span className="mr-2">{index + 1}.</span>
//                       <span className="text-lg font-semibold">
//                         {result.text}
//                       </span>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     {result.isCorrect ? (
//                       <article className="flex items-center space-x-2">
//                         <FaCheck className="text-green-500" />
//                         <span>{result.correctAnswer}</span>
//                       </article>
//                     ) : (
//                       <article>
//                         <div className="flex items-center space-x-2">
//                           <FaTimes className="text-red-500" />
//                           <span>{result.selectedAnswer}</span>
//                         </div>
//                         Respuesta correcta:
//                         <span className="font-bold">
//                           {" "}
//                           {result.correctAnswer}
//                         </span>
//                       </article>
//                     )}
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </ScrollArea>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
