"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config/config";
import { jwtDecode } from "jwt-decode";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { showErrorToast, showServerErrorToast } from "@/utils/toastUtils";
import { FaCheck } from "react-icons/fa";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const warningTimerRef = useRef(null);
  const logoutTimerRef = useRef(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      if (isTokenValid(accessToken)) {
        fetchUserData(accessToken);
      }
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
    iniciarTimeout(accessToken);
    router.push("/quizzes");
  };

  const closeSession = () => {
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    removeTokens();
    setIsLoggedIn(false);
    setUser(null);
    router.push("/login");
  };

  const isTokenValid = (token) => {
    const decoded = jwtDecode(token);
    const expirationTime = decoded.exp * 1000;
    return expirationTime > Date.now();
  };

  const iniciarTimeout = (accessToken) => {
    // Limpiar temporizadores anteriores
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    // Decodificar token para obtener tiempo de expiración
    const decoded = jwtDecode(accessToken);
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const timeLeft = expirationTime - currentTime;

    // Avisar 1 minuto antes de que expire
    const adviseDuration = 60 * 1000;
    const warningTime = timeLeft - adviseDuration;

    if (warningTime > 0) {
      warningTimerRef.current = setTimeout(() => {
        toast({
          title: "Tu sesión expira pronto",
          description:
            "Expira en " +
            adviseDuration / 1000 +
            " segundos. ¿Deseas mantenerla?",
          duration: adviseDuration,
          action: (
            <ToastAction altText="Mantener Sesión" onClick={refreshAccessToken}>
              <div className="flex items-center space-x-2">
                <FaCheck />
                <span>Mantener Sesión</span>
              </div>
            </ToastAction>
          ),
        });
      }, warningTime);
    }

    // Cerrar sesión cuando expire el token
    logoutTimerRef.current = setTimeout(() => {
      closeSession();
    }, timeLeft);
  };

  const fetchUserData = async (accessToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}users/me/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setIsLoggedIn(true);
        setUser(userData);
        iniciarTimeout(accessToken);
      } else {
        closeSession();
        showErrorToast({
          title: "Error al cargar usuario",
          description: "No se pudo cargar la información del usuario.",
        });
      }
    } catch (error) {
      closeSession();
      showServerErrorToast();
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
        iniciarTimeout(data.access);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
