import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  Input,
} from "@/components/ui";
import { API_ROUTES } from "@/constants";
import { useAuth, useAuthFetch } from "@/hooks";

export const DialogDeleteAccount = ({ open, onOpenChange }) => {
  const fetchWithAuth = useAuthFetch();
  const { closeSession } = useAuth();
  const [confirmText, setConfirmText] = useState("");

  const handleDeleteAccount = async () => {
    if (confirmText !== "CONFIRMAR") {
      toast.error("Confirmación incorrecta", {
        description: 'Escribe "CONFIRMAR" para eliminar tu cuenta.',
      });
      return;
    }

    const res = await fetchWithAuth(API_ROUTES.USER_DETAIL, {
      method: "DELETE",
      body: JSON.stringify({
        confirm_delete: true,
      }),
    });

    if (!res.ok) {
      toast.error("Error al eliminar la cuenta");
      return;
    }

    toast.success("Cuenta eliminada correctamente");

    closeSession();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Cuenta</DialogTitle>
          <DialogDescription>Esta acción es irreversible.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleDeleteAccount} className="space-y-4">
          <p>
            ¿Estás seguro de eliminar tu cuenta? Escribe{" "}
            <strong>CONFIRMAR</strong>
          </p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="CONFIRMAR"
            required
          />

          <DialogFooter>
            <Button type="submit" variant="destructive">
              <Trash2 />
              Eliminar Cuenta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
