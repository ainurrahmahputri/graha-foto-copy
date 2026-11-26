/* Efek visual dan getar. Semua murni DOM/Web Animations API, tidak menyentuh state React. */
export const REDUCED = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
export const hap = (n) => { try { navigator.vibrate && navigator.vibrate(n); } catch { /* abaikan */ } };

/* Ulangi animasi CSS dengan menambah class sebentar. */
export function flick(el, cls, ms) {
  if (!el) return;
  el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), ms);
}

/* Konfeti kertas dari sebuah elemen, di dalam bingkai HP. */
export function burst(el) {
  const ph = document.getElementById("phone");
  if (REDUCED || !el || !ph) return;
  const pr = ph.getBoundingClientRect(), r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2 - pr.left, cy = r.top + r.height / 2 - pr.top;
  const cols = ["#0f6a4a", "#58b894", "#ffffff", "#d9efe4", "#c9b87a", "#8fd1b4"];
  for (let i = 0; i < 28; i++) {
    const p = document.createElement("i");
    p.className = "cf";
    p.style.cssText = `left:${cx}px;top:${cy}px;width:${5 + Math.random() * 5}px;height:${7 + Math.random() * 7}px;background:${cols[i % cols.length]};box-shadow:0 0 0 1px rgba(0,0,0,.08)`;
    ph.appendChild(p);
    const a = Math.random() * Math.PI * 2, v = 70 + Math.random() * 130;
    const dx = Math.cos(a) * v, dy = Math.sin(a) * v - 90;
    const an = p.animate(
      [
        { transform: "translate(0,0) rotate(0)", opacity: 1 },
        { transform: `translate(${dx}px,${dy}px) rotate(${Math.random() * 540}deg)`, opacity: 1, offset: 0.5 },
        { transform: `translate(${dx * 1.15}px,${dy + 280}px) rotate(${Math.random() * 900}deg)`, opacity: 0 },
      ],
      { duration: 1300 + Math.random() * 600, easing: "cubic-bezier(.2,.7,.4,1)" }
    );
    an.onfinish = () => p.remove();
  }
}

/* Tirai lingkaran antar layar. `cb` dijalankan saat layar tertutup penuh. */
export function wipe(e, cb) {
  const ph = document.getElementById("phone");
  if (REDUCED || !ph) return cb();
  const pr = ph.getBoundingClientRect();
  const t = e && e.currentTarget && e.currentTarget.getBoundingClientRect ? e.currentTarget.getBoundingClientRect() : pr;
  const x = ((e && e.clientX) || t.left + t.width / 2) - pr.left;
  const y = ((e && e.clientY) || t.top + t.height / 2) - pr.top;
  const d = document.createElement("div");
  d.className = "wipe";
  d.innerHTML = (document.querySelector("[data-logo]") || {}).innerHTML || "";
  ph.appendChild(d);
  const R = Math.hypot(Math.max(x, pr.width - x), Math.max(y, pr.height - y)) + 24;
  let done = false;
  const go = () => {
    if (done) return; done = true; cb();
    try { d.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, easing: "ease-out", fill: "forwards" }).onfinish = () => d.remove(); } catch { /* abaikan */ }
    setTimeout(() => d.remove(), 900);
  };
  try {
    d.animate([{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${R}px at ${x}px ${y}px)` }],
      { duration: 460, easing: "cubic-bezier(.6,.05,.3,1)", fill: "forwards" }).onfinish = go;
  } catch { go(); }
  setTimeout(go, 700);
}

/* Riak sentuh, pop, getar kecil, dan gerak ilustrasi saat diketuk. Dipasang sekali di App. */
const RIP = ".btn,.opt,.seg,.step button,.home,.x,.svc .c,.how li,.drop,.lnk,.fl button,.side nav button,.cb";
export function installGlobalFx() {
  const down = (e) => {
    const t = e.target.closest && e.target.closest(RIP);
    if (!t || t.disabled || REDUCED) return;
    const r = t.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2, s = document.createElement("span");
    s.className = "rip";
    s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    t.appendChild(s);
    setTimeout(() => s.remove(), 650);
  };
  const click = (e) => {
    const o = e.target.closest(".opt,.seg,.fl button");
    if (o && !o.disabled) flick(o, "pop", 400);
    if (e.target.closest(".btn,.opt,.seg,.cb,.step button")) hap(5);
    const lg = e.target.closest(".logo");
    if (lg) flick(lg, "pop", 450);
    const ar = e.target.closest("[data-art]");
    if (ar) flick(ar, "go", 2700);
  };
  document.addEventListener("pointerdown", down, { passive: true });
  document.addEventListener("click", click);
  return () => { document.removeEventListener("pointerdown", down); document.removeEventListener("click", click); };
}

/* Tombol "Lanjut" yang belum aktif ditekan: gulir ke bagian yang kurang, goyang, beri tahu. */
export function nudge(el, msg, focus, toast) {
  if (!el) return;
  toast(msg); hap(14);
  el.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "center" });
  el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake", "hl");
  setTimeout(() => el.classList.remove("shake", "hl"), 1300);
  if (focus) setTimeout(() => el.focus({ preventScroll: true }), 380);
}
