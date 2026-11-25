import { useEffect, useRef, useState } from "react";
import { useApp } from "../../context.jsx";
import { isDemo } from "../../api/client.js";
import Logo from "../ui/Logo.jsx";
import PayBar, { BarCtx } from "./PayBar.jsx";
import Step1 from "./Step1Files.jsx";
import Step2 from "./Step2Confirm.jsx";
import Step3 from "./Step3Pay.jsx";
import Step4 from "./Step4Track.jsx";

const NAMES = ["Berkas", "Konfirmasi", "Bayar", "Lacak"];
const BAR0 = { label: "Estimasi total", amount: 0, text: "Lanjut", disabled: true, busy: false, back: false, hidden: false, fn: { current: {} } };

export default function CustomerApp() {
  const { cfg, view, go, tab, goTab, draft, order } = useApp();
  const [bar, setBar] = useState(BAR0);
  const pane = useRef(null), tabs = useRef(null), prev = useRef(0);

  /* animasi masuk tiap ganti langkah (mundur = arah sebaliknya) */
  useEffect(() => {
    if (view !== "app") { prev.current = 0; return; }
    const p = pane.current, tb = tabs.current;
    if (!p) return;
    const back = tab < prev.current;
    prev.current = tab;
    p.classList.remove("enter", "back"); void p.offsetWidth; p.classList.add("enter"); if (back) p.classList.add("back");
    tb.classList.add("tin");
    const a = setTimeout(() => p.classList.remove("enter", "back"), 1000);
    const b = setTimeout(() => tb.classList.remove("tin"), 900);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [tab, view]);

  const Step = tab === 3 && !order ? Step1 : [Step1, Step2, Step3, Step4][tab - 1];

  return (
    <BarCtx.Provider value={setBar}>
      <section id="app" className={"view" + (view === "app" ? " on" : "")}>
        <header className="ahead">
          <div className="aw">
            <div className="abar">
              <Logo />
              <div><b>{cfg.name}</b><small>Print dan fotokopi</small></div>
              <span className="sp" />
              <button className="home" onClick={() => go("landing")}>Beranda</button>
            </div>
            <div className="seg4" id="tabs" ref={tabs}>
              {NAMES.map((n, i) => {
                const k = i + 1, dis = (k === 2 && !draft.files.length) || (k === 3 && !order);
                return (
                  <button key={k} className={"seg " + (tab === k ? "on" : k < tab ? "done" : "")} disabled={dis} onClick={() => goTab(k)}>
                    <i />{k}. {n}
                  </button>
                );
              })}
            </div>
          </div>
        </header>
        {isDemo && <div id="demoBar" className="demo">Mode demo: data hanya tersimpan di perangkat ini.</div>}
        <main className="aw" id="pane" ref={pane}><Step /></main>
        <PayBar bar={bar} tab={tab} />
      </section>
    </BarCtx.Provider>
  );
}
