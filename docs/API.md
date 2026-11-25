# Kontrak API (untuk tim backend Express)

Front end sudah memanggil endpoint di bawah lewat `src/api/client.js`. Selama backend belum siap, front end jalan dalam **mode demo** (data di localStorage). Begitu `VITE_API_URL` diisi, semua panggilan pindah ke Express tanpa mengubah komponen.

- Base URL: nilai `VITE_API_URL`, contoh `https://graha-api.up.railway.app/api`
- Format: JSON, kecuali yang ditandai **multipart**
- Waktu: epoch milidetik (`createdAt: 1763890000000`)
- Zona waktu bisnis: WIB (Asia/Jakarta)
- CORS: izinkan origin Vercel milik front end, dan header `Authorization`, `X-Client-Id`, `Content-Type`

## Identitas pemanggil

| Peran | Cara dikenali |
|---|---|
| Pelanggan (tanpa login) | Header `X-Client-Id: <string acak dari perangkat>`. Pesanan milik pelanggan = pesanan dengan `clientId` yang sama. |
| Admin | Header `Authorization: Bearer <JWT>` dari `POST /auth/login`. |

Endpoint bertanda **admin** wajib menolak tanpa token yang valid dengan `401`.

## Format error

```json
{ "message": "Teks yang boleh langsung ditampilkan ke pengguna" }
```

Status yang dipakai: `400` input salah, `401` belum login, `403` bukan pemilik pesanan, `404` tidak ada, `413` file terlalu besar, `422` bukti ditolak AI (lihat di bawah), `500` error server.

## Bentuk data

### Order

```json
{
  "code": "GFC-261123-WPPM",
  "name": "Rina Aulia",
  "wa": "0812...",
  "files": [{ "name": "bab1.pdf", "type": "application/pdf", "size": 120331, "pages": 12 }],
  "color": "bw",            // "bw" | "color"
  "size": "A4",             // "A4" | "F4" | "A3"
  "sides": "1",             // "1" | "2"
  "copies": 2,
  "bind": "none",           // "none" | "staples" | "spiral"
  "pickup": "today",        // "today" | "tomorrow"
  "pickupLabel": "Senin, 23 November",
  "note": "halaman 1-10 saja",
  "pages": 12,              // total halaman semua file
  "total": 24000,           // rupiah, DIHITUNG SERVER
  "status": "draft",        // draft | menunggu | dikonfirmasi | dicetak | siap | selesai | ditolak
  "payMethod": "qris",      // ada setelah bukti dikirim: "qris" | "ewallet" | "bank"
  "hasProof": false,
  "ai": { "manual": false, "match": true, "amount": 24000, "method": "QRIS", "datetime": null, "note": "..." },
  "adminNote": "",
  "createdAt": 1763890000000
}
```

`ai` hanya ada setelah bukti dikirim. `ai.manual = true` berarti AI tidak tersedia dan admin harus cek sendiri.

### Rumus harga (server wajib menghitung ulang, jangan percaya angka dari browser)

```
cetak = total_halaman * copies * harga[color][size]
jilid = harga.bind[bind] * copies
total = cetak + jilid
```

Harga diambil dari konfigurasi toko (`GET /config`).

### Shop (konfigurasi toko)

```json
{
  "name": "Graha Foto Copy", "address": "...", "wa": "0812-...",
  "open": "08:00", "close": "21:00",
  "mode": "auto",           // "auto" | "open" | "closed"
  "prices": {
    "bw":    { "A4": 500,  "F4": 600,  "A3": 1500 },
    "color": { "A4": 2000, "F4": 2500, "A3": 5000 },
    "bind":  { "none": 0, "staples": 1000, "spiral": 7000 }
  },
  "pay": {
    "ewallet": [{ "n": "DANA", "no": "0812-...", "an": "Graha Foto Copy" }],
    "bank":    [{ "n": "BCA",  "no": "000 ...",  "an": "Graha Foto Copy" }]
  }
}
```

## Endpoint

### Auth

| Method | Path | Body | Respons |
|---|---|---|---|
| POST | `/auth/login` | `{ "username": "...", "password": "..." }` | `200 { "token": "<JWT>" }`, salah: `401` |

### Konfigurasi toko

| Method | Path | Akses | Keterangan |
|---|---|---|---|
| GET | `/config` | publik | `200 { "shop": Shop, "photoUrl": string\|null, "qrisUrl": string\|null }`. URL boleh dari Supabase Storage. Front end memanggil ini tiap 60 detik. |
| PUT | `/config` | admin | Body = `Shop`. Respons `200` bebas. |
| PUT | `/config/photo` | admin | **multipart**, field `file` (gambar). Foto beranda. |
| DELETE | `/config/photo` | admin | `204`. |
| PUT | `/config/qris` | admin | **multipart**, field `file` (gambar QRIS). |

### Pesanan (pelanggan)

