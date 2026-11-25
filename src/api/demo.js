/*
  Backend palsu untuk mode demo: dipakai otomatis kalau VITE_API_URL kosong.
  Bentuk fungsi dan datanya SAMA dengan yang dikembalikan Express (lihat docs/API.md),
  jadi komponen React tidak perlu tahu sedang demo atau live.
  Data tersimpan di localStorage browser ini saja.
*/
import { CFG0, INV0, mergeCfg } from "../lib/config.js";
import { calc, dayLabel, sleep } from "../lib/format.js";
import { readURL, shrinkImage } from "../lib/files.js";

const LS = "gfc_demo_v4";
const ADMIN = { username: "admin", password: "graha2026" };

const load = () => {
  try { return JSON.parse(localStorage.getItem(LS) || "{}"); } catch { return {}; }
};
const db = Object.assign({ shop: null, photo: null, qris: null, orders: [], expenses: [], inventory: null }, load());
const save = () => {
  try { localStorage.setItem(LS, JSON.stringify(db)); } catch { throw new Error("Penyimpanan demo penuh. Hapus data demo atau pakai file lebih kecil."); }
};
const blobKey = (code, k) => `gfc_blob_${code}_${k}`;
const putBlob = (code, k, url) => {
  try { localStorage.setItem(blobKey(code, k), url); } catch { throw new Error("Penyimpanan demo penuh. Pakai file lebih kecil."); }
};
const genCode = () => {
  const d = new Date(), z = (n) => String(n).padStart(2, "0");
  return `GFC-${String(d.getFullYear()).slice(2)}${z(d.getMonth() + 1)}${z(d.getDate())}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
};
const clone = (x) => JSON.parse(JSON.stringify(x));

export const demoApi = {
  isDemo: true,
  async login(username, password) {
    await sleep(150);
    if (username === ADMIN.username && password === ADMIN.password) return { token: "demo-admin" };
    const e = new Error("Nama atau password salah."); e.status = 401; throw e;
  },
  async getConfig() {
    return { shop: mergeCfg(db.shop), photoUrl: db.photo, qrisUrl: db.qris };
  },
  async saveShop(shop) { db.shop = shop; save(); return mergeCfg(shop); },
  async setPhoto(file) {
    db.photo = file ? await readURL(await shrinkImage(file, 800, 0.66)) : null; save();
  },
  async setQris(file) { db.qris = await readURL(await shrinkImage(file, 700, 0.8)); save(); },

  async createOrder(uid, form, files) {
    const cfg = mergeCfg(db.shop), code = genCode();
    const metas = [];
    for (let i = 0; i < files.length; i++) {
      const { file, pages } = files[i];
      let url = await readURL(file), type = file.type || "application/octet-stream";
      if (file.type.startsWith("image/") && file.size > 900000) { url = await readURL(await shrinkImage(file, 2000, 0.85)); type = "image/jpeg"; }
      putBlob(code, `f${i}`, url);
      metas.push({ name: file.name, type, size: file.size, pages });
    }
    const c = calc({ ...form, files: metas }, cfg);
    const o = {
      code, uid, name: form.name.trim(), wa: form.wa.trim(), files: metas,
      color: form.color, size: form.size, sides: form.sides, copies: form.copies, bind: form.bind,
      pickup: form.pickup, pickupLabel: dayLabel(form.pickup === "today" ? 0 : 1), note: form.note,
      pages: c.pages, total: c.total, status: "draft", hasProof: false, createdAt: Date.now(),
    };
    db.orders.push(o); save();
    return clone(o);
  },
  async myOrders(uid) { return clone(db.orders.filter((o) => o.uid === uid).sort((a, b) => b.createdAt - a.createdAt)); },

  /* Demo tidak punya AI: bukti selalu "cek manual". Di Express, AI dijalankan oleh server. */
  async sendProof(code, blob, method) {
    const o = db.orders.find((x) => x.code === code);
    if (!o) throw new Error("Pesanan tidak ditemukan");
    putBlob(code, "proof", await readURL(blob));
    Object.assign(o, {
      status: "menunggu", payMethod: method, paidAt: Date.now(), hasProof: true,
      ai: { manual: true, note: "AI sedang tidak tersedia, jadi admin yang akan cek buktimu." },
    });
    save();
    return clone(o);
  },

  async listOrders() { return clone([...db.orders].sort((a, b) => b.createdAt - a.createdAt)); },
  async updateOrder(code, patch) {
    const o = db.orders.find((x) => x.code === code);
    if (!o) throw new Error("Pesanan tidak ditemukan");
    Object.assign(o, patch); if (patch.status) o[patch.status + "At"] = Date.now();
    save(); return clone(o);
  },
  async fileUrl(code, kind) {
    const data = localStorage.getItem(blobKey(code, kind));
    if (!data) throw new Error("Berkas tidak ada");
    const o = db.orders.find((x) => x.code === code);
    const type = kind === "proof" ? "image/jpeg" : o?.files[+kind.slice(1)]?.type || "";
    /* samakan dengan Express: kembalikan blob URL, bukan data URL */
    return { url: URL.createObjectURL(await (await fetch(data)).blob()), type };
  },

  async getInventory() { return db.inventory || clone(INV0); },
  async saveInventory(items) { db.inventory = items; save(); return items; },
  async listExpenses() { return clone(db.expenses); },
  async addExpense(e) { const x = { id: "e" + Date.now(), ...e }; db.expenses.push(x); save(); return x; },
  async deleteExpense(id) { db.expenses = db.expenses.filter((e) => e.id !== id); save(); },
};

export { CFG0 };
