import { Routes, Route } from "react-router-dom";
import { Layout, PrivateRoute } from "@/components";
import { ROUTES } from "@/constants";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import MisQuizzes from "@/pages/MisQuizzes";
import PublicQuizzes from "@/pages/PublicQuizzes";
import QuizCreator from "@/pages/QuizCreator";
import QuizDetail from "@/pages/QuizDetail";
import QuizGenerator from "@/pages/QuizGenerator";
import QuizTake from "@/pages/QuizTake";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
        <Route path={ROUTES.PUBLIC_QUIZZES} element={<PublicQuizzes />} />
        <Route path={ROUTES.QUIZ_TAKE} element={<QuizTake />} />

        <Route
          path={ROUTES.MY_QUIZZES}
          element={
            <PrivateRoute>
              <MisQuizzes />
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.MY_QUIZ_DETAIL_PATH}
          element={
            <PrivateRoute>
              <QuizDetail />
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.CREATE_QUIZ}
          element={
            <PrivateRoute>
              <QuizCreator />
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.GENERATE_QUIZ}
          element={
            <PrivateRoute>
              <QuizGenerator />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
