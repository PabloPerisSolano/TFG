import { CardPagedQuizzes } from "@/components/cards";
import { API_ROUTES } from "@/constants";

export default function MisQuizzes() {
  return (
    <CardPagedQuizzes
      cardTitle="Mis Cuestionarios"
      cardDescription="Aquí puedes ver y gestionar todos tus cuestionarios."
      link={API_ROUTES.USER_QUIZ_LIST_CREATE}
    />
  );
}
