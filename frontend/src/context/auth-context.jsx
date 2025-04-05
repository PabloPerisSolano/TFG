"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config/config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchUserData(accessToken);
    }
  }, []);

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const removeTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const handleLogin = (accessToken, refreshToken, user) => {
    setTokens(accessToken, refreshToken);
    setUser(user);
    setIsLoggedIn(true);
    router.push("/quizzes");
  };

  const closeSession = () => {
    removeTokens();
    setIsLoggedIn(false);
    setUser(null);
    router.push("/login");
  };

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}users/me/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setIsLoggedIn(true);
        setUser(userData);
      } else {
        closeSession();
      }
    } catch (error) {
      closeSession();
    }
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");
    if (!refreshToken || !accessToken) return;

    try {
      const response = await fetch(`${API_BASE_URL}auth/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      closeSession();
    } catch (error) {
      closeSession();
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return;

    try {
      const response = await fetch(`${API_BASE_URL}auth/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setTokens(data.access, data.refresh);
      } else {
        closeSession();
      }
    } catch (error) {
      closeSession();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        handleLogin,
        handleLogout,
        updateUser,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
