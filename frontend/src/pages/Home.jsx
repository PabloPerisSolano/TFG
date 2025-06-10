import Autoplay from "embla-carousel-autoplay";
import { Play, ArrowBigRightDash, UserPlus, LockOpen } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui";
import { ROUTES } from "@/constants";
import { useAuth } from "@/hooks";

export default function Home() {
  const { user } = useAuth();

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

      <section>
        <Carousel
          className="p-6"
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
        >
          <h2 className="text-center text-2xl font-bold">¿Cómo funciona?</h2>
          <CarouselContent>
            <CarouselItem className="space-y-6">
              <article className="flex justify-center space-x-2 items-center mt-5">
                <h2 className="text-2xl font-bold">
                  Crea cuestionarios tipo test
                </h2>
                <ArrowBigRightDash className="text-2xl" />
              </article>
              <img
                src="/crearQuiz.png"
                alt="Captura de pantalla 3"
                className="rounded-lg shadow-lg"
              />
            </CarouselItem>
            <CarouselItem className="space-y-6">
              <article className="flex justify-center space-x-2 items-center mt-5">
                <h2 className="text-2xl font-bold">Gestiónalo a tu manera</h2>
                <ArrowBigRightDash className="text-2xl" />
              </article>
              <img
                src="/gestionarQuiz.png"
                alt="Captura de pantalla 3"
                className="rounded-lg shadow-lg"
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </section>

      <section className="bg-white py-12 rounded-3xl max-w-3xl mx-auto p-4 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-8">Características</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Creación rápida</CardTitle>
              <CardDescription>
                Crea cuestionarios en minutos con nuestra interfaz intuitiva.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Personalización</CardTitle>
              <CardDescription>
                Personaliza tus quizzes añadiendo preguntas y respuestas.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Evaluacíon</CardTitle>
              <CardDescription>
                Pon a prueba tu conocimiento realizando los cuestionarios.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
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
