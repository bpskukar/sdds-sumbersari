/* =====================================================================
   SDDS — Satu Data Desa Sumber Sari
   FILE DATA KATALOG  (satu-satunya file yang perlu diedit pengelola)

   Cara menambah tautan baru:
   1. Unggah berkas ke folder Google Drive yang sesuai.
   2. Klik kanan berkas di Drive → Bagikan → Salin link.
   3. Salin salah satu blok { ... } di bagian DATA di bawah, tempel di
      kategori yang sesuai, lalu ganti isinya:
        judul      : nama data yang mudah dipahami warga
        kategori   : satu atau lebih id kategori, mis. ["dtsen"]
        jenis      : folder | pdf | xlsx | sheet | docx | gambar | video
        url        : link Google Drive yang tadi disalin
        lokasi     : letak berkas di Drive (untuk dokumentasi)
        diperbarui : tanggal format TAHUN-BULAN-TANGGAL, mis. "2026-09-21"
        ket        : keterangan singkat (boleh dikosongkan)
        terbatas   : true bila berisi data pribadi warga (NIK, nama, dsb.)
        utama      : true untuk folder induk sebuah kategori
        unggulan   : true untuk publikasi yang ditampilkan di rak Publikasi
   4. Simpan (Commit). Situs di GitHub Pages ikut berubah ±1 menit.
   Perhatikan tanda koma di antara blok { ... }.
   ===================================================================== */

