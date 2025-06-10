import { Search, BrushCleaning } from "lucide-react";
import { useState } from "react";
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
import { ANY, INITIAL_QUIZ_FILTERS } from "@/constants";

export const FiltroQuizzes = ({ isPublicVariant, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(INITIAL_QUIZ_FILTERS);

  const handleChange = (field, value) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleLimpiarFiltros = () => {
    setLocalFilters(INITIAL_QUIZ_FILTERS);
    onFilterChange(INITIAL_QUIZ_FILTERS);
  };

  const handleBuscar = () => {
    onFilterChange(localFilters);
  };

  return (
    <div className="flex flex-col gap-5 p-4 border rounded-lg shadow-lg">
      <h2 className="text-lg font-bold">Filtrar Quizzes</h2>

      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Input
          type="text"
          placeholder="Buscar por título..."
          value={localFilters.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        <SelectorCategoria
          onValueChange={(value) => handleChange("category", value)}
          isFilter={true}
          valueFilter={localFilters.category}
        />

        {!isPublicVariant && (
          <Select
            value={localFilters.public}
            onValueChange={(value) => handleChange("public", value)}
          >
            <SelectTrigger className="w-[260px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>Públicos y Privados</SelectItem>
              <SelectItem value={true}>Públicos</SelectItem>
              <SelectItem value={false}>Privados</SelectItem>
            </SelectContent>
          </Select>
        )}
      </section>

      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <article>
          <Label className="mb-0.5">Ordenar por:</Label>

          <Select
            value={localFilters.sort_by}
            onValueChange={(value) => handleChange("sort_by", value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Ordenar por..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Fecha de Creación</SelectItem>
              <SelectItem value="questions">Número de Preguntas</SelectItem>
              <SelectItem value="title">Título</SelectItem>
              <SelectItem value="category">Categoría</SelectItem>
            </SelectContent>
          </Select>
        </article>

        <article>
          <Label className="mb-0.5">Orden:</Label>

          <Select
            value={localFilters.sort_order}
            onValueChange={(value) => handleChange("sort_order", value)}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descendente</SelectItem>
              <SelectItem value="asc">Ascendente</SelectItem>
            </SelectContent>
          </Select>
        </article>

        <article className="mt-4 flex flex-col sm:flex-row gap-3">
          <Button variant="destructive" onClick={handleLimpiarFiltros}>
            <BrushCleaning />
            Limpiar Filtros
          </Button>

          <Button onClick={handleBuscar}>
            <Search />
            Buscar
          </Button>
        </article>
      </section>
    </div>
  );
};
