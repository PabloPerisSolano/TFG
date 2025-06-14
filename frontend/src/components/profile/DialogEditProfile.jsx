import { Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogDescription,
  DialogContent,
  DialogTitle,
  DialogFooter,
  Input,
  Label,
} from "@/components/ui";
import { API_ROUTES } from "@/constants";
import { useAuth, useAuthFetch } from "@/hooks";

export const DialogEditProfile = ({ open, onOpenChange }) => {
  const fetchWithAuth = useAuthFetch();
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [first_name, setFirstName] = useState(user.first_name || "");
  const [last_name, setLastName] = useState(user.last_name || "");

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const res = await fetchWithAuth(API_ROUTES.USER_DETAIL, {
      method: "PATCH",
      body: JSON.stringify({
        username,
        email,
        first_name,
        last_name,
      }),
    });

    const jsonRes = await res.json();

    if (!res.ok) {
      if (jsonRes.username) {
        setUsername(user.username);
        toast.error("Error al actualizar el nombre de usuario", {
          description: jsonRes.username,
        });
        return;
      }

      if (jsonRes.email) {
        setEmail(user.email);
        toast.error("Error al actualizar el email", {
          description: jsonRes.email,
        });
        return;
      }

      toast.error("Error al actualizar el perfil");
      return;
    }

    updateUser(jsonRes);

    toast.success("Perfil actualizado");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configuración de perfil</DialogTitle>
          <DialogDescription>
            Modifica tus datos personales y guarda los cambios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSaveChanges} className="space-y-4">
          <div>
            <Label htmlFor="username">Nombre de usuario</Label>
            <Input
              id="username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="first_name">Nombre</Label>
            <Input
              id="first_name"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Escribe tu nombre..."
            />
          </div>
          <div>
            <Label htmlFor="last_name">Apellidos</Label>
            <Input
              id="last_name"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Escribe tus apellidos..."
            />
          </div>

          <DialogFooter>
            <Button type="submit">
              <Save />
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
