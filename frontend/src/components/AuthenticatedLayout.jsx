import Sidebar from "@/components/Sidebar";

export default function AuthenticatedLayout({ children }) {
  return (
    <div className="flex h-screen fixed">
      <Sidebar />
      <div>{children}</div>
    </div>
  );
}
