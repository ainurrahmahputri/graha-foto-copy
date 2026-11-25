import { createContext, useContext, useEffect, useRef } from "react";
import { useCountUp } from "../../fx/useCountUp.js";
import { flick } from "../../fx/effects.js";
import { rp } from "../../lib/format.js";

/*
  Bar harga di bawah layar. Satu instance saja (angkanya berhitung antar langkah),
  tiap langkah mengatur isinya lewat useBar().
*/
export const BarCtx = createContext(() => {});

export function useBar(p) {
  const set = useContext(BarCtx);
  const fn = useRef({});
  fn.current = { onNext: p.onNext, onDisabled: p.onDisabled, onBack: p.onBack };
  useEffect(() => {
    set({ label: p.label, amount: p.amount, text: p.text, disabled: !!p.disabled, busy: !!p.busy, back: !!p.back, hidden: !!p.hidden, fn });
  }, [set, p.label, p.amount, p.text, p.disabled, p.busy, p.back, p.hidden]);
}

export default function PayBar({ bar, tab }) {
  const amt = useCountUp(bar.amount || 0, 420, rp, 0);
  const amtRef = useRef(null), btnRef = useRef(null), prevDis = useRef(true), prevAmt = useRef(0);

  useEffect(() => {
    if ((bar.amount || 0) !== prevAmt.current) { prevAmt.current = bar.amount || 0; flick(amtRef.current, "tick", 350); }
  }, [bar.amount]);
  useEffect(() => {
    if (prevDis.current && !bar.disabled && tab === 1) flick(btnRef.current, "ready", 950);
    prevDis.current = bar.disabled;
  }, [bar.disabled, tab]);

  const onBarClick = (e) => {
    if (!bar.disabled || e.target.closest("#pBack")) return;
    bar.fn.current.onDisabled && bar.fn.current.onDisabled();
  };

  return (
    <div className={"pbar" + (tab >= 2 ? " compact" : "") + (bar.busy ? " busy" : "")} id="pbar"
      style={{ display: bar.hidden ? "none" : "block" }} onClick={onBarClick}>
      <div className="aw">
        <div className="t"><small>{bar.label}</small><b ref={amtRef}>{amt}</b></div>
        <button className="btn ghost" id="pBack" style={{ display: bar.back ? "inline-flex" : "none" }} onClick={() => bar.fn.current.onBack && bar.fn.current.onBack()}>Kembali</button>
        <button className="btn gold" ref={btnRef} disabled={bar.disabled} onClick={() => bar.fn.current.onNext && bar.fn.current.onNext()}>
          {bar.busy ? <><span className="spin" /> {bar.text}</> : bar.text}
        </button>
      </div>
    </div>
  );
}
