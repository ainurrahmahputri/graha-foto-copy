import { useState } from "react";
import { useApp } from "../../context.jsx";
import { api, clientId } from "../../api/client.js";
import { dayLabel, isOpen, optLabel, rp } from "../../lib/format.js";
import { Num } from "../../fx/useCountUp.js";
import PageTitle from "../ui/PageTitle.jsx";
import { useBar } from "./PayBar.jsx";

export default function Step2() {
  const { cfg, draft, calc, order, setOrder, setProof, goTab, toast, refreshMine } = useApp();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [failed, setFailed] = useState(false);

  const create = async () => {
    setBusy(true); setFailed(false); setMsg("Mengirim berkas dan menyimpan pesanan…");
    try {
      const o = await api.createOrder(clientId(), draft, draft.files.map((f) => ({ file: f.file, pages: f.pages })));
      setOrder(o); setProof(null); refreshMine();
      toast("Pesanan dibuat"); goTab(3);
    } catch (e) {
      setMsg("Gagal menyimpan: " + (e.message || "coba lagi")); setFailed(true);
    } finally { setBusy(false); }
  };

  useBar({
    label: "Total", amount: calc.total, back: true, busy, disabled: busy,
    text: busy ? "Menyimpan…" : order ? "Lanjut bayar" : failed ? "Coba lagi" : "Buat pesanan",
    onNext: () => (order ? goTab(3) : create()),
    onBack: () => goTab(1),
  });

  const rows = [
    ["Cetak " + optLabel(draft), rp(calc.print)],
    ["Jilid", draft.bind === "none" ? "Tanpa jilid" : rp(calc.bind)],
    ["Halaman × salinan", `${calc.pages} × ${draft.copies}`],
    ["Ambil", draft.pickup === "today" ? "Hari ini" : "Besok"],
  ];
  return (
    <>
      <PageTitle step="Langkah 2 · Konfirmasi" a="Cek" b="pesananmu" />
      <div className="sumc">
        <small>Total pesanan</small>
        <div className="amt"><Num value={calc.total} dur={800} fmt={rp} /></div>
        {rows.map(([l, v], i) => (<div className="r" key={l} style={{ "--i": i }}><span>{l}</span><b>{v}</b></div>))}
      </div>
      <div className="card">
        <h3>Pesananmu</h3>
        <table className="sum mt-2"><tbody>
          <tr><td>Pemesan</td><td>{draft.name}{draft.wa && <><br /><small className="text-(color:--muted) font-normal">{draft.wa}</small></>}</td></tr>
          <tr><td>Berkas</td><td>{draft.files.map((f) => (<span key={f.id}>{f.name} ({f.pages} hlm)<br /></span>))}</td></tr>
          <tr><td>Tanggal ambil</td><td>{dayLabel(draft.pickup === "today" ? 0 : 1)}</td></tr>
          {draft.note && <tr><td>Catatan</td><td>{draft.note}</td></tr>}
        </tbody></table>
        {!isOpen(cfg) && <div className="note">Toko sedang tutup. Pesananmu tetap dicatat dan diproses saat buka.</div>}
        {msg && <div className="note">{msg}</div>}
      </div>
    </>
  );
}
