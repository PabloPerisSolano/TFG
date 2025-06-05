const API_BASE = "http://localhost:8000/api/v1/";
const API_BASE_AUTH = `${API_BASE}auth/`;
const API_BASE_USERS = `${API_BASE}users/`;
const API_BASE_QUIZZES = `${API_BASE}quizzes/`;

const API_BASE_QUIZZES_PUBLIC = `${API_BASE_QUIZZES}public/`;
const API_BASE_QUIZZES_ME = `${API_BASE_QUIZZES}me/`;

export const API_ROUTES = {
  // Auth
  REGISTER: `${API_BASE_AUTH}register/`,
  LOGIN: `${API_BASE_AUTH}login/`,
  GOOGLE_LOGIN: `${API_BASE_AUTH}google/`,
  LOGOUT: `${API_BASE_AUTH}logout/`,
  REFRESH: `${API_BASE_AUTH}refresh/`,
  PASSWORD_RESET_REQUEST: `${API_BASE_AUTH}password-reset-request/`,
  PASSWORD_RESET_CONFIRM: `${API_BASE_AUTH}password-reset-confirm/`,

  // Users
  USER_DETAIL: `${API_BASE_USERS}me/`,
  CHANGE_PASSWORD: `${API_BASE_USERS}me/change-password/`,

  // Quizzes - públicos
  PUBLIC_QUIZ_LIST: API_BASE_QUIZZES_PUBLIC,
  PUBLIC_QUIZ_DETAIL: (quiz_id) => `${API_BASE_QUIZZES_PUBLIC}${quiz_id}/`,

  // Quizzes - usuario autenticado
  USER_QUIZ_LIST_CREATE: API_BASE_QUIZZES_ME,
  USER_QUIZ_DETAIL: (quiz_id) => `${API_BASE_QUIZZES_ME}${quiz_id}/`,

  USER_QUIZ_QUESTIONS: (quiz_id) =>
    `${API_BASE_QUIZZES_ME}${quiz_id}/questions/`,
  USER_QUIZ_QUESTION_DETAIL: (quiz_id, question_id) =>
    `${API_BASE_QUIZZES_ME}${quiz_id}/questions/${question_id}/`,

  USER_QUIZ_QUESTION_ANSWERS: (quiz_id, question_id) =>
    `${API_BASE_QUIZZES_ME}${quiz_id}/questions/${question_id}/answers/`,
  USER_QUIZ_QUESTION_ANSWER_DETAIL: (quiz_id, question_id, answer_id) =>
    `${API_BASE_QUIZZES_ME}${quiz_id}/questions/${question_id}/answers/${answer_id}/`,

  QUIZZ_TAKE: (quiz_id) => `${API_BASE_QUIZZES}take/${quiz_id}/`,
  QUIZ_GENERATOR: `${API_BASE_QUIZZES_ME}generator/`,
};
