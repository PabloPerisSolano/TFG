import { LogIn, UserPlus, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { DropdownNavigationMobile } from "@/components";
import { DropdownAvatar } from "@/components/profile";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/components/ui";
import { ROUTES, privateRoutes, publicRoutes } from "@/constants";
import { useAuth } from "@/hooks";

export const Header = () => {
  const { user } = useAuth();
  const excludedPathsInDesktop = [ROUTES.HOME, ROUTES.LOGIN, ROUTES.REGISTER];

  return (
    <div
      style={{ backgroundColor: "var(--rich-black)" }}
      className="p-2 flex justify-between items-center"
    >
      <Link to={ROUTES.HOME}>
        <img
          src="/LogoQuizGenerate.png"
          alt="QuizGenerate Logo"
          width={100}
          className="rounded-md transition-transform duration-200 hover:scale-105 active:scale-95"
        />
      </Link>

      <section className="hidden md:flex gap-20">
        {user
          ? privateRoutes.map((route) => (
              <Link key={route.path} to={route.path}>
                <Button variant="link">
                  <route.icon />
                  {route.name}
                </Button>
              </Link>
            ))
          : publicRoutes
              .filter((route) => !excludedPathsInDesktop.includes(route.path))
              .map((route) => (
                <Link key={route.path} to={route.path}>
                  <Button variant="link">
                    <route.icon />
                    {route.name}
                  </Button>
                </Link>
              ))}
      </section>

      <section className="flex gap-4 items-center">
        {user ? (
          <DropdownAvatar>
            <Avatar className="cursor-pointer">
              <AvatarImage src={user.profile_picture || null} />
              <AvatarFallback>
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownAvatar>
        ) : (
          <div className="hidden md:flex gap-3 items-center">
            <Link to="/login">
              <Button variant="secondary">
                <LogIn />
                Iniciar sesión
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="link">
                <UserPlus />
                Registrarse
              </Button>
            </Link>
          </div>
        )}
        <DropdownNavigationMobile>
          <Menu className="md:hidden text-white size-10" />
        </DropdownNavigationMobile>
      </section>
    </div>
  );
};
