# TFG - Generador de Quizzes

**Trabajo Fin de Grado 2024-25**  
Autor: **Pablo Peris Solano**  
Grado en Ingeniería Informática

![Quiz Generate Logo](assets/LogoQuizGenerate.png)

---

## 📑 Tabla de Contenidos

1. [Descripción](#-descripción)
2. [Características](#-características)
3. [Tecnologías utilizadas](#-tecnologías-utilizadas)
4. [Requisitos previos](#️-requisitos-previos)
5. [Instalación y configuración](#-instalación-y-configuración)
6. [Uso](#-uso)
7. [Estructura del proyecto](#-estructura-del-proyecto)
8. [Contacto](#-contacto)
9. [Licencia](#-licencia)

---

## 📖 Descripción

Este proyecto es una aplicación diseñada para **crear, generar, gestionar y realizar quizzes** de manera eficiente. El objetivo principal es proporcionar una herramienta intuitiva y flexible que permita a los usuarios generar cuestionarios personalizados para diferentes propósitos, como educación, entretenimiento o evaluación.

---

## ✨ Características

- 🔒 **Autenticación segura**: Registro, inicio de sesión y cierre de sesión con soporte para JWT.
- 👤 **Gestión de usuarios**: Actualización de datos personales y subida de fotos de perfil.
- 📝 **Generación de quizzes**: Creación de cuestionarios personalizados con múltiples opciones.
- 🔑 **Restablecimiento de contraseñas**: Envío de correos electrónicos para recuperar contraseñas olvidadas.
- 🖥️ **Interfaz amigable**: Diseño intuitivo para facilitar la experiencia del usuario.
- 🌐 **API RESTful**: Backend desarrollado con Django y Django REST Framework.

---

## 🛠️ Tecnologías utilizadas

### Backend:

- **Django**: Framework principal para el desarrollo del backend.
- **Django REST Framework**: Para la creación de APIs RESTful.
- **Simple JWT**: Manejo de autenticación basada en tokens.
- **SQLite**: Base de datos utilizada en desarrollo (puede cambiarse a PostgreSQL o MySQL en producción).

### Frontend:

- **React**: Framework para la interfaz de usuario.
- **Next.js**: Framework para renderizado del frontend.
- **Tailwind CSS**: Para un diseño moderno y responsivo.

---

## ⚙️ Requisitos previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

- **Python 3.10+**
- **Node.js 16+**
- **npm** o **yarn**
- **Git**

---

## 🚀 Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/TFG.git
cd TFG
```

### 2. Configurar el backend

```bash
python -m venv backend/.venv
source backend/.venv/bin/activate

pip install -r backend/requirements.txt
```

## Crear un archivo .env en backend/ con las siguientes variables:

SECRET_KEY=tu_clave_secreta
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
EMAIL_HOST_USER=tu_email@gmail.com
EMAIL_HOST_PASSWORD=tu_contraseña

```bash
python manage.py migrate
python manage.py runserver
```

### 3. Configurar el frontend

```bash
cd frontend
npm install
npm run dev
```

---

### 📚 Uso

1. Accede al frontend en http://localhost:3000.
2. Regístrate o inicia sesión para comenzar a usar la aplicación.
3. Crea, edita y realiza quizzes desde la interfaz de usuario.

---

### 📂 Estructura del proyecto

TFG/
├── backend/ # Código del backend
│ ├── apps/ # Aplicaciones Django personalizadas
│ │ ├── users/ # Gestión de usuarios (autenticación, perfiles, etc.)
│ │ └── quizzes/ # Lógica relacionada con los quizzes
│ ├── projectTFG/ # Configuración principal de Django (settings, urls, wsgi, etc.)
│ ├── db.sqlite3 # Base de datos SQLite (ignorado en producción)
│ ├── manage.py
│ ├── requirements.txt # Dependencias del backend
│ └── .env # Variables de entorno (ignorado por Git)
├── frontend/ # Código del frontend
│ ├── src/ # Código fuente del frontend
│ │ ├── app/ # Páginas y rutas principales (Next.js)
│ │ ├── components/ # Componentes reutilizables de React
│ │ ├── context/ # Contextos globales (autenticación, etc.)
│ │ ├── lib/ # Utilidades y funciones auxiliares
│ │ ├── public/ # Archivos estáticos (imágenes, íconos, etc.)
│ │ └── styles/ # Archivos CSS y configuración de Tailwind
│ ├── package.json # Dependencias del frontend
│ ├── next.config.js # Configuración de Next.js
│ └── .env.local # Variables de entorno del frontend (ignorado por Git)
├── media/ # Archivos subidos por los usuarios (ignorado por Git)
├── .gitignore # Archivos y carpetas ignorados por Git
├── LICENSE # Licencia del proyecto
└── README.md # Documentación del proyecto

---

### 📧 Contacto

**Si tienes preguntas, sugerencias o problemas, no dudes en contactarme:**

- **Autor**: Pablo Peris Solano
- **Email**: pabloperissolano@gmail.com

---

### 📝 Licencia

Este proyecto de código abierto está licenciado bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
