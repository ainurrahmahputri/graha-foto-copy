/*
  Satu-satunya pintu data untuk front end.
  - VITE_API_URL diisi  -> semua fungsi memanggil REST API Express (lihat docs/API.md)
  - VITE_API_URL kosong -> mode demo: data di localStorage (demo.js), tidak butuh backend
*/
import { demoApi } from "./demo.js";

const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

/* ID perangkat pelanggan (tanpa login). Dikirim sebagai header X-Client-Id. */
export function clientId() {
  try {
    let id = localStorage.getItem("gfc_uid");
    if (!id) { id = "c" + Math.random().toString(36).slice(2, 12); localStorage.setItem("gfc_uid", id); }
    return id;
  } catch { return "c" + Math.random().toString(36).slice(2, 12); }
}

let token = null;
try { token = sessionStorage.getItem("gfc_token"); } catch { /* abaikan */ }
export const auth = {
  get on() { return !!token; },
  set(t) { token = t; try { t ? sessionStorage.setItem("gfc_token", t) : sessionStorage.removeItem("gfc_token"); } catch { /* abaikan */ } },
};

async function http(method, path, body, { raw } = {}) {
  const headers = { "X-Client-Id": clientId() };
  if (token) headers.Authorization = "Bearer " + token;
  const init = { method, headers };
  if (body instanceof FormData) init.body = body;
  else if (body !== undefined) { headers["Content-Type"] = "application/json"; init.body = JSON.stringify(body); }
  let res;
  try { res = await fetch(BASE + path, init); }
  catch { throw Object.assign(new Error("Server tidak bisa dihubungi. Cek koneksimu."), { status: 0 }); }
  if (raw && res.ok) return res;
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw Object.assign(new Error(data?.message || "Permintaan gagal (" + res.status + ")"), { status: res.status, data });
  return data;
}

const form = (obj, files = [], field = "files") => {
  const fd = new FormData();
  Object.entries(obj).forEach(([k, v]) => fd.append(k, typeof v === "string" ? v : JSON.stringify(v)));
  files.forEach((f) => fd.append(field, f));
  return fd;
};

const httpApi = {
  isDemo: false,
  login: (username, password) => http("POST", "/auth/login", { username, password }),
  getConfig: () => http("GET", "/config"),
  saveShop: (shop) => http("PUT", "/config", shop),
  setPhoto: (file) => (file ? http("PUT", "/config/photo", form({}, [file], "file")) : http("DELETE", "/config/photo")),
  setQris: (file) => http("PUT", "/config/qris", form({}, [file], "file")),

  /* multipart: field `data` (JSON opsi pesanan + halaman tiap file) dan `files[]` */
  createOrder: (_uid, f, files) =>
    http("POST", "/orders", form({ data: { ...f, files: files.map((x) => ({ name: x.file.name, pages: x.pages })) } }, files.map((x) => x.file))),
  myOrders: () => http("GET", "/orders/mine"),
  /* multipart: `file` (gambar bukti) + `method`. Server menjalankan cek AI. 422 = bukti ditolak AI. */
  sendProof: (code, blob, method) => http("POST", `/orders/${code}/proof`, form({ method }, [new File([blob], "bukti.jpg", { type: "image/jpeg" })], "file")),

  listOrders: () => http("GET", "/orders"),
  updateOrder: (code, patch) => http("PATCH", `/orders/${code}`, patch),
  async fileUrl(code, kind) {
    const path = kind === "proof" ? `/orders/${code}/proof` : `/orders/${code}/files/${kind.slice(1)}`;
    const res = await http("GET", path, undefined, { raw: true });
    const blob = await res.blob();
    return { url: URL.createObjectURL(blob), type: blob.type };
  },

  getInventory: () => http("GET", "/inventory"),
  saveInventory: (items) => http("PUT", "/inventory", { items }),
  listExpenses: () => http("GET", "/finance/expenses"),
  addExpense: (e) => http("POST", "/finance/expenses", e),
  deleteExpense: (id) => http("DELETE", `/finance/expenses/${id}`),
};

export const api = BASE ? httpApi : demoApi;
export const isDemo = !BASE;
