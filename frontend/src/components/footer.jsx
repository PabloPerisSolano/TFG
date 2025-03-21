import React from "react";
import Link from "next/link";
import { FaInstagram, FaGoogle } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="p-3 container mx-auto px-4 flex flex-wrap justify-between">
      <section className="w-full md:w-1/3 mb-6 md:mb-0">
        <article className="flex items-center space-x-2 mb-2">
          <img
            src="/favicon.png"
            width={20}
            alt="QuizGenerate Logo"
            className="rounded-md"
          />
          <h2 className="text-xl font-bold">QuizGenerate</h2>
        </article>
        <p>TFG: Pablo Peris Solano. 2025</p>
      </section>

      <div className="w-full md:w-1/3 mb-6 md:mb-0">
        <h2 className="text-xl font-bold mb-2">Contacto</h2>
        <ul>
          <li className="mb-2">
            <article className="flex items-center space-x-2">
              <FaGoogle />
              <a
                href="mailto:pabloperissolano@gmail.com"
                className="hover:underline"
              >
                pabloperissolano@gmail.com
              </a>
            </article>
          </li>
        </ul>
      </div>
      <div className="w-full md:w-1/3">
        <h2 className="text-xl font-bold mb-2">Síguenos</h2>
        <ul className="flex space-x-4">
          <li>
            <a
              href="https://www.instagram.com/pabloperiss_03/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline "
            >
              <article className="flex items-center space-x-2">
                <FaInstagram /> <p>Instagram</p>
              </article>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
