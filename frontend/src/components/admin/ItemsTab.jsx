import { useState } from "react";
import { api } from "../../api/client.js";
import { useApp } from "../../context.jsx";
import { INV0 } from "../../lib/config.js";
import { rp } from "../../lib/format.js";
import { Num } from "../../fx/useCountUp.js";
import Head from "./Head.jsx";

export default function ItemsTab({ inv, setInv }) {
  const { cfg, toast } = useApp();
  const items = inv || INV0, low = items.filter((i) => i.q <= i.min).length;
  const [nn, setNn] = useState(""), [nq, setNq] = useState("");
  const P = cfg.prices;

  const save = async (arr) => {
    setInv(arr);
    try { await api.saveInventory(arr); } catch (e) { toast(e.message); }
  };
  const bump = (k, d) => save(items.map((x, i) => (i === k ? { ...x, q: Math.max(0, x.q + d) } : x)));
  const add = () => { const n = nn.trim(); if (!n) return; save([...items, { n, q: +nq || 0, min: 1 }]); setNn(""); setNq(""); };

  return (
    <>
      <Head t="Item & Stok" p="Bahan yang dipakai untuk layanan: kertas, toner, dan perlengkapan jilid." />
      <div className="kpis grid-cols-2 max-w-[480px]">
        <div className="kpi"><small>Jenis item</small><b><Num value={items.length} dur={850} /></b></div>
        <div className="kpi"><small>Stok menipis</small><b className={low ? "text-(color:--bad)" : "text-(color:--ok)"}><Num value={low} dur={850} /></b></div>
      </div>
      <div className="panel">
        <table className="t"><tbody>
          <tr><th>Item</th><th>Stok</th><th>Batas minimum</th><th /></tr>
          {items.map((i, k) => (
            <tr key={k}>
              <td>{i.n}{i.q <= i.min && <span className="low"> · menipis</span>}</td>
              <td><div className="step"><button onClick={() => bump(k, -1)}>−</button><b className="min-w-[30px] text-center">{i.q}</b><button onClick={() => bump(k, 1)}>+</button></div></td>
              <td>{i.min}</td>
              <td className="r"><button className="x" onClick={() => save(items.filter((_, j) => j !== k))}>&times;</button></td>
            </tr>
          ))}
        </tbody></table>
        <div className="iform">
          <input className="inp" placeholder="Nama item baru" value={nn} onChange={(e) => setNn(e.target.value)} />
          <input className="inp" type="number" min="0" placeholder="Stok awal" value={nq} onChange={(e) => setNq(e.target.value)} />
          <button className="btn primary" onClick={add}>Tambah</button>
        </div>
      </div>
      <div className="panel"><h3>Layanan & harga</h3>
        <table className="t"><tbody>
          <tr><th>Layanan</th><th className="r">Harga</th></tr>
          {["A4", "F4", "A3"].flatMap((s) => [
            <tr key={"bw" + s}><td>Print/copy hitam putih {s}</td><td className="r">{rp(P.bw[s])} / hlm</td></tr>,
            <tr key={"c" + s}><td>Print/copy berwarna {s}</td><td className="r">{rp(P.color[s])} / hlm</td></tr>,
          ])}
          <tr><td>Staples</td><td className="r">{rp(P.bind.staples)}</td></tr>
          <tr><td>Jilid spiral</td><td className="r">{rp(P.bind.spiral)}</td></tr>
        </tbody></table>
        <p className="text-[12px] text-(color:--muted) mt-2.5">Ubah harga di menu Pengaturan.</p>
      </div>
    </>
  );
}
