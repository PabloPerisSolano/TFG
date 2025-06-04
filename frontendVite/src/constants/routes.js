import {
  House,
  LogIn,
  UserPlus,
  ClipboardList,
  ClipboardPlus,
  Sparkles,
  LockOpen,
} from "lucide-react";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  PUBLIC_QUIZZES: "/public-quizzes",
  PUBLIC_QUIZZ_DETAIL_PATH: "/public-quizzes/:quizId",
  PUBLIC_QUIZZ_DETAIL: (quizId) => `/public-quizzes/${quizId}`,

  MY_QUIZZES: "/my-quizzes",
  MY_QUIZZ_DETAIL_PATH: "/my-quizzes/:quizId",
  MY_QUIZZ_DETAIL: (quizId) => `/my-quizzes/${quizId}`,
  CREATE_QUIZZ: "/create-quizz",
  GENERATE_QUIZZ: "/generate-quizz",
};

export const publicRoutes = [
  {
    path: ROUTES.PUBLIC_QUIZZES,
    name: "Quizzes Públicos",
    icon: LockOpen,
  },
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
    path: ROUTES.PUBLIC_QUIZZES,
    name: "Quizzes Públicos",
    icon: LockOpen,
  },
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
