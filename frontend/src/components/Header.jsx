"use client";

import { FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { isLoggedIn, user, handleLogout } = useAuth();

  return (
    <div className="p-3 flex justify-between items-center">
      <Link href={isLoggedIn ? "/quizzes" : "/"}>
        <Image
          src="/LogoQuizGenerate.png"
          alt="QuizGenerate Logo"
          width={120}
          height={49}
          className="rounded-md transition-transform duration-200 hover:scale-105 active:scale-95"
        />
      </Link>

      {isLoggedIn ? (
        <div className="flex gap-4">
          <Button variant="secondary">
            <FaUser />
            <span>{user?.username}</span>
          </Button>
          <Button onClick={handleLogout} variant="destructive">
            <FaSignOutAlt />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="secondary" className="ml-4">
              <FaSignInAlt />
              <span>Iniciar Sesión</span>
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary">
              <FaUserPlus />
              <span>Registrarse</span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
