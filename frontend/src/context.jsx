import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { api, auth, clientId, isDemo } from "./api/client.js";
import { mergeCfg } from "./lib/config.js";
import { ST, calc as calcTotal } from "./lib/format.js";
import { burst, hap } from "./fx/effects.js";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export const DRAFT0 = { files: [], color: "bw", size: "A4", sides: "1", copies: 1, bind: "none", pickup: "today", name: "", wa: "", note: "" };
const NOTIFY = ["dikonfirmasi", "dicetak", "siap", "selesai", "ditolak"];

export function AppProvider({ children }) {
  /* --- toko & tampilan --- */
  const [cfg, setCfg] = useState(() => mergeCfg(null));
  const [photo, setPhoto] = useState(null);
  const [qris, setQris] = useState(null);
  const [view, setView] = useState("splash");
  const [avPick, setAvPick] = useState(null);

  /* --- alur pelanggan --- */
  const [tab, setTab] = useState(1);
  const [draft, setDraft] = useState(DRAFT0);
  const [order, setOrder] = useState(null);
  const [proof, setProof] = useState(null);
  const [payMethod, setPayMethod] = useState("qris");
  const [myOrders, setMyOrders] = useState([]);
  const [flash, setFlash] = useState(() => new Set());

  /* --- toast --- */
  const [toastMsg, setToastMsg] = useState({ text: "", on: false });
  const tt = useRef();
  const toast = useCallback((text) => {
    setToastMsg({ text, on: true });
    clearTimeout(tt.current);
    tt.current = setTimeout(() => setToastMsg((m) => ({ ...m, on: false })), 2800);
  }, []);

  /* --- navigasi --- */
  const go = useCallback((v) => {
    setView(v);
    document.body.dataset.mode = v === "admin" ? "admin" : "cust";
    requestAnimationFrame(() => { const el = document.getElementById(v); if (el) el.scrollTop = 0; window.scrollTo(0, 0); });
  }, []);
  const goTab = useCallback((k) => {
    setTab(k);
    requestAnimationFrame(() => { const el = document.getElementById("app"); if (el) el.scrollTop = 0; });
  }, []);

  /* --- konfigurasi toko (polling ringan) --- */
  const loadConfig = useCallback(async () => {
    try {
      const d = await api.getConfig();
      setCfg(mergeCfg(d.shop)); setPhoto(d.photoUrl || null); setQris(d.qrisUrl || null);
    } catch { /* pakai bawaan */ }
  }, []);
  useEffect(() => { loadConfig(); const t = setInterval(loadConfig, 60000); return () => clearInterval(t); }, [loadConfig]);

  /* --- splash --- */
  useEffect(() => {
    const t = setTimeout(() => go("landing"), 1350);
    return () => clearTimeout(t);
  }, [go]);

  /* --- pesanan milik perangkat ini: dipantau saat layar pelanggan terbuka --- */
  const lastSt = useRef({});
  const mineRef = useRef([]);
  mineRef.current = myOrders;
  const refreshMine = useCallback(async () => {
    try {
      const rows = await api.myOrders(clientId());
      rows.forEach((o) => {
        const p = lastSt.current[o.code];
        if (p !== undefined && p !== o.status && NOTIFY.includes(o.status)) {
          setFlash((s) => new Set(s).add(o.code));
          toast("Status pesananmu: " + ST[o.status]); hap([10, 30, 10]);
          if (o.status === "siap") setTimeout(() => { const c = document.querySelector(`[data-code="${o.code}"] .code`); if (c) burst(c); }, 300);
        }
        lastSt.current[o.code] = o.status;
      });
      setMyOrders(rows);
      setOrder((cur) => (cur ? rows.find((x) => x.code === cur.code) || cur : cur));
    } catch { /* abaikan, coba lagi di polling berikutnya */ }
  }, [toast]);
  useEffect(() => {
    if (view !== "app") return;
    refreshMine();
    const t = setInterval(refreshMine, 5000);
    return () => clearInterval(t);
  }, [view, refreshMine]);

  /* --- draft --- */
  const patchDraft = useCallback((patch, keepOrder) => {
    setDraft((d) => ({ ...d, ...patch }));
    if (!keepOrder) setOrder(null);
  }, []);
  const calc = useMemo(() => calcTotal(draft, cfg), [draft, cfg]);

  /* --- admin --- */
  const [loginOpen, setLoginOpen] = useState(false);
  const [viewer, setViewer] = useState(null); // { title, body } untuk modal berkas/bukti
  const enterAdmin = useCallback(() => go("admin"), [go]);
  const exitAdmin = useCallback(() => { auth.set(null); go("landing"); }, [go]);
  const demoAdmin = useCallback(() => { auth.set("demo-admin"); go("admin"); }, [go]);

  const value = {
    cfg, photo, qris, view, go, loadConfig, avPick, setAvPick, isDemo,
    tab, goTab, draft, patchDraft, setDraft, order, setOrder, proof, setProof, payMethod, setPayMethod,
    myOrders, refreshMine, flash, setFlash, calc,
    toast, toastMsg,
    loginOpen, setLoginOpen, viewer, setViewer, enterAdmin, exitAdmin, demoAdmin,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
