import {
  Trash2,
  Pencil,
  ClipboardCheck,
  BadgeCheck,
  BadgeMinus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DialogConfirm } from "@/components/dialogs";
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
import { ROUTES } from "@/constants";

export const CardQuiz = ({
  quiz,
  isPublicVariant,
  onDelete,
  onTogglePublic,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <CardDescription>{quiz.description}</CardDescription>
        <CardAction>
          <Link
            to={quiz.num_questions > 0 ? ROUTES.QUIZ_TAKE_PARAM(quiz.id) : "#"}
          >
            <Button
              variant={isPublicVariant ? "default" : "outline"}
              disabled={quiz.num_questions === 0}
            >
              <ClipboardCheck />
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
              <TableCell className="font-semibold">Categoría</TableCell>
              <TableCell>{quiz.category_display}</TableCell>
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
          {!isPublicVariant && (
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
                    onCheckedChange={onTogglePublic}
                  />
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </CardContent>
      {!isPublicVariant && (
        <CardFooter className="justify-end gap-2">
          <DialogConfirm
            title="¿Seguro que quieres eliminar este cuestionario?"
            description="Se eliminará permanentemente el cuestionario."
            onConfirm={onDelete}
            triggerButton={
              <Button variant="destructive">
                <Trash2 />
                Eliminar
              </Button>
            }
          />
          <Link to={ROUTES.MY_QUIZ_DETAIL(quiz.id)}>
            <Button>
              <Pencil /> Editar
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};
