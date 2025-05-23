import { Routes, Route } from "react-router-dom";
import MisQuizzes from "./pages/mis-quizzes";
import Layout from "@/components/layout";
import PrivateRoute from "@/components/private-route";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-quizzes" element={<MisQuizzes />} />

        {/* <Route
          path="/privado"
          element={
            <PrivateRoute>
              <div>Contenido privado</div>
            </PrivateRoute>
          }
        ></Route> */}
      </Route>
    </Routes>
  );
}

export default App;
