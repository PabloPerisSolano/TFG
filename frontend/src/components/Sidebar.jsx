import React from "react";
import Link from "next/link";
import { FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  return (
    <div className=" bg-gray-700">
      <div className="p-4">
        <h2 className="text-xl font-bold">Menu</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul>
          <li className="mb-2">
            <Link href="/quizzes">
              <Button variant="secondary">
                <FaSignInAlt />
                <span>Mis Cuestionarios</span>
              </Button>
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/creator"
              className="block p-2 rounded hover:bg-gray-700"
            >
              Crear Cuestionario
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/generator"
              className="block p-2 rounded hover:bg-gray-700"
            >
              Generar Cuestionario
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
