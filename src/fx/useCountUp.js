import { useEffect, useRef, useState } from "react";
import { REDUCED } from "./effects.js";

/* Angka yang berhitung ke nilai baru (ease-out). Pertama muncul: dari 0 atau dari `start`. */
export function useCountUp(target, dur = 600, fmt = (v) => String(Math.round(v)), start = 0) {
  const shown = useRef(REDUCED ? target : start);
  const [txt, setTxt] = useState(() => fmt(shown.current));
  useEffect(() => {
    const from = shown.current;
    if (REDUCED || from === target) { shown.current = target; setTxt(fmt(target)); return; }
    const t0 = performance.now();
    let raf;
    const step = (t) => {
      const k = Math.min(1, Math.max(0, (t - t0) / dur)), e = 1 - Math.pow(1 - k, 3);
      shown.current = k < 1 ? from + (target - from) * e : target;
      setTxt(fmt(shown.current));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const fin = setTimeout(() => { cancelAnimationFrame(raf); shown.current = target; setTxt(fmt(target)); }, dur + 150);
    return () => { cancelAnimationFrame(raf); clearTimeout(fin); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, dur]);
  return txt;
}

export function Num({ value, dur, fmt, start }) {
  return useCountUp(value, dur, fmt, start);
}
