"use client";

import { useAuth } from "@/context/auth-context";
import PleaseLogin from "@/components/please-login";

export default function QuizzesPage() {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <PleaseLogin />;
  }

  return <p>QuizzesPage</p>;
}
