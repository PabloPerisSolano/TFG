import { UserPen, UserLock, LogOut, Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import { DialogChangePassword } from "@/components/profile/DialogChangePassword";
import { DialogDeleteAccount } from "@/components/profile/DialogDeleteAccount";
import { DialogEditPhoto } from "@/components/profile/DialogEditPhoto";
import { DialogEditProfile } from "@/components/profile/DialogEditProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useAuth } from "@/hooks/useAuth";

export const DropdownAvatar = ({ children }) => {
  const { user, handleLogout } = useAuth();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup className="flex flex-col items-center space-y-1">
            <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
            <div className="relative">
              <Avatar className="size-24">
                <AvatarImage src={user.profile_picture || null} />
                <AvatarFallback>{user.username.toUpperCase()}</AvatarFallback>
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

          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="text-red-600" />
            <span className="text-red-600">Borrar Cuenta</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              handleLogout();
            }}
          >
            <LogOut className="text-red-600" />
            <span className="text-red-600">Cerrar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogEditProfile
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
      />
      <DialogChangePassword
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      />

      <DialogDeleteAccount
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
      <DialogEditPhoto
        open={isPhotoDialogOpen}
        onOpenChange={setIsPhotoDialogOpen}
      />
    </>
  );
};
