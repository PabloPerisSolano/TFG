import { useCallback } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_ROUTES } from "@/api/api";
import { AuthContext } from "@/context/auth-context";
import { useFetchWithAuth } from "@/hooks/use-fetch-with-auth";

export default function AuthProvider({ children }) {
  const fetchWithAuth = useFetchWithAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const closeSession = useCallback(() => {
    setUser(null);
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetchWithAuth(API_ROUTES.USER_DETAIL);

      if (!response.ok) {
        closeSession();
        toast.error("Error al cargar usuario");
        return;
      }

      const userData = await response.json();
      setUser(userData);
    };

    fetchUserData();
  }, [fetchWithAuth, closeSession]);

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleLogin = (user) => {
    setUser(user);
    navigate("/quizzes");
  };

  const handleLogout = async () => {
    await fetchWithAuth(API_ROUTES.LOGOUT);
    closeSession();
  };

  return (
    <AuthContext.Provider
      value={{
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
