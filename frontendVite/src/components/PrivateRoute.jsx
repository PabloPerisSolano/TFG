import { Navigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";

export default function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to={ROUTES.LOGIN} />;
  return children;
}
