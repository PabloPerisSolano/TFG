import Sidebar from "@/components/Sidebar";

export default function AuthenticatedLayout({ children, title }) {
  return (
    <div className="flex h-screen fixed">
      <Sidebar />
      <div className="panel">
        <h1 className="text-center text-2xl font-bold mb-4">{title}</h1>
        {children}
      </div>
    </div>
  );
}
