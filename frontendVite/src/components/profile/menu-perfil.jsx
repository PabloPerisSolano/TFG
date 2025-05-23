import {
  UserPen,
  UserLock,
  LogOut,
  Save,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { API_ROUTES } from "@/api/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/use-auth";
import { useFetchWithAuth } from "@/hooks/use-fetch-with-auth";

export default function MenuPerfil() {
  const fetchWithAuth = useFetchWithAuth();
  const { user, updateUser, handleLogout } = useAuth();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);

  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [first_name, setFirstName] = useState(user.first_name || "");
  const [last_name, setLastName] = useState(user.last_name || "");
  const [profile_picture, setProfilePicture] = useState(
    user.profile_picture || ""
  );

  const [current_password, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [new_password, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [confirmText, setConfirmText] = useState("");

  const handleSaveChanges = async () => {
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

    setIsProfileDialogOpen(false);
  };

  const handleChangePassword = async () => {
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

    setIsPasswordDialogOpen(false);
  };

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

    handleLogout();
  };

  const handleUpdatePhoto = async () => {
    const formData = new FormData();
    formData.append("profile_picture", profile_picture);

    const res = await fetchWithAuth(API_ROUTES.USER_DETAIL, {
      method: "PATCH",
      body: formData,
    });

    const jsonRes = await res.json();

    if (!res.ok) {
      toast.error("Error al actualizar la foto de perfil");
      return;
    }

    toast.success("Foto de perfil actualizada correctamente");

    setIsPhotoDialogOpen(false);
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

    toast.success("Foto de perfil borrada correctamente");

    setProfilePicture("");
    setIsPhotoDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={profile_picture || null} />
            <AvatarFallback className="bg-purple-200 text-gray-800">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60">
          <DropdownMenuGroup className="flex flex-col items-center space-y-1">
            <DropdownMenuLabel>{user.email}</DropdownMenuLabel>

            <div className="relative">
              <Avatar className="size-24">
                <AvatarImage src={profile_picture || null} />
                <AvatarFallback className="bg-purple-200 text-gray-800 text-xs">
                  {user.username.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full"
                onClick={() => setIsPhotoDialogOpen(true)}
              >
                <Pencil />
              </Button>
            </div>

            <DropdownMenuLabel>¡Hola, {user.username}!</DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsProfileDialogOpen(true)}>
              <UserPen />
              Editar Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsPasswordDialogOpen(true)}>
              <UserLock />
              Cambiar Contraseña
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600 "
          >
            <Trash2 />
            Borrar Cuenta
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogout} className="text-red-600 ">
            <LogOut />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="text-black">
          <DialogHeader>
            <DialogTitle className="font-bold">
              Configuración de perfil
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
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
          </div>
          <DialogFooter>
            <Button onClick={handleSaveChanges}>
              <Save />
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      >
        <DialogContent className="text-black">
          <DialogHeader>
            <DialogTitle className="font-bold">Cambiar Contraseña</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
                  placeholder="Escribe tu nueva actual..."
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
          </div>
          <DialogFooter>
            <Button onClick={handleChangePassword}>
              <Save />
              Cambiar Contraseña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="text-black">
          <DialogHeader>
            <DialogTitle className="font-bold">Borrar Cuenta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              ¿Estás seguro de borrar tu cuenta? Escribe{" "}
              <strong>CONFIRMAR</strong>
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="CONFIRMAR"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleDeleteAccount();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleDeleteAccount} className="bg-red-600">
              <Trash2 />
              Borrar Cuenta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
        <DialogContent className="text-gray-800">
          <DialogHeader>
            <DialogTitle>Actualizar Foto de Perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Selecciona una imagen</Label>
            <input
              type="file"
              accept=".png, .jpg, .jpeg, .gif"
              onChange={(e) => setProfilePicture(e.target.files[0])}
              className="border rounded p-2"
            />
          </div>
          <DialogFooter>
            <div className="flex justify-end space-x-2">
              <Button onClick={handleDeletePhoto} variant="destructive">
                <Trash2 />
                Borrar Foto
              </Button>
              <Button onClick={handleUpdatePhoto}>
                <Save />
                Guardar Foto
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
