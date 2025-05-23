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
    navigate("/login");
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleLogin = (user) => {
    setUser(user);
    navigate("/my-quizzes");
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
