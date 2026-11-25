import { useEffect } from "react";
import { useApp } from "../../context.jsx";
import { FLOW, ST, fmtDateTime, rp } from "../../lib/format.js";
import Art from "../ui/Art.jsx";
import PageTitle from "../ui/PageTitle.jsx";
import { useBar } from "./PayBar.jsx";

/* ilustrasi + kalimat singkat per status */
const STMSG = {
  menunggu: ["stack", "Buktimu lagi dicek admin. Biasanya tidak lama."],
  dikonfirmasi: ["stack", "Pembayaran diterima. Berkasmu masuk antrean cetak."],
  dicetak: ["printer", "Lagi dicetak sekarang. Sebentar lagi jadi."],
  siap: ["bag", "Printanmu sudah jadi. Ambil di toko dan sebutkan kode pesanan."],
  selesai: ["pick", "Selesai. Makasih sudah print di sini!"],
};

export default function Step4() {
  const { myOrders, setOrder, goTab, flash, setFlash, toast } = useApp();
  useBar({ label: "", amount: 0, text: "", hidden: true });

  /* kartu yang statusnya baru berubah berkedip sebentar */
  useEffect(() => {
    if (!flash.size) return;
    const t = setTimeout(() => setFlash(new Set()), 1900);
    return () => clearTimeout(t);
  }, [flash, setFlash]);

  const copyCode = (c) => navigator.clipboard?.writeText(c).then(() => toast("Kode pesanan disalin")).catch(() => toast("Kode: " + c));

  return (
    <>
      <PageTitle step="Langkah 4 · Lacak" a="Pantau" b="pesanan" art="none" />
      {myOrders.length ? myOrders.map((o) => {
        const idx = FLOW.indexOf(o.status), rej = o.status === "ditolak", draft = o.status === "draft", m = STMSG[o.status];
        return (
          <div key={o.code} data-code={o.code} className={"card trk" + (flash.has(o.code) ? " flash" : "")}>
            <span className="code" onClick={() => copyCode(o.code)}>{o.code}</span>
            <div className="sub tdate">{fmtDateTime(o.createdAt)}</div>
            <div className={"tstat s-" + o.status}>{ST[o.status]}</div>
            {rej ? (
              <div className="res bad"><b>Pesanan ditolak</b>{o.adminNote || "Hubungi toko untuk info lebih lanjut."}</div>
            ) : draft ? (
              <>
                <div className="res warn"><b>Belum dibayar</b>Selesaikan pembayaran supaya pesananmu diproses.</div>
                <button className="btn primary sm mt-2.5"  onClick={() => { setOrder(o); goTab(3); }}>Bayar sekarang</button>
              </>
            ) : (
              <>
                <div className="tl">
                  {FLOW.map((s, i) => (
                    <div key={s} className={"p" + (i < idx ? " d" : "") + (i === idx ? " c" : "")} style={{ "--i": i }}>
                      <i>{i < idx ? "✓" : i + 1}</i>{s === "menunggu" ? "Menunggu" : ST[s]}
                    </div>
                  ))}
                </div>
                {m && (
                  <div className={"stmsg " + o.status}>
                    <Art name={m[0]} />
                    <span>{m[1]}{(o.status === "menunggu" || o.status === "dicetak") && <span className="dots"><i /><i /><i /></span>}</span>
                  </div>
                )}
              </>
            )}
            {o.adminNote && !rej && <div className="note">Catatan toko: {o.adminNote}</div>}
            <div className="tinfo">
              <p><b>{o.name}</b></p>
              <p className="tf">{o.files.map((f, i) => <span key={i}>{f.name}<br /></span>)}</p>
              <p className="tp">Diambil {o.pickupLabel || ""}</p>
              <div className="ttot">{rp(o.total)}</div>
            </div>
          </div>
        );
      }) : (
        <div className="card empty">
          <Art name="pick" />
          <b style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: 20, color: "var(--ink)" }}>Belum ada pesanan</b>
          <p className="mt-1.5">Upload file pertamamu untuk mulai.</p>
          <button className="btn primary mt-3.5"  onClick={() => goTab(1)}>Mulai print</button>
        </div>
      )}
    </>
  );
}
