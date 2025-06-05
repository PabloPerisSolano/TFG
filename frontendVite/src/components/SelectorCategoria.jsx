import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { CATEGORY_CHOICES } from "@/constants";
import { ANY } from "@/constants";

export const SelectorCategoria = ({
  onValueChange,
  defaultValue,
  isFilter = false,
  valueFilter,
}) => {
  const selectProps = isFilter ? { value: valueFilter } : { defaultValue };

  return (
    <Select onValueChange={onValueChange} {...selectProps}>
      <SelectTrigger className={isFilter ? "w-[260px]" : "w-[181px]"}>
        <SelectValue placeholder="Seleccione Categoría" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categorías</SelectLabel>
          {isFilter && (
            <SelectItem value={ANY}>Todas las categorías</SelectItem>
          )}
          {CATEGORY_CHOICES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
