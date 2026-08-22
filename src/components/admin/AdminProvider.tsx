"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { DbShape } from "@/lib/types";

type Ctx = {
  db: DbShape | null;
  loading: boolean;
  action: (type: string, payload: Record<string, unknown>) => Promise<boolean>;
};

const AdminContext = createContext<Ctx>({
  db: null,
  loading: true,
  action: async () => false,
});

export function useAdmin() {
  return useContext(AdminContext);
}

export default function AdminProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DbShape | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showError = useCallback((msg: string) => {
    setError(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setError(null), 4000);
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/bootstrap", { cache: "no-store" });
      if (!res.ok) throw new Error("No se pudo cargar los datos");
      setDb((await res.json()) as DbShape);
    } catch (e) {
      showError(e instanceof Error ? e.message : "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 0);
    return () => clearTimeout(t);
  }, [load]);

  const action = useCallback(
    async (type: string, payload: Record<string, unknown>) => {
      try {
        const res = await fetch("/api/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, payload }),
        });
        const data = (await res.json()) as DbShape & { error?: string };
        if (!res.ok) throw new Error(data.error ?? "Error en la operación");
        setDb(data);
        return true;
      } catch (e) {
        showError(e instanceof Error ? e.message : "Error inesperado");
        return false;
      }
    },
    [showError]
  );

  return (
    <AdminContext.Provider value={{ db, loading, action }}>
      {children}
      {error && (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-lg border border-red-500/40 bg-red-950 px-5 py-3 text-sm text-red-200 shadow-xl">
          ⚠️ {error}
        </div>
      )}
    </AdminContext.Provider>
  );
}
