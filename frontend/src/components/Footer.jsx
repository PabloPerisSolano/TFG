import { Instagram, Mail } from "lucide-react";
import React from "react";

export const Footer = () => {
  return (
    <div
      style={{ backgroundColor: "var(--rich-black)" }}
      className="text-white p-3 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0"
    >
      <section className="md:ml-10">
        <article className="flex items-center justify-center md:justify-start space-x-2 mb-2">
          <img src="/favicon.png" width={20} alt="QuizGenerate Logo" />
          <h2 className="text-xl font-bold">QuizGenerate</h2>
        </article>
        <p>TFG: Pablo Peris Solano. 2025</p>
      </section>

      <section className="text-center md:text-left">
        <h2 className="text-xl font-bold mb-2">Contacto</h2>
        <ul>
          <li className="mb-2">
            <article className="flex items-center space-x-2">
              <Mail />
              <a
                href="mailto:quizgenerateapp@gmail.com"
                className="hover:underline"
              >
                quizgenerateapp@gmail.com
              </a>
            </article>
          </li>
        </ul>
      </section>

      <section className="md:mr-10 text-center md:text-left">
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
                <Instagram /> <p>Instagram</p>
              </article>
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
};
