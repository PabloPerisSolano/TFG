"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { API_BASE_URL, TRANSITION_DURATION } from "@/config/config";
import {
  showServerErrorToast,
  showSuccessToast,
  showErrorToast,
} from "@/utils/toastUtils";
import { FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa";

export function RegisterForm({ className, ...props }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}users/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          first_name,
          last_name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showErrorToast({
          title: "Error de registro",
          description: errorData.email || errorData.username,
        });
        return;
      }

      showSuccessToast({
        title: "Usuario registrado",
        description: "Se ha registrado correctamente.",
      });

      setTimeout(() => {
        router.push("/login");
      }, TRANSITION_DURATION);
    } catch (error) {
      showServerErrorToast();
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>
            Introduce tus datos de usuario para registrarte.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <article className="relative flex items-center">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </article>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">Nombre de pila (opcional)</Label>
                <Input
                  id="first_name"
                  type="text"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">Apellidos (opcional)</Label>
                <Input
                  id="last_name"
                  type="text"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <Button type="submit" className="w-full">
                  <FaUserPlus />
                  Crear Cuenta
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-blue-500 hover:underline">
                Iniciar sesión
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
