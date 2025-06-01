import { toast } from "sonner";
import { useAuth } from "@/hooks";

export const useAuthFetch = () => {
  const { closeSession } = useAuth();

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
        toast.warning("Debes estar autenticado para acceder.");
        closeSession();
      }

      return response;
    } catch (error) {
      toast.error(error.message);
      return null;
    }
  };
};
