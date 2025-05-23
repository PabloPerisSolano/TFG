import {
  Trash2,
  Eye,
  CirclePlus,
  ArrowDownUp,
  ClipboardCheck,
  LoaderCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import DialogConfirm from "@/components/DialogConfirm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { API_ROUTES } from "@/config/api";
import { ROUTES } from "@/config/routes";
import { useAuthFetch } from "@/hooks/useAuthFetch";

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

  const handleDelete = async (quizId) => {
    const res = await fetchWithAuth(API_ROUTES.USER_QUIZ_DETAIL(quizId), {
      method: "DELETE",
    });

    if (!res.ok) {
      toast.error("Error al eliminar el cuestionario");
      return;
    }

    setQuizzes((prevQuizzes) =>
      prevQuizzes.filter((quiz) => quiz.id !== quizId)
    );

    toast.success("Cuestionario eliminado");
  };

  const handleTogglePublic = async (quizId, isPublic) => {
    const res = await fetchWithAuth(API_ROUTES.USER_QUIZ_DETAIL(quizId), {
      method: "PATCH",
      body: JSON.stringify({ public: isPublic }),
    });

    if (!res.ok) {
      toast.error("Error al actualizar el estado");
      return;
    }

    setQuizzes((prevQuizzes) =>
      prevQuizzes.map((quiz) =>
        quiz.id === quizId ? { ...quiz, public: isPublic } : quiz
      )
    );
    toast.success("Estado actualizado", {
      description: `El cuestionario ahora es ${
        isPublic ? "público" : "privado"
      }.`,
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mis Cuestionarios</h1>

      {loading ? (
        <LoaderCircle className="animate-spin" />
      ) : quizzes.length === 0 ? (
        <div className="text-center bg-white rounded-3xl p-3">
          <p className="mb-4 font-bold text-gray-800">
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
          <section className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white text-gray-800"
            />
            <Button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              <ArrowDownUp />
              Ordenar {sortOrder === "asc" ? "↓" : "↑"}
            </Button>
          </section>

          <section className="space-y-4">
            {sortedQuizzes.map((quiz, index) => (
              <Card key={quiz.id}>
                <CardHeader>
                  <div className="space-y-2">
                    <section className="flex items-center justify-between">
                      <CardTitle>
                        {index + 1}. {quiz.title}
                      </CardTitle>
                      <article className="flex items-center space-x-2 bg-slate-400 p-2 rounded-2xl">
                        <label className="text-sm text-white font-bold">
                          Publicar
                        </label>
                        <Switch
                          checked={quiz.public}
                          onCheckedChange={(checked) =>
                            handleTogglePublic(quiz.id, checked)
                          }
                        />
                      </article>
                    </section>

                    <CardDescription>{quiz.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="text-sm ">
                  <ul className="list-disc list-inside">
                    <li>
                      <label className="font-semibold">Autor:</label>{" "}
                      {quiz.author}
                    </li>
                    <li>
                      <label className="font-semibold">Tiempo:</label>{" "}
                      {quiz.time_limit / 60} minutos
                    </li>
                    <li>
                      <label className="font-semibold">
                        Número de preguntas:
                      </label>{" "}
                      {quiz.num_questions}
                    </li>
                    <li>
                      <label className="font-semibold">
                        Fecha de creación:
                      </label>{" "}
                      {new Date(quiz.created_at).toLocaleDateString()}
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="justify-end space-x-2">
                  <DialogConfirm
                    title="¿Seguro que quieres eliminar este cuestionario?"
                    description="Se eliminará permanentemente el cuestionario."
                    onConfirm={() => handleDelete(quiz.id)}
                    triggerButton={
                      <Button
                        variant="destructive"
                        className="flex items-center"
                      >
                        <Trash2 />
                        <span className="hidden sm:inline">Eliminar</span>
                      </Button>
                    }
                  />
                  <Link to={`/quizzes/${quiz.id}`}>
                    <Button>
                      <Eye /> Ver detalles
                    </Button>
                  </Link>
                  <Link to={`/quizzes/${quiz.id}/take`}>
                    <Button>
                      <ClipboardCheck /> Evaluar
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </section>
        </div>
      )}
    </div>
  );
}
