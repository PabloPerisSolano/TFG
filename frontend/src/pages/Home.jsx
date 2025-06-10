import { Play, UserPlus, LockOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { HomeCarrusel, HomeCaracteristicas } from "@/components";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants";
import { useAuth } from "@/hooks";

export default function Home() {
  const { user } = useAuth();
  const carouselItems = [
    {
      title: "Crea cuestionarios tipo test",
      img: "/crearQuiz.png",
    },
    { title: "También puedes generarlos con IA", img: "/generarQuizIA.png" },
    {
      title: "Pon a prueba tu conocimiento realizando los cuestionarios",
      img: "/quizTake.png",
    },
    { title: "Gestiona tus quizzes", img: "/misQuizzes.png" },
    {
      title: "Explora también quizzes públicos creados por la comunidad",
      img: "/publicQuizzes.png",
    },
  ];

  const caracteristicasItems = [
    {
      title: "Creación rápida",
      description:
        "Crea o genera cuestionarios en segundos con nuestra interfaz intuitiva.",
    },
    {
      title: "Personalización",
      description: "Personaliza tus quizzes añadiendo preguntas y respuestas.",
    },
    {
      title: "Evaluación",
      description: "Pon a prueba tu conocimiento realizando los cuestionarios.",
    },
  ];

  return (
    <div className="space-y-10">
      <section className="text-center space-y-6 bg-white  p-6 max-w-3xl mx-auto rounded-3xl shadow-2xl">
        <article className="flex items-center space-x-2 justify-center">
          <img
            src="/favicon.png"
            alt="QuizGenerate Logo"
            width={60}
            className="rounded-md"
          />
          <h1 className="text-4xl md:text-5xl font-bold">QuizGenerate</h1>
        </article>
        <p className="text-xl">
          Crea, gestiona y realiza cuestionarios de manera fácil y rápida
        </p>
        <article className="flex flex-col md:flex-row justify-center gap-6">
          <Link to={user ? ROUTES.MY_QUIZZES : ROUTES.LOGIN}>
            <Button>
              <Play />
              Comenzar ahora
            </Button>
          </Link>

          <Link to={ROUTES.PUBLIC_QUIZZES}>
            <Button>
              <LockOpen />
              Ver Quizzes Públicos
            </Button>
          </Link>
        </article>
      </section>

      <section className="p-6 shadow-3xl bg-secondary rounded-3xl">
        <HomeCarrusel items={carouselItems} />
      </section>

      <section className="bg-white mx-auto py-8 px-4 rounded-3xl max-w-3xl shadow-2xl space-y-4">
        <h2 className="text-3xl font-bold text-center">Características</h2>
        <HomeCaracteristicas items={caracteristicasItems} />
      </section>

      {!user && (
        <section className="text-center">
          <h2 className="text-4xl font-bold">¿Listo para comenzar?</h2>
          <p className="mt-4 text-xl">
            Regístrate ahora y empieza a crear tus cuestionarios.
          </p>
          <Link to={ROUTES.REGISTER}>
            <Button className="mt-6">
              <UserPlus />
              Registrarse
            </Button>
          </Link>
        </section>
      )}
    </div>
  );
}
