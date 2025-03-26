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

export function DropdownMenuPerfil() {
  const { user, handleLogout } = useAuth();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [email, setEmail] = useState(user?.email || "");
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
          first_name: firstName,
          last_name: lastName,
          email,
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <FaUser />
            <span>{user?.username}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
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
              <Input id="username" value={user?.username} disabled />
            </div>
            <div>
              <Label htmlFor="first_name">Nombre</Label>
              <Input
                id="first_name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Escribe tu nombre..."
              />
            </div>
            <div>
              <Label htmlFor="last_name">Apellidos</Label>
              <Input
                id="last_name"
                value={lastName}
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
    </>
  );
}
