import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaSignInAlt, FaLock } from "react-icons/fa";

export default function PleaseLogin() {
  return (
    <div className="flex flex-col items-center p-6">
      <FaLock className="text-6xl mb-2" />
      <p className="text-xl font-semibold mb-4">Acceso Restringido</p>
      <p className=" mb-2">Inicie sesión para ver esta página.</p>
      <Link href="/login">
        <Button variant="secondary">
          <FaSignInAlt className="mr-2" />
          <span>Iniciar Sesión</span>
        </Button>
      </Link>
    </div>
  );
}
