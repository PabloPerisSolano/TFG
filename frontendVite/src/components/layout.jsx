import { Outlet } from "react-router-dom";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
