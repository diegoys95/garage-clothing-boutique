import type { Metadata } from "next";
import AdminProvider from "@/components/admin/AdminProvider";
import VentasSidebar from "@/components/ventas/VentasSidebar";
import AmbientMusic from "@/components/ventas/AmbientMusic";

export const metadata: Metadata = {
  title: "App Operativa de Ventas | GARAGE",
};

export default function VentasLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <VentasSidebar />
        <AmbientMusic />
        <div className="md:pl-56">
          <main className="mx-auto max-w-6xl p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </AdminProvider>
  );
}
