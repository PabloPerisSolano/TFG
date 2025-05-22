import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useFetchWithAuth = () => {
  const navigate = useNavigate();

  return async (url, options = {}) => {
    const headers = {
      ...(options.headers || {}),
    };

    if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    try {
      const response = await fetch(url, {
        ...options,
        credentials: "include",
        headers,
      });

      if (response.status === 401) {
        toast.error("Debes estar autenticado para acceder.");
        navigate("/login");
        return null;
      }

      return response;
    } catch (error) {
      toast.error(error.message);
      return null;
    }
  };
};
