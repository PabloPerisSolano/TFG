"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { API_BASE_URL } from "@/config/config";
import { showServerErrorToast, showErrorToast } from "@/utils/toastUtils";
import { FaSignInAlt } from "react-icons/fa";

export function LoginForm({ className, ...props }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}users/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        showErrorToast({
          title: "Error de inicio de sesión",
          description: "Credenciales incorrectas.",
        });
        return;
      }

      const data = await response.json();

      handleLogin(data.access, data.refresh);
    } catch (error) {
      showServerErrorToast();
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>Introduce tus credenciales.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                <FaSignInAlt />
                Iniciar Sesión
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              ¿Quieres crear una cuenta?{" "}
              <Link href="/register" className="text-blue-500">
                Registrarse
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
