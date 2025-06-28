# TFG - QuizGenerate

### Trabajo Fin de Grado 2024-25

**Grado en Ingeniería Informática**  
**Autor:** Pablo Peris Solano

![Quiz Generate Logo](assets/LogoQuizGenerate.png)

---

## 📑 Tabla de Contenidos

1. [Descripción](#-descripción)
2. [Tecnologías utilizadas](#-tecnologías-utilizadas)
3. [Requisitos previos](#️-requisitos-previos)
4. [Instalación y configuración](#-instalación-y-configuración)
5. [Contacto](#-contacto)
6. [Licencia](#-licencia)

---

## 📖 Descripción

**QuizGenerate** es una aplicación web que permite a los usuarios crear, editar, realizar e incluso generar mediante inteligencia artificial (IA) cuestionarios tipo test. El objetivo principal es proporcionar una herramienta **open source**, intuitiva y flexible para fines educativos.

---

## 🛠️ Tecnologías utilizadas

### Backend:

![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![DRF](https://img.shields.io/badge/DRF-ff1709?style=for-the-badge&logo=django&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Simple JWT](https://img.shields.io/badge/Simple%20JWT-007ec6?style=for-the-badge)
![PyMuPDF](https://img.shields.io/badge/PyMuPDF-3776AB?style=for-the-badge)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

- **Django**: Framework principal para el desarrollo del backend.
- **Django REST Framework**: Creación de API RESTful en Django.
- **SQLite y PostgreSQL**: Bases de datos utilizadas en desarrollo y producción respectivamente.
- **Simple JWT**: Manejo de autenticación basada en tokens (gestionado por Cookies).
- **PyMuPDF**: Procesamiento de documentos PDF.
- **OpenAI**: Generación de cuestionarios tipo test mediante IA.

### Frontend:

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000?style=for-the-badge)
![Sonner](https://img.shields.io/badge/Sonner-000?style=for-the-badge)
![Framer Motion](https://img.shields.io/badge/Motion-0055FF?style=for-the-badge&logo=framer)
![Lucide React](https://img.shields.io/badge/Lucide%20React-000?style=for-the-badge)

- **React**: Librería principal para la interfaz de usuario.
- **Vite**: Herramienta de build y desarrollo ultrarrápida para React.
- **Tailwind CSS**: Para un diseño moderno y responsivo.
- **shadcn/ui**: Componentes de interfaz accesibles y personalizables.
- **Sonner**: Notificaciones toast (flotantes) modernas.
- **Motion**: Animaciones fluidas para React, utilizadas en la realización de los cuestionarios.
- **Lucide React**: Iconos SVG para React.

---

## ⚙️ Requisitos previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas, utilizados para ejecutar los comandos de la instalación:

- **Git**
- **Python**
- **Node.js (npm)**

---

## 🚀 Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/PabloPerisSolano/TFG.git
```

### 2. Configuración del Backend

#### 2.1 Crear entorno virtual y descargar dependencias

```bash
cd TFG/backend

python -m venv .venv
source .venv/bin/activate

pip install -r requirements-dev.txt
```

#### 2.2 Configurar variables de entorno

Crea un archivo `.env` en con las siguientes variables:

```env
SECRET_KEY="tu_clave_secreta"
AI_API_KEY="tu_clave_motor_IA"
```

#### 2.3 Inicia el servidor

```bash
python manage.py migrate
python manage.py runserver
```

El backend estará disponible en la siguiente dirección:
`http://localhost:8000/api/v1/`

### 3. Configuración del frontend

```bash
cd TFG/frontend
npm install
npm run dev
```

El frontend estará disponible en la siguiente dirección:
`http://localhost:5173`

---

### 📧 Contacto

**Si tienes preguntas, sugerencias o problemas, no dudes en contactarme:**

- **Autor**: Pablo Peris Solano
- **Email**: pabloperissolano@gmail.com

---

### 📝 Licencia

Este proyecto de código abierto está licenciado bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
