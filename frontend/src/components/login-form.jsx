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
import {
  showSuccessToast,
  showErrorToast,
  showServerErrorToast,
} from "@/utils/toastUtils";
import { FaSignInAlt } from "react-icons/fa";
import AddItemDialog from "@/components/add-item-dialog";

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

  const handlePasswordResetRequest = async (email) => {
    if (!email.trim()) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}users/password-reset-request/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const jsonRes = await response.json();

      if (!response.ok) {
        showErrorToast({
          title: "Correo inválido",
          description: jsonRes.error,
        });
        return;
      }

      showSuccessToast({
        title: "Solicitud enviada",
        description: jsonRes.message,
      });
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
                <Label htmlFor="username">Email o Nombre de usuario</Label>
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
                <article className="flex justify-between space-x-10">
                  <Label htmlFor="password">Contraseña</Label>
                  <AddItemDialog
                    dialogTitle="Restablecer contraseña"
                    inputPlaceholder="Escribe tu dirección de correo"
                    onSave={(email) => handlePasswordResetRequest(email)}
                  >
                    <Label className="hover:underline cursor-pointer">
                      ¿Has olvidado la contraseña?
                    </Label>
                  </AddItemDialog>
                </article>

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

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Acceder con
                </span>
              </div>

              <Button variant="outline" className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                <span className="sr-only">Login with Google</span>
              </Button>
            </div>

            <div className="mt-4 text-center text-sm"></div>

            <div className="mt-4 text-center text-sm">
              ¿Aún no tienes cuenta?{" "}
              <Link href="/register" className="text-blue-500 hover:underline">
                Registrarse
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
