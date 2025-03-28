import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import {
  FaUser,
  FaUserEdit,
  FaUserLock,
  FaSignOutAlt,
  FaSave,
  FaTrashAlt,
  FaPencilAlt,
} from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  showServerErrorToast,
  showErrorToast,
  showSuccessToast,
} from "@/utils/toastUtils";
import { API_BASE_URL } from "@/config/config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DropdownMenuPerfil() {
  const { user, handleLogout } = useAuth();
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

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const handleSaveChanges = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`${API_BASE_URL}users/me/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          username,
          email,
          first_name,
          last_name,
        }),
      });

      if (!res.ok) {
        showErrorToast({
          title: "Error al actualizar el perfil",
          description: "No se pudo actualizar el perfil.",
        });
        return;
      }

      showSuccessToast({
        title: "Perfil actualizado",
        description: "Se ha actualizado el perfil correctamente.",
      });

      setIsProfileDialogOpen(false);
    } catch (error) {
      showServerErrorToast();
    }
  };

  const handleChangePassword = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`${API_BASE_URL}users/change-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (!res.ok) {
        showErrorToast({
          title: "Error al cambiar la contraseña",
          description: "No se pudo cambiar la contraseña.",
        });
        return;
      }

      showSuccessToast({
        title: "Contraseña cambiada",
        description: "Se ha cambiado la contraseña correctamente.",
      });

      setIsPasswordDialogOpen(false);
    } catch (error) {
      showServerErrorToast();
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== "CONFIRMAR") {
      showErrorToast({
        title: "Confirmación incorrecta",
        description: 'Escribe "CONFIRMAR" para eliminar tu cuenta.',
      });
      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`${API_BASE_URL}users/me/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          confirm_delete: true,
        }),
      });

      if (!res.ok) {
        showErrorToast({
          title: "Error al borrar la cuenta",
          description: "No se pudo borrar la cuenta.",
        });
        return;
      }

      showSuccessToast({
        title: "Cuenta borrada",
        description: "Tu cuenta ha sido borrada correctamente.",
      });

      handleLogout();
    } catch (error) {
      showServerErrorToast();
    }
  };

  const handleUpdatePhoto = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("profile_picture", profile_picture);

    try {
      const res = await fetch(`${API_BASE_URL}users/me/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const jsonRes = await res.json();

      if (!res.ok) {
        showErrorToast({
          title: "Error al actualizar la foto",
          description: "No se pudo actualizar la foto de perfil.",
        });
        return;
      }

      showSuccessToast({
        title: "Foto actualizada",
        description: "Se ha actualizado la foto de perfil correctamente.",
      });

      setIsPhotoDialogOpen(false);
      setProfilePicture(jsonRes.profile_picture);
    } catch (error) {
      showServerErrorToast();
    }
  };

  const handleDeletePhoto = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`${API_BASE_URL}users/me/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ profile_picture: null }),
      });

      if (!res.ok) {
        showErrorToast({
          title: "Error al borrar la foto",
          description: "No se pudo borrar la foto de perfil.",
        });
        return;
      }

      showSuccessToast({
        title: "Foto borrada",
        description: "Se ha borrado la foto de perfil correctamente.",
      });

      setProfilePicture("");
      setIsPhotoDialogOpen(false);
    } catch (error) {
      showServerErrorToast();
    }
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
                <FaPencilAlt />
              </Button>
            </div>

            <DropdownMenuLabel>¡Hola, {user.username}!</DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsProfileDialogOpen(true)}>
              <FaUserEdit />
              Editar Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsPasswordDialogOpen(true)}>
              <FaUserLock />
              Cambiar Contraseña
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600 "
          >
            <FaTrashAlt />
            Borrar Cuenta
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogout} className="text-red-600 ">
            <FaSignOutAlt />
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
                value={user.username}
                onChange={(e) => setUsername(e.target.value)}
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
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveChanges}>
              <FaSave />
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
            <div>
              <Label htmlFor="current_password">Contraseña Actual</Label>
              <Input
                id="current_password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Escribe tu contraseña actual..."
              />
            </div>
            <div>
              <Label htmlFor="new_password">Nueva Contraseña</Label>
              <Input
                id="new_password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Escribe tu nueva contraseña..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleChangePassword}>
              <FaSave />
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
              <FaTrashAlt />
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
                <FaTrashAlt />
                Borrar Foto
              </Button>
              <Button onClick={handleUpdatePhoto}>
                <FaSave />
                Guardar Foto
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
