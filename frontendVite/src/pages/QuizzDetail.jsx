import { TriangleAlert, Reply, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { CardQuizzDetail } from "@/components/cards";
import { Button } from "@/components/ui";
import { API_ROUTES, ROUTES } from "@/config";
import { useAuthFetch } from "@/hooks";

export default function QuizzDetail() {
  const fetchWithAuth = useAuthFetch();
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      const res = await fetchWithAuth(API_ROUTES.USER_QUIZ_DETAIL(quizId));

      if (!res.ok) {
        if (res.status === 404) {
          toast.error("No se ha encontrado el cuestionario");
        } else if (res.status === 403) {
          toast.error("No tienes permiso para acceder a este cuestionario");
        } else {
          toast.error("Error al obtener el cuestionario");
        }
        setLoading(false);
        setQuiz(null);
        return;
      }

      const data = await res.json();

      setLoading(false);
      setQuiz(data);
    };

    fetchQuiz();
  }, [quizId]);

  if (loading)
    return (
      <div className="flex justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );

  if (!quiz)
    return (
      <div className="flex flex-col items-center gap-2">
        <section className="items-center flex gap-2">
          <TriangleAlert />
          <p className="font-bold">No se ha encontrado el cuestionario.</p>
        </section>
        <Link to={ROUTES.MY_QUIZZES}>
          <Button>
            <Reply />
            Volver a mis cuestionarios
          </Button>
        </Link>
      </div>
    );

  return <CardQuizzDetail quiz={quiz} onQuizUpdate={setQuiz} />;
}
