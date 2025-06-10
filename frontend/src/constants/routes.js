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
  RESET_PASSWORD: "/reset-password",

  PUBLIC_QUIZZES: "/public-quizzes",
  PUBLIC_QUIZ_DETAIL_PATH: "/public-quizzes/:quizId",
  PUBLIC_QUIZ_DETAIL: (quizId) => `/public-quizzes/${quizId}`,

  MY_QUIZZES: "/my-quizzes",
  MY_QUIZ_DETAIL_PATH: "/my-quizzes/:quizId",
  MY_QUIZ_DETAIL: (quizId) => `/my-quizzes/${quizId}`,
  CREATE_QUIZ: "/create-quiz",
  GENERATE_QUIZ: "/generate-quiz",

  QUIZ_TAKE: "/quiz-take/:quizId",
  QUIZ_TAKE_PARAM: (quizId) => `/quiz-take/${quizId}`,
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
    path: ROUTES.CREATE_QUIZ,
    name: "Crear Quiz",
    icon: ClipboardPlus,
  },
  {
    path: ROUTES.GENERATE_QUIZ,
    name: "Generar Quiz",
    icon: Sparkles,
  },
];
