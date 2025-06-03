import { Routes, Route } from "react-router-dom";
import { Layout, PrivateRoute } from "@/components";
import { ROUTES } from "@/config";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import MisQuizzes from "@/pages/MisQuizzes";
import QuizzCreator from "@/pages/QuizzCreator";
import QuizzDetail from "@/pages/QuizzDetail";
import QuizzGenerator from "@/pages/QuizzGenerator";
import Register from "@/pages/Register";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />

        <Route
          path={ROUTES.MY_QUIZZES}
          element={
            <PrivateRoute>
              <MisQuizzes />
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.MY_QUIZZ_DETAIL_PATH}
          element={
            <PrivateRoute>
              <QuizzDetail />
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.CREATE_QUIZZ}
          element={
            <PrivateRoute>
              <QuizzCreator />
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.GENERATE_QUIZZ}
          element={
            <PrivateRoute>
              <QuizzGenerator />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
