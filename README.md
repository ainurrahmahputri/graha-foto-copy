# Graha Foto Copy: front end React

Aplikasi pemesanan print untuk toko fotokopi: halaman pelanggan (HP) dan dashboard admin (desktop atau HP).

## Stack

| Bagian | Teknologi |
|---|---|
| Front end | React 19 (dibangun dengan Vite) + Tailwind CSS v4 |
| Backend (tim lain) | Node.js + Express.js |
| Database | Supabase (PostgreSQL) |
| Deploy | Vercel (front end), Railway (backend) |
| AI cek bukti bayar | Python (PyTorch, Pillow, OpenCV), dipanggil oleh Express |

Isi repo ini hanya **front end**. Semua data lewat satu file, `src/api/client.js`, yang memanggil REST API Express. Daftar endpoint ada di [`docs/API.md`](docs/API.md).

## Menjalankan di VS Code

Butuh Node.js 20 atau lebih baru.

```bash
cd frontend
npm install
npm run dev
```

Buka http://localhost:5173. Tanpa backend pun jalan: otomatis **mode demo** (data di localStorage browser, tidak ada server).

- Ganti ke admin: tekan logo tiga kali cepat, atau pakai pil **Pelanggan | Admin** di pojok (hanya mode demo).
- Login admin mode demo: `admin` / `graha2026` (hanya di `src/api/demo.js`, tidak ikut ke mode live).

## Menyambung ke backend Express

1. Salin `frontend/.env.example` jadi `frontend/.env`
2. Isi alamat API: `VITE_API_URL=http://localhost:3000/api` (atau alamat Railway)
3. Restart `npm run dev`

Begitu `VITE_API_URL` terisi, mode demo mati dan semua panggilan memakai endpoint di `docs/API.md`. Saat `npm run dev`, alamat `/api` juga diteruskan ke `http://localhost:3000` lewat proxy di `vite.config.js`.

## Build dan deploy

```bash
cd frontend
npm run build      # hasil di dist/
npm run preview    # coba hasil build
```

**Vercel**: impor repo GitHub, framework Vite (terdeteksi otomatis), tambahkan environment variable `VITE_API_URL` berisi alamat Railway, lalu deploy. **Railway**: deploy Express dari repo backend, dan izinkan domain Vercel di CORS.

## Struktur

Root repo berisi `frontend/` (React + Vite), `backend/` (Express, masih kerangka) dan `docs/`.

```
frontend/src/
  main.jsx, App.jsx        titik masuk, kerangka layar
  context.jsx              state bersama: toko, draft pesanan, layar, toast
  api/
    client.js              satu-satunya pintu data (demo atau Express)
    demo.js                backend palsu di localStorage
  components/
    customer/              Landing, Hero, Services, Calculator, langkah 1-4, PayBar
    admin/                 Admin, tab Pesanan/Keuangan/Item/Pengaturan, modal login dan berkas
    ui/                    Art (ilustrasi), Logo, Modal, PageTitle
  fx/                      efek: riak sentuh, konfeti, tirai antar layar, angka berhitung
  hooks/                   useNow, useReveal
  lib/                     art.js (ilustrasi SVG), format, config, file helper
  styles/
    index.css              Tailwind + legacy.css
    legacy.css             gaya tampilan dan animasi
docs/API.md                kontrak API untuk tim backend
```

## Tentang Tailwind di proyek ini

Tailwind v4 terpasang lewat plugin Vite dan dipakai untuk utility (jarak, ukuran, warna, grid) di komponen. Gaya inti tampilan, ilustrasi, dan semua animasi masih di `src/styles/legacy.css` (CSS biasa) supaya tampilan sama persis dengan desain yang sudah disetujui. Jadi ini **hibrida**, bukan semuanya utility Tailwind. Preflight (reset bawaan Tailwind) sengaja dimatikan di `index.css` karena `legacy.css` sudah punya reset sendiri. Komponen baru boleh langsung pakai utility Tailwind, dan `legacy.css` bisa dipindahkan ke utility sedikit demi sedikit kalau tim mau.

## Cara kerja alur pelanggan

1. Beranda: pilih layanan atau hitung harga, tekan **Mulai print**
2. Langkah 1: upload file (halaman PDF dihitung otomatis), opsi cetak, data pemesan
3. Langkah 2: cek ringkasan, **Buat pesanan** → `POST /orders`
4. Langkah 3: bayar (QRIS/e-wallet/bank), upload bukti → `POST /orders/:code/proof`
5. Langkah 4: lacak status. Halaman ini cek ulang ke server tiap 5 detik

Admin mengubah status lewat `PATCH /orders/:code`, dan dashboard cek ulang tiap 4 detik, jadi pesanan baru muncul tanpa refresh.

## Yang perlu diketahui

- Total harga dihitung di browser hanya untuk tampilan. **Server wajib menghitung ulang** (rumus ada di `docs/API.md`).
- Real-time memakai polling. Kalau mau lebih halus, backend bisa menambah SSE atau Supabase Realtime, lalu `refreshMine` di `context.jsx` dan `refreshOrders` di `Admin.jsx` diganti.
- Mode demo menyimpan berkas di localStorage (batas sekitar 5 MB), jadi cocok untuk coba-coba saja.
- Font diambil dari Google Fonts (lihat `index.html`), perlu internet.
