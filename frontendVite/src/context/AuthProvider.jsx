import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_ROUTES } from "@/config/api";
import { ROUTES } from "@/config/routes";
import { AuthContext } from "@/context/AuthContext";
import { useAuthFetch } from "@/hooks/useAuthFetch";

export default function AuthProvider({ children }) {
  const fetchWithAuth = useAuthFetch();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
  }, []);

  const handleLogout = async () => {
    await fetchWithAuth(API_ROUTES.LOGOUT);
    closeSession();
  };

  const closeSession = () => {
    setUser(null);
    navigate(ROUTES.LOGIN);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleLogin = (user) => {
    setUser(user);
    navigate(ROUTES.MY_QUIZZES);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
