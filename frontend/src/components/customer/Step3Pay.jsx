import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../../context.jsx";
import { api } from "../../api/client.js";
import { fakeQR, shrinkImage } from "../../lib/files.js";
import { rp, sleep } from "../../lib/format.js";
import { burst, hap, nudge } from "../../fx/effects.js";
import PageTitle from "../ui/PageTitle.jsx";
import { useBar } from "./PayBar.jsx";

const CK = (
  <svg className="ck" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" /><path d="M7 12.5l3.3 3.3L17 9" /></svg>
);

export default function Step3() {
  const { cfg, qris, order, setOrder, proof, setProof, payMethod, setPayMethod, goTab, toast, refreshMine } = useApp();
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(null);
  const [scan, setScan] = useState(null);
  const dropCard = useRef(null), img = useRef(null), resBox = useRef(null);
  const o = order;
  const paid = o.status !== "draft" && !result && !checking; // dianggap "sudah" hanya kalau bukan baru dikirim sekarang
  const preview = useMemo(() => (proof ? URL.createObjectURL(proof) : null), [proof]);

  /* konfeti + getar sekali saat bukti diterima */
  useEffect(() => { if (result && !result.bad && resBox.current) { burst(resBox.current); hap([14, 40, 20]); } }, [result]);

  const copy = async (no) => {
    try { await navigator.clipboard.writeText(no.replace(/\D/g, "")); toast("Nomor disalin"); }
    catch { toast("Salin manual: " + no); }
    setCopied(no); setTimeout(() => setCopied(null), 1500);
  };

  const pickProof = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try { setProof(await shrinkImage(f, 1100, 0.78)); setResult(null); }
    catch { toast("Gambar tidak bisa dibaca"); }
  };

  const submit = async () => {
    const im = img.current;
    if (im) setScan({ left: im.offsetLeft, top: im.offsetTop, width: im.offsetWidth, height: im.offsetHeight });
    setChecking(true); setResult(null);
    try {
      /* Server menjalankan cek AI (nominal, status, tanda edit). Hasilnya ada di order.ai. */
      const upd = await api.sendProof(o.code, proof, payMethod);
      setOrder(upd); refreshMine();
      setResult({ manual: !!upd.ai?.manual, note: upd.ai?.note });
      toast("Bukti terkirim");
      await sleep(1000); goTab(4);
    } catch (e) {
      const reasons = e.status === 422 && e.data?.reasons?.length ? e.data.reasons : null;
      setResult({ bad: true, reasons, message: e.message });
    } finally { setChecking(false); setScan(null); }
  };

  useBar({
    label: "Total", amount: o.total, back: true, busy: checking,
    text: paid ? "Lacak pesanan" : checking ? "Memeriksa…" : "Periksa bukti bayar",
    disabled: !paid && (!proof || checking || (result && !result.bad)),
    onNext: () => (paid ? goTab(4) : submit()),
    onBack: () => goTab(2),
    onDisabled: () => !proof && nudge(dropCard.current, "Upload bukti bayar dulu", false, toast),
  });

  const accounts = payMethod === "qris" ? null : cfg.pay[payMethod];
  return (
    <>
      <PageTitle step="Langkah 3 · Bayar" a="Saatnya" b="bayar" art="bag" />
      <div className="sumc">
        <small>Total bayar, kode <span className="code" style={{ background: "rgba(255,255,255,.12)", color: "#fff" }}
          onClick={() => { navigator.clipboard?.writeText(o.code).then(() => toast("Kode pesanan disalin")).catch(() => toast("Kode: " + o.code)); }}>{o.code}</span></small>
        <div className="amt mb-1.5">{rp(o.total)}</div>
        <small>Pastikan nominal di bukti sama persis.</small>
      </div>

      <div className="card">
        <h3>Metode pembayaran</h3>
        <div className="opts mt-3">
          {[["qris", "QRIS"], ["ewallet", "E-Wallet"], ["bank", "Transfer Bank"]].map(([k, l]) => (
            <button key={k} className={"opt" + (payMethod === k ? " on" : "")} onClick={() => setPayMethod(k)}>{l}</button>
          ))}
        </div>
        {accounts ? accounts.map((a, i) => (
          <div className="acc" key={i}>
            <span className="n">{a.n}</span>
            <span className="no">{a.no}<small>a.n. {a.an}</small></span>
            <button className={"btn ghost sm" + (copied === a.no ? " copied" : "")} onClick={() => copy(a.no)}>{copied === a.no ? "Tersalin ✓" : "Salin"}</button>
          </div>
        )) : (
          <>
            <div className="payinfo">
              <div className="qr">{qris ? <img src={qris} alt="QRIS" /> : <span dangerouslySetInnerHTML={{ __html: fakeQR() }} />}</div>
              <p>Pindai QRIS atas nama <b>{cfg.name}</b> dengan aplikasi bank atau e-wallet apa pun.<b className="a">{rp(o.total)}</b></p>
            </div>
            {!qris && <p className="sub mt-2 mb-0">Admin belum menambahkan QRIS. Gambar di atas hanya contoh.</p>}
          </>
        )}
      </div>

      <div className="card" ref={dropCard}>
        <h3>Upload bukti bayar</h3><p className="sub">Foto atau screenshot struk. AI akan cek nominalnya.</p>
        {paid ? (
          <div className="res ok"><b>Bukti sudah diterima</b>Pesananmu masuk antrean konfirmasi admin.</div>
        ) : (
          <>
            <label className="drop">
              <input type="file" accept="image/*" hidden onChange={pickProof} />
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4m0 0l-4 4m4-4l4 4" /><path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" /></svg>
              <b>Pilih foto atau screenshot struk</b>
            </label>
            <div className="proofbox relative">
              {preview && <img ref={img} src={preview} alt="Bukti bayar" />}
              {scan && <i className="scanln" style={scan} />}
            </div>
            <div>
              {result && result.bad && (
                <div className="res bad">
                  <b>{result.reasons ? "Bukti belum sesuai" : "Gagal mengirim"}</b>
                  {result.reasons ? <>{result.reasons.map((r, i) => <span key={i}>{r}<br /></span>)}Pastikan nominalnya tepat {rp(o.total)}, lalu upload ulang bukti yang jelas.</> : result.message}
                </div>
              )}
              {result && !result.bad && (
                <div className={"res " + (result.manual ? "warn" : "ok")} ref={resBox}>
                  {CK}<b>{result.manual ? "Bukti diterima" : "Bukti sesuai"}</b>
                  {result.manual ? result.note : "Nominalnya cocok. Pesananmu masuk antrean konfirmasi admin."}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
