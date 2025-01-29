import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

export default function Header({ isLoggedIn, onLogout }) {
    return (
        <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <h1 className="text-xl">QuizGenerate</h1>
            <div>
                {isLoggedIn ? (
                    <>
                        <span className="mr-4">Bienvenido, Usuario</span>
                        <button onClick={onLogout} className="p-2 bg-red-500 rounded">Cerrar Sesión</button>
                    </>
                ) : (
                    <>
                        <Button asChild>
                            <Link href="/login">Iniciar Sesión</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/register">Registrarse</Link>
                        </Button>
                    </>
                )}
            </div>
        </header>
    );
}