import { Search } from "lucide-react";
import { SelectorCategoria } from "@/components";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
} from "@/components/ui";
import { ALL_CATEGORIES } from "@/constants";

export const FiltroQuizzes = ({ isPublicVariant }) => (
  <div className="flex flex-col gap-4 p-4 border rounded-lg shadow-lg">
    <h2 className="text-lg font-bold">Filtrar Quizzes</h2>

    <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <Input
        type="text"
        placeholder="Buscar por título..."
        // value={searchTerm}
        // onChange={(e) => setSearchTerm(e.target.value)}
      />

      <SelectorCategoria
        onValueChange={() => {}}
        defaultValue={ALL_CATEGORIES}
        isFilter={true}
      />

      {!isPublicVariant && (
        <Select defaultValue="public/private" onValueChange={() => {}}>
          <SelectTrigger className="w-[270px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public/private">Públicos y Privados</SelectItem>
            <SelectItem value="public">Públicos</SelectItem>
            <SelectItem value="private">Privados</SelectItem>
          </SelectContent>
        </Select>
      )}
    </section>

    <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <section>
        <Label className="mb-0.5">Ordenar por:</Label>

        <Select defaultValue="noOrder" onValueChange={() => {}}>
          <SelectTrigger className="w-[270px]">
            <SelectValue placeholder="Ordenar por..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="noOrder">No ordenar</SelectItem>
            <SelectItem value="title">Título</SelectItem>
            <SelectItem value="created">Fecha de Creación</SelectItem>
            <SelectItem value="questions">Número de Preguntas</SelectItem>
            <SelectItem value="category">Categoría</SelectItem>
          </SelectContent>
        </Select>
      </section>

      <section>
        <Label className="mb-0.5">Orden:</Label>

        <Select defaultValue="asc" onValueChange={() => {}}>
          <SelectTrigger className="w-[270px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascendente</SelectItem>
            <SelectItem value="desc">Descendente</SelectItem>
          </SelectContent>
        </Select>
      </section>
      <Button>
        <Search />
        Buscar
      </Button>
    </section>
  </div>
);
