import { LogIn, UserPlus, House, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import MenuPerfil from "@/components/profile/menu-perfil";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/hooks/use-auth";

export default function Header() {
  const { user } = useAuth();

  return (
    <div
      style={{ backgroundColor: "var(--rich-black)" }}
      className="p-2 flex justify-between w-full items-center"
    >
      <Link to={user ? "/my-quizzes" : "/"}>
        <img
          src="/LogoQuizGenerate.png"
          alt="QuizGenerate Logo"
          width={100}
          className="rounded-md transition-transform duration-200 hover:scale-105 active:scale-95"
        />
      </Link>

      {user ? (
        <MenuPerfil />
      ) : (
        <div className="hidden md:flex gap-3 items-center">
          <Link to="/login">
            <Button variant="secondary">
              <LogIn />
              <span>Iniciar sesión</span>
            </Button>
          </Link>
          <Link to="/register">
            <Button>
              <UserPlus />
              <span>Registrarse</span>
            </Button>
          </Link>
        </div>
      )}

      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Menu className="text-white size-9" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link to="/">
              <DropdownMenuItem>
                <House />
                Inicio
              </DropdownMenuItem>
            </Link>
            <Link to="/login">
              <DropdownMenuItem>
                <LogIn />
                Iniciar Sesión
              </DropdownMenuItem>
            </Link>
            <Link to="/register">
              <DropdownMenuItem>
                <UserPlus />
                Registrarse
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
