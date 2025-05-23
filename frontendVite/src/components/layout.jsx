import { Outlet } from "react-router-dom";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function Layout() {
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
}
