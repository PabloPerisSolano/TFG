import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { AuthProvider } from "@/context/auth-context";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "QuizGenerate",
  description: "Generated by create next app",
  icon: "/favico.png",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="es">
        <head>
          <link rel="icon" href="/favicon.png" type="image/png" />
        </head>

        <body className={`${roboto.variable} antialiased`}>
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
              <header className="flex items-center">
                <SidebarTrigger className="ml-2" />
                <Header />
              </header>
              {children}
              <Toaster />
            </main>
          </SidebarProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
