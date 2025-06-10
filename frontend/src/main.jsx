import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { Toaster } from "@/components/ui";
import { AuthProvider } from "@/context";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster richColors theme="light" closeButton />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
