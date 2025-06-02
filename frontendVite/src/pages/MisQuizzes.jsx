import { CirclePlus, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { CardQuizz, FiltroQuizzes } from "@/components";
import { Button } from "@/components/ui";
import { API_ROUTES, ROUTES } from "@/config";
import { useAuthFetch } from "@/hooks";

export default function MisQuizzes() {
  const fetchWithAuth = useAuthFetch();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      const res = await fetchWithAuth(API_ROUTES.USER_QUIZ_LIST_CREATE);
      if (!res.ok) {
        toast.error("Error al obtener cuestionarios");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setQuizzes(data);
      setLoading(false);
    };
    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);

    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Mis Cuestionarios</h1>

      {loading ? (
        <div className="flex justify-center">
          <LoaderCircle className="animate-spin" />
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center bg-white rounded-3xl p-3">
          <p className="mb-4 font-bold">
            Todavía no tienes ningún cuestionario creado.
          </p>
          <Link to={ROUTES.CREATE_QUIZZ}>
            <Button>
              <CirclePlus />
              Crear cuestionario
            </Button>
          </Link>
        </div>
      ) : (
        <div>
          <FiltroQuizzes
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedQuizzes.map((quiz) => (
              <CardQuizz
                key={quiz.id}
                quiz={quiz}
                onDelete={(quizId) =>
                  setQuizzes((prevQuizzes) =>
                    prevQuizzes.filter((quiz) => quiz.id !== quizId)
                  )
                }
                onTogglePublic={(quizId, isPublic) =>
                  setQuizzes((prevQuizzes) =>
                    prevQuizzes.map((quiz) =>
                      quiz.id === quizId ? { ...quiz, public: isPublic } : quiz
                    )
                  )
                }
              />
            ))}
          </section>
        </div>
      )}
    </div>
  );
}
