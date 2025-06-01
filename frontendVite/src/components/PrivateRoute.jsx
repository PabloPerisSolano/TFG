import { LoaderCircle } from "lucide-react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/config";
import { useAuth } from "@/hooks";

export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  if (!user) return <Navigate to={ROUTES.LOGIN} />;
  return children;
};
