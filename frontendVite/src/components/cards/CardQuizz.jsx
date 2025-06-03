import {
  Trash2,
  Pencil,
  ClipboardCheck,
  BadgeCheck,
  BadgeMinus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { DialogConfirm } from "@/components";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableFooter,
} from "@/components/ui";
import { API_ROUTES, ROUTES } from "@/config";
import { useAuthFetch } from "@/hooks";

export const CardQuizz = ({ quiz, onDelete, onTogglePublic }) => {
  const fetchWithAuth = useAuthFetch();

  const handleDelete = async (quizId) => {
    const res = await fetchWithAuth(API_ROUTES.USER_QUIZ_DETAIL(quizId), {
      method: "DELETE",
    });

    if (!res.ok) {
      toast.error("Error al eliminar el cuestionario");
      return;
    }

    onDelete(quizId);

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

    onTogglePublic(quizId, isPublic);

    toast.success("Estado actualizado", {
      description: `El cuestionario ahora es ${
        isPublic ? "público" : "privado"
      }.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <CardDescription>{quiz.description}</CardDescription>
        <CardAction>
          <Link to={`/quizzes/${quiz.id}/take`}>
            <Button variant="outline">
              <ClipboardCheck />{" "}
              <span className="hidden sm:inline">Evaluar</span>
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="text-sm ">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold">Autor</TableCell>
              <TableCell>{quiz.author}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Tiempo</TableCell>
              <TableCell>{quiz.time_limit / 60} minutos</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Nº preguntas</TableCell>
              <TableCell>{quiz.num_questions}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Creación</TableCell>
              <TableCell>
                {new Date(quiz.created_at).toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-semibold">Estado</TableCell>
              <TableCell className="flex items-center gap-2">
                {quiz.public ? (
                  <Badge className="bg-green-700 font-bold">
                    <BadgeCheck />
                    Público
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <BadgeMinus />
                    Privado
                  </Badge>
                )}
                <Switch
                  checked={quiz.public}
                  onCheckedChange={(checked) =>
                    handleTogglePublic(quiz.id, checked)
                  }
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <DialogConfirm
          title="¿Seguro que quieres eliminar este cuestionario?"
          description="Se eliminará permanentemente el cuestionario."
          onConfirm={() => handleDelete(quiz.id)}
          triggerButton={
            <Button variant="destructive" className="flex items-center">
              <Trash2 />
              <span className="hidden sm:inline">Eliminar</span>
            </Button>
          }
        />
        <Link to={ROUTES.MY_QUIZZ_DETAIL(quiz.id)}>
          <Button>
            <Pencil /> <span className="hidden sm:inline">Editar</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
