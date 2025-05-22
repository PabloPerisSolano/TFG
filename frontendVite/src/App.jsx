import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout";
import PrivateRoute from "@/components/private-route";
import Home from "@/pages/home";
import { Login } from "@/pages/login";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/privado"
          element={
            <PrivateRoute>
              <div>Contenido privado</div>
            </PrivateRoute>
          }
        ></Route>
      </Route>
    </Routes>
  );
}

export default App;
