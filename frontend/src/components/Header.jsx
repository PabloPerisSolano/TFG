"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { isLoggedIn, user, handleLogout } = useAuth();

  return (
    <div className="flex justify-between items-center p-3 bg-gray-800 text-white">
      <Link href="/">
        <Image
          src="/LogoQuizGenerate.png"
          alt="QuizGenerate Logo"
          width={120}
          height={49}
        />
      </Link>
      <div>
        {isLoggedIn ? (
          <div className="flex gap-4">
            <span className="mr-4">Bienvenido, {user?.username}</span>
            <Button onClick={handleLogout} variant="destructive">
              Cerrar Sesión
            </Button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
