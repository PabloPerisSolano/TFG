import { Routes, Route } from "react-router-dom";
import { Layout, PrivateRoute } from "@/components";
import { ROUTES } from "@/config";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import MisQuizzes from "@/pages/MisQuizzes";
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
      </Route>
    </Routes>
  );
}

export default App;
