import { Save, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_ROUTES } from "@/config/api";
import { useAuthFetch } from "@/hooks/useAuthFetch";

export const DialogChangePassword = ({ open, onOpenChange }) => {
  const fetchWithAuth = useAuthFetch();
  const [current_password, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [new_password, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const res = await fetchWithAuth(API_ROUTES.CHANGE_PASSWORD, {
      method: "POST",
      body: JSON.stringify({
        current_password,
        new_password,
      }),
    });

    const jsonRes = await res.json();

    if (!res.ok) {
      toast.error("Error al cambiar la contraseña", {
        description: jsonRes.error,
      });
      return;
    }

    toast.success("Contraseña cambiada correctamente", {
      description: jsonRes.message,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar Contraseña</DialogTitle>
          <DialogDescription>
            Modifica tu contraseña y guarda los cambios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <section>
            <Label htmlFor="current_password">Contraseña Actual</Label>
            <article className="relative flex items-center">
              <Input
                id="current_password"
                type={showCurrentPassword ? "text" : "password"}
                required
                value={current_password}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Escribe tu contraseña actual..."
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff /> : <Eye />}
              </Button>
            </article>
          </section>

          <section>
            <Label htmlFor="new_password">Nueva Contraseña</Label>
            <article className="relative flex items-center">
              <Input
                id="new_password"
                type={showNewPassword ? "text" : "password"}
                required
                value={new_password}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Escribe tu nueva contraseña..."
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff /> : <Eye />}
              </Button>
            </article>
          </section>

          <DialogFooter>
            <Button type="submit">
              <Save />
              Cambiar Contraseña
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
