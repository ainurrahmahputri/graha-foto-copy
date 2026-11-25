import { useEffect } from "react";

/*
  Elemen landing muncul pelan saat digulir ke layar.
  Tanpa IntersectionObserver (sengaja): dicek lewat scroll + interval, plus jaring pengaman 30 detik.
*/
export function useReveal(ref, active) {
  useEffect(() => {
    const ld = ref.current;
    if (!ld) return;
    const revealEl = (el) => {
      el.style.setProperty("--d", (el._i || 0) * 90 + "ms");
      el.classList.add("in");
      const h = (ev) => {
        if (ev.target !== el || ev.animationName !== "rvIn") return;
        el.classList.remove("rv", "in"); el.removeEventListener("animationend", h);
      };
      el.addEventListener("animationend", h);
      setTimeout(() => el.classList.remove("rv", "in"), 2500);
      if (el.matches(".how li")) {
        setTimeout(() => { el.classList.add("go"); setTimeout(() => el.classList.remove("go"), 2800); }, 600 + (el._i || 0) * 250);
      }
    };
    const check = () => {
      if (!active.current) return;
      const lr = ld.getBoundingClientRect();
      ld.querySelectorAll(".rv:not(.in)").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < lr.bottom - 30 && r.bottom > lr.top) revealEl(el);
      });
    };
    ld.querySelectorAll(".sec,.how li,.calc,.foot .row").forEach((el) => {
      el.classList.add("rv");
      el._i = el.matches(".how li") ? [...el.parentNode.children].indexOf(el) : 0;
    });
    check();
    const iv = setInterval(check, 500);
    const safe = setTimeout(() => ld.querySelectorAll(".rv").forEach((el) => el.classList.remove("rv")), 30000);
    ld.addEventListener("scroll", check, { passive: true });
    return () => { clearInterval(iv); clearTimeout(safe); ld.removeEventListener("scroll", check); };
  }, [ref, active]);
}
