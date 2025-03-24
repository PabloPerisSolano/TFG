"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE_URL, TRANSITION_DURATION } from "@/config/config";
import {
  showSuccessToast,
  showErrorToast,
  showServerErrorToast,
} from "@/utils/toastUtils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ResetPasswordPage() {
  const [new_password, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (new_password !== confirmPassword) {
      showErrorToast({
        title: "Error al restablecer la contraseña",
        description: "Las contraseñas no coinciden",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}users/password-reset-confirm/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            new_password,
          }),
        }
      );

      const jsonRes = await response.json();

      if (!response.ok) {
        showErrorToast({
          title: "Error al restablecer la contraseña",
          description: jsonRes.error,
        });
        return;
      }

      showSuccessToast({
        title: "Contraseña restablecida",
        description: jsonRes.message,
      });

      setTimeout(() => {
        router.push("/login");
      }, TRANSITION_DURATION);
    } catch (error) {
      console.log(error);
      showServerErrorToast();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Restablecer contraseña</CardTitle>
          <CardDescription>
            Introduce la nueva contraseña para tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <section className="space-y-2">
              <Label htmlFor="new_password">Nueva contraseña</Label>
              <Input
                id="new_password"
                type="password"
                required
                value={new_password}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </section>

            <section className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </section>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Procesando..." : "Restablecer contraseña"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
