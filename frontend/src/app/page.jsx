"use client";

import HomeAuthenticated from "@/components/HomeAuthenticated";
import HomeUnauthenticated from "@/components/HomeUnauthenticated";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { isLoggedIn, user } = useAuth();

  return (
    <div>
      {isLoggedIn ? <HomeAuthenticated user={user} /> : <HomeUnauthenticated />}
    </div>
  );
}
