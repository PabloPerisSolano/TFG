export const GOOGLE_CLIENT_OAUTH2 =
  "672192043879-eij608ek676727jq4u600iq0td32nsrh.apps.googleusercontent.com";

export const MIN_QUIZ_TIME = 1; // Minutos
export const MAX_QUIZ_TIME = 120; // Minutos

export const ANY = "any";

export const CATEGORY_CHOICES = [
  { value: "SCIENCE", label: "Ciencia" },
  { value: "GEOGRAPHY", label: "Geografía" },
  { value: "HISTORY", label: "Historia" },
  { value: "SPORTS", label: "Deportes" },
  { value: "MUSIC", label: "Música" },
  { value: "ART", label: "Arte" },
  { value: "TECH", label: "Tecnología" },
  { value: "LANGUAGE", label: "Idiomas" },
  { value: "LITERATURE", label: "Literatura" },
  { value: "MATH", label: "Matemáticas" },
  { value: "CINEMA", label: "Cine/TV" },
  { value: "HEALTH", label: "Salud/Bienestar" },
  { value: "OTHER", label: "Otros" },
];

export const INITIAL_QUIZ_FILTERS = {
  title: "",
  category: ANY,
  public: ANY,
  sort_by: "created",
  sort_order: "desc",
};
