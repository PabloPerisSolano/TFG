"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config/config";
import { showErrorToast } from "@/utils/toastUtils";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}users/me/`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        setIsLoggedIn(true);
        setUser(userData);
      } else {
        handleLogout();
      }
    } catch (error) {
      handleLogout();
      showErrorToast({
        title: "Error de servidor",
        description: error.message || error.toString(),
      });
    }
  };

  const handleLogin = () => {
    fetchUserData();
    router.push("/quizzes");
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}users/logout/`, {
        method: "POST",
        credentials: "include",
      });

      setIsLoggedIn(false);
      setUser(null);
      router.push("/");
    } catch (error) {
      showErrorToast({
        title: "Error de servidor",
        description: error.message || error.toString(),
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
