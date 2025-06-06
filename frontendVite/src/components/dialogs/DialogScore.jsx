import { Trophy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui";
import { ROUTES } from "@/constants";

export const DialogScore = ({ score, maxScore, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy />
            <span>
              Puntuación: {score} / {maxScore}
            </span>
          </DialogTitle>
          <DialogDescription>
            Has conseguido un {((score / maxScore) * 100).toFixed(2)}% de
            aciertos.{" "}
            {score >= maxScore / 2 ? "¡Buen trabajo!" : "¡Sigue practicando!"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Link to={ROUTES.HOME} className="flex justify-end">
            <Button>
              <Check />
              Terminar Quizz
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
