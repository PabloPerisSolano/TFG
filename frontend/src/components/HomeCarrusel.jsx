import Autoplay from "embla-carousel-autoplay";
import { StepForward } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  Separator,
} from "@/components/ui";

export const HomeCarrusel = ({ items }) => {
  return (
    <Carousel
      className="space-y-5"
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
    >
      <h2 className="text-center text-3xl font-bold">¿Cómo funciona?</h2>

      <Separator className="bg-gray-400" />

      <CarouselContent>
        {items.map((item, idx) => (
          <CarouselItem key={idx} className="space-y-4">
            <article className="flex justify-center space-x-2 items-center">
              <h2 className="sm:text-2xl font-bold">{item.title}</h2>
              <StepForward className="sm:text-2xl" />
            </article>
            <img src={item.img} className="rounded-lg" />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
