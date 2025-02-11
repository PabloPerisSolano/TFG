import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="p-3 container mx-auto px-4 flex flex-wrap justify-between">
      <div className="w-full md:w-1/3 mb-6 md:mb-0">
        <h2 className="text-xl font-bold mb-2">QuizGenerate</h2>
        <p>© TFG: Pablo Peris Solano. 2025</p>
      </div>
      <div className="w-full md:w-1/3 mb-6 md:mb-0">
        <h2 className="text-xl font-bold mb-2">Enlaces</h2>
        <ul>
          <li className="mb-2">
            <Link href="/about" className="hover:underline">
              Acerca de
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/contact" className="hover:underline">
              Contacto
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/privacy" className="hover:underline">
              Política de Privacidad
            </Link>
          </li>
        </ul>
      </div>
      <div className="w-full md:w-1/3">
        <h2 className="text-xl font-bold mb-2">Síguenos</h2>
        <ul className="flex space-x-4">
          <li>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Facebook
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Twitter
            </a>
          </li>
          <li>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Instagram
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
