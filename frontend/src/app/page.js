"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/Header";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setIsLoggedIn(true);
      // Aquí puedes hacer una solicitud para obtener los datos del usuario si es necesario
      // Por ejemplo:
      // fetchUserData(accessToken).then(userData => setUser(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main className="p-4">
        {isLoggedIn ? (
          <div>
            <h2>Bienvenido, {user ? user.username : "Usuario"}</h2>
            <p>Esta es tu página de inicio personalizada.</p>
          </div>
        ) : (
          <div>
            <h2>Bienvenido a Mi Aplicación</h2>
            <p>Por favor, inicia sesión o regístrate para continuar.</p>
          </div>
        )}
      </main>
    </div>
  );
}
