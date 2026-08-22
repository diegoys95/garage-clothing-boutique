export function fmtMoney(n: number): string {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "short",
  });
}

export function fmtDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString("es-EC", { day: "2-digit", month: "short" })} ${d.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })}`;
}
