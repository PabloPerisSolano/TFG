import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { CATEGORY_CHOICES, ALL_CATEGORIES } from "@/constants";

export const SelectorCategoria = ({
  onValueChange,
  defaultValue,
  isFilter = false,
}) => {
  return (
    <Select defaultValue={defaultValue} onValueChange={onValueChange}>
      <SelectTrigger className={isFilter ? "w-[270px]" : "w-[181px]"}>
        <SelectValue placeholder="Seleccione Categoría" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categorías</SelectLabel>
          {isFilter && (
            <SelectItem value={ALL_CATEGORIES}>Todas las categorías</SelectItem>
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
