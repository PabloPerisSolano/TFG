import {
  House,
  LogIn,
  UserPlus,
  ClipboardList,
  ClipboardPlus,
  Sparkles,
} from "lucide-react";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  MY_QUIZZES: "/my-quizzes",
  CREATE_QUIZZ: "/create-quizz",
  GENERATE_QUIZZ: "/generate-quizz",
};

export const publicRoutes = [
  {
    path: ROUTES.HOME,
    name: "Inicio",
    icon: House,
  },
  {
    path: ROUTES.LOGIN,
    name: "Iniciar sesión",
    icon: LogIn,
  },
  {
    path: ROUTES.REGISTER,
    name: "Registrarse",
    icon: UserPlus,
  },
];

export const privateRoutes = [
  {
    path: ROUTES.MY_QUIZZES,
    name: "Mis Quizzes",
    icon: ClipboardList,
  },
  {
    path: ROUTES.CREATE_QUIZZ,
    name: "Crear Quizz",
    icon: ClipboardPlus,
  },
  {
    path: ROUTES.GENERATE_QUIZZ,
    name: "Generar Quizz",
    icon: Sparkles,
  },
];
