import { Outlet } from "react-router-dom";
import { Header, Footer } from "@/components";

export const Layout = () => {
  return (
    <div>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto p-4 max-w-6xl">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};
