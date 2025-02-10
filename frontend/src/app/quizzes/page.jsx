"use client";

import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import UserQuizzes from "@/components/UserQuizzes";
import { useAuth } from "@/context/AuthContext";

export default function QuizzesPage() {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <p>Por favor, inicia sesión para ver tus cuestionarios.</p>;
  }

  return (
    <AuthenticatedLayout title="Mis Cuestionarios">
      <UserQuizzes user={user} />
    </AuthenticatedLayout>
  );
}
