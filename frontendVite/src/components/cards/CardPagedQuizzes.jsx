import { LoaderCircle, CircleAlert } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CardQuizz } from "@/components/cards";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui";
import { useAuthFetch } from "@/hooks";

export const CardPagedQuizzes = ({ cardTitle, cardDescription, link }) => {
  const fetchWithAuth = useAuthFetch();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);

      const res = await fetchWithAuth(
        `${link}?page=${currentPage}&page_size=${itemsPerPage}`
      );

      if (!res.ok) {
        toast.error("Error al obtener los cuestionarios");
        setLoading(false);
        return;
      }

      const data = await res.json();

      setItems(data.results || []);
      setTotalItems(data.count || 0);

      setLoading(false);
    };

    fetchItems();
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Cambiar de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Cambiar tamaño de página
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) pages.push(1);
      if (startPage > 2) pages.push("...");

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) pages.push("...");
      if (endPage < totalPages) pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-lg sm:text-3xl">
          {cardTitle}
        </CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
        <CardAction>
          <Select value={itemsPerPage} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Nº Resultados" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Mostrar Resultados</SelectLabel>
                <SelectItem value={4}>4 Resultados</SelectItem>
                <SelectItem value={12}>12 Resultados</SelectItem>
                <SelectItem value={24}>24 Resultados</SelectItem>
                <SelectItem value={36}>36 Resultados</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center">
            <LoaderCircle className="animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex justify-center gap-2 items-center">
            <CircleAlert />
            <p className="font-bold">No se han encontrado resultados.</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((quiz) => (
              <CardQuizz key={quiz.id} quiz={quiz} />
            ))}
          </section>
        )}
      </CardContent>
      {totalPages > 1 && (
        <CardFooter>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <span className="px-2">...</span>
                  ) : (
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      )}
    </Card>
  );
};
