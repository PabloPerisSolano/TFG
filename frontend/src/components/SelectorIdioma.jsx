import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

const LANGUAGES = [
  { code: "es", name: "Español" },
  { code: "en", name: "Inglés" },
  { code: "fr", name: "Francés" },
  { code: "de", name: "Alemán" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Portugués" },
  { code: "ca", name: "Catalán" },
  { code: "gl", name: "Gallego" },
  { code: "eu", name: "Euskera" },
];

export const SelectorIdioma = ({ value, onValueChange }) => {
  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Idioma" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Idioma</SelectLabel>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.name}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
