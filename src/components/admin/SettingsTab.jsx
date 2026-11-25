import { useState } from "react";
import { api } from "../../api/client.js";
import { useApp } from "../../context.jsx";
import { CFG0 } from "../../lib/config.js";
import Head from "./Head.jsx";

const toText = (a) => a.map((x) => `${x.n} | ${x.no} | ${x.an}`).join("\n");
const parse = (t) => t.split("\n").map((l) => l.split("|").map((s) => s.trim())).filter((a) => a[0]).map((a) => ({ n: a[0], no: a[1] || "", an: a[2] || "" }));

export default function SettingsTab() {
  const { cfg, photo, qris, toast, loadConfig } = useApp();
  const [f, setF] = useState(() => ({
    name: cfg.name, wa: cfg.wa, address: cfg.address, open: cfg.open, close: cfg.close, mode: cfg.mode,
    prices: JSON.parse(JSON.stringify(cfg.prices)), ewallet: toText(cfg.pay.ewallet), bank: toText(cfg.pay.bank),
  }));
  const [photoFile, setPhotoFile] = useState(null), [qrisFile, setQrisFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const setPrice = (g, k, v) => setF((s) => ({ ...s, prices: { ...s.prices, [g]: { ...s.prices[g], [k]: Math.max(0, +v || 0) } } }));

  const save = async () => {
    setSaving(true);
    try {
      const shop = {
        name: f.name.trim() || CFG0.name, wa: f.wa.trim(), address: f.address.trim(), open: f.open || "08:00", close: f.close || "21:00",
        mode: f.mode, prices: f.prices, pay: { ewallet: parse(f.ewallet), bank: parse(f.bank) },
      };
      if (photoFile) await api.setPhoto(photoFile);
      if (qrisFile) await api.setQris(qrisFile);
      await api.saveShop(shop);
      setPhotoFile(null); setQrisFile(null);
      await loadConfig(); toast("Pengaturan tersimpan");
    } catch (e) { toast("Gagal menyimpan: " + (e.message || "")); }
    setSaving(false);
  };
  const delPhoto = async () => { try { await api.setPhoto(null); await loadConfig(); toast("Foto dihapus"); } catch (e) { toast(e.message); } };

  const P = f.prices;
  return (
    <>
      <Head t="Pengaturan" p="Data toko, jam buka, harga, dan rekening pembayaran." />
      <div className="g2 items-start">
        <div>
          <div className="panel mt-0"><h3>Toko</h3>
            <div className="two">
              <div><label className="lbl">Nama toko</label><input className="inp" value={f.name} onChange={(e) => set("name", e.target.value)} /></div>
              <div><label className="lbl">No. WA toko</label><input className="inp" value={f.wa} onChange={(e) => set("wa", e.target.value)} /></div>
            </div>
            <div className="grp"><label className="lbl">Alamat</label><input className="inp" value={f.address} onChange={(e) => set("address", e.target.value)} /></div>
            <div className="two">
              <div className="grp"><label className="lbl">Jam buka</label><input className="inp" type="time" value={f.open} onChange={(e) => set("open", e.target.value)} /></div>
              <div className="grp"><label className="lbl">Jam tutup</label><input className="inp" type="time" value={f.close} onChange={(e) => set("close", e.target.value)} /></div>
            </div>
            <div className="grp"><label className="lbl">Foto toko (tampil di halaman depan)</label>
              <input type="file" accept="image/*" className="inp" onChange={(e) => setPhotoFile(e.target.files[0] || null)} />
              {photo ? (
                <>
                  <img src={photo} alt="" className="max-w-[180px] mt-2.5 rounded-[14px] border border-(--line) block" />
                  <button className="btn ghost sm mt-2"  onClick={delPhoto}>Hapus foto</button>
                </>
              ) : <p className="text-[12px] text-(color:--muted) mt-1.5">Belum ada foto. Halaman depan memakai ilustrasi printer.</p>}
            </div>
            <div className="grp"><label className="lbl">Papan buka/tutup</label>
              <div className="opts">
                {[["auto", "Otomatis sesuai jam"], ["open", "Paksa BUKA"], ["closed", "Paksa TUTUP"]].map(([v, l]) => (
                  <button key={v} className={"opt" + (f.mode === v ? " on" : "")} onClick={() => set("mode", v)}>{l}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="panel"><h3>Harga per halaman</h3>
            <div className="two">
              {["A4", "F4", "A3"].flatMap((s) => [
                <div key={"bw" + s}><label className="lbl">Hitam putih {s}</label><input className="inp" type="number" value={P.bw[s]} onChange={(e) => setPrice("bw", s, e.target.value)} /></div>,
                <div key={"c" + s}><label className="lbl">Warna {s}</label><input className="inp" type="number" value={P.color[s]} onChange={(e) => setPrice("color", s, e.target.value)} /></div>,
              ])}
              <div><label className="lbl">Staples</label><input className="inp" type="number" value={P.bind.staples} onChange={(e) => setPrice("bind", "staples", e.target.value)} /></div>
              <div><label className="lbl">Jilid spiral</label><input className="inp" type="number" value={P.bind.spiral} onChange={(e) => setPrice("bind", "spiral", e.target.value)} /></div>
            </div>
          </div>
        </div>
        <div className="panel mt-0"><h3>Rekening pembayaran</h3>
          <p className="text-[12.5px] text-(color:--muted) mb-2.5">Satu baris per akun: Nama | Nomor | Atas nama</p>
          <label className="lbl">E-Wallet</label>
          <textarea className="inp" value={f.ewallet} onChange={(e) => set("ewallet", e.target.value)} />
          <label className="lbl mt-3">Bank</label>
          <textarea className="inp" value={f.bank} onChange={(e) => set("bank", e.target.value)} />
          <label className="lbl mt-3">Gambar QRIS</label>
          <input type="file" accept="image/*" className="inp" onChange={(e) => setQrisFile(e.target.files[0] || null)} />
          {qris && <img src={qris} alt="QRIS" className="max-w-[150px] mt-2.5 rounded-[12px] border border-(--line)" />}
          <button className="btn primary mt-4.5 w-full"  disabled={saving} onClick={save}>{saving ? "Menyimpan…" : "Simpan pengaturan"}</button>
        </div>
      </div>
    </>
  );
}
