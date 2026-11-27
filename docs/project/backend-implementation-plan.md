# Implementation Plan Backend (Express)

Penanggung jawab: Cut Fenny Nandalita (AI Full-Stack Developer)
Dikerjakan per tahap. Setiap tahap diperiksa dulu sebelum lanjut ke tahap berikutnya.
Tidak ada commit tanpa izin pemilik repo.

## Tahap 1. Setup Express (selesai, menunggu review)
- `backend/package.json` (ES module, Node 20+), dependensi: `express`, `cors`, `dotenv`
- `src/app.js`: CORS (izinkan header `Authorization`, `X-Client-Id`, `Content-Type`), parser JSON, prefix `/api`
- `src/server.js`: membaca `.env`, menjalankan server di `PORT` (default 3000, sama dengan proxy Vite)
- `GET /api/health` -> `200 { status: "ok", time }`
- Format error sesuai `docs/API.md`: `{ "message": "..." }` untuk 404 dan 500
- `.env.example` (PORT, CORS_ORIGIN)
- Cek: `npm run dev`, lalu buka `http://localhost:3000/api/health`

## Tahap 2. Konfigurasi tarif
- Salin `tarif.json` ke `src/config/tarif.json`
- `src/config/tarif.js`: memuat dan memvalidasi (jenis kertas, kelas warna, tarif per kelas, laminating, pembulatan). Server gagal start dengan pesan jelas kalau tarif rusak
- `GET /api/tarif` (publik) supaya frontend bisa menampilkan daftar harga dari sumber yang sama

## Tahap 3. Modul hitung harga + 35 kasus uji
- `src/services/harga.js`: fungsi murni `hitungHarga({ jenisKertas, halBw, hal10, hal30, hal70, hal100, rangkap, laminating })`
- Aturan dari `tarif.json`: B/W Rp1.000 per 3 lembar, tarif per kelas warna, laminating per lembar, pembulatan sekali di akhir (ke atas, kelipatan 1.000, minimum 1.000, toleransi 1e-6)
- Tes `node:test` (tanpa dependensi tambahan) memakai `kasus_uji_harga.csv`, 35 kasus harus lolos
- Koordinasi: modul harga di project plan adalah tugas Syifaunnisa. Sepakati apakah kode ini dipakai, atau aturannya dari Syifaunnisa dan backend hanya mengintegrasikan

## Tahap 4. Database Supabase
- `docs/database/schema.sql`: tabel `orders`, `order_files` (termasuk hasil analisis per halaman/kelas warna), status pesanan
- `src/config/supabase.js`: klien Supabase dari `.env` (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, hanya di server)
- Pembuatan project Supabase dan pengisian `.env` dilakukan sendiri oleh pemilik akun

## Tahap 5. Endpoint pesanan dasar
- `POST /api/orders`, `GET /api/orders/mine`, `GET /api/orders` (admin), `GET /api/orders/:code`, `PATCH /api/orders/:code` (ubah status)
- Server selalu menghitung ulang harga, tidak percaya angka dari browser
- Hasil analisis warna memakai data tiruan (`src/services/analisis.js`) sampai layanan AI siap (pencegahan R4)

## Menunggu keputusan setelah diskusi mentor
- Autentikasi: pelanggan tanpa akun (`X-Client-Id`) atau login mahasiswa seperti di project plan
- Upload PDF: signed URL langsung ke Supabase Storage atau lewat Express
- Integrasi layanan Python: service terpisah atau tidak, request langsung atau proses latar belakang
- Polling atau Supabase Realtime

## Konflik yang harus diputuskan sebelum Tahap 3 dan 5
`docs/API.md` masih memakai model harga dan status versi lama, yang berbeda dengan `tarif.json` dan project plan:

| Bagian | docs/API.md | tarif.json / project plan |
|---|---|---|
| Ukuran kertas | A4, F4, A3 | A4, Legal, Kertas Sertif |
| Warna | `bw` / `color` per pesanan | B/W + kelas warna 10/30/70/100 per halaman |
| Layanan tambahan | jilid (staples, spiral) | laminating; jilid belum punya tarif |
| Pembulatan | tidak ada | ke atas kelipatan 1.000, minimum 1.000 |
| Status | 7 status + alur bukti bayar | belum selesai / selesai |
| Pembayaran, stok, keuangan | ada endpoint | di luar cakupan MVP |

Usulan: backend mengikuti `tarif.json` dan project plan, lalu `docs/API.md` dan frontend diperbarui menyesuaikan.
