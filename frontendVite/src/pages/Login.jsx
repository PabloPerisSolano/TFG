import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { DialogOneInput } from "@/components";
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
import { API_ROUTES, GOOGLE_CLIENT_ID, ROUTES } from "@/config";
import { useAuth, useAuthFetch } from "@/hooks";
import { cn } from "@/lib/utils";

export default function Login({ className, ...props }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin } = useAuth();
  const fetchWithAuth = useAuthFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchWithAuth(API_ROUTES.LOGIN, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      toast.error("Error de inicio de sesión");
      return;
    }

    const data = await response.json();
    handleLogin(data.user);
  };

  const handlePasswordResetRequest = async (email) => {
    if (!email.trim()) return;

    const response = await fetchWithAuth(API_ROUTES.PASSWORD_RESET_REQUEST, {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    const jsonRes = await response.json();

    if (!response.ok) {
      toast.error("Correo inválido", {
        description: jsonRes.error,
      });
      return;
    }

    toast.success("Correo enviado", {
      description: jsonRes.message,
    });
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const response = await fetchWithAuth(API_ROUTES.GOOGLE_LOGIN, {
      method: "POST",
      body: JSON.stringify({ token: credentialResponse.credential }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    handleLogin(data.user);
  };

  const handleGoogleLoginError = () => {
    toast.error("Error de inicio de sesión con Google");
  };

  return (
    <div className={cn("max-w-sm mx-auto", className)} {...props}>
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
                  <DialogOneInput
                    dialogTitle="Email de recuperación"
                    inputPlaceholder="Escribe tu dirección de correo"
                    onSave={(email) => handlePasswordResetRequest(email)}
                  >
                    <Label className="hover:underline cursor-pointer">
                      ¿Has olvidado la contraseña?
                    </Label>
                  </DialogOneInput>
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
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </article>
              </section>

              <Button type="submit" className="w-full">
                <LogIn />
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
              <Link
                to={ROUTES.REGISTER}
                className="text-blue-500 hover:underline"
              >
                Registrarse
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
