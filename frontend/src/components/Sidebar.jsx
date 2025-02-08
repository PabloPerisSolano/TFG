import Link from "next/link";
import { FaListAlt, FaPlusCircle, FaMagic } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const menuItems = [
    { href: "/quizzes", icon: <FaListAlt />, label: "Mis Cuestionarios" },
    { href: "/creator", icon: <FaPlusCircle />, label: "Crear Cuestionario" },
    { href: "/generator", icon: <FaMagic />, label: "Generar Cuestionario" },
  ];

  return (
    <div className=" bg-gray-700">
      <div className="pt-3">
        <h2 className="text-2xl font-bold text-center">Menu</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link href={item.href}>
                <Button variant="secondary" className="w-full">
                  {item.icon}
                  <span>{item.label}</span>
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
