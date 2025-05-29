import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_ROUTES } from "@/config/api";
import { ROUTES } from "@/config/routes";
import { AuthContext } from "@/context/AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(API_ROUTES.USER_DETAIL, {
          credentials: "include",
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        toast.error(error.message);
        setUser(null);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(API_ROUTES.LOGOUT, {
        credentials: "include",
        method: "POST",
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      closeSession();
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleLogin = (user) => {
    setUser(user);
    navigate(ROUTES.MY_QUIZZES);
  };

  const closeSession = () => {
    setUser(null);
    navigate(ROUTES.HOME);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser,
        handleLogin,
        handleLogout,
        closeSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
