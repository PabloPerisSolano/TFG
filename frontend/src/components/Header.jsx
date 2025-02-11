"use client";

import { FaSignInAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { DropdownMenuPerfil } from "@/components/menu-perfil";

export default function Header() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="p-2 flex justify-between w-full items-center">
      <Link href={isLoggedIn ? "/quizzes" : "/"}>
        <Image
          src="/LogoQuizGenerate.png"
          alt="QuizGenerate Logo"
          width={100}
          height={40}
          className="rounded-md transition-transform duration-200 hover:scale-105 active:scale-95"
        />
      </Link>
      {isLoggedIn ? (
        <DropdownMenuPerfil />
      ) : (
        <Link href="/login">
          <Button variant="secondary">
            <FaSignInAlt />
            <span>Acceder</span>
          </Button>
        </Link>
      )}
    </div>
  );
}
