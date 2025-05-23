import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ROUTES } from "@/config/routes";

export const useAuthFetch = () => {
  const navigate = useNavigate();

  return async (url, options = {}) => {
    const headers = {
      ...(options.headers || {}),
    };

    if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
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
        navigate(ROUTES.LOGIN);
      }

      return response;
    } catch (error) {
      toast.error(error.message);
      return null;
    }
  };
};
