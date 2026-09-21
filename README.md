# SDDS — Satu Data Desa Sumber Sari

Portal katalog data Desa Sumber Sari, Kecamatan Loa Kulu, Kabupaten Kutai Kartanegara.
Semua tautan Google Drive (DTSEN, RDDK, UMKM, Data RT, Posyandu, profil desa, LKE Desa Cantik, dokumentasi) dicatat di satu tempat supaya tidak hilang atau tercecer.

Situs ini statis (HTML + CSS + JavaScript biasa), tanpa server dan tanpa database, jadi bisa di-hosting gratis di **GitHub Pages**.

---

## Isi repositori

```
index.html            halaman utama
assets/css/style.css  tampilan (warna, huruf, tata letak)
assets/js/app.js      logika pencarian, filter, halaman kategori
assets/js/akses.js    halaman masuk perangkat desa
ganti-sandi.html      alat membuat kode akun / ganti kata sandi
assets/img/           logo & favicon
data/katalog.js       ← DAFTAR TAUTAN. Hanya file ini yang perlu diedit.
```

## Menayangkan di GitHub Pages

1. Buat repositori baru di GitHub, misalnya `sdds-sumbersari` (pilih **Public**).
2. Unggah semua isi folder ini: **Add file → Upload files**, seret seluruh file & folder, lalu **Commit changes**.
   Atau lewat terminal:
   ```bash
   git remote add origin https://github.com/USERNAME/sdds-sumbersari.git
   git branch -M main
   git push -u origin main
   ```
3. Buka **Settings → Pages**. Pada *Build and deployment*, pilih **Deploy from a branch**, branch **main**, folder **/ (root)**, lalu **Save**.
4. Tunggu ±1 menit. Situs tayang di `https://USERNAME.github.io/sdds-sumbersari/`.

## Menambah atau mengubah tautan data

Semua tautan ada di `data/katalog.js`. Bisa diedit langsung di browser (ikon pensil di GitHub).

1. Unggah berkas ke folder Google Drive yang sesuai.
2. Di Drive: klik kanan → **Bagikan** → **Salin link**.
3. Di `data/katalog.js`, salin satu blok data lalu ganti isinya:

```js
{ judul: "Data DTSEN (Desil 2)", kategori: ["dtsen"], jenis: "xlsx", terbatas: true,
  url: "https://drive.google.com/file/d/XXXXXXXX/view",
  lokasi: "DESA CANTIK / Kegiatan Statistik Sumber Sari / 4. Pengumpulan Data / DTSEN",
  diperbarui: "2026-10-01",
  ket: "Daftar keluarga desil 2." },
```

| Kolom | Isi |
|---|---|
| `judul` | Nama data yang mudah dipahami |
| `kategori` | Satu atau lebih: `dtsen`, `rddk`, `umkm`, `rt`, `kesehatan`, `pendidikan`, `publikasi`, `pedoman`, `kelembagaan`, `lke`, `dokumentasi`, `arsip` |
| `jenis` | `folder`, `pdf`, `xlsx`, `sheet`, `docx`, `gambar`, `video` |
| `url` | Link Google Drive |
| `lokasi` | Letak di Drive (untuk dokumentasi) |
| `diperbarui` | Tanggal `TAHUN-BULAN-TANGGAL` |
| `ket` | Keterangan singkat (opsional) |
| `terbatas` | `true` bila memuat data pribadi warga (NIK, nama, alamat) |
| `utama` | `true` untuk folder induk sebuah kategori |
| `unggulan` | `true` agar tampil di rak Publikasi |

4. **Commit changes.** Situs ikut berubah dalam ±1 menit.

Perhatikan tanda koma `,` di antara blok `{ ... }`. Bila halaman kosong setelah diedit, biasanya ada koma atau tanda kutip yang hilang.

Untuk menambah kategori baru, tambahkan satu baris di bagian `kategori` (id, nama, ikon, warna, deskripsi).
Angka ringkas di bawah banner (luas wilayah, penduduk, KK, dll.) ada di bagian `statistik`.

## Akun perangkat desa (halaman masuk)

Sebelum katalog tampil, pengunjung harus masuk dengan email/ID dan kata sandi perangkat desa.
Kata sandi **tidak pernah ditulis di kode**. Yang disimpan di `data/katalog.js` hanya *hash*
(kode acak PBKDF2-SHA256 dari email/ID + kata sandi), jadi kata sandi tidak terbaca dari repositori.

**Membuat akun pertama** — setelah situs tayang, buka alamatnya. Karena `akun: [ ]` masih kosong,
situs menampilkan layar *Siapkan akun perangkat desa*:

1. Isi nama akun, email/ID, dan kata sandi → **Buat kode akun**.
2. Salin baris kode yang muncul, contoh `{ nama: "Perangkat Desa Sumber Sari", hash: "…" },`
3. Tempel di `data/katalog.js`, di antara `akun: [` dan `]`, lalu **Commit**.
4. Tunggu ±1 menit, muat ulang. Situs sekarang meminta login.

**Menambah akun / mengganti kata sandi** — buka `ganti-sandi.html` di situs
(mis. `https://USERNAME.github.io/sdds-sumbersari/ganti-sandi.html`), buat kode baru, tempel,
lalu hapus baris akun lama bila sandinya diganti. Perangkat yang masih masuk dengan sandi lama otomatis keluar.

Pilihan *Tetap masuk di perangkat ini* menyimpan sesi 30 hari. Tanpa itu, sesi berakhir saat tab ditutup.
Tombol **Keluar** ada di pojok kanan atas.

Tips: pakai kata sandi yang panjang (≥ 12 karakter) dan **jangan sama dengan kata sandi Gmail**.

## Tentang keamanan data

SDDS **hanya menyimpan tautan**, bukan isi berkas. Halaman masuk menyaring pengunjung umum, tetapi karena GitHub Pages adalah situs statis publik, file `data/katalog.js` tetap bisa diunduh langsung oleh orang yang paham teknis. Pengaman utama tetap pengaturan berbagi di Google Drive.

- Berkas berisi data pribadi (DTSEN desil, RDDK, data per RT, daftar murid, PUS) sebaiknya diatur **Dibatasi** di Drive, bukan "Siapa saja yang memiliki link".
- Berkas seperti itu diberi label **Terbatas** di situs, lengkap dengan tombol *Minta akses*.
- Karena repositori GitHub Pages bersifat publik, jangan menulis NIK, nama warga, atau isi data pribadi di `katalog.js`.

## Sumber angka di beranda

Profil Desa Sumber Sari 2026 (isian November 2025) dan List RT Desa Cantik 2026.

---

Program Desa Cantik (Desa Cinta Statistik) 2026 · Desa Sumber Sari bersama BPS Kabupaten Kutai Kartanegara.
