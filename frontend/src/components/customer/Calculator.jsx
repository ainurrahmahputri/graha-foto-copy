import { useMemo, useState } from "react";
import { useApp } from "../../context.jsx";
import { clamp, rp } from "../../lib/format.js";
import { wipe } from "../../fx/effects.js";
import { Num } from "../../fx/useCountUp.js";

const COLORS = [["bw", "Hitam putih"], ["color", "Berwarna"]];
const SIZES = ["A4", "F4", "A3"];

/* Kalkulator harga di beranda. Warna dan ukuran dibagi dengan form pesanan. */
export default function Calculator() {
  const { cfg, draft, patchDraft, goTab, go, toast } = useApp();
  const [pages, setPages] = useState(20);
  const unit = cfg.prices[draft.color][draft.size];
  const total = pages * unit;
  const n = clamp(Math.ceil(pages / 12), 1, 16);
  /* kemiringan acak tiap lembar di tumpukan, dibuat sekali */
  const tilt = useMemo(() => Array.from({ length: 16 }, () => (Math.random() * 1.6 - 0.8).toFixed(1) + "deg"), []);

  return (
    <div className="calc" id="calc">
      <div className="cl2">
        <div>
          <span className="lbl">Warna</span>
          <div className="opts">
            {COLORS.map(([v, l]) => (
              <button key={v} className={"opt" + (draft.color === v ? " on" : "")} onClick={() => patchDraft({ color: v })}>{l}</button>
            ))}
          </div>
        </div>
        <div>
          <span className="lbl">Ukuran</span>
          <div className="opts">
            {SIZES.map((v) => (
              <button key={v} className={"opt" + (draft.size === v ? " on" : "")} onClick={() => patchDraft({ size: v })}>{v}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="grp">
        <span className="lbl">Jumlah halaman <b>{pages}</b></span>
        <div className="cl-row">
          <button className="cb" aria-label="Kurangi" onClick={() => setPages((p) => clamp(p - 5, 1, 200))}>−</button>
          <input type="range" min="1" max="200" value={pages} aria-label="Jumlah halaman" onChange={(e) => setPages(+e.target.value)} />
          <button className="cb" aria-label="Tambah" onClick={() => setPages((p) => clamp(p + 5, 1, 200))}>+</button>
        </div>
      </div>
      <div className="cl-out">
        <div className={"stk" + (draft.color === "color" ? " col" : "")}>
          {Array.from({ length: n }, (_, k) => (
            <i key={k} style={{ bottom: k * 3.4 + "px", "--r": tilt[k], "--x": (k % 2 ? 1.5 : -1.5) + "px" }} />
          ))}
        </div>
        <div className="tx"><small>{pages} hlm × {rp(unit)}</small><b><Num value={total} dur={380} fmt={rp} /></b></div>
      </div>
      <button className="btn gold sm" onClick={(e) => wipe(e, () => { go("app"); goTab(1); toast("Pilihanmu dibawa ke pesanan"); })}>
        Pakai untuk pesananku
      </button>
    </div>
  );
}
