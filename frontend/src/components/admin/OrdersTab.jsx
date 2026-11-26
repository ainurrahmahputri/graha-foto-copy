import { useState } from "react";
import { api } from "../../api/client.js";
import { useApp } from "../../context.jsx";
import { ST, dayKey, fmtDateTime, optLabel, rp } from "../../lib/format.js";
import { Num } from "../../fx/useCountUp.js";
import Head from "./Head.jsx";

const FILTERS = [["all", "Semua"], ["menunggu", "Menunggu"], ["dikonfirmasi", "Dikonfirmasi"], ["dicetak", "Dicetak"], ["siap", "Siap"], ["selesai", "Selesai"], ["draft", "Belum bayar"], ["ditolak", "Ditolak"]];
const NEXT = { menunggu: ["dikonfirmasi", "Konfirmasi"], dikonfirmasi: ["dicetak", "Mulai cetak"], dicetak: ["siap", "Siap diambil"], siap: ["selesai", "Selesai"] };
const muted = { color: "var(--muted)" };

export default function OrdersTab({ orders, err, refresh, newRows }) {
  const { toast, setViewer } = useApp();
  const [filter, setFilter] = useState("all");
  const [notes, setNotes] = useState({});
  const [busy, setBusy] = useState(null);
  const today = dayKey(Date.now());
  const cnt = (s) => orders.filter((o) => o.status === s).length;
  const list = orders.filter((o) => filter === "all" || o.status === filter);

  const move = async (o, st) => {
    setBusy(o.code + st);
    try {
      await api.updateOrder(o.code, { status: st, adminNote: notes[o.code] ?? o.adminNote ?? "" });
      toast("Status: " + ST[st]); await refresh();
    } catch { toast("Gagal memperbarui"); }
    setBusy(null);
  };

  return (
    <>
      <Head t="Pesanan" p="Ubah status pesanan di sini. Pelanggan langsung melihat perubahannya." />
      {err && <div className="res bad mb-4"><b>Data pesanan tidak bisa dibaca</b>Akun ini belum punya akses admin ({err}).</div>}
      <div className="stats5">
        <div className="kpi hl"><small>Perlu dikonfirmasi</small><b><Num value={cnt("menunggu")} dur={850} /></b></div>
        <div className="kpi"><small>Sedang diproses</small><b><Num value={cnt("dikonfirmasi") + cnt("dicetak")} dur={850} /></b></div>
        <div className="kpi"><small>Siap diambil</small><b><Num value={cnt("siap")} dur={850} /></b></div>
        <div className="kpi"><small>Pesanan hari ini</small><b><Num value={orders.filter((o) => dayKey(o.createdAt) === today).length} dur={850} /></b></div>
      </div>
      <div className="fl">
        {FILTERS.map(([k, l]) => (<button key={k} className={filter === k ? "on" : ""} onClick={() => setFilter(k)}>{l}</button>))}
      </div>
      <div className="panel mt-0 pt-2 px-3.5 pb-3.5">
        {list.length ? (
          <table className="t resp"><tbody>
            <tr><th>Pesanan</th><th>Pelanggan</th><th>Detail cetak</th><th>Pembayaran</th><th>Status</th><th>Aksi</th></tr>
            {list.map((o) => {
              const nxt = NEXT[o.status];
              return (
                <tr key={o.code} className={newRows.has(o.code) ? "newrow" : ""}>
                  <td data-l="Pesanan"><span className="code">{o.code}</span><br /><small style={muted}>{fmtDateTime(o.createdAt)}</small></td>
                  <td data-l="Pelanggan"><b>{o.name}</b>{o.wa && <><br /><small style={muted}>{o.wa}</small></>}<br /><small style={muted}>Ambil: {o.pickupLabel || ""}</small></td>
                  <td data-l="Detail cetak">{o.files.length} berkas, {o.pages} hlm × {o.copies}<br />
                    <small style={muted}>{optLabel(o)}{o.bind !== "none" ? ", jilid " + o.bind : ""}</small>
                    {o.note && <><br /><small className="text-(color:--em)">“{o.note}”</small></>}</td>
                  <td data-l="Pembayaran"><b>{rp(o.total)}</b>
                    {o.payMethod && <><br /><small style={muted}>{o.payMethod.toUpperCase()}</small></>}
                    {o.ai && <><br /><span className={"aiok " + (o.ai.manual ? "m" : "y")}>{o.ai.manual ? "Cek manual" : "Sesuai (AI)"}</span></>}</td>
                  <td data-l="Status"><span className={"badge s-" + o.status}>{ST[o.status]}</span></td>
                  <td data-l="Aksi">
                    <div className="acts">
                      <div className="row">
                        <button className="btn ghost sm" onClick={() => setViewer({ type: "files", order: o })}>Berkas</button>
                        <button className="btn ghost sm" disabled={!o.hasProof} onClick={() => setViewer({ type: "proof", order: o })}>Bukti</button>
                      </div>
                      <input className="inp" placeholder="Catatan ke pelanggan" value={notes[o.code] ?? o.adminNote ?? ""}
                        onChange={(e) => setNotes((n) => ({ ...n, [o.code]: e.target.value }))} />
                      <div className="row">
                        {nxt && <button className="btn primary sm" disabled={busy === o.code + nxt[0]} onClick={() => move(o, nxt[0])}>{nxt[1]}</button>}
                        {!["selesai", "ditolak"].includes(o.status) && <button className="btn danger sm" disabled={busy === o.code + "ditolak"} onClick={() => move(o, "ditolak")}>Tolak</button>}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody></table>
        ) : <div className="empty">Belum ada pesanan{filter !== "all" ? " pada filter ini" : ""}.</div>}
      </div>
    </>
  );
}
