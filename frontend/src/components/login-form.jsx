import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export function LoginForm({
  className,
  ...props
}) {
  return (
    (<div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Introduce tus datos de acceso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input id="username" type="text" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Iniciar Sesión
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              ¿Quieres crear una cuenta?
              <Link href="/register" className="text-blue-500"> Registrarse</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>)
  );
}
