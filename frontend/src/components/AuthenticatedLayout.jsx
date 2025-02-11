//import Sidebar from "@/components/Sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function AuthenticatedLayout({ children, title }) {
  return (
    <div className="flex">
      <AppSidebar />
      <div>
        <SidebarTrigger />
      </div>
      {/* <div className="panel">
        <h1 className="text-center text-2xl font-bold mb-4">{title}</h1>
        {children}
      </div> */}
    </div>
  );
}
