import { Outlet } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const Layout = () => {
  return (
    <div>
      <div className="min-h-screen">
        <Header />
        <main className="p-4">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};
