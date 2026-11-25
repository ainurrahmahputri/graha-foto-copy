import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../api/client.js";
import { useApp } from "../../context.jsx";
import { hap, flick } from "../../fx/effects.js";
import Logo from "../ui/Logo.jsx";
import { AIcon } from "./icons.jsx";
import OrdersTab from "./OrdersTab.jsx";
import MoneyTab from "./MoneyTab.jsx";
import ItemsTab from "./ItemsTab.jsx";
import SettingsTab from "./SettingsTab.jsx";

const TABS = [["orders", "Pesanan"], ["money", "Keuangan"], ["items", "Item & Stok"], ["set", "Pengaturan"]];

export default function Admin() {
  const { cfg, view, exitAdmin, toast } = useApp();
  const on = view === "admin";
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState("");
  const [exp, setExp] = useState([]);
  const [inv, setInv] = useState(null);
  const [newRows, setNewRows] = useState(() => new Set());
  const pane = useRef(null), ordBtn = useRef(null);
  const t0 = useRef(0), seen = useRef(new Set()), stat = useRef({});

  const refreshOrders = useCallback(async () => {
    try { setOrders(await api.listOrders()); setErr(""); }
    catch (e) { setErr(e.status ? String(e.status) : e.message); }
  }, []);
  const refreshExp = useCallback(async () => { try { setExp(await api.listExpenses()); } catch { /* abaikan */ } }, []);

  /* data dipantau (polling) selama dashboard terbuka */
  useEffect(() => {
    if (!on) return;
    t0.current = performance.now(); seen.current = new Set(); stat.current = {};
    refreshOrders(); refreshExp(); api.getInventory().then(setInv).catch(() => {});
    const t = setInterval(refreshOrders, 4000);
    return () => clearInterval(t);
  }, [on, refreshOrders, refreshExp]);

  /* pesanan baru / status berubah: baris berkedip, toast, tombol Pesanan bergoyang */
  useEffect(() => {
    if (!on) return;
    const warm = performance.now() - t0.current < 1600, fresh = [], changed = [];
    orders.forEach((o) => {
      if (o.status === "draft") { stat.current[o.code] = o.status; return; }
      if (!seen.current.has(o.code)) { seen.current.add(o.code); if (!warm) fresh.push(o); }
      else if (stat.current[o.code] !== o.status && !warm) changed.push(o.code);
      stat.current[o.code] = o.status;
    });
    const hl = [...fresh.map((o) => o.code), ...changed];
    if (hl.length) { setNewRows(new Set(hl)); setTimeout(() => setNewRows(new Set()), 3000); }
    if (fresh.length) { toast("Pesanan baru dari " + fresh.map((o) => o.name).join(", ")); hap([20, 40, 20]); flick(ordBtn.current, "wig", 600); }
  }, [orders, on, toast]);

  /* animasi masuk tiap ganti menu */
  useEffect(() => {
    if (!on || !pane.current) return;
    const p = pane.current;
    p.classList.remove("aenter"); void p.offsetWidth; p.classList.add("aenter");
    const t = setTimeout(() => p.classList.remove("aenter"), 1300);
    return () => clearTimeout(t);
  }, [tab, on]);

  const pend = orders.filter((o) => o.status === "menunggu").length;

  return (
    <section id="admin" className={"view" + (on ? " on" : "")}>
      <div className="adm">
        <aside className="side">
          <div className="sbrand"><Logo /><div><b>{cfg.name}</b><small>Dashboard admin</small></div></div>
          <nav id="atabs">
            {TABS.map(([k, l]) => (
              <button key={k} ref={k === "orders" ? ordBtn : null} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>
                <AIcon k={k} /><span>{l}{k === "orders" && pend ? ` (${pend})` : ""}</span>
              </button>
            ))}
          </nav>
          <div className="sp" />
          <button className="out" id="aOut" onClick={exitAdmin}><AIcon k="out" /><span>Keluar</span></button>
        </aside>
        <main className="amain" id="apane" ref={pane}>
          {tab === "orders" && <OrdersTab orders={orders} err={err} refresh={refreshOrders} newRows={newRows} />}
          {tab === "money" && <MoneyTab orders={orders} exp={exp} refreshExp={refreshExp} />}
          {tab === "items" && <ItemsTab inv={inv} setInv={setInv} />}
          {tab === "set" && <SettingsTab />}
        </main>
      </div>
    </section>
  );
}
