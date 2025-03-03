import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-white text-center">
        <h1 className="text-5xl font-bold">QuizGenerate</h1>
        <p className="mt-4 text-xl">
          Crea y gestiona tus cuestionarios de manera fácil y rápida
        </p>
        <Button className="mt-6 bg-white text-blue-600 hover:bg-gray-100">
          Comenzar ahora
        </Button>
      </header>

      {/* Carrusel */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">¿Cómo funciona?</h2>
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            <CarouselItem>
              <img
                src="/LogoQuizGenerate.png"
                alt="Captura de pantalla 1"
                className="rounded-lg shadow-lg"
              />
            </CarouselItem>
            <CarouselItem>
              <img
                src="/screenshot2.png"
                alt="Captura de pantalla 2"
                className="rounded-lg shadow-lg"
              />
            </CarouselItem>
            <CarouselItem>
              <img
                src="/screenshot3.png"
                alt="Captura de pantalla 3"
                className="rounded-lg shadow-lg"
              />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Características */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Características
          </h2>
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
                  Personaliza tus quizzes con temas, colores y más.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Comparte fácilmente</CardTitle>
                <CardDescription>
                  Comparte tus quizzes con un enlace o intégralos en tu sitio
                  web.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Llamado a la acción (CTA) */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-white text-center">
        <h2 className="text-4xl font-bold">¿Listo para comenzar?</h2>
        <p className="mt-4 text-xl">
          Regístrate ahora y empieza a crear tus cuestionarios.
        </p>
        <Button className="mt-6 bg-white text-blue-600 hover:bg-gray-100">
          Registrarse
        </Button>
      </section>

      {/* Footer */}
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}
