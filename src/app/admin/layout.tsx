import type { Metadata } from "next";
import AdminProvider from "@/components/admin/AdminProvider";
import Sidebar from "@/components/admin/Sidebar";

export const metadata: Metadata = {
  title: "Panel Operativo | GARAGE Clothing Boutique",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <Sidebar />
        <div className="md:pl-56">
          <main className="mx-auto max-w-6xl p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </AdminProvider>
  );
}
