"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config/config";
import { jwtDecode } from "jwt-decode";
import { showErrorToast, showServerErrorToast } from "@/utils/toastUtils";
import { FaCheck, FaRedoAlt, FaSignOutAlt } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showTimeoutDialog, setShowTimeoutDialog] = useState(false);
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

    // Avisar 5 minuto antes de que expire
    const adviseDuration = 1 * 60 * 1000;
    const warningTime = timeLeft - adviseDuration;

    if (warningTime > 0) {
      warningTimerRef.current = setTimeout(() => {
        setShowTimeoutDialog(true);
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

      await response.json();

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

      <Dialog open={showTimeoutDialog}>
        <DialogContent
          className="text-black"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Tu sesión expirará en menos de 5 minutos</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                setShowTimeoutDialog(false);
                handleLogout();
              }}
            >
              <FaSignOutAlt />
              Cerrar sesión
            </Button>
            <Button
              onClick={() => {
                setShowTimeoutDialog(false);
                refreshAccessToken();
              }}
            >
              <FaRedoAlt />
              Mantener activa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
