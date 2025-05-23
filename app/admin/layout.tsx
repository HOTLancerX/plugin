import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <div className="ml-64 p-8 flex-grow">
        {children}
      </div>
    </div>
  );
}