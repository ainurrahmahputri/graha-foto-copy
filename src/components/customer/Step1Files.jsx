import { useEffect, useRef, useState } from "react";
import { useApp } from "../../context.jsx";
import { dayLabel, rp } from "../../lib/format.js";
import { pdfPages } from "../../lib/files.js";
import { nudge } from "../../fx/effects.js";
import PageTitle from "../ui/PageTitle.jsx";
import { useBar } from "./PayBar.jsx";

let fid = 0;
const UP_ICON = (s) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 16V4m0 0l-4 4m4-4l4 4" /><path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
  </svg>
);

export default function Step1() {
  const { cfg, draft, patchDraft, setDraft, setOrder, toast, goTab, calc } = useApp();
  const [over, setOver] = useState(false);
  const [leaving, setLeaving] = useState(() => new Set());
  const [bump, setBump] = useState(false);
  const dropCard = useRef(null), nameEl = useRef(null);
  const P = cfg.prices;

  const addFiles = async (list) => {
    const fresh = [];
    for (const f of list) {
      if (f.size > 2.5 * 1024 * 1024 && !f.type.startsWith("image/")) { toast(`${f.name} terlalu besar (maks. 2,5 MB)`); continue; }
      const isPdf = /\.pdf$/i.test(f.name);
      fresh.push({ id: ++fid, file: f, name: f.name, size: f.size, pages: isPdf ? await pdfPages(f) : 1, auto: isPdf, img: f.type.startsWith("image/"), fresh: true });
    }
    if (!fresh.length) return;
    setDraft((d) => ({ ...d, files: [...d.files, ...fresh] }));
    setOrder(null);
  };
  /* tanda "baru" cuma untuk animasi masuk */
  useEffect(() => {
    if (!draft.files.some((f) => f.fresh)) return;
    const t = setTimeout(() => setDraft((d) => ({ ...d, files: d.files.map((f) => (f.fresh ? { ...f, fresh: false } : f)) })), 600);
    return () => clearTimeout(t);
  }, [draft.files, setDraft]);

  const remove = (id) => {
    setLeaving((s) => new Set(s).add(id));
    setTimeout(() => { patchDraft({ files: draft.files.filter((f) => f.id !== id) }); setLeaving((s) => { const n = new Set(s); n.delete(id); return n; }); }, 210);
  };
  const setPages = (id, v) => patchDraft({ files: draft.files.map((f) => (f.id === id ? { ...f, pages: Math.max(1, +v || 1) } : f)) });
  const setCopies = (v) => patchDraft({ copies: Math.max(1, Math.min(500, v)) });
  const step = (d) => { setCopies(draft.copies + d); setBump(true); setTimeout(() => setBump(false), 350); };

  const ok = draft.files.length > 0 && draft.name.trim().length > 1;
  useBar({
    label: calc.pages ? `${calc.pages} hlm × ${draft.copies} salinan` : "Estimasi total",
    amount: calc.total, text: "Lanjut", disabled: !ok, onNext: () => goTab(2),
    onDisabled: () => {
      if (!draft.files.length) nudge(dropCard.current, "Pilih file yang mau dicetak dulu", false, toast);
      else nudge(nameEl.current, "Isi nama pemesan dulu", true, toast);
    },
  });

  const opts = (k, items) => (
    <div className="opts">
      {items.map(([v, l, s]) => (
        <button key={v} className={"opt" + (draft[k] === v ? " on" : "")} onClick={() => patchDraft({ [k]: v })}>{l}{s && <small>{s}</small>}</button>
      ))}
    </div>
  );

  return (
    <>
      <PageTitle step="Langkah 1 · Berkas" a="Unggah" b="berkasmu" art="send" />
      <div className="card" ref={dropCard}>
        <h3>Berkas</h3><p className="sub">PDF, Word, atau gambar. Maksimal 2,5 MB per file.</p>
        <label className={"drop" + (over ? " over" : "")}
          onDragEnter={(e) => { e.preventDefault(); setOver(true); }} onDragOver={(e) => { e.preventDefault(); setOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); setOver(false); }}
          onDrop={(e) => { e.preventDefault(); setOver(false); addFiles([...e.dataTransfer.files]); }}>
          <input type="file" multiple hidden accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.webp,.txt"
            onChange={(e) => { addFiles([...e.target.files]); e.target.value = ""; }} />
          {UP_ICON(34)}
          <b>Pilih file atau seret ke sini</b><small>Jumlah halaman PDF dihitung otomatis</small>
        </label>
        <div>
          {draft.files.map((f) => (
            <div key={f.id} className={"frow" + (f.fresh ? " fin" : "") + (leaving.has(f.id) ? " fout" : "")}>
              <div className="nm">{f.name}<small>{(f.size / 1024).toFixed(0)} KB{f.auto ? ", halaman terdeteksi" : ", isi jumlah halaman"}</small></div>
              <input type="number" min="1" value={f.pages} onChange={(e) => setPages(f.id, e.target.value)} />
              <small>hlm</small>
              <button className="x" onClick={() => remove(f.id)}>&times;</button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Opsi cetak</h3>
        <div className="grp"><label>Warna</label>{opts("color", [["bw", "Hitam Putih"], ["color", "Berwarna"]])}</div>
        <div className="grp"><label>Ukuran kertas</label>{opts("size", [["A4", "A4"], ["F4", "F4 / Folio"], ["A3", "A3"]])}</div>
        <div className="grp"><label>Sisi</label>{opts("sides", [["1", "Satu sisi"], ["2", "Bolak-balik"]])}</div>
        <div className="grp"><label>Jilid</label>
          {opts("bind", [["none", "Tanpa jilid"], ["staples", "Staples", "+" + rp(P.bind.staples)], ["spiral", "Spiral", "+" + rp(P.bind.spiral)]])}
        </div>
        <div className="grp"><label>Jumlah salinan</label>
          <div className="step">
            <button onClick={() => step(-1)}>−</button>
            <input className={bump ? "bump" : ""} type="number" min="1" max="500" value={draft.copies} onChange={(e) => setCopies(+e.target.value || 1)} />
            <button onClick={() => step(1)}>+</button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Pengambilan</h3><p className="sub">Mau ambil kapan?</p>
        <div className="opts">
          <button className={"opt" + (draft.pickup === "today" ? " on" : "")} onClick={() => patchDraft({ pickup: "today" })}>Ambil hari ini<small>{dayLabel(0)}</small></button>
          <button className={"opt" + (draft.pickup === "tomorrow" ? " on" : "")} onClick={() => patchDraft({ pickup: "tomorrow" })}>Ambil besok<small>{dayLabel(1)}</small></button>
        </div>
      </div>

      <div className="card">
        <h3>Data pemesan</h3>
        <div className="grp"><label className="lbl">Nama</label>
          <input className="inp" ref={nameEl} placeholder="Nama lengkap" value={draft.name} onChange={(e) => patchDraft({ name: e.target.value })} /></div>
        <div className="grp"><label className="lbl">No. WhatsApp (opsional)</label>
          <input className="inp" inputMode="tel" placeholder="08xxxxxxxxxx" value={draft.wa} onChange={(e) => patchDraft({ wa: e.target.value }, true)} /></div>
        <div className="grp"><label className="lbl">Catatan</label>
          <input className="inp" placeholder="Contoh: halaman 1-10 saja" value={draft.note} onChange={(e) => patchDraft({ note: e.target.value }, true)} /></div>
      </div>
    </>
  );
}
