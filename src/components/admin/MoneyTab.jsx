import { useState } from "react";
import { api } from "../../api/client.js";
import { useApp } from "../../context.jsx";
import { PAID, dayKey, monthName, rp } from "../../lib/format.js";
import { Num } from "../../fx/useCountUp.js";
import { Lv } from "./Head.jsx";

const MNAME = { qris: "QRIS", ewallet: "E-Wallet", bank: "Transfer bank", lainnya: "Lainnya" };

export default function MoneyTab({ orders, exp, refreshExp }) {
  const { toast } = useApp();
  const today = dayKey(Date.now());
  const [mon, setMon] = useState(today.slice(0, 7));
  const [f, setF] = useState({ d: today, n: "", a: "" });

  const paid = orders.filter((o) => PAID.includes(o.status));
  const om = (fn) => paid.filter(fn).reduce((s, o) => s + o.total, 0);
  const ex = (fn) => exp.filter(fn).reduce((s, e) => s + e.amt, 0);
  const od = om((o) => dayKey(o.createdAt) === today), ed = ex((e) => e.d === today);
  const omM = om((o) => dayKey(o.createdAt).startsWith(mon)), exM = ex((e) => e.d.startsWith(mon));
  const days = [...Array(14)].map((_, i) => { const k = dayKey(Date.now() - (13 - i) * 864e5); return { v: om((o) => dayKey(o.createdAt) === k), l: k.slice(8) }; });
  const mx = Math.max(1, ...days.map((d) => d.v));

  const dm = {};
  paid.filter((o) => dayKey(o.createdAt).startsWith(mon)).forEach((o) => { const k = dayKey(o.createdAt); (dm[k] = dm[k] || { n: 0, o: 0, e: 0 }); dm[k].n++; dm[k].o += o.total; });
  exp.filter((e) => e.d.startsWith(mon)).forEach((e) => { (dm[e.d] = dm[e.d] || { n: 0, o: 0, e: 0 }); dm[e.d].e += e.amt; });
  const dRows = Object.keys(dm).sort().reverse();
  const [cy, cm] = today.split("-").map(Number);
  const months = [...Array(6)].map((_, i) => { const d = new Date(Date.UTC(cy, cm - 1 - i, 1)); return d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0"); });
  const by = {};
  paid.filter((o) => dayKey(o.createdAt).startsWith(mon)).forEach((o) => { const k = o.payMethod || "lainnya"; by[k] = (by[k] || 0) + o.total; });
  const tot = omM || 1;

  const add = async () => {
    const n = f.n.trim(), a = +f.a;
    if (!n || !(a > 0)) return toast("Isi keterangan dan jumlah");
    try { await api.addExpense({ d: f.d || today, n, amt: a }); setF({ d: f.d, n: "", a: "" }); toast("Tersimpan"); await refreshExp(); } catch (e) { toast(e.message); }
  };
  const del = async (id) => { try { await api.deleteExpense(id); await refreshExp(); } catch (e) { toast(e.message); } };

  return (
    <>
      <div className="ah">
        <div><span className="eb">Dashboard<Lv /></span><h2>Keuangan</h2><p>Omset dihitung dari pesanan yang sudah dikonfirmasi. Laba bersih adalah omset dikurangi pengeluaran.</p></div>
        <div><label className="lbl">Bulan</label><input type="month" className="inp w-auto" value={mon}  onChange={(e) => setMon(e.target.value)} /></div>
      </div>
      <div className="kpis">
        <div className="kpi hl"><small>Omset hari ini</small><b><Num value={od} dur={850} fmt={rp} /></b><em>{paid.filter((o) => dayKey(o.createdAt) === today).length} pesanan</em></div>
        <div className="kpi"><small>Laba bersih hari ini</small><b><Num value={od - ed} dur={850} fmt={rp} /></b><em>Pengeluaran {rp(ed)}</em></div>
        <div className="kpi hl"><small>Omset {monthName(mon)}</small><b><Num value={omM} dur={850} fmt={rp} /></b><em>{paid.filter((o) => dayKey(o.createdAt).startsWith(mon)).length} pesanan</em></div>
        <div className="kpi"><small>Laba bersih {monthName(mon)}</small><b><Num value={omM - exM} dur={850} fmt={rp} /></b><em>Pengeluaran {rp(exM)}</em></div>
      </div>
      <div className="g2">
        <div className="panel"><h3>Omset 14 hari terakhir</h3>
          <div className="bars">{days.map((d, i) => (<div key={i}><em>{d.v ? Math.round(d.v / 1000) + "rb" : ""}</em><i style={{ height: Math.max(3, d.v / mx * 130) }} />{d.l}</div>))}</div></div>
        <div className="panel"><h3>Metode bayar {monthName(mon)}</h3>
          {Object.keys(by).length ? Object.entries(by).map(([k, v]) => (
            <div className="mrow" key={k}><span style={{ width: 96 }}>{MNAME[k] || k}</span><div className="b"><i style={{ width: v / tot * 100 + "%" }} /></div><b>{rp(v)}</b></div>
          )) : <div className="empty">Belum ada pemasukan.</div>}</div>
      </div>
      <div className="g2">
        <div className="panel"><h3>Rekap harian {monthName(mon)}</h3>
          <table className="t"><tbody>
            <tr><th>Tanggal</th><th className="r">Pesanan</th><th className="r">Omset</th><th className="r">Pengeluaran</th><th className="r">Laba bersih</th></tr>
            {dRows.length ? dRows.map((k) => (
              <tr key={k}><td>{k.slice(8)}/{k.slice(5, 7)}</td><td className="r">{dm[k].n}</td><td className="r">{rp(dm[k].o)}</td><td className="r">{rp(dm[k].e)}</td><td className="r"><b>{rp(dm[k].o - dm[k].e)}</b></td></tr>
            )) : <tr><td colSpan="5" className="empty">Belum ada data bulan ini.</td></tr>}
          </tbody></table></div>
        <div className="panel"><h3>Rekap bulanan</h3>
          <table className="t"><tbody>
            <tr><th>Bulan</th><th className="r">Omset</th><th className="r">Laba bersih</th></tr>
            {months.map((m) => { const o = om((x) => dayKey(x.createdAt).startsWith(m)), e = ex((x) => x.d.startsWith(m)); return (<tr key={m}><td>{monthName(m)}</td><td className="r">{rp(o)}</td><td className="r"><b>{rp(o - e)}</b></td></tr>); })}
          </tbody></table></div>
      </div>
      <div className="panel"><h3>Pengeluaran</h3>
        <div className="eform">
          <div><label className="lbl">Tanggal</label><input className="inp" type="date" value={f.d} onChange={(e) => setF({ ...f, d: e.target.value })} /></div>
          <div><label className="lbl">Keterangan</label><input className="inp" placeholder="Mis. beli toner" value={f.n} onChange={(e) => setF({ ...f, n: e.target.value })} /></div>
          <div><label className="lbl">Jumlah (Rp)</label><input className="inp" type="number" min="0" value={f.a} onChange={(e) => setF({ ...f, a: e.target.value })} /></div>
          <button className="btn primary" onClick={add}>Tambah</button>
        </div>
        <table className="t mt-3.5"><tbody>
          <tr><th>Tanggal</th><th>Keterangan</th><th className="r">Jumlah</th><th /></tr>
          {exp.length ? [...exp].sort((a, b) => b.d.localeCompare(a.d)).slice(0, 40).map((e) => (
            <tr key={e.id}><td>{e.d}</td><td>{e.n}</td><td className="r">{rp(e.amt)}</td><td className="r"><button className="x" onClick={() => del(e.id)}>&times;</button></td></tr>
          )) : <tr><td colSpan="4" className="empty">Belum ada pengeluaran.</td></tr>}
        </tbody></table>
      </div>
    </>
  );
}
