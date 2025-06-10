import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/ui";
import { ROUTES, API_ROUTES } from "@/constants";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch(API_ROUTES.PASSWORD_RESET_CONFIRM, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          new_password: newPassword,
        }),
      });

      const jsonRes = await response.json();

      if (!response.ok) {
        toast.error(jsonRes.error);
        return;
      }

      toast.success(jsonRes.message);

      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error("Error del servidor", {
        description: error.message,
      });
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Restablecer contraseña</CardTitle>
          <CardDescription>
            Introduce la nueva contraseña para tu cuenta.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CardContent className="space-y-5">
            <section>
              <Label>Nueva contraseña</Label>
              <article className="relative flex items-center">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Escribe tu nueva contraseña..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff /> : <Eye />}
                </Button>
              </article>
            </section>

            <section>
              <Label>Confirmar contraseña</Label>
              <article className="relative flex items-center">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirma tu nueva contraseña..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </Button>
              </article>
            </section>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Restablecer contraseña
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
