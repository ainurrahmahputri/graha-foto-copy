export const rp = (n) => "Rp " + Math.round(n || 0).toLocaleString("id-ID");
export const rpk = (n) => "Rp" + Math.round(n).toLocaleString("id-ID");
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export const ST = {
  draft: "Menunggu pembayaran",
  menunggu: "Menunggu konfirmasi",
  dikonfirmasi: "Dikonfirmasi",
  dicetak: "Sedang dicetak",
  siap: "Siap diambil",
  selesai: "Selesai",
  ditolak: "Ditolak",
};
export const FLOW = ["menunggu", "dikonfirmasi", "dicetak", "siap", "selesai"];
export const PAID = ["dikonfirmasi", "dicetak", "siap", "selesai"];

export const dayLabel = (off) =>
  new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", weekday: "long", day: "numeric", month: "long" }).format(
    new Date(Date.now() + off * 864e5)
  );
export const fmtDateTime = (t) =>
  new Date(t).toLocaleString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "medium", timeStyle: "short" });
export const dayKey = (t) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date(t));
export const monthName = (k) =>
  new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(k + "-01T00:00:00Z"));

export function nowWIB() {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  return +p.find((x) => x.type === "hour").value * 60 + +p.find((x) => x.type === "minute").value;
}
export const toMin = (t) => {
  const [h, m] = (t || "0:0").split(":").map(Number);
  return h * 60 + (m || 0);
};
export function isOpen(cfg) {
  if (cfg.mode === "open") return true;
  if (cfg.mode === "closed") return false;
  const n = nowWIB();
  return n >= toMin(cfg.open) && n < toMin(cfg.close);
}
export const hrsText = (cfg) => "Buka " + cfg.open.replace(":", ".") + " – " + cfg.close.replace(":", ".");
export const fmtLeft = (m) => {
  const h = Math.floor(m / 60), mm = m % 60;
  return h > 0 ? `${h} jam ${mm} menit` : `${mm} menit`;
};

/* Hitung total. Backend WAJIB menghitung ulang dengan rumus yang sama. */
export function calc(d, cfg) {
  const pages = d.files.reduce((a, f) => a + (+f.pages || 0), 0);
  const unit = cfg.prices[d.color][d.size];
  const print = pages * d.copies * unit;
  const bind = cfg.prices.bind[d.bind] * d.copies;
  return { pages, unit, print, bind, total: print + bind };
}
export const optLabel = (o) => `${o.color === "bw" ? "Hitam putih" : "Berwarna"} ${o.size}${o.sides === "2" ? ", bolak-balik" : ""}`;
