import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { publicRoutes, privateRoutes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";

export default function DropdownNavigationMobile({ children }) {
  const { user } = useAuth();
  const routes = user ? privateRoutes : publicRoutes;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {routes.map((route) => (
          <Link key={route.path} to={route.path}>
            <DropdownMenuItem>
              <route.icon />
              {route.name}
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
