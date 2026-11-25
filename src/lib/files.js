export const readURL = (f) =>
  new Promise((ok, no) => {
    const r = new FileReader();
    r.onload = () => ok(r.result);
    r.onerror = no;
    r.readAsDataURL(f);
  });

export function shrinkImage(file, max = 1100, q = 0.78) {
  return new Promise((ok, no) => {
    const img = new Image(), u = URL.createObjectURL(file);
    img.onload = () => {
      let { width: w, height: h } = img;
      const k = Math.min(1, max / Math.max(w, h));
      w = Math.round(w * k); h = Math.round(h * k);
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const x = c.getContext("2d");
      x.fillStyle = "#fff"; x.fillRect(0, 0, w, h); x.drawImage(img, 0, 0, w, h);
      c.toBlob((b) => { URL.revokeObjectURL(u); b ? ok(b) : no(new Error("gagal")); }, "image/jpeg", q);
    };
    img.onerror = () => { URL.revokeObjectURL(u); no(new Error("Gambar tidak bisa dibaca")); };
    img.src = u;
  });
}

/* Hitung halaman PDF dengan membaca penanda /Type /Page (cukup untuk PDF biasa). */
export async function pdfPages(file) {
  try {
    const t = new TextDecoder("latin1").decode(new Uint8Array(await file.arrayBuffer()));
    const m = t.match(/\/Type\s*\/Page[^s]/g);
    return m ? m.length : 1;
  } catch { return 1; }
}

/* QRIS contoh (kotak acak) sampai admin mengunggah QRIS asli. */
export function fakeQR() {
  let s = 7, g = "";
  const r = () => (s = (s * 9301 + 49297) % 233280) / 233280, n = 21, c = 4.6;
  const fin = (x, y) => `<rect x="${x * c}" y="${y * c}" width="${7 * c}" height="${7 * c}" fill="#0b2a20"/><rect x="${(x + 1) * c}" y="${(y + 1) * c}" width="${5 * c}" height="${5 * c}" fill="#fff"/><rect x="${(x + 2) * c}" y="${(y + 2) * c}" width="${3 * c}" height="${3 * c}" fill="#0b2a20"/>`;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if ((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)) continue;
    if (r() > 0.52) g += `<rect x="${x * c}" y="${y * c}" width="${c}" height="${c}" fill="#0b2a20"/>`;
  }
  return `<svg viewBox="0 0 ${n * c} ${n * c}">${g}${fin(0, 0)}${fin(14, 0)}${fin(0, 14)}</svg>`;
}
