"use client";

import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import UserQuizzes from "@/components/UserQuizzes";
import { useAuth } from "@/context/AuthContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function QuizzesPage() {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <p>Por favor, inicia sesión para ver tus cuestionarios.</p>;
  }

  return (
    <p>QuizzesPage</p>
    // <AuthenticatedLayout title="Mis Cuestionarios">
    //   <UserQuizzes user={user} />
    // </AuthenticatedLayout>
  );
}
