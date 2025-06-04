import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CardPagedQuizzes } from "@/components/cards";
import { API_ROUTES } from "@/constants";
import { useAuthFetch } from "@/hooks";

export default function MisQuizzes() {
  const fetchWithAuth = useAuthFetch();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);

      const res = await fetchWithAuth(
        `${API_ROUTES.USER_QUIZ_LIST_CREATE}?page=${currentPage}&page_size=${itemsPerPage}`
      );

      if (!res.ok) {
        toast.error("Error al obtener los cuestionarios");
        setLoading(false);
        return;
      }

      const data = await res.json();

      setQuizzes(data.results || []);
      setTotalQuizzes(data.count || 0);

      setLoading(false);
    };

    fetchQuizzes();
  }, [currentPage, itemsPerPage]);

  return (
    <CardPagedQuizzes
      cardTitle="Mis Cuestionarios"
      cardDescription="Aquí puedes ver y gestionar todos tus cuestionarios."
      quizzes={quizzes}
      loading={loading}
      totalItems={totalQuizzes}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      onPageChange={(page) => setCurrentPage(page)}
      onItemsPerPageChange={(items) => setItemsPerPage(items)}
    />
  );
}
