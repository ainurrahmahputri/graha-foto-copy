export const CFG0 = {
  name: "Graha Foto Copy",
  address: "Jl. Contoh No. 12, Kota Anda",
  wa: "0812-0000-0000",
  open: "08:00",
  close: "21:00",
  mode: "auto",
  prices: {
    bw: { A4: 500, F4: 600, A3: 1500 },
    color: { A4: 2000, F4: 2500, A3: 5000 },
    bind: { none: 0, staples: 1000, spiral: 7000 },
  },
  pay: {
    ewallet: [
      { n: "DANA", no: "0812-0000-0000", an: "Graha Foto Copy" },
      { n: "GoPay", no: "0812-0000-0000", an: "Graha Foto Copy" },
      { n: "OVO", no: "0812-0000-0000", an: "Graha Foto Copy" },
    ],
    bank: [
      { n: "BCA", no: "000 000 0000", an: "Graha Foto Copy" },
      { n: "BRI", no: "0000 00 000000 00 0", an: "Graha Foto Copy" },
      { n: "Mandiri", no: "000 00 0000000 0", an: "Graha Foto Copy" },
    ],
  },
};

export function mergeCfg(d) {
  if (!d) return CFG0;
  return {
    ...CFG0,
    ...d,
    prices: {
      bw: { ...CFG0.prices.bw, ...(d.prices?.bw || {}) },
      color: { ...CFG0.prices.color, ...(d.prices?.color || {}) },
      bind: { ...CFG0.prices.bind, ...(d.prices?.bind || {}) },
    },
    pay: { ewallet: d.pay?.ewallet || CFG0.pay.ewallet, bank: d.pay?.bank || CFG0.pay.bank },
  };
}

export const INV0 = [
  { n: "Kertas A4 (rim)", q: 10, min: 3 },
  { n: "Kertas F4 (rim)", q: 8, min: 3 },
  { n: "Kertas A3 (rim)", q: 3, min: 1 },
  { n: "Toner hitam", q: 2, min: 1 },
  { n: "Tinta warna (set)", q: 2, min: 1 },
  { n: "Spiral jilid (pak)", q: 5, min: 2 },
  { n: "Plastik cover (pak)", q: 4, min: 1 },
];
