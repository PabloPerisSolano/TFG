import { CardPagedQuizzes } from "@/components/cards";
import { API_ROUTES } from "@/constants";

export default function PublicQuizzes() {
  return (
    <CardPagedQuizzes
      cardTitle="Cuestionarios Públicos"
      cardDescription="Aquí puedes ver todos los cuestionarios públicos."
      link={API_ROUTES.PUBLIC_QUIZ_LIST}
    />
  );
}
