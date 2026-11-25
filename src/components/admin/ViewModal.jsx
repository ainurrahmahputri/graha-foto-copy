import { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { useApp } from "../../context.jsx";
import { rp } from "../../lib/format.js";
import Modal from "../ui/Modal.jsx";

const Spin = () => <div className="empty"><span className="spin d" /></div>;

/* Isi modal: bukti bayar atau daftar berkas (diambil dari API saat dibuka). */
function ProofBody({ o }) {
  const [st, setSt] = useState({ loading: true });
  useEffect(() => {
    let alive = true;
    api.fileUrl(o.code, "proof").then((r) => alive && setSt({ url: r.url })).catch(() => alive && setSt({ err: true }));
    return () => { alive = false; };
  }, [o.code]);
  if (st.loading) return <Spin />;
  if (st.err) return <div className="empty">Bukti tidak bisa dimuat.</div>;
  return (
    <>
      <img src={st.url} alt="Bukti" className="block mx-auto max-h-[55vh]" />
      <table className="sum mt-3"><tbody>
        <tr><td>Total pesanan</td><td>{rp(o.total)}</td></tr>
        <tr><td>Nominal terbaca AI</td><td>{o.ai && o.ai.amount != null ? rp(o.ai.amount) : "—"}</td></tr>
        <tr><td>Metode dipilih</td><td>{(o.payMethod || "").toUpperCase()}</td></tr>
        <tr><td>Catatan AI</td><td>{o.ai?.note || "—"}</td></tr>
      </tbody></table>
    </>
  );
}

function FilesBody({ o }) {
  const [view, setView] = useState(null); // {loading}|{url,type}|{err}
  const open = async (i) => {
    setView({ loading: true });
    try { setView(await api.fileUrl(o.code, "f" + i)); } catch { setView({ err: true }); }
  };
  return (
    <>
      {o.files.map((f, i) => (
        <div className="frow" key={i}>
          <div className="nm">{f.name}<small>{f.pages} hlm, {(f.size / 1024).toFixed(0)} KB</small></div>
          <button className="btn ghost sm" onClick={() => open(i)}>Buka</button>
        </div>
      ))}
      <div className="mt-3">
        {view?.loading && <Spin />}
        {view?.err && <div className="note">Berkas tidak bisa dimuat.</div>}
        {view?.url && (
          <>
            {view.type.startsWith("image/") ? <img src={view.url} alt="" className="block mx-auto max-h-[60vh]" />
              : view.type === "application/pdf" ? <iframe src={view.url} title="Pratinjau" />
              : <div className="note">Format ini tidak bisa dipratinjau di sini.</div>}
            {!view.type.startsWith("image/") && <p className="mt-2"><a href={view.url} target="_blank" rel="noreferrer" className="btn ghost sm">Buka di tab baru</a></p>}
          </>
        )}
      </div>
    </>
  );
}

export default function ViewModal() {
  const { viewer, setViewer } = useApp();
  return (
    <Modal id="viewM" on={!!viewer} wide onClose={() => setViewer(null)}>
      <h3>{viewer ? (viewer.type === "proof" ? "Bukti transaksi " : "Berkas ") + viewer.order.name : ""}</h3>
      <div>
        {viewer && (viewer.type === "proof" ? <ProofBody key={viewer.order.code} o={viewer.order} /> : <FilesBody key={viewer.order.code} o={viewer.order} />)}
      </div>
    </Modal>
  );
}
