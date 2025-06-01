import { ArrowDownUp } from "lucide-react";
import { Button, Input } from "@/components/ui";

export const FiltroQuizzes = ({
  searchTerm,
  setSearchTerm,
  sortOrder,
  setSortOrder,
}) => (
  <section className="flex space-x-2 mb-4">
    <Input
      type="text"
      placeholder="Buscar por título..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="bg-white text-gray-800"
    />
    <Button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
      <ArrowDownUp />
      Ordenar {sortOrder === "asc" ? "↓" : "↑"}
    </Button>
  </section>
);
