import { UserPlus, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/ui";
import { API_ROUTES, ROUTES } from "@/constants";
import { useAuthFetch } from "@/hooks";
import { cn } from "@/lib/utils";

export default function Register({ className, ...props }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const navigate = useNavigate();
  const fetchWithAuth = useAuthFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchWithAuth(API_ROUTES.REGISTER, {
      method: "POST",
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
      toast.error("Error de registro", {
        description: errorData.email || errorData.username,
      });
      return;
    }

    toast.success("Registro exitoso");

    navigate(ROUTES.LOGIN);
  };

  return (
    <div className={cn("max-w-lg mx-auto", className)} {...props}>
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
                    {showPassword ? <EyeOff /> : <Eye />}
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
                  <UserPlus />
                  Crear Cuenta
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link to={ROUTES.LOGIN} className="text-blue-500 hover:underline">
                Iniciar sesión
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
