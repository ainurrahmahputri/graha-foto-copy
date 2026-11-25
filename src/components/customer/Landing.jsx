import { useEffect, useMemo, useRef } from "react";
import { useApp } from "../../context.jsx";
import { fmtLeft, hrsText, isOpen, nowWIB, toMin } from "../../lib/format.js";
import { REDUCED, wipe } from "../../fx/effects.js";
import { useNow } from "../../hooks/useNow.js";
import { useReveal } from "../../hooks/useReveal.js";
import Art from "../ui/Art.jsx";
import Hero from "./Hero.jsx";
import Services from "./Services.jsx";
import Calculator from "./Calculator.jsx";

const USES = ["tugas kuliah", "skripsi", "laporan PKL", "poster A3", "foto berwarna", "undangan", "proposal"];

function liveText(cfg) {
  const n = nowWIB();
  if (cfg.mode === "open") return "Buka sekarang";
  if (cfg.mode === "closed") return "Tutup sementara";
  if (isOpen(cfg)) return `Buka sekarang · tutup ${fmtLeft(toMin(cfg.close) - n)} lagi`;
  if (n < toMin(cfg.open)) return `Tutup · buka ${fmtLeft(toMin(cfg.open) - n)} lagi`;
  return `Tutup · buka besok ${cfg.open.replace(":", ".")}`;
}

export default function Landing() {
  const { cfg, view, go, goTab, setLoginOpen } = useApp();
  useNow(20000);
  const ld = useRef(null), paper = useRef(null), word = useRef(null), active = useRef(false);
  active.current = view === "landing";
  const open = isOpen(cfg);

  /* tepi atas kertas sobek, acak sekali */
  const clip = useMemo(() => {
    const t = [];
    for (let i = 0; i <= 46; i++) t.push((i / 46 * 100).toFixed(2) + "% " + (Math.random() * 16 + 2).toFixed(1) + "px");
    return "polygon(" + t.join(",") + ",100% 100%,0 100%)";
  }, []);

  useReveal(ld, active);

  /* kata yang berganti di "Biasa dicetak" */
  useEffect(() => {
    if (REDUCED) return;
    let i = 0;
    const iv = setInterval(() => {
      const w = word.current;
      if (!active.current || !w) return;
      w.classList.add("out");
      setTimeout(() => {
        i = (i + 1) % USES.length; w.textContent = USES[i];
        w.classList.add("pre"); void w.offsetWidth; w.classList.remove("pre", "out");
      }, 330);
    }, 2600);
    return () => clearInterval(iv);
  }, []);

  /* paralaks hero saat digulir */
  const raf = useRef();
  const onScroll = () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const h = document.getElementById("hero");
      if (h && ld.current) h.style.setProperty("--sy", Math.min(ld.current.scrollTop, 420) * 0.28 + "px");
    });
  };

  const wd = String(cfg.wa || "").replace(/\D/g, "").replace(/^0/, "62");

  return (
    <section id="landing" ref={ld} className={"view" + (view === "landing" ? " on" : "")} onScroll={onScroll}>
      <Hero onLogo={() => setLoginOpen(true)} />
      <div className="paper" id="paper" ref={paper} style={{ clipPath: clip }}>
        <div className="hbody">
          <span className="eb">Cetak tanpa antre</span>
          <h1>Mau print apa<i>hari ini?</i></h1>
          <p>Kirim file dari HP, pilih ukuran dan jilidnya, bayar, lalu ambil di toko.</p>
          <div className="uses">Biasa dicetak: <span className="win"><span ref={word}>{USES[0]}</span></span></div>
          <div className="cta">
            <button className="btn gold" onClick={(e) => wipe(e, () => { go("app"); goTab(1); })}>Mulai print</button>
            <button className="lnk" onClick={(e) => wipe(e, () => { go("app"); goTab(4); })}>Cek pesananku</button>
          </div>
          <div className="live"><i className={"dot" + (open ? " on" : "")} /><span>{liveText(cfg)}</span></div>
        </div>

        <div className="sec"><span className="eb">Layanan</span><h2>Pilih sesuai <i>kebutuhanmu</i></h2></div>
        <Services />
        <div className="sec"><span className="eb">Cek harga cepat</span><h2>Hitung <i>sebelum cetak</i></h2></div>
        <Calculator />
        <div className="sec"><span className="eb">Cara kerja</span><h2>Tiga langkah, <i>tanpa antre</i></h2></div>
        <ol className="how">
          <li><Art name="send" /><div><em>01</em><strong>Kirim dari HP</strong><span>Pilih file, ukuran kertas, dan jilid. Total harga langsung terlihat.</span></div></li>
          <li><Art name="printer" /><div><em>02</em><strong>Kami cetak</strong><span>Bayar lewat QRIS, e-wallet, atau bank, lalu pantau statusnya.</span></div></li>
          <li><Art name="pick" /><div><em>03</em><strong>Ambil di toko</strong><span>Mepet deadline? Pilih ambil hari ini. Santai? Besok juga bisa.</span></div></li>
        </ol>
      </div>

      <footer className="foot">
        <span className="eb">Datang ke toko</span><h3>{cfg.name}</h3>
        <div className="row"><small>Alamat</small><span>{cfg.address}</span></div>
        <div className="row"><small>Jam buka</small><span>{hrsText(cfg)} WIB</span></div>
        <div className="row"><small>WhatsApp</small><span>{cfg.wa}</span></div>
        <a className="btn line sm" href={wd ? "https://wa.me/" + wd : "#"} target="_blank" rel="noopener noreferrer">Chat WhatsApp</a>
        <div className="fine">© Graha Foto Copy</div>
      </footer>
    </section>
  );
}
