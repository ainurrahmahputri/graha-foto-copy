import { useApp } from "../../context.jsx";
import { rpk } from "../../lib/format.js";
import { flick } from "../../fx/effects.js";
import Art from "../ui/Art.jsx";

/* Kartu layanan: ketuk untuk memilih warna atau jilid, pilihan langsung terbawa ke pesanan. */
export default function Services() {
  const { cfg, draft, patchDraft, toast } = useApp();
  const P = cfg.prices;
  const pick = (e, k) => {
    if (k === "bind") {
      const o = ["none", "staples", "spiral"], next = o[(o.indexOf(draft.bind) + 1) % 3];
      patchDraft({ bind: next });
      toast(next === "none" ? "Tanpa jilid" : "Jilid " + (next === "spiral" ? "spiral" : "staples") + " dipilih");
    } else {
      patchDraft({ color: k });
      toast((k === "bw" ? "Hitam putih" : "Berwarna") + " dipilih");
    }
    flick(e.currentTarget, "tap", 650);
  };
  const cards = [
    { k: "bw", art: "bw", small: "Per lembar A4", b: "Hitam putih", s: `Mulai ${rpk(P.bw.A4)}. Cocok untuk tugas dan skripsi.` },
    { k: "color", art: "color", small: "Per lembar A4", b: "Berwarna", s: `Mulai ${rpk(P.color.A4)}. Untuk poster, grafik, dan foto.` },
    { k: "bind", art: "bind", small: "Jilid", b: "Staples dan spiral", s: `Staples ${rpk(P.bind.staples)}, spiral ${rpk(P.bind.spiral)} per salinan.` },
  ];
  return (
    <div className="svc" id="svc">
      {cards.map((c) => {
        const sel = c.k === "bind" ? draft.bind !== "none" : c.k === draft.color;
        return (
          <div key={c.k} className={"c" + (sel ? " sel" : "")} data-sv={c.k} onClick={(e) => pick(e, c.k)}>
            <Art name={c.art} />
            <small>{c.small}</small><b>{c.b}</b><span>{c.s}</span>
            <i className="tg">{c.k === "bind" ? (draft.bind === "spiral" ? "Spiral" : "Staples") : "Dipilih"}</i>
          </div>
        );
      })}
    </div>
  );
}
