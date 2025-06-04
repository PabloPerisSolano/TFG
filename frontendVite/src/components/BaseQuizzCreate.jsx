import { SelectorCategoria } from "@/components";
import { Checkbox, Input, Label, Textarea } from "@/components/ui";
import { MAX_QUIZ_TIME, MIN_QUIZ_TIME } from "@/constants";

export const BaseQuizzCreate = ({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  tiempo,
  onTiempoChange,
  publicar,
  onPublicarChange,
  onCategoryChange,
}) => {
  return (
    <div className="space-y-4">
      <article>
        <Label className="font-semibold">Título</Label>
        <Input
          value={title}
          onChange={onTitleChange}
          placeholder="Escribe el título del cuestionario..."
          required
        />
      </article>

      <article>
        <Label className="font-semibold">Descripción</Label>
        <Textarea
          value={description}
          onChange={onDescriptionChange}
          placeholder="Escibe una descripción del cuestionario..."
        />
      </article>

      <section className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <article>
          <Label className="font-semibold">Tiempo límite en minutos</Label>
          <Input
            type="number"
            min={MIN_QUIZ_TIME}
            max={MAX_QUIZ_TIME}
            value={tiempo}
            onChange={onTiempoChange}
          />
        </article>

        <SelectorCategoria onValueChange={onCategoryChange} />

        <article className="flex items-center space-x-2 ">
          <Checkbox checked={publicar} onCheckedChange={onPublicarChange} />
          <Label className="font-semibold">Publicar</Label>
        </article>
      </section>
    </div>
  );
};
