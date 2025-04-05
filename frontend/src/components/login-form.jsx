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
import { API_BASE_URL, GOOGLE_CLIENT_ID } from "@/config/config";
import {
  showSuccessToast,
  showErrorToast,
  showServerErrorToast,
} from "@/utils/toastUtils";
import { FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import AddItemDialog from "@/components/add-item-dialog";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export function LoginForm({ className, ...props }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}auth/login/`, {
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

      handleLogin(data.access, data.refresh, data.user);
    } catch (error) {
      showServerErrorToast();
    }
  };

  const handlePasswordResetRequest = async (email) => {
    if (!email.trim()) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}auth/password-reset-request/`,
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

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const response = await fetch(`${API_BASE_URL}auth/google/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const jsonRes = await response.json();

      if (!response.ok) {
        showErrorToast({
          title: "Error al iniciar sesión",
          description: jsonRes.message,
        });
        return;
      }

      handleLogin(jsonRes.access, jsonRes.refresh, jsonRes.user);
    } catch (error) {
      showServerErrorToast();
    }
  };

  const handleGoogleLoginError = () => {
    showErrorToast({
      title: "Error al iniciar sesión",
      description: "No se pudo completar el inicio de sesión con Google.",
    });
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
              <section className="grid gap-2">
                <Label htmlFor="username">Email o Nombre de usuario</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
              </section>

              <section className="grid gap-2">
                <article className="flex justify-between space-x-10">
                  <Label htmlFor="password">Contraseña</Label>
                  <AddItemDialog
                    dialogTitle="Email de recuperación"
                    inputPlaceholder="Escribe tu dirección de correo"
                    onSave={(email) => handlePasswordResetRequest(email)}
                  >
                    <Label className="hover:underline cursor-pointer">
                      ¿Has olvidado la contraseña?
                    </Label>
                  </AddItemDialog>
                </article>

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
              </section>

              <Button type="submit" className="w-full">
                <FaSignInAlt />
                Iniciar Sesión
              </Button>

              <section className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Acceder con
                </span>
              </section>

              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginError}
                />
              </GoogleOAuthProvider>
            </div>

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
