import { jwtDecode } from "jwt-decode";
import { RefreshCcw, LogOut } from "lucide-react";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_ROUTES } from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const fetchWithAuth = useFetchWithAuth();
  const [user, setUser] = useState(null);
  const [showTimeoutDialog, setShowTimeoutDialog] = useState(false);
  const navigate = useNavigate();
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
    iniciarTimeout(accessToken);
    navigate("/quizzes");
  };

  const closeSession = () => {
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    removeTokens();
    setUser(null);
    navigate("/login");
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
    const adviseDuration = 5 * 60 * 1000;
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
    const response = await fetchWithAuth(API_ROUTES.USER_DETAIL);

    if (!response.ok) {
      closeSession();
      toast.error("Error al cargar usuario");
      return;
    }

    const userData = await response.json();
    setUser(userData);
    iniciarTimeout(accessToken);
  };

  const handleLogout = async () => {
    await fetchWithAuth(API_ROUTES.LOGOUT);
    closeSession();
  };

  const refreshAccessToken = async () => {
    const response = await fetchWithAuth(API_ROUTES.REFRESH);
    if (!response) {
      closeSession();
      return;
    }

    const data = await response.json();
    setTokens(data.access, data.refresh);
    iniciarTimeout(data.access);
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
              <LogOut />
              Cerrar sesión
            </Button>
            <Button
              onClick={() => {
                setShowTimeoutDialog(false);
                refreshAccessToken();
              }}
            >
              <RefreshCcw />
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