(function () {
  /* Jalur folder yang sering dipakai (hanya teks untuk dokumentasi) */
  var ROOT = "DESA CANTIK";
  var KEG = ROOT + " / Kegiatan Statistik Sumber Sari / 4. Pengumpulan Data";
  var LKE = ROOT + " / LKE Desa Sumber Sari";
  var TK = LKE + " / I. Tata Kelola";
  var KS = LKE + " / II. Kapasitas Statistik";
  var MD = LKE + " / III. Manajemen Data";
  var P7 = KS + " / 7. Pengumpulan/Inventarisasi Data";
  var P9 = KS + " / 9. Penyajian Data";
  var P13 = MD + " / 13. Pemutakhiran Data";
  var DOK = ROOT + " / Punya Indah / Desa Cantik 2026";

  var F = "https://drive.google.com/drive/folders/";
  var D = "https://drive.google.com/file/d/";

  window.SDDS = {
    situs: {
      nama: "SDDS",
      namaPanjang: "Satu Data Desa Sumber Sari",
      slogan: "Data tertata, desa berdaya.",
      program: "Desa Cantik · Desa Cinta Statistik 2026",
      diperbarui: "2026-09-21"
    },

    desa: {
      nama: "Desa Sumber Sari",
      kecamatan: "Loa Kulu",
      kabupaten: "Kutai Kartanegara",
      provinsi: "Kalimantan Timur",
      website: "https://sumbersari.klandesa.com/",
      folderInduk: F + "1meMzbGUxPfD1aELKz-p-Mz_Sdf6ZCJrj"
    },

    /* ---------------------------------------------------------------
       AKSES — halaman masuk khusus perangkat desa.
       Kata sandi TIDAK ditulis di sini. Yang disimpan hanya "hash"
       (kode acak hasil olahan email + kata sandi).
       Cara menambah / mengganti akun:
         1. Buka halaman ganti-sandi.html di situs ini.
         2. Isi nama akun, email/ID, dan kata sandi → klik "Buat kode akun".
         3. Salin baris { nama: ..., hash: ... }, tempel di dalam daftar akun (di bawah).
         4. Hapus baris akun lama bila sandinya diganti. Commit.
       Selama daftar akun masih kosong, situs menampilkan layar penyiapan.
       --------------------------------------------------------------- */
    akses: {
      wajibMasuk: true,
      garam: "sdds-sumbersari-2026",   /* jangan diubah setelah akun dibuat */
      iterasi: 150000,                 /* jangan diubah setelah akun dibuat */
      akun: [
        { nama: "Perangkat Desa Sumber Sari", hash: "c15a8f7d73df823ebf936714b64dd34920f9f6b1c8cc7c9651fc1e8af2efb3e4" },
        /* tempel kode akun di sini, contoh:
           { nama: "Perangkat Desa Sumber Sari", hash: "3f9a...(64 karakter)" }, */
      ]
    },

    /* ---------------------------------------------------------------
       PENYIMPANAN (MODE EDIT)
       Isi url dengan alamat Web App Google Apps Script (…/exec) dari
       spreadsheet "SDDS – Database Katalog" (lihat README → Mode edit).
       Bila kosong, situs memakai data di file ini dan mode edit hanya
       berjalan sebagai uji coba di browser masing-masing.
       --------------------------------------------------------------- */
    backend: {
      url: "https://script.google.com/macros/s/AKfycbyq-ZEcuI-JowbWZn3j8mUyoD5Lf7tbbmtRqsd3VqkcezaKjkkSvO3JEy3EOWmz3XLRlw/exec",
      /* Spreadsheet database (dibuka lewat tombol "Buka Sheet" di mode edit) */
      sheet: "https://docs.google.com/spreadsheets/d/1sAWFy-y3M0ea9Z5wEPF7fUetB7PqV8MpUAQ3qt24OUg/edit"
    },

    /* Menu tambahan di navigasi atas (bisa diubah juga lewat mode edit) */
    menu: [
      { label: "Data Sumber Sari", url: "https://docs.google.com/spreadsheets/d/1C4eFqkd-xjLurRsvzEFMxHB_-GAqdSIZ-uN3lFxWFfQ/edit", terbatas: true }
    ],

    kontak: {
      /* Dipakai untuk tombol "Minta akses" dan "Laporkan tautan rusak" */
      email: "desacantikdesasumbersari@gmail.com"
    },

    /* Angka ringkas di bawah banner. Penduduk, KK, luas, dan kepadatan
       disamakan dengan Portal Data Publik sumbersari.klandesa.com.
       Perbarui bila angka di portal desa berubah. */
    statistik: [
      { label: "Luas wilayah", nilai: "1.416", satuan: "ha", ket: "kepadatan 252,68 jiwa/km²" },
      { label: "Penduduk", nilai: "3.578", satuan: "jiwa", ket: "data kependudukan Juli 2026" },
      { label: "Kepala keluarga", nilai: "1.172", satuan: "KK", ket: "rata-rata 3,05 jiwa per KK" },
      { label: "Wilayah", nilai: "11", satuan: "RT", ket: "tersebar di 2 dusun" },
      { label: "Pelaku usaha", nilai: "163", satuan: "UMKM", ket: "hasil pendataan UMKM Desa Cantik 2026" }
    ],
    statistikSumber: "Portal Data Publik Desa Sumber Sari (sumbersari.klandesa.com, diperbarui Juli 2026) untuk luas, penduduk, KK, dan kepadatan; Profil Desa 2026 untuk jumlah RT/dusun; pendataan UMKM Desa Cantik 2026 untuk pelaku usaha.",

    /* ---------------------------------------------------------------
       KATEGORI — id dipakai di kolom kategori pada DATA.
       ikon: users, home, store, map, heart, school, book, clipboard,
             landmark, layers, camera, archive
       --------------------------------------------------------------- */
    kategori: [
      { id: "dtsen", nama: "DTSEN", namaPanjang: "Data Tunggal Sosial Ekonomi Nasional", ikon: "users", warna: "#D0473B", sorot: true,
        deskripsi: "Basis data kesejahteraan keluarga (peringkat desil) untuk sasaran bantuan sosial: data desil, pedoman konsep-definisi, dan dokumentasi pendataan." },
      { id: "rddk", nama: "RDDK", namaPanjang: "Registrasi Data Dasar Keluarga", ikon: "home", warna: "#2F7FC1", sorot: true,
        deskripsi: "Pendataan keluarga dan anggota keluarga di 11 RT, lengkap dengan kuesioner, buku pedoman, dan metadata statistik." },
      { id: "umkm", nama: "UMKM", namaPanjang: "Usaha Mikro, Kecil, dan Menengah", ikon: "store", warna: "#C9821A", sorot: true,
        folder: F + "1skOzapigvNlMmrc3KqgB1wHmtMMe72JL",
        deskripsi: "Daftar pedagang dan pelaku usaha warga per RT, rancangan output, serta kegiatan pelatihan UMKM." },
      { id: "rt", nama: "Data RT & Penduduk", namaPanjang: "Rekap per Rukun Tetangga", ikon: "map", warna: "#1E9A8A",
        deskripsi: "Berkas data RT 1 sampai RT 11, daftar objek per RT, dan pemutakhiran daftar penduduk." },
      { id: "kesehatan", nama: "Kesehatan & KB", namaPanjang: "Posyandu, KPM, PPKBD", ikon: "heart", warna: "#CF4A86",
        deskripsi: "Laporan Posyandu, Kader Pembangunan Manusia (KPM), dan PPKBD termasuk data pasangan usia subur." },
      { id: "pendidikan", nama: "Pendidikan", namaPanjang: "KB, PAUD, dan TK", ikon: "school", warna: "#6B5FD3",
        deskripsi: "Data guru dan murid kelompok bermain, PAUD, dan TK di Desa Sumber Sari." },
      { id: "publikasi", nama: "Profil & Publikasi", namaPanjang: "Monografi, profil, booklet", ikon: "book", warna: "#2E8B57",
        deskripsi: "Profil desa, monografi, Sumber Sari Dalam Angka, booklet, infografis, dan bahan website desa." },
      { id: "pedoman", nama: "Pedoman & Metadata", namaPanjang: "Kuesioner, SOP, metadata", ikon: "clipboard", warna: "#8A6A3A",
        deskripsi: "Kuesioner, buku pedoman, metadata statistik, SOP kegiatan, dan formulir permintaan data." },
      { id: "kelembagaan", nama: "Kelembagaan & SK", namaPanjang: "Agen statistik dan perangkat", ikon: "landmark", warna: "#4B6A88",
        deskripsi: "SK agen statistik, perangkat desa, PPID, serta catatan kegiatan agen statistik." },
      { id: "lke", nama: "LKE Desa Cantik", namaPanjang: "Lembar Kerja Evaluasi", ikon: "layers", warna: "#3F8F3A",
        deskripsi: "Bukti dukung evaluasi Desa Cantik (Tata Kelola, Kapasitas Statistik, Manajemen Data) dan folder 8 tahap GSBPM." },
      { id: "dokumentasi", nama: "Dokumentasi", namaPanjang: "Foto dan video kegiatan", ikon: "camera", warna: "#B8612E",
        deskripsi: "Foto dan video kegiatan Desa Cantik Sumber Sari sepanjang 2026, dari pencanangan hingga pendataan." },
      { id: "arsip", nama: "Arsip Tim", namaPanjang: "Folder kerja anggota tim", ikon: "archive", warna: "#737D78",
        deskripsi: "Folder kerja anggota tim yang isinya belum dipilah ke kategori. Pindahkan ke kategori yang tepat bila sempat." }
    ],

    /* ---------------------------------------------------------------
       ALUR DATA — 8 tahap GSBPM (Generic Statistical Business Process
       Model) v5.1 yang dipakai BPS. Setiap tahap tertaut ke foldernya di
       Google Drive: DESA CANTIK / Kegiatan Statistik Sumber Sari.
       "isi" = petunjuk berkas apa yang diunggah ke folder tersebut.
       --------------------------------------------------------------- */
    alurRujukan: "Generic Statistical Business Process Model (GSBPM) v5.1",
    alurFolder: F + "1auwvaZa6fjIYvg1_MnGNtZmEe8WME6Iv",
    alur: [
      { fase: "Spesifikasi Kebutuhan", en: "Specify Needs",
        ket: "Mengenali kebutuhan data desa bersama pengguna dan mengecek data yang sudah tersedia.",
        isi: "instrumen identifikasi kebutuhan, notulen & daftar hadir konsultasi, daftar ketersediaan data",
        tautan: [ { label: "1. Spesifikasi Kebutuhan", url: F + "1wOr8oyPfXxK6K3tMt84ewO_0hv5FzALs" } ] },
      { fase: "Desain", en: "Design",
        ket: "Merancang tabel output, variabel dan konsep-definisi, kuesioner, serta metode pengumpulan.",
        isi: "rancangan output, rancangan kuesioner, metadata & konsep-definisi",
        tautan: [ { label: "2. Desain", url: F + "1VX8LsiXZl4ntrZKW9yX4NHQvz6Vfdax8" } ] },
      { fase: "Membangun", en: "Build",
        ket: "Menyiapkan kuesioner final, buku pedoman, SOP, dan uji coba instrumen.",
        isi: "kuesioner final, buku pedoman, SOP kegiatan, hasil uji coba",
        tautan: [ { label: "3. Membangun", url: F + "1tGRss8TNp7p0al-gbHJRWhywZAd0NkX9" } ] },
      { fase: "Pengumpulan", en: "Collect",
        ket: "Melatih petugas, lalu mendata DTSEN, RDDK, dan UMKM di 11 RT.",
        isi: "materi & daftar hadir pelatihan, hasil dan foto pendataan per kegiatan",
        tautan: [ { label: "4. Pengumpulan Data", url: F + "1q8GymYVpzgWYBeSs6E0C9fM7hO1FHuMk" } ] },
      { fase: "Pengolahan", en: "Process",
        ket: "Entri, pemeriksaan, validasi, dan integrasi data.",
        isi: "file entri, hasil validasi & pembersihan data, tabel hasil olahan",
        tautan: [ { label: "5. Pengolahan Data", url: F + "18RAD_OylVJxOhIX7Lwyhzt-f8HQRyO-N" } ] },
      { fase: "Analisis", en: "Analyse",
        ket: "Menyusun tabel dan grafik, memeriksa konsistensi, lalu menafsirkan hasil.",
        isi: "draf tabel & grafik, catatan analisis, hasil pemeriksaan kualitas",
        tautan: [ { label: "6. Analisis", url: F + "1tcp9ETRU1GH6Ftmc3ST-XFD2H6UFTm9d" } ] },
      { fase: "Diseminasi", en: "Disseminate",
        ket: "Menyajikan hasil lewat monografi, profil desa, booklet, infografis, dan website.",
        isi: "publikasi final, infografis, bukti tayang di website atau papan informasi",
        tautan: [ { label: "7. Diseminasi", url: F + "1JwdlAnDTH4wUTxXEb8Q3wDooEz4nIAGK" } ] },
      { fase: "Evaluasi", en: "Evaluate",
        ket: "Menilai proses dan kebermanfaatan data sebagai bahan perbaikan siklus berikutnya.",
        isi: "notulen evaluasi, catatan kendala & rekomendasi, bukti pemanfaatan data",
        tautan: [ { label: "8. Evaluasi", url: F + "1LM72Y0I9ZWeDOOlhl7A4fO85I3rjxGl5" } ] }
    ],

    /* ===============================================================
       DATA — daftar tautan Google Drive
       =============================================================== */
    data: [
      /* ---------- DTSEN ---------- */
      { judul: "Folder DTSEN — hasil pendataan 2026", kategori: ["dtsen"], jenis: "folder", utama: true,
        url: F + "1IlADTcEL-G9LkeNynqA3GuA8x0Ffg0rN", lokasi: KEG, diperbarui: "2026-09-21",
        ket: "Folder induk pendataan DTSEN Desa Sumber Sari. Simpan semua berkas DTSEN baru di sini." },
      { judul: "Data DTSEN (Desil 1)", kategori: ["dtsen"], jenis: "xlsx", terbatas: true,
        url: D + "1_JZIcMFhW3qFDbXjgLmOJWBQ0RvpSWOV/view", lokasi: P7 + " / 7a.6 Data Hasil Pengumpulan", diperbarui: "2026-08-11",
        ket: "Daftar keluarga peringkat desil 1 hasil pengumpulan data." },
      { judul: "Buku Pedoman Konsep & Definisi Variabel DTSEN", kategori: ["dtsen", "pedoman"], jenis: "pdf",
        url: D + "16cSM_4qnVtCV6tWhhVL-dWwCgJTBWuGH/view", lokasi: P7 + " / 7a.3 Buku Pedoman", diperbarui: "2026-07-23",
        ket: "Pedoman konsep-definisi variabel DTSEN khusus Desa Sumber Sari." },
      { judul: "Kuesioner PBI 2026 (revisi 18 Feb 2026)", kategori: ["dtsen", "pedoman"], jenis: "pdf",
        url: D + "1U5T2mvSJth4hAeYTKc4upMDjaxpwKHn9/view", lokasi: P7 + " / 7a.1 Kuesioner", diperbarui: "2026-07-23",
        ket: "Instrumen pendataan penerima bantuan iuran (PBI) 2026." },
      { judul: "Foto pendataan DTSEN", kategori: ["dtsen", "dokumentasi"], jenis: "folder",
        url: F + "1x7MWxSoHlqdAnG4owrl3HsvavReCoNzf", lokasi: KEG + " / DTSEN", diperbarui: "2026-09-21",
        ket: "Dokumentasi kunjungan dan pendataan DTSEN." },
      { judul: "Rancangan Output RDDK, UMKM, dan DTSEN", kategori: ["dtsen", "rddk", "umkm", "pedoman"], jenis: "xlsx",
        url: D + "1ZI_CjkjyonC74yKq3426jZg_zMOkJbQw/view", lokasi: P7 + " / 7a.2 Rancangan Output", diperbarui: "2026-08-13",
        ket: "Rancangan tabel keluaran untuk ketiga pendataan utama desa." },

      /* ---------- RDDK ---------- */
      { judul: "Folder RDDK — hasil pendataan 2026", kategori: ["rddk"], jenis: "folder", utama: true,
        url: F + "1huf7ywJSz2HXn8XPVEgKrLRVFyBAHQf4", lokasi: KEG, diperbarui: "2026-09-21",
        ket: "Folder induk Registrasi Data Dasar Keluarga. Simpan semua berkas RDDK baru di sini." },
      { judul: "Data Registrasi Data Dasar Keluarga (RDDK)", kategori: ["rddk"], jenis: "pdf", terbatas: true,
        url: D + "13QzTrXYer6fnUTnMHrhvaAVh-8_aO9r8/view", lokasi: P7 + " / 7a.6 Data Hasil Pengumpulan", diperbarui: "2026-08-11",
        ket: "Hasil pengumpulan data dasar keluarga." },
      { judul: "Buku Pedoman RDDK Desa Sumber Sari", kategori: ["rddk", "pedoman"], jenis: "pdf",
        url: D + "15roaY5h41SVsO1YCQHPtyALNheI8JOg7/view", lokasi: P7 + " / 7a.3 Buku Pedoman", diperbarui: "2026-06-17" },
      { judul: "Kuesioner RDDK — KUES01-KL", kategori: ["rddk", "pedoman"], jenis: "pdf",
        url: D + "1kuyFdceUYi3kZfo3vnYiwPjqA1LS3ZlP/view", lokasi: P7 + " / 7a.1 Kuesioner", diperbarui: "2026-08-12" },
      { judul: "Kuesioner RDDK — KUES02-PL", kategori: ["rddk", "pedoman"], jenis: "pdf",
        url: D + "1GrJ3Bb5tVo2Wzrw1smL4IIXNsQZuL2jv/view", lokasi: P7 + " / 7a.1 Kuesioner", diperbarui: "2026-08-12" },
      { judul: "Kuesioner & pedoman RDDK", kategori: ["rddk", "pedoman"], jenis: "folder",
        url: F + "1MqWZLJ0FarOOfQ-x54nV-hGhaNQDXfnl", lokasi: ROOT, diperbarui: "2026-06-17" },
      { judul: "Metadata Indikator RDDK", kategori: ["rddk", "pedoman"], jenis: "pdf",
        url: D + "1ay3b-8jsyHgA8lt0DVcvh6jRLs97TOWB/view", lokasi: MD + " / 11. Kualitas Data / 11b. Meta Data Statistik", diperbarui: "2026-07-03" },
      { judul: "Metadata Kegiatan RDDK", kategori: ["rddk", "pedoman"], jenis: "pdf",
        url: D + "1c-mOFLzr3K_YhhF4kFt3eKVkitnLl8vS/view", lokasi: MD + " / 11. Kualitas Data / 11b. Meta Data Statistik", diperbarui: "2026-07-03" },
      { judul: "Metadata Variabel RDDK", kategori: ["rddk", "pedoman"], jenis: "pdf",
        url: D + "1aUeiar9dMUu3FYGMYrNZpTj9sDDEMDU6/view", lokasi: MD + " / 11. Kualitas Data / 11b. Meta Data Statistik", diperbarui: "2026-07-03" },
      { judul: "Foto pendataan RDDK", kategori: ["rddk", "dokumentasi"], jenis: "folder",
        url: F + "15U2Da752nsHRMvbrCD2hjkmAgQU7lf5C", lokasi: KEG + " / RDDK", diperbarui: "2026-09-21" },

      /* ---------- UMKM ---------- */
      { judul: "Data UMKM Desa Sumber Sari", kategori: ["umkm"], jenis: "pdf", utama: true,
        url: D + "1O8i16DqxIeK78fcP6cwlbEv-bhXDrGYh/view", lokasi: P7 + " / 7a.6 Data Hasil Pengumpulan", diperbarui: "2026-08-11",
        ket: "Rekap pelaku usaha mikro dan kecil hasil pendataan." },
      { judul: "List RT — objek pendataan & pelaku usaha per RT", kategori: ["umkm", "rt"], jenis: "sheet", terbatas: true,
        url: "https://docs.google.com/spreadsheets/d/1aEiHL_TDpAmh2_6VzqeHi3h06un_tnhC_a7XSDPDqUE/edit", lokasi: ROOT + " / Data RT", diperbarui: "2026-07-17",
        ket: "Pembagian objek per RT (kependudukan, pertanian, perikanan, wisata, ekonomi, fasilitas umum) dan daftar pedagang per RT." },
      { judul: "Pelatihan UMKM", kategori: ["umkm", "dokumentasi"], jenis: "folder",
        url: F + "1VaFLax0YZ3QitcNRp2kJADEDwpAXKMnq", lokasi: P7 + " / 7a.5 Pelatihan/Briefing Petugas", diperbarui: "2026-07-25" },

      /* ---------- DATA RT & PENDUDUK ---------- */
      { judul: "Folder Data RT (RT 1 – RT 11)", kategori: ["rt"], jenis: "folder", utama: true,
        url: F + "1gvOYXo1ZpL1C-C8gy_dhQcSFReZb-GA1", lokasi: ROOT, diperbarui: "2026-07-17" },
      { judul: "Data RT 1", kategori: ["rt"], jenis: "xlsx", terbatas: true, url: D + "12ddkSBPfovzRqsuBSbx8CDUGeqWEmVJr/view", lokasi: ROOT + " / Data RT", diperbarui: "2026-06-22" },
      { judul: "Data RT 2", kategori: ["rt"], jenis: "xlsx", terbatas: true, url: D + "1GW5rbJk7YPvJeZwku7iH6Cxu5y5VWIoi/view", lokasi: ROOT + " / Data RT", diperbarui: "2026-06-22" },
      { judul: "Data RT 3", kategori: ["rt"], jenis: "xlsx", terbatas: true, url: D + "1k7BgViaS3MOG9czBbwnJniU1dhphdUlP/view", lokasi: ROOT + " / Data RT", diperbarui: "2026-06-22" },
      { judul: "Data RT 4", kategori: ["rt"], jenis: "xlsx", terbatas: true, url: D + "1oec5cBNjnPJ3Vbkb5YisIHQzofHC4mmc/view", lokasi: ROOT + " / Data RT", diperbarui: "2026-06-22" },
      { judul: "Data RT 5", kategori: ["rt"], jenis: "xlsx", terbatas: true, url: D + "1r2ijQp36U97NMlHKLQ39MOMiooIVnhl0/view", lokasi: ROOT + " / Data RT", diperbarui: "2026-06-22" },
      { judul: "Data RT 6", kategori: ["rt"], jenis: "xlsx", terbatas: true, url: D + "1b55B1HUPECYlelGjF-ysy9NOdpmKX0OA/view", lokasi: ROOT + " / Data RT", diperbarui: "2026-06-22" },
      { judul: "Data RT 7", kategori: ["rt"], jenis: "xlsx", terbatas: true, url: D + "1lhZB8EYwS_LiAd44EpdwOBxSKz_KEF5J/view", lokasi: ROOT + " / Data RT", diperbarui: "2026-06-22" },
      { judul: "Data RT 8", kategori: ["rt"], jenis: "xlsx", terbatas: true, url: D + "1ulNyRIrXMB2J2iXbK1ark8GhdoANujhD/view", lokasi: ROOT + " / Data RT", diperbarui: "2026-06-22" },
      { judul: "Data RT 9", kategori: ["rt"], jenis: "xlsx", terbatas: true, url: D + "1a2zYGbxA77uQI1ybuRiKFkzl4F3W_3Es/view", lokasi: ROOT + " / Data RT", diperbarui: "2026-06-22" },
      { judul: "Data RT 10", kategori: ["rt"], jenis: "xlsx", terbatas: true, url: D + "1uflQGpM8U3a32J20_8W6X4Z8UqCApU-H/view", lokasi: ROOT + " / Data RT", diperbarui: "2026-06-22" },
      { judul: "Data RT 11", kategori: ["rt"], jenis: "xlsx", terbatas: true, url: D + "1qbpoRPidWcLXFsGfPhpN6plzbQHDhZpw/view", lokasi: ROOT + " / Data RT", diperbarui: "2026-06-22" },
      { judul: "Data Sumber Sari", kategori: ["rt"], jenis: "sheet", terbatas: true,
        url: "https://docs.google.com/spreadsheets/d/1C4eFqkd-xjLurRsvzEFMxHB_-GAqdSIZ-uN3lFxWFfQ/edit", lokasi: "Google Drive", diperbarui: "2026-09-21",
        ket: "Data penduduk per RT: kependudukan, pendidikan, pekerjaan, dan bantuan sosial." },
      { judul: "Pengolahan updating daftar penduduk", kategori: ["rt"], jenis: "xlsx", terbatas: true,
        url: D + "1rwBY5jFEcBa4sfCTnvITBRJGYkcQjalH/view", lokasi: KS + " / 8. Pengolahan Data", diperbarui: "2026-07-23" },

      /* ---------- KESEHATAN & KB ---------- */
      { judul: "Laporan Posyandu", kategori: ["kesehatan"], jenis: "folder", utama: true,
        url: F + "1oApsABGVw6vdjrbm3Chbff-W_oeeIqoY", lokasi: ROOT, diperbarui: "2026-06-25" },
      { judul: "Laporan Posyandu (bukti pemutakhiran)", kategori: ["kesehatan"], jenis: "folder",
        url: F + "1-KftPjmRBdJ0X57hu819euaPjzzaUoa_", lokasi: P13, diperbarui: "2026-06-25" },
      { judul: "Laporan Posyandu Nusa Indah", kategori: ["kesehatan"], jenis: "pdf",
        url: D + "17ZP4r003qC1K2AkIRG3sCmqOL0SvO6Yc/view", lokasi: P13 + " / LAPORAN POSYANDU", diperbarui: "2026-06-22" },
      { judul: "Laporan KPM (Kader Pembangunan Manusia)", kategori: ["kesehatan"], jenis: "folder",
        url: F + "1vP9EYZZfb8tvAp73T28DVq66qyF4tqlG", lokasi: P13, diperbarui: "2026-06-22" },
      { judul: "Laporan KPM bulan Januari", kategori: ["kesehatan"], jenis: "pdf",
        url: D + "14X0fKwSHlvqRDiokrlVXJUjjyq0k0u_J/view", lokasi: P13 + " / LAPORAN KPM", diperbarui: "2026-06-19" },
      { judul: "PPKBD", kategori: ["kesehatan"], jenis: "folder",
        url: F + "1QHtO8OxiIgUBz3wW541Nl2MtIzJm28xj", lokasi: P13, diperbarui: "2026-06-22" },
      { judul: "PPKBD — pasangan usia subur (PUS)", kategori: ["kesehatan"], jenis: "xlsx", terbatas: true,
        url: D + "1a-AbLKSuEmus7GqdkJWZofZm8a3DYlKF/view", lokasi: P13 + " / PPKBD", diperbarui: "2026-06-22" },
      { judul: "Laporan kader PKBD", kategori: ["kesehatan"], jenis: "pdf",
        url: D + "1OoeLujEcKRnYCftd4v3_3e3-OXgi58hQ/view", lokasi: P13 + " / PPKBD", diperbarui: "2026-06-19" },

      /* ---------- PENDIDIKAN ---------- */
      { judul: "Data guru & murid KB, PAUD, dan TK", kategori: ["pendidikan"], jenis: "folder", utama: true,
        url: F + "1Fm4-4Oc1h5AHua6WwinRQAy694Kp6GRo", lokasi: P13, diperbarui: "2026-06-22" },
      { judul: "Daftar guru TK Satu Atap", kategori: ["pendidikan"], jenis: "pdf",
        url: D + "1_2P39JYblK2gwaUbgmAmA-OdeYjt0GoC/view", lokasi: P13 + " / DATA GURU DAN MURID KB,PAUD&TK", diperbarui: "2026-06-19" },
      { judul: "Daftar murid TK Melati Putih", kategori: ["pendidikan"], jenis: "xlsx", terbatas: true,
        url: D + "1ntFteVxOu4G7ud1jk35lhUGyRCQtZ2Uh/view", lokasi: P13 + " / DATA GURU DAN MURID KB,PAUD&TK", diperbarui: "2026-06-19" },

      /* ---------- PROFIL & PUBLIKASI ---------- */
      { judul: "Profil Desa Sumber Sari 2026", kategori: ["publikasi"], jenis: "pdf", unggulan: true, utama: true,
        url: D + "1hZrn9VIVdUFjpYDyipcmzd66jSxXr_zB/view", lokasi: P9 + " / 9a.2 Profil Desa", diperbarui: "2026-07-23",
        ket: "Potensi sumber daya alam, penduduk, kelembagaan, serta sarana-prasarana desa." },
      { judul: "Monografi Desa Sumber Sari Semester I 2026", kategori: ["publikasi"], jenis: "pdf", unggulan: true,
        url: D + "1cRk3GYsmTUJwfmeIiWpJxwOQ5zofiAUN/view", lokasi: P9 + " / 9a.1 Monografi", diperbarui: "2026-07-23" },
      { judul: "Sumber Sari Dalam Angka 2026", kategori: ["publikasi"], jenis: "pdf", unggulan: true,
        url: D + "12byZqbUuej7GNpSY9tHj0QXCJJiozVPv/view", lokasi: P9 + " / 9a.4 Publikasi Mengandung PODES", diperbarui: "2026-07-23" },
      { judul: "Booklet Desa Sumber Sari", kategori: ["publikasi"], jenis: "pdf", unggulan: true,
        url: D + "1AC9XKzUuhm1fA9SYm3Y6jaBBOkBeXrTy/view", lokasi: P9 + " / 9a.3 Booklet Infografis", diperbarui: "2026-08-14" },
      { judul: "Buku Saku Desa Sumber Sari", kategori: ["publikasi"], jenis: "pdf", unggulan: true,
        url: D + "1nFqkKZ_d34l351j1S8DaaQobCRZRE-Ew/view", lokasi: "7. Kaltim-Sumber Sari / Desa", diperbarui: "2026-09-09",
        ket: "Ringkasan data dan potensi Desa Sumber Sari dalam format saku." },
      { judul: "Infografis Desa Sumber Sari", kategori: ["publikasi"], jenis: "gambar", unggulan: true,
        url: D + "1jmDtxeuf-3TshD8OZtt25VATjgYmNSzy/view", lokasi: P9 + " / 9a.3 Booklet Infografis", diperbarui: "2026-07-17" },
      { judul: "Naskah Profil Desa Sumber Sari 2026 (Word)", kategori: ["publikasi"], jenis: "docx",
        url: D + "1PCEFPpa2xYdF401R-ctFHfOAPX4PZDpj/view", lokasi: MD + " / 12. Akses Data", diperbarui: "2026-06-18" },
      { judul: "Daftar ragam data desa", kategori: ["publikasi", "pedoman"], jenis: "pdf",
        url: D + "1ityPlgRsmXZylgTwSMEaiQp4m_q5odlh/view", lokasi: MD + " / 10a. Ketersediaan Data", diperbarui: "2026-07-17",
        ket: "Daftar 37 jenis data desa beserta halaman letaknya di Monografi Desa." },
      { judul: "Publikasi lainnya", kategori: ["publikasi"], jenis: "folder",
        url: F + "1laBCsYpMAjk4fl6NTaZaPKA6-xpk5mJ5", lokasi: P9 + " / 9a.5", diperbarui: "2026-07-03" },
      { judul: "Bahan website desa", kategori: ["publikasi"], jenis: "folder",
        url: F + "1ia-qpHOcdxAo1wLpKvOFHx5SOKh_pjma", lokasi: P9 + " / 9a.6", diperbarui: "2026-07-03" },
      { judul: "Media publikasi", kategori: ["publikasi", "dokumentasi"], jenis: "folder",
        url: F + "1V3t2VownK7H7nurjRHGEWZOYXycQOIcG", lokasi: ROOT, diperbarui: "2026-06-17" },

      /* ---------- PEDOMAN, SOP & METADATA ---------- */
      { judul: "Kuesioner (semua pendataan)", kategori: ["pedoman"], jenis: "folder", utama: true,
        url: F + "1a5d_EwUBqRxyGOwOZSzUZmZKRCY9RuPG", lokasi: P7 + " / 7a.1", diperbarui: "2026-08-12" },
      { judul: "Buku pedoman", kategori: ["pedoman"], jenis: "folder",
        url: F + "1T4VpEGqrmBJsLAi8NMbOy80JSyTxicme", lokasi: P7 + " / 7a.3", diperbarui: "2026-07-23" },
      { judul: "Rancangan output", kategori: ["pedoman"], jenis: "folder",
        url: F + "1TQS93cfoRbNUilRkj7EN2Sft7Qrj0Ssz", lokasi: P7 + " / 7a.2", diperbarui: "2026-08-13" },
      { judul: "SOP kegiatan", kategori: ["pedoman"], jenis: "folder",
        url: F + "1Couq0CdO_QcVsXROsrmI4F2j3inLI67g", lokasi: P7 + " / 7a.4", diperbarui: "2026-07-03" },
      { judul: "Metadata statistik", kategori: ["pedoman"], jenis: "folder",
        url: F + "1ako9fI9wtrO4NlKQp_vpk3VxzOw1zzqT", lokasi: MD + " / 11. Kualitas Data / 11b", diperbarui: "2026-07-17" },
      { judul: "Instrumen identifikasi kebutuhan data 2026", kategori: ["pedoman"], jenis: "pdf",
        url: D + "16Hj7Sk82aMq8f7uUd-TrDxk0NxBiCWTf/view", lokasi: KS + " / 6. Identifikasi Kebutuhan Data", diperbarui: "2026-07-23" },
      { judul: "Instrumen identifikasi kebutuhan data 2026 (Word)", kategori: ["pedoman"], jenis: "docx",
        url: D + "1BpEIKI8LrMdOcwLqc9JGtOzxFcViPITz/view", lokasi: KS + " / 6. Identifikasi Kebutuhan Data", diperbarui: "2026-07-23" },
      { judul: "Formulir permintaan informasi data", kategori: ["pedoman", "kelembagaan"], jenis: "pdf",
        url: D + "1kHvTXMvW7RsAyEZnK_RO5vxq2c0bbmCN/view", lokasi: MD + " / 12. Akses Data / 12b. SOP Permintaan Data", diperbarui: "2026-07-07",
        ket: "Isi formulir ini untuk meminta salinan data desa." },
      { judul: "SOP permintaan data", kategori: ["pedoman"], jenis: "folder",
        url: F + "110Rfv98Sd0BN5U3jDSP9Q5MoMkIyUg9B", lokasi: MD + " / 12. Akses Data / 12b", diperbarui: "2026-07-07" },

      /* ---------- KELEMBAGAAN & SK ---------- */
      { judul: "SK Agen Desa Cantik", kategori: ["kelembagaan"], jenis: "pdf", utama: true,
        url: D + "1ugdH6m5Xfu4wf3O8QrUP3to-cDOVi0-l/view", lokasi: TK + " / 3. Agen/Komunitas Statistik", diperbarui: "2026-07-03" },
      { judul: "SK Kepala Desa — pengangkatan perangkat", kategori: ["kelembagaan"], jenis: "pdf",
        url: D + "1ojElHIFcuWOq9Lna9yP-Sohj62eX97GA/view", lokasi: TK + " / 3. Agen/Komunitas Statistik", diperbarui: "2026-06-18" },
      { judul: "SK Staf 2026", kategori: ["kelembagaan"], jenis: "pdf",
        url: D + "1DGfIZB1-qvmMyhEQp8NR5tsJftukngAV/view", lokasi: TK + " / 3. Agen/Komunitas Statistik", diperbarui: "2026-06-18" },
      { judul: "SK PPID Sumber Sari", kategori: ["kelembagaan"], jenis: "pdf",
        url: D + "1bHO2TjtoJ8WTK_QMiP2_O9OmARdtJXIN/view", lokasi: MD + " / 12. Akses Data / 12b", diperbarui: "2026-06-25" },
      { judul: "Resume kegiatan agen statistik", kategori: ["kelembagaan", "lke"], jenis: "xlsx",
        url: D + "1TDJSNEC-sDq1IzgqdVip4tTdbOYAi86r/view", lokasi: TK + " / 3. Agen/Komunitas Statistik", diperbarui: "2026-09-20",
        ket: "Catatan kegiatan agen statistik yang terus diperbarui." },
      { judul: "Jumlah agen statistik", kategori: ["kelembagaan", "lke"], jenis: "pdf",
        url: D + "1Yn_GnIFAAXQA9PUFw6x5so2-gbshORQv/view", lokasi: TK + " / 4. Keberlanjutan Desa Cantik / 4a", diperbarui: "2026-07-03" },

      /* ---------- LKE DESA CANTIK ---------- */
      { judul: "LKE Desa Sumber Sari", kategori: ["lke"], jenis: "folder", utama: true,
        url: F + "1iDqLAywqeLQEjU5EVBqIi02CUArULwRX", lokasi: ROOT, diperbarui: "2026-07-02",
        ket: "Folder induk bukti dukung Lembar Kerja Evaluasi Desa Cantik." },
      { judul: "I. Tata Kelola", kategori: ["lke"], jenis: "folder",
        url: F + "1gXdoi-PSp1Ri-RntxNXbhRLDMuobA4N6", lokasi: LKE, diperbarui: "2026-07-03" },
      { judul: "II. Kapasitas Statistik", kategori: ["lke"], jenis: "folder",
        url: F + "1VSTm41OWDcuTl3z2xlY4JE0w2OSb2ppL", lokasi: LKE, diperbarui: "2026-07-03" },
      { judul: "III. Manajemen Data", kategori: ["lke"], jenis: "folder",
        url: F + "1pOmYRAGs_JtJ5kReMuN02TG1dEXOWhhw", lokasi: LKE, diperbarui: "2026-07-03" },
      { judul: "LKE bukti dukung 4.b", kategori: ["lke"], jenis: "docx",
        url: D + "1pyb36-KvN_uPeSHgAKAwgyuE3nvRAaRC/view", lokasi: TK + " / 3. Agen/Komunitas Statistik", diperbarui: "2026-08-14" },
      { judul: "LKE bukti dukung 14.a.2 — kebermanfaatan data", kategori: ["lke"], jenis: "pdf",
        url: D + "1uQ2pVvtn9VKEojdlQoAoo69NgD76abg7/view", lokasi: MD + " / 14. Kebermanfaatan Program / 14a.2", diperbarui: "2026-08-12" },
      { judul: "Kegiatan Statistik Sumber Sari (8 tahap GSBPM)", kategori: ["lke"], jenis: "folder",
        url: F + "1auwvaZa6fjIYvg1_MnGNtZmEe8WME6Iv", lokasi: ROOT, diperbarui: "2026-09-21",
        ket: "Folder induk kegiatan statistik desa, dibagi per tahap GSBPM." },
      { judul: "GSBPM 1. Spesifikasi Kebutuhan", kategori: ["lke"], jenis: "folder", url: F + "1wOr8oyPfXxK6K3tMt84ewO_0hv5FzALs", lokasi: ROOT + " / Kegiatan Statistik Sumber Sari", diperbarui: "2026-09-21" },
      { judul: "GSBPM 2. Desain", kategori: ["lke"], jenis: "folder", url: F + "1VX8LsiXZl4ntrZKW9yX4NHQvz6Vfdax8", lokasi: ROOT + " / Kegiatan Statistik Sumber Sari", diperbarui: "2026-09-21" },
      { judul: "GSBPM 3. Membangun", kategori: ["lke"], jenis: "folder", url: F + "1tGRss8TNp7p0al-gbHJRWhywZAd0NkX9", lokasi: ROOT + " / Kegiatan Statistik Sumber Sari", diperbarui: "2026-09-21" },
      { judul: "GSBPM 4. Pengumpulan Data", kategori: ["lke"], jenis: "folder", url: F + "1q8GymYVpzgWYBeSs6E0C9fM7hO1FHuMk", lokasi: ROOT + " / Kegiatan Statistik Sumber Sari", diperbarui: "2026-09-21" },
      { judul: "GSBPM 5. Pengolahan Data", kategori: ["lke"], jenis: "folder", url: F + "18RAD_OylVJxOhIX7Lwyhzt-f8HQRyO-N", lokasi: ROOT + " / Kegiatan Statistik Sumber Sari", diperbarui: "2026-09-21" },
      { judul: "GSBPM 6. Analisis", kategori: ["lke"], jenis: "folder", url: F + "1tcp9ETRU1GH6Ftmc3ST-XFD2H6UFTm9d", lokasi: ROOT + " / Kegiatan Statistik Sumber Sari", diperbarui: "2026-09-21" },
      { judul: "GSBPM 7. Diseminasi", kategori: ["lke"], jenis: "folder", url: F + "1JwdlAnDTH4wUTxXEb8Q3wDooEz4nIAGK", lokasi: ROOT + " / Kegiatan Statistik Sumber Sari", diperbarui: "2026-09-21" },
      { judul: "GSBPM 8. Evaluasi", kategori: ["lke"], jenis: "folder", url: F + "1LM72Y0I9ZWeDOOlhl7A4fO85I3rjxGl5", lokasi: ROOT + " / Kegiatan Statistik Sumber Sari", diperbarui: "2026-09-21" },

      /* ---------- DOKUMENTASI ---------- */
      { judul: "Video Cantik Sumber Sari", kategori: ["dokumentasi"], jenis: "folder", utama: true,
        url: F + "10V2Fu92sM-HUPVVT62EOXvHVNZ_f4Ip0", lokasi: ROOT, diperbarui: "2026-08-18" },
      { judul: "Dokumentasi Desa Cantik 2026 (semua kegiatan)", kategori: ["dokumentasi"], jenis: "folder",
        url: F + "1fq0-4FC_K6FZhu6A2q2Er4bUmQ5gWcKq", lokasi: ROOT + " / Punya Indah", diperbarui: "2026-09-09" },
      { judul: "Kegiatan ke-1 · 22 April 2026", kategori: ["dokumentasi"], jenis: "folder", url: F + "1g8BPSQxaSQu9TbB1sxL-Xp0OwoGHEb7O", lokasi: DOK, diperbarui: "2026-04-22" },
      { judul: "Kegiatan ke-2 · 29 April 2026", kategori: ["dokumentasi"], jenis: "folder", url: F + "1lm4Wa_e8PqL495fkJ9M8kebEXCXHEo_A", lokasi: DOK, diperbarui: "2026-04-29" },
      { judul: "Kegiatan ke-3 · 30 April 2026", kategori: ["dokumentasi"], jenis: "folder", url: F + "1gaES7fiuI98i5C5rJuDo7GDhTaBo84W7", lokasi: DOK, diperbarui: "2026-04-30" },
      { judul: "Kegiatan ke-5 · 13 Mei 2026 — Pencanangan Desa Cantik", kategori: ["dokumentasi"], jenis: "folder", url: F + "1sfsWcmlCQW_ibPpMLWIVDqHKcnz1Q7XF", lokasi: DOK, diperbarui: "2026-05-13" },
      { judul: "Kegiatan ke-10 · 22 Juni 2026", kategori: ["dokumentasi"], jenis: "folder", url: F + "1YFXXhk3N2N4v7k02gXyi9cS9FB0MgjVw", lokasi: DOK, diperbarui: "2026-06-22" },
      { judul: "Kegiatan ke-11 · 23 Juni 2026", kategori: ["dokumentasi"], jenis: "folder", url: F + "1aIH7tE0VzLB9Kdn-L6ReK4P70aLd94Pb", lokasi: DOK, diperbarui: "2026-06-23" },
      { judul: "Kegiatan ke-17 · 7 Juli 2026", kategori: ["dokumentasi"], jenis: "folder", url: F + "101FkYhOkEguHm0MqSsBBHD8JmGnDOBfR", lokasi: DOK, diperbarui: "2026-07-07" },
      { judul: "Kegiatan ke-20 · 10 Juli 2026", kategori: ["dokumentasi"], jenis: "folder", url: F + "1Yq33_5jGNu34ecthRTReO9HZwGLQnRav", lokasi: DOK, diperbarui: "2026-07-10" },
      { judul: "Kegiatan ke-34 · 8 September 2026", kategori: ["dokumentasi"], jenis: "folder", url: F + "1F2H5LPywGnejJ4ZQuKNpsMxmlI1LHPD7", lokasi: DOK, diperbarui: "2026-09-08" },

      /* ---------- ARSIP TIM ---------- */
      { judul: "Folder induk DESA CANTIK", kategori: ["arsip", "lke"], jenis: "folder", utama: true,
        url: F + "1meMzbGUxPfD1aELKz-p-Mz_Sdf6ZCJrj", lokasi: "Google Drive", diperbarui: "2026-09-21",
        ket: "Folder paling atas yang menampung seluruh data Desa Cantik Sumber Sari." },
      { judul: "Arsip Bu Eni", kategori: ["arsip"], jenis: "folder",
        url: F + "16iBtYY7WBrC-KI8OCaWo0FLX5LKpJUdY", lokasi: ROOT, diperbarui: "2026-06-22" },
      { judul: "Arsip Mbak Indah", kategori: ["arsip"], jenis: "folder",
        url: F + "1BurteawgSyyrLNx8dB4DkNpWx6l7O2uc", lokasi: ROOT, diperbarui: "2026-08-12" },
      { judul: "Arsip Mbak Indah · 7 Juli 2026", kategori: ["arsip"], jenis: "folder",
        url: F + "1DzMqBrz1hJfrIyyPi9zjhl0otNO28Qjf", lokasi: ROOT + " / Punya Indah", diperbarui: "2026-08-12" },
      { judul: "Arsip Mas Budi (MBG)", kategori: ["arsip"], jenis: "folder",
        url: F + "1VFIPe30c4KSaYgTbtssLRCFZS2D5yGrl", lokasi: ROOT, diperbarui: "2026-06-18" }
    ]
  };
})();
