"use client";

import React, { useState } from 'react';
import Header from '../components/Header';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main className="p-4">
        {isLoggedIn ? (
          <div>
            <h2>Bienvenido, Usuario</h2>
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