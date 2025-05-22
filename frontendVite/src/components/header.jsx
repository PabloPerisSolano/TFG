import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/use-auth";

export default function Header() {
  const { user } = useAuth();

  return (
    <div
      style={{ backgroundColor: "var(--rich-black)" }}
      className="p-2 flex justify-between w-full items-center"
    >
      <Link to="/home">
        <img
          src="/LogoQuizGenerate.png"
          alt="QuizGenerate Logo"
          width={100}
          className="rounded-md transition-transform duration-200 hover:scale-105 active:scale-95"
        />
      </Link>
      {user != null ? (
        // <DropdownMenuPerfil />
        <p>logueado</p>
      ) : (
        <Link to="/login">
          <Button variant="secondary">
            <LogIn />
            <span>Acceder</span>
          </Button>
        </Link>
      )}
    </div>
  );
}
