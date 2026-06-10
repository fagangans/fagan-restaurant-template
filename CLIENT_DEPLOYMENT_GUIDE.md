# CLIENT DEPLOYMENT GUIDE
## Panduan Lengkap Memasang Website Restaurant Anda

> **Untuk siapa panduan ini?**
> Panduan ini ditulis untuk pemilik bisnis atau staf yang belum terbiasa dengan coding.
> Tidak perlu paham programming. Ikuti langkah demi langkah.
>
> **Total estimasi waktu: 15–30 menit** untuk website Anda live di internet.

---

## Daftar Isi

1. [Persiapan Awal](#persiapan-awal) — 5 menit
2. [Clone Template](#langkah-1-clone-template) — 3 menit
3. [Ganti Informasi Restaurant](#langkah-2-ganti-informasi-restaurant) — 5 menit
4. [Ganti Menu](#langkah-3-ganti-menu) — 5 menit
5. [Ganti Galeri Foto](#langkah-4-ganti-galeri-foto) — 3 menit
6. [Ganti Nomor WhatsApp](#langkah-5-ganti-nomor-whatsapp) — 1 menit
7. [Ganti Tema Warna](#langkah-6-ganti-tema-warna) — 1 menit
8. [Upload ke GitHub](#langkah-7-upload-ke-github) — 3 menit
9. [Deploy ke Vercel](#langkah-8-deploy-ke-vercel-website-live) — 5 menit
10. [Setelah Website Live](#setelah-website-live)
11. [Troubleshooting](#troubleshooting)

---

## Persiapan Awal

**Estimasi: 5 menit**

Sebelum mulai, pastikan Anda sudah punya:

### Yang Dibutuhkan

| Kebutuhan | Keterangan | Gratis? |
|-----------|-----------|---------|
| **Akun GitHub** | Tempat menyimpan kode website | ✅ Gratis |
| **Akun Vercel** | Tempat website Anda live di internet | ✅ Gratis |
| **VS Code** | Aplikasi untuk mengedit file teks | ✅ Gratis |
| **Node.js** | Diperlukan untuk menjalankan website | ✅ Gratis |
| **Git** | Diperlukan untuk upload ke GitHub | ✅ Gratis |

### Cara Daftar / Download

**GitHub** → Buka [github.com](https://github.com) → Klik "Sign up" → Ikuti instruksi

**Vercel** → Buka [vercel.com](https://vercel.com) → Klik "Sign Up" → Pilih "Continue with GitHub"

**VS Code** → Buka [code.visualstudio.com](https://code.visualstudio.com) → Klik "Download" → Install

**Node.js** → Buka [nodejs.org](https://nodejs.org) → Klik tombol hijau "LTS" → Install

**Git** → Buka [git-scm.com](https://git-scm.com) → Klik "Download" → Install

> ✅ **Tip:** Daftar GitHub dulu, lalu daftar Vercel menggunakan akun GitHub yang sama. Ini mempercepat proses deployment nanti.

---

## Langkah 1: Clone Template

**Estimasi: 3 menit**

"Clone" artinya mengunduh salinan template ke komputer Anda.

### 1.1 — Buka Terminal

**Windows:** Tekan tombol `Windows + R` → ketik `cmd` → Enter

**Mac:** Tekan `Command + Space` → ketik `Terminal` → Enter

### 1.2 — Masukkan Perintah Ini

Ketik perintah berikut satu per satu. Tekan **Enter** setelah setiap baris:

```
git clone https://github.com/fagangans/fagan-restaurant-template.git nama-restaurant-anda
```

> 🔁 Ganti `nama-restaurant-anda` dengan nama bisnis Anda, tanpa spasi.
> Contoh: `git clone https://... warung-bu-sari` atau `git clone https://... restoran-makmur`

```
cd nama-restaurant-anda
```

```
npm install
```

Tunggu sampai selesai. Ini mengunduh semua yang dibutuhkan. Mungkin memakan waktu 1–2 menit.

### 1.3 — Buka di VS Code

```
code .
```

VS Code akan terbuka dengan semua file template siap diedit.

---

## Langkah 2: Ganti Informasi Restaurant

**Estimasi: 5 menit**

Semua informasi bisnis ada di **satu file**: `content/restaurant.json`

### 2.1 — Buka File

Di VS Code, di panel kiri, klik:
```
content → restaurant.json
```

### 2.2 — Bagian yang Perlu Diganti

Cari dan ganti nilai di bawah ini. **Jangan hapus tanda kutip `"` dan titik dua `:`**

---

**Nama Restaurant**
```json
"name": "Nusantara Dining",
```
Ganti `Nusantara Dining` dengan nama restaurant Anda.

---

**Tagline / Slogan**
```json
"tagline": "Where Heritage Meets Refinement",
```
Ganti dengan slogan bisnis Anda.

---

**Deskripsi Singkat** (muncul di footer)
```json
"shortDescription": "Premium Indonesian cuisine in an elegant setting",
```

---

**Foto Hero** (foto utama halaman pertama)
```json
"backgroundImage": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=90",
```
Ganti URL dengan link foto restaurant Anda. Foto idealnya berukuran lebar (landscape), minimal 1920px.

> 📷 **Tips foto:** Upload foto ke [imgbb.com](https://imgbb.com) atau [Google Drive](https://drive.google.com) dan gunakan link direktnya. Atau gunakan foto dari [Unsplash](https://unsplash.com) yang gratis.

---

**Teks Headline Hero**
```json
"headline": "An Extraordinary",
"headlineAccent": "Culinary Journey",
```
Ganti dengan kalimat yang menggambarkan restaurant Anda.
Contoh: `"headline": "Cita Rasa"` dan `"headlineAccent": "Nusantara Asli"`

---

**Deskripsi di Hero**
```json
"subheadline": "Experience the finest Indonesian cuisine...",
```
Ganti dengan kalimat promosi restaurant Anda (1–2 kalimat).

---

**Informasi About / Cerita Restaurant**

Cari bagian `"about"` dan ganti:
```json
"heading": "A Story of Passion",
"headingAccent": "& Heritage",
"story": "Tulis cerita singkat restaurant Anda di sini...",
"mission": "Tulis misi bisnis Anda di sini...",
```

---

**Alamat dan Kontak**

Cari bagian `"location"` dan ganti semua:
```json
"address": "Jl. Sudirman No. 123, Jakarta Pusat 10220",
"city": "Jakarta",
"country": "Indonesia",
"phone": "+62 21 1234 5678",
"whatsapp": "+6281234567890",
"email": "reservations@nusantaradining.com",
```

---

**Jam Buka**
```json
"hours": [
  { "days": "Monday – Friday", "open": "11:00", "close": "22:00" },
  { "days": "Saturday", "open": "10:00", "close": "23:00" },
  { "days": "Sunday", "open": "10:00", "close": "21:00" }
],
```
Sesuaikan hari dan jam buka restaurant Anda.

---

**Link Google Maps**

Buka [maps.google.com](https://maps.google.com) → cari lokasi restaurant Anda → Klik "Share" → "Embed a map" → Salin kode yang mengandung URL panjang → Ambil hanya URL-nya.

```json
"mapEmbedUrl": "https://www.google.com/maps/embed?pb=...",
```

---

**Media Sosial**
```json
"socialMedia": {
  "instagram": "https://instagram.com/akun-anda",
  "facebook": "https://facebook.com/akun-anda",
  "tiktok": "https://tiktok.com/@akun-anda"
}
```

---

**SEO (Judul dan Deskripsi di Google)**
```json
"seo": {
  "title": "Nama Restaurant Anda — Deskripsi Singkat",
  "description": "Kalimat 1–2 yang menjelaskan restaurant Anda. Ini yang muncul di hasil pencarian Google.",
  "keywords": "kata kunci, nama restaurant, kota, jenis masakan",
  "ogImage": "https://link-foto-utama-anda.jpg"
}
```

### 2.3 — Simpan File

Tekan `Ctrl + S` (Windows) atau `Command + S` (Mac) untuk menyimpan.

---

## Langkah 3: Ganti Menu

**Estimasi: 5 menit**

File menu ada di `content/menu.json`

### 3.1 — Buka File

Di VS Code, klik: `content → menu.json`

### 3.2 — Ganti Kategori Menu

Cari bagian `"categories"`:
```json
"categories": [
  { "id": "signature", "name": "Signature", "description": "Our chef's most celebrated creations" },
  { "id": "appetizer", "name": "Appetizer", "description": "..." },
  ...
]
```

Ganti `"name"` setiap kategori dengan nama kategori menu restaurant Anda.
Contoh: `"Makanan Utama"`, `"Minuman"`, `"Dessert"`, `"Paket Hemat"`

> ⚠️ **Penting:** Jangan ganti nilai `"id"`. ID ini digunakan untuk menghubungkan kategori dengan menu item.

### 3.3 — Ganti Item Menu

Cari bagian `"items"` dan ikuti format ini untuk setiap menu:

```json
{
  "id": "1",
  "categoryId": "signature",
  "name": "Nama Menu",
  "description": "Deskripsi singkat menu ini.",
  "price": 85000,
  "image": "https://link-foto-menu.jpg",
  "badge": "Best Seller",
  "isSpicy": false,
  "isHalal": true,
  "isVegetarian": false
}
```

**Penjelasan setiap baris:**

| Field | Artinya |
|-------|---------|
| `"id"` | Nomor unik. Isi berurutan: "1", "2", "3", dst. |
| `"categoryId"` | Harus sama dengan `"id"` salah satu kategori di atas |
| `"name"` | Nama menu |
| `"description"` | Deskripsi 1–2 kalimat |
| `"price"` | Harga dalam Rupiah (angka saja, tanpa titik/koma) |
| `"image"` | Link foto menu |
| `"badge"` | Label kecil di foto: "Best Seller", "New", dll. Isi `null` jika tidak perlu |
| `"isSpicy"` | `true` = ada ikon pedas, `false` = tidak |
| `"isHalal"` | `true` = tampilkan label Halal |
| `"isVegetarian"` | `true` = tampilkan label Vegetarian |

### 3.4 — Contoh: Menambah Menu Baru

Salin blok ini dan tempelkan di dalam `"items": [ ... ]`, pisahkan dengan tanda koma `,`:

```json
{
  "id": "17",
  "categoryId": "main",
  "name": "Ayam Geprek Spesial",
  "description": "Ayam crispy geprek dengan sambal bawang khas kami. Pedas, gurih, menggugah selera.",
  "price": 35000,
  "image": "https://images.unsplash.com/photo-1598103442097-8b74394b95c9?w=600&q=85",
  "badge": "New",
  "isSpicy": true,
  "isHalal": true,
  "isVegetarian": false
}
```

### 3.5 — Cara Mendapatkan Link Foto Menu

**Opsi 1 — Foto Anda Sendiri:**
1. Buka [imgbb.com](https://imgbb.com)
2. Upload foto menu Anda
3. Salin "Direct Link"
4. Tempelkan di field `"image"`

**Opsi 2 — Foto dari Unsplash (gratis):**
1. Buka [unsplash.com](https://unsplash.com)
2. Cari foto yang relevan (contoh: "nasi goreng", "grilled chicken")
3. Klik foto → klik tombol download → pilih ukuran kecil
4. Salin URL dari address bar browser dan tambahkan `?w=600&q=85` di akhir

### 3.6 — Simpan File

Tekan `Ctrl + S` / `Command + S`.

---

## Langkah 4: Ganti Galeri Foto

**Estimasi: 3 menit**

File galeri ada di `content/gallery.json`

### 4.1 — Buka File

Di VS Code, klik: `content → gallery.json`

### 4.2 — Ganti Judul Galeri

```json
"heading": "A Feast for the Eyes",
"subheading": "Every dish is a work of art. Every moment, a memory worth keeping.",
```
Ganti dengan judul dan kalimat yang sesuai.

### 4.3 — Ganti Foto Galeri

Setiap foto mengikuti format ini:

```json
{
  "id": "1",
  "image": "https://link-foto-anda.jpg",
  "alt": "Deskripsi foto ini (penting untuk SEO)",
  "category": "food",
  "span": "large"
}
```

**Kategori foto:**

| `category` | Artinya |
|-----------|---------|
| `"food"` | Foto makanan/minuman |
| `"ambience"` | Foto suasana restoran |
| `"kitchen"` | Foto dapur/chef |
| `"events"` | Foto acara/catering |

**Ukuran tampilan foto (span):**

| `span` | Proporsi | Gunakan untuk |
|--------|----------|--------------|
| `"large"` | Lebar, panoramik | Foto restoran / suasana terbaik |
| `"medium"` | Sedang | Foto makanan featured |
| `"small"` | Kotak/kecil | Foto detail, menu biasa |

> 💡 **Tips:** Gunakan campuran ukuran agar galeri terlihat dinamis. Mulai dengan `"large"`, lalu `"small"`, `"small"`, `"medium"`, dst.

### 4.4 — Simpan File

Tekan `Ctrl + S` / `Command + S`.

---

## Langkah 5: Ganti Nomor WhatsApp

**Estimasi: 1 menit**

Ini adalah **langkah paling penting**. Semua tombol "WhatsApp" dan "Reserve" di website akan menghubungi nomor ini.

### 5.1 — Buka File

Di VS Code, klik: `content → restaurant.json`

### 5.2 — Cari dan Ganti

Gunakan **Ctrl + F** (atau **Command + F** di Mac) untuk mencari:
```
"whatsapp"
```

Ganti dengan nomor WhatsApp bisnis Anda:
```json
"whatsapp": "+6281234567890",
```

**Format yang benar:**
- Mulai dengan `+62` (kode negara Indonesia)
- Diikuti nomor tanpa angka 0 di depan
- Tanpa spasi atau tanda hubung
- Contoh: `+6281312345678`

> ✅ **Test:** Setelah website live, klik tombol WhatsApp dan pastikan terhubung ke nomor yang benar.

### 5.3 — Simpan File

Tekan `Ctrl + S` / `Command + S`.

---

## Langkah 6: Ganti Tema Warna

**Estimasi: 1 menit**

Tema warna mengubah seluruh tampilan website dalam sekejap.

### 6.1 — Buka File

Di VS Code, klik: `content → restaurant.json`

### 6.2 — Cari dan Ganti

Gunakan **Ctrl + F** untuk mencari:
```
"theme"
```

Ganti dengan salah satu tema:

```json
"theme": "steakhouse",
```

**Pilihan tema:**

| Tema | Kode | Cocok untuk |
|------|------|-------------|
| 🟡 Steakhouse | `"steakhouse"` | Restoran daging, fine dining, masakan Indonesia berat |
| 🔵 Seafood | `"seafood"` | Seafood, ikan bakar, masakan pesisir |
| 🟤 Coffee | `"coffee"` | Kafe, coffee shop, bistro |
| 🟠 Bakery | `"bakery"` | Bakery, dessert, pastry |

### 6.3 — Simpan File

Tekan `Ctrl + S` / `Command + S`.

### 6.4 — Preview Perubahan (Opsional)

Untuk melihat hasil perubahan sebelum live:

Di terminal, ketik:
```
npm run dev
```

Buka browser dan masuk ke: **http://localhost:3000**

Tekan `Ctrl + C` di terminal untuk menghentikan preview.

---

## Langkah 7: Upload ke GitHub

**Estimasi: 3 menit**

GitHub adalah tempat menyimpan kode website Anda di cloud. Vercel akan mengambil dari sini untuk menjalankan website.

### 7.1 — Buat Repository Baru di GitHub

1. Buka [github.com](https://github.com) dan login
2. Klik tombol **"+"** di pojok kanan atas
3. Pilih **"New repository"**
4. Isi nama repository: contoh `website-restoran-saya`
5. Pilih **"Private"** (hanya Anda yang bisa lihat)
6. Klik **"Create repository"**
7. **Jangan tambahkan README** — biarkan kosong

### 7.2 — Hubungkan dan Upload dari Terminal

Di terminal (pastikan masih di folder project Anda), jalankan perintah ini satu per satu:

```
git remote remove origin
```

```
git remote add origin https://github.com/USERNAME-ANDA/nama-repository-anda.git
```

> 🔁 Ganti `USERNAME-ANDA` dengan username GitHub Anda, dan `nama-repository-anda` dengan nama yang Anda buat di langkah 7.1.

```
git add .
```

```
git commit -m "Website restaurant siap"
```

```
git push -u origin main
```

Jika diminta login GitHub, masukkan username dan password Anda.

### 7.3 — Konfirmasi Berhasil

Buka GitHub di browser → masuk ke repository Anda → semua file seharusnya sudah muncul.

---

## Langkah 8: Deploy ke Vercel (Website Live!)

**Estimasi: 5 menit**

Vercel akan mengambil kode dari GitHub dan membuat website Anda bisa diakses siapapun di internet. **GRATIS.**

### 8.1 — Buka Vercel

Buka [vercel.com](https://vercel.com) → Login dengan akun GitHub Anda

### 8.2 — Tambahkan Project Baru

1. Klik tombol **"Add New..."** → **"Project"**
2. Di bagian **"Import Git Repository"**, cari nama repository yang baru Anda buat
3. Klik **"Import"** di sebelahnya

### 8.3 — Konfigurasi Deploy

Halaman konfigurasi akan muncul. **Tidak perlu mengubah apapun.** Vercel sudah otomatis mendeteksi bahwa ini adalah Next.js.

Langsung klik **"Deploy"** (tombol hitam besar).

### 8.4 — Tunggu Proses Build

Vercel akan memproses website Anda. Ini memakan waktu **1–3 menit**.

Anda akan melihat log berjalan. Tunggu hingga muncul tanda ✅ dan konfirmasi **"Congratulations!"**

### 8.5 — Website Anda Live!

Vercel akan memberikan URL gratis seperti:
```
https://website-restoran-saya.vercel.app
```

Klik URL tersebut — website restaurant Anda sudah bisa diakses siapapun di seluruh dunia! 🎉

---

## Setelah Website Live

### Cara Update Konten di Masa Depan

Setiap kali Anda ingin mengubah sesuatu (misalnya update harga menu, tambah foto, dll):

1. Edit file yang relevan di folder `content/`
2. Simpan file (`Ctrl + S`)
3. Buka terminal dan jalankan:
   ```
   git add .
   git commit -m "Update menu / foto / dll"
   git push
   ```
4. Vercel otomatis mendeteksi perubahan dan **update website dalam 1–2 menit**. Tidak perlu deploy ulang secara manual.

### Menghubungkan Domain Sendiri (Opsional)

Jika Anda punya domain sendiri (misal `www.restoran-anda.com`):

1. Di Vercel dashboard, buka project Anda
2. Klik **"Settings"** → **"Domains"**
3. Klik **"Add"** dan masukkan domain Anda
4. Ikuti instruksi yang diberikan Vercel untuk mengatur DNS

> Domain `.com` bisa dibeli dari [Niagahoster](https://niagahoster.co.id), [Namecheap](https://namecheap.com), atau penyedia domain lainnya. Harga sekitar Rp 150.000 – Rp 300.000 per tahun.

### Mengupdate Foto Lama

1. Upload foto baru ke [imgbb.com](https://imgbb.com)
2. Salin "Direct Link"
3. Buka file JSON yang relevan
4. Ganti URL lama dengan URL baru
5. Simpan → push → website update otomatis

---

## Troubleshooting

### ❌ "npm install" gagal atau error

**Solusi:** Pastikan Node.js sudah terinstall dengan benar. Coba:
```
node --version
```
Harus muncul angka versi seperti `v20.x.x`. Jika tidak muncul, install ulang Node.js dari [nodejs.org](https://nodejs.org).

---

### ❌ "git push" meminta password terus menerus

**Solusi:** Gunakan GitHub Personal Access Token:
1. Buka GitHub → klik foto profil → **Settings**
2. Scroll ke bawah → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. **Generate new token** → centang `repo` → **Generate**
4. Salin token tersebut dan gunakan sebagai password saat diminta

---

### ❌ Website di Vercel menampilkan error atau halaman kosong

**Solusi:**
1. Di Vercel dashboard, klik project Anda → **Deployments**
2. Klik deployment terbaru → lihat **Build Logs**
3. Cari baris merah yang menunjukkan error
4. Penyebab paling umum: ada kesalahan format di file JSON (misalnya lupa koma atau tanda kutip)

---

### ❌ Ada kesalahan di file JSON (website tidak mau deploy)

Kesalahan JSON paling umum:

**Lupa koma setelah blok:**
```json
// ❌ Salah
{ "name": "Nasi Goreng" }
{ "name": "Soto Ayam" }

// ✅ Benar
{ "name": "Nasi Goreng" },
{ "name": "Soto Ayam" }
```

**Kutip tidak ditutup:**
```json
// ❌ Salah
"name": "Nasi Goreng

// ✅ Benar
"name": "Nasi Goreng"
```

> 💡 **Tip:** Gunakan [jsonlint.com](https://jsonlint.com) — paste isi file JSON Anda di sana dan klik "Validate". Kalau ada error, akan langsung ditunjukkan baris mana yang salah.

---

### ❌ Foto tidak muncul di website

**Penyebab umum:** URL foto salah atau gambar tidak bisa diakses publik.

**Solusi:**
1. Buka URL foto langsung di browser — pastikan foto tampil
2. Pastikan URL dimulai dengan `https://` (bukan `http://`)
3. Jika menggunakan Google Drive, pastikan file diset "Anyone with the link can view"

---

### Butuh Bantuan?

Jika menemukan masalah yang tidak ada di panduan ini, hubungi developer/agen yang menjual template ini kepada Anda. Sertakan:
- Screenshot error yang muncul
- Nama file yang sedang diedit
- Apa yang sudah dicoba

---

## Ringkasan: 8 Langkah dalam 15 Menit

| # | Langkah | Estimasi |
|---|---------|----------|
| 0 | Persiapan (install software, daftar akun) | 5 menit |
| 1 | Clone template | 3 menit |
| 2 | Edit `restaurant.json` (nama, alamat, kontak) | 5 menit |
| 3 | Edit `menu.json` (daftar menu) | 5 menit |
| 4 | Edit `gallery.json` (foto galeri) | 3 menit |
| 5 | Ganti nomor WhatsApp | 1 menit |
| 6 | Pilih tema warna | 1 menit |
| 7 | Upload ke GitHub | 3 menit |
| 8 | Deploy ke Vercel | 5 menit |
| | **TOTAL** | **~31 menit** |

---

*Panduan ini dibuat untuk membantu Anda mandiri mengelola website restaurant Anda.*
*Tidak perlu bayar developer setiap kali ingin update konten — cukup edit file JSON dan push.*