| Method | Path | Keterangan |
|---|---|---|
| POST | `/orders` | **multipart**. Field `data` = string JSON `{ name, wa, color, size, sides, copies, bind, pickup, note, files: [{ name, pages }] }`. Field `files` = file-file (urutan sama dengan `data.files`). Server membuat `code`, menghitung `total`, menyimpan `clientId` dari header, status `draft`. Respons `201 Order`. Batas: 2,5 MB per file non-gambar. |
| GET | `/orders/mine` | Semua pesanan milik `X-Client-Id`, terbaru dulu. `200 Order[]`. Dipanggil tiap 5 detik saat pelanggan membuka aplikasinya. |
| POST | `/orders/:code/proof` | **multipart**. Field `file` (gambar bukti, JPEG) dan `method` (`qris`/`ewallet`/`bank`). Hanya pemilik pesanan (`clientId` cocok). Server menjalankan cek AI (lihat di bawah). Lolos atau AI tidak tersedia: status jadi `menunggu`, respons `200 Order` dengan `ai`. Ditolak AI: `422`. |

Respons `422` dari `/proof`:

```json
{ "message": "Bukti belum sesuai", "reasons": ["Nominal di bukti Rp 20.000 tidak sama dengan total pesanan Rp 24.000."] }
```

Front end menampilkan `reasons` apa adanya, lalu meminta pelanggan upload ulang.

### Pesanan (admin)

| Method | Path | Keterangan |
|---|---|---|
| GET | `/orders` | Semua pesanan, terbaru dulu. Boleh `?status=menunggu`. Dipanggil tiap 4 detik saat dashboard terbuka. |
| PATCH | `/orders/:code` | Body `{ "status"?: "...", "adminNote"?: "..." }`. Alur yang dipakai UI: `menunggu → dikonfirmasi → dicetak → siap → selesai`, atau `ditolak` dari status mana pun sebelum selesai. Simpan waktu perubahan (mis. `dikonfirmasiAt`). Respons `200 Order`. |
| GET | `/orders/:code/files/:index` | Stream file ke-`index` (mulai 0) dengan `Content-Type` aslinya. |
| GET | `/orders/:code/proof` | Stream gambar bukti bayar. |

### Stok dan keuangan (admin)

| Method | Path | Keterangan |
|---|---|---|
| GET | `/inventory` | `200 [{ "n": "Kertas A4 (rim)", "q": 10, "min": 3 }]`, atau `null` kalau belum pernah disimpan (front end memakai daftar bawaan). |
| PUT | `/inventory` | Body `{ "items": [...] }` menggantikan seluruh daftar. |
| GET | `/finance/expenses` | `200 [{ "id": "...", "d": "2026-11-23", "n": "Beli toner", "amt": 250000 }]` |
| POST | `/finance/expenses` | Body `{ "d": "2026-11-23", "n": "...", "amt": 250000 }`, respons `201` objek dengan `id`. |
| DELETE | `/finance/expenses/:id` | `204`. |

Omset dan laba dihitung di front end dari `GET /orders` (status `dikonfirmasi`, `dicetak`, `siap`, `selesai`) dikurangi pengeluaran. Kalau datanya sudah besar, tambahkan `GET /finance/summary` nanti.

## Cek bukti bayar dengan AI (tim Python)

Saat `POST /orders/:code/proof`, Express mengirim gambar bukti dan `total` ke layanan Python (PyTorch/OpenCV/Pillow), mis. `POST http://ai-service/check`. Hasil yang dibutuhkan:

```json
{ "is_payment_proof": true, "successful": true, "amount": 24000, "method": "QRIS", "datetime": null, "suspicious": false, "note": "Satu kalimat." }
```

Aturan yang dipakai di aplikasi lama, silakan dipertahankan:

- bukan bukti pembayaran: tolak, "Gambar tidak terbaca sebagai bukti pembayaran."
- status tidak terlihat berhasil: tolak
- `amount` kosong atau tidak sama dengan `total`: tolak
- `suspicious = true`: tolak
- layanan AI mati atau timeout: **jangan tolak**. Simpan `ai: { manual: true, note: "AI sedang tidak tersedia, jadi admin yang akan cek buktimu." }` dan lanjut ke `menunggu`.

## Saran skema Supabase (PostgreSQL)

- `shop_config` (1 baris: kolom JSONB `shop`, `photo_path`, `qris_path`)
- `orders` (`code` unik, `client_id`, kolom opsi cetak, `total`, `status`, `pay_method`, `ai` JSONB, `admin_note`, `created_at`, `proof_path`)
- `order_files` (`order_code`, `idx`, `name`, `type`, `size`, `pages`, `path`)
- `expenses` (`id`, `d` date, `n`, `amt`)
- `inventory_items` (`id`, `n`, `q`, `min`)
- Storage bucket privat: `order-files`, `order-proofs`. Bucket `shop-assets` boleh publik untuk foto toko dan QRIS.

Password admin jangan disimpan di front end. Simpan hash (bcrypt) di environment atau tabel `admins`, dan terbitkan JWT dari `/auth/login`.
