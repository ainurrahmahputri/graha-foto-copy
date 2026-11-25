import { useEffect, useState } from "react";

/* Memicu render ulang tiap `ms` supaya status buka/tutup ikut berubah. */
export function useNow(ms = 20000) {
  const [t, setT] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => setT(Date.now()), ms); return () => clearInterval(i); }, [ms]);
  return t;
}
