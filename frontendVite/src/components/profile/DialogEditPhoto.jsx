import { Save, Trash2 } from "lucide-react";
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
  Label,
} from "@/components/ui";
import { API_ROUTES } from "@/config";
import { useAuth, useAuthFetch } from "@/hooks";

export const DialogEditPhoto = ({ open, onOpenChange }) => {
  const fetchWithAuth = useAuthFetch();
  const { user, updateUser } = useAuth();
  const [profile_picture, setProfilePicture] = useState(
    user.profile_picture || ""
  );

  const handleUpdatePhoto = async () => {
    const formData = new FormData();
    formData.append("profile_picture", profile_picture);

    const res = await fetchWithAuth(API_ROUTES.USER_DETAIL, {
      method: "PATCH",
      body: formData,
    });

    if (!res.ok) {
      console.error(res);
      toast.error("Error al actualizar la foto de perfil");
      return;
    }

    const jsonRes = await res.json();

    updateUser(jsonRes);

    toast.success("Foto de perfil actualizada correctamente");

    onOpenChange(false);
    setProfilePicture(jsonRes.profile_picture);
  };

  const handleDeletePhoto = async () => {
    const res = await fetchWithAuth(API_ROUTES.USER_DETAIL, {
      method: "PATCH",
      body: JSON.stringify({
        profile_picture: null,
      }),
    });

    if (!res.ok) {
      toast.error("Error al borrar la foto de perfil");
      return;
    }

    const jsonRes = await res.json();

    updateUser(jsonRes);

    toast.success("Foto de perfil borrada correctamente");

    setProfilePicture("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar Foto de Perfil</DialogTitle>
          <DialogDescription>
            Selecciona una nueva foto de perfil o borra la actual.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Label>Selecciona una imagen</Label>
          <Input
            type="file"
            accept=".png, .jpg, .jpeg, .gif"
            onChange={(e) => setProfilePicture(e.target.files[0])}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleDeletePhoto} variant="destructive">
            <Trash2 />
            Borrar Foto
          </Button>
          <Button onClick={handleUpdatePhoto}>
            <Save />
            Guardar Foto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
