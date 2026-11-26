import { useEffect, useRef, useState } from "react";
import { useApp } from "../../context.jsx";
import { ART, signSVG } from "../../lib/art.js";
import { clamp, hrsText, isOpen } from "../../lib/format.js";
import { REDUCED, flick, hap } from "../../fx/effects.js";
import Art from "../ui/Art.jsx";
import Logo from "../ui/Logo.jsx";
import { useNow } from "../../hooks/useNow.js";

const PTIPS = ["brrr…", "tcak tcak tcak…", "Satu lembar jadi!", "Mau berapa lembar?", "Yuk kirim file-mu"];
const SIGN_F = { __html: signSVG(true) };
const SIGN_B = { __html: signSVG(false) };

export default function Hero({ onLogo }) {
  const { cfg, photo } = useApp();
  useNow(20000);
  const open = isOpen(cfg);
  const hero = useRef(null), swing = useRef(null), bg = useRef(null), logoClicks = useRef({ n: 0, t: 0 });
  const [hint, setHint] = useState(true);
  const [tip, setTip] = useState({ x: 0, y: 0, txt: "", key: 0, on: false });
  const pti = useRef(0), tipTimer = useRef();

  /* papan buka/tutup: mulai terbalik, lalu berputar ke status sebenarnya */
  const [rot, setRot] = useState(open ? 180 : 0);
  useEffect(() => { const t = setTimeout(() => setRot(open ? 0 : 180), 450); return () => clearTimeout(t); }, [open]);

  useEffect(() => { const t = setTimeout(() => setHint(false), 9000); return () => clearTimeout(t); }, []);

  const showTip = (x, y, txt, ms = 2400) => {
    setTip((t) => ({ x, y, txt, key: t.key + 1, on: true }));
    clearTimeout(tipTimer.current);
    tipTimer.current = setTimeout(() => setTip((t) => ({ ...t, on: false })), ms);
  };

  const onClick = (e) => {
    if (e.target.closest(".ltop")) return;
    setHint(false);
    const r = hero.current.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    const sg = e.target.closest(".sign");
    if (sg) {
      flick(swing.current, "kick", 1750);
      showTip(sg.offsetLeft + sg.offsetWidth / 2, sg.offsetTop + sg.offsetHeight + 14, (open ? "Buka" : "Tutup") + " · " + hrsText(cfg).replace("Buka ", ""));
      hap(10);
    } else if (!photo) {
      flick(bg.current, "go", 2600);
      showTip(x, y + 14, PTIPS[pti.current++ % PTIPS.length], 1800);
      hap([8, 30, 8, 30, 8]);
    }
  };
  const onMove = (e) => {
    if (e.pointerType === "touch") return;
    const r = hero.current.getBoundingClientRect(), s = hero.current.style;
    s.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5) * -10 + "px");
    s.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5) * -6 + "px");
  };

  /* tiga ketukan cepat pada logo membuka login admin */
  const logoTap = () => {
    const c = logoClicks.current;
    c.n++; clearTimeout(c.t); c.t = setTimeout(() => (c.n = 0), 1200);
    if (c.n >= 3) { c.n = 0; onLogo(); }
  };

  /* posisi tooltip dijaga supaya tidak keluar bingkai */
  const tipRef = useRef(null);
  const [tipLeft, setTipLeft] = useState(0);
  useEffect(() => {
    if (!tip.on || !tipRef.current || !hero.current) return;
    const w = tipRef.current.offsetWidth;
    setTipLeft(clamp(tip.x, w / 2 + 10, hero.current.clientWidth - w / 2 - 10));
  }, [tip.key, tip.on, tip.x]);

  return (
    <div className={"hero" + (photo ? " photo" : "")} id="hero" ref={hero} onClick={onClick} onPointerMove={onMove}
      onPointerLeave={() => hero.current.style.setProperty("--px", "0px")}>
      <div className="bg" id="heroBg" ref={bg}
        dangerouslySetInnerHTML={{ __html: photo ? `<img src="${photo}" alt=""><div class="shade"></div>` : ART.scene }} />
      <header className="ltop">
        <Logo id="logo" onClick={logoTap} />
        <div><div className="nm">{cfg.name}</div><small>{cfg.address}</small></div>
        <span className="sp" />
        <span className={"pill " + (open ? "o" : "c")}>{open ? "Buka" : "Tutup"}</span>
      </header>
      <Art name="arm" className="art arm" />
      <div className="sign">
        <div className="swing" ref={swing}>
          <div className="board" style={{ transform: `rotateY(${rot}deg)` }}>
            <div className="face front" dangerouslySetInnerHTML={SIGN_F} />
            <div className="face back" dangerouslySetInnerHTML={SIGN_B} />
          </div>
        </div>
      </div>
      <div className={"hint-tap" + (hint ? "" : " off")}>Ketuk printer atau papannya</div>
      <div ref={tipRef} className={"tip" + (tip.on ? " on" : "")} style={{ top: tip.y, left: tipLeft }}>{tip.txt}</div>
    </div>
  );
}
