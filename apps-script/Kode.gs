/* =====================================================================
   SDDS — Satu Data Desa Sumber Sari
   Backend Google Apps Script untuk website (versi 2).

   Fitur:
   - Katalog: kategori, tautan, alur GSBPM, menu, angka beranda.
   - Unggah berkas dari website langsung ke folder Google Drive.
   - Baca otomatis nama, jenis, tanggal, dan letak berkas dari link Drive.
   - Kotak masuk: berkas baru di Drive yang belum dicatat di SDDS.
   - Cek tautan rusak + peringatan berkas "Terbatas" yang terbuka publik.
   - Jadwal pembaruan data, penanggung jawab, dan email pengingat.
   - Tong sampah 30 hari, riwayat perubahan, cadangan mingguan.
   - Dasbor statistik (hanya angka ringkasan) dari spreadsheet penduduk.

   PEMASANGAN / PEMBARUAN
   1. Buka spreadsheet "SDDS – Database Katalog" → Ekstensi → Apps Script.
   2. Hapus semua isi editor, tempel seluruh file ini, klik Simpan.
   3. Di bilah atas editor, pilih fungsi  aktifkanOtomatis  → klik Jalankan.
      Izinkan akses (Lanjutan → Buka … (tidak aman) → Izinkan).
   4. Terapkan → Kelola deployment → ikon pensil → Versi: Versi baru → Terapkan.
      (Pemasangan pertama: Terapkan → Deployment baru → Aplikasi web,
       Jalankan sebagai: Saya · Yang memiliki akses: Siapa saja.)
   5. Pemasangan pertama saja: salin URL /exec ke data/katalog.js → backend.url.

   Lupa kunci editor? Setelan project → Properti skrip → hapus KUNCI_HASH,
   lalu buat kunci baru dari website.
   ===================================================================== */

/* ---------------- pengaturan dasar ---------------- */
var SHEET_ID = '1sAWFy-y3M0ea9Z5wEPF7fUetB7PqV8MpUAQ3qt24OUg';          // spreadsheet database ini
var DATA_PENDUDUK_ID = '1C4eFqkd-xjLurRsvzEFMxHB_-GAqdSIZ-uN3lFxWFfQ';  // "DATA SUMBER SARI" untuk dasbor
var FOLDER_INDUK_ID = '1meMzbGUxPfD1aELKz-p-Mz_Sdf6ZCJrj';             // folder DESA CANTIK
var SITUS_URL = 'https://bpskukar.github.io/sdds-sumbersari/';
var EMAIL_DESA = 'desacantikdesasumbersari@gmail.com';
var VERSI = 2;
var BATAS_UNGGAH = 20 * 1024 * 1024;   // 20 MB per berkas
var HARI_SAMPAH = 30;
var JUMLAH_CADANGAN = 8;

var KOLOM = {
  Kategori: ['id', 'nama', 'namaPanjang', 'ikon', 'warna', 'deskripsi', 'sorot', 'folder'],
  Data: ['id', 'judul', 'kategori', 'jenis', 'url', 'lokasi', 'diperbarui', 'ket', 'terbatas', 'utama', 'unggulan', 'frekuensi', 'pj', 'pjEmail'],
  Pengaturan: ['kunci', 'nilai'],
  Riwayat: ['waktu', 'oleh', 'aksi', 'keterangan'],
  Status: ['id', 'cek', 'pesan', 'diubahDrive', 'akses', 'dicek'],
  KotakMasuk: ['id', 'nama', 'url', 'mime', 'jalur', 'leluhur', 'dibuat', 'diubah', 'status', 'ditemukan'],
  Sampah: ['sid', 'waktu', 'oleh', 'jenis', 'judul', 'isi'],
  _Pindai: ['id', 'nama', 'induk', 'status']
};
var BOOL = { sorot: 1, terbatas: 1, utama: 1, unggulan: 1 };
var PENGATURAN_BOLEH = ['alur', 'menu', 'statistik', 'statistikSumber', 'folderPantau', 'folderUnggah', 'notifikasi', 'dasborSumber'];
var PENGATURAN_TERSEMBUNYI = { kunciEditor: 1, dasbor: 1 };
var FREKUENSI_BULAN = { bulanan: 1, triwulan: 3, semester: 6, tahunan: 12 };
var MIME_FOLDER = 'application/vnd.google-apps.folder';
var MIME_LEWATI = { 'application/vnd.google-apps.script': 1, 'application/vnd.google-apps.shortcut': 1, 'application/vnd.google-apps.form': 0 };

/* =====================================================================
   MENU SPREADSHEET (hanya muncul bila script menempel di spreadsheet)
   ===================================================================== */
function onOpen() {
  try { SpreadsheetApp.getUi(); } catch (e) { return; }
  SpreadsheetApp.getUi().createMenu('SDDS')
    .addItem('Aktifkan fitur otomatis', 'aktifkanOtomatis')
    .addItem('Cadangkan database sekarang', 'cadangkanSekarang')
    .addItem('Hitung ulang dasbor statistik', 'hitungDasborSekarang')
    .addSeparator()
    .addItem('Atur kunci editor', 'aturKunci')
    .addItem('Lihat alamat web app', 'lihatUrl')
    .addToUi();
}

function aturKunci() {
  var ui = SpreadsheetApp.getUi();
  var r = ui.prompt('Kunci editor SDDS',
    'Tulis kunci editor baru (minimal 8 karakter).\nKunci ini dipakai perangkat desa untuk menyimpan perubahan dari website.',
    ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;
  var k = String(r.getResponseText() || '').trim();
  if (k.length < 8) { ui.alert('Kunci minimal 8 karakter. Coba lagi.'); return; }
  props_().setProperty('KUNCI_HASH', hash_(k));
  catat_('Admin', 'Atur kunci editor', 'Kunci editor diganti');
  ui.alert('Kunci editor tersimpan.\n\nBagikan kunci ini hanya kepada perangkat yang boleh mengubah data.');
}

function lihatUrl() {
  var u = '';
  try { u = ScriptApp.getService().getUrl(); } catch (e) { u = ''; }
  pesan_(u ? 'Alamat web app:\n\n' + u + '\n\nTempel alamat ini di data/katalog.js → backend.url'
    : 'Belum di-deploy.\nTerapkan → Deployment baru → Aplikasi web.');
}

/* Jalankan SEKALI dari editor Apps Script: memberi izin Drive/email
   dan memasang jadwal harian (pukul 06.00). */
function aktifkanOtomatis() {
  hapusPemicu_('tugasHarian');
  hapusPemicu_('lanjutkanTugas');
  ScriptApp.newTrigger('tugasHarian').timeBased().everyDays(1).atHour(6).create();
  DriveApp.getRootFolder();
  MailApp.getRemainingDailyQuota();
  var p = props_();
  p.setProperty('OTOMATIS', sekarang_());
  if (!p.getProperty('EMAIL_TERAKHIR')) p.setProperty('EMAIL_TERAKHIR', String(Date.now()));
  sheet_('Status'); sheet_('KotakMasuk'); sheet_('Sampah');
  var r = jalankanSemua_(4 * 60 * 1000);
  pesan_('Fitur otomatis SDDS aktif.\n\n' +
    '• Tautan diperiksa setiap hari pukul 06.00\n' +
    '• Berkas baru di Drive masuk Kotak masuk\n' +
    '• Database dicadangkan setiap minggu\n' +
    '• Email pengingat dikirim setiap minggu\n\n' +
    'Pemeriksaan pertama: ' + (r.belum ? 'masih berlanjut beberapa menit lagi.' : 'selesai.') +
    '\n\nLangkah berikutnya: Terapkan → Kelola deployment → pensil → Versi baru → Terapkan.');
}

function cadangkanSekarang() { var r = cadangkan_('Admin'); pesan_('Cadangan dibuat:\n' + r.nama); }
function hitungDasborSekarang() { var r = hitungDasbor_(); pesan_(r.ok ? 'Dasbor dihitung ulang: ' + r.total + ' penduduk.' : r.pesan); }

/* =====================================================================
   WEB APP
   ===================================================================== */
function doGet(e) {
  try {
    var aksi = e && e.parameter && e.parameter.aksi;
    if (aksi === 'dasbor') return json_(bacaDasbor_());
    pastikanId_();
    return json_(statusLengkap_());
  } catch (err) {
    return json_({ ok: false, pesan: pesanGalat_(err) });
  }
}

function doPost(e) {
  var b;
  try { b = JSON.parse((e && e.postData && e.postData.contents) || '{}'); }
  catch (err) { return json_({ ok: false, pesan: 'Permintaan tidak bisa dibaca.' }); }
  try {
    var cek = cocokKunci_(b.kunci);
    if (b.aksi === 'buatKunci') {
      if (cek !== null) return json_({ ok: false, pesan: 'Kunci editor sudah pernah dibuat. Masukkan kunci yang sudah ada.' });
      var baru = String(b.kunciBaru || '').trim();
      if (baru.length < 8) return json_({ ok: false, pesan: 'Kunci minimal 8 karakter.' });
      props_().setProperty('KUNCI_HASH', hash_(baru));
      catat_(String(b.oleh || 'Perangkat desa').slice(0, 60), 'Buat kunci editor', 'Kunci editor dibuat dari website');
      return json_({ ok: true });
    }
    if (cek === null) return json_({ ok: false, kode: 'belum-ada-kunci', pesan: 'Kunci editor belum dibuat.' });
    if (!cek) return json_({ ok: false, kode: 'kunci', pesan: 'Kunci editor salah.' });
    var oleh = String(b.oleh || 'Perangkat desa').slice(0, 60);

    switch (b.aksi) {
      case 'cek': return json_({ ok: true, versi: VERSI });
      case 'infoTautan': return json_(infoTautan_(b.url));
      case 'kotakMasuk': return json_(bacaKotakMasuk_());
      case 'log': return json_(bacaLog_());
      case 'jalankan': return json_(jalankanDariWeb_(String(b.tugas || ''), !!b.mulaiBaru, oleh));
      case 'unggah': return json_(unggah_(b, oleh));
    }
    return json_(denganKunci_(function () {
      pastikanId_();
      ubahData_(b, oleh);
      return statusLengkap_();
    }));
  } catch (err) {
    return json_({ ok: false, pesan: pesanGalat_(err) });
  }
}

function ubahData_(b, oleh) {
  if (b.aksi === 'simpanItem') {
    var it = rapikanItem_(b.item || {});
    if (!it.id || !it.url) throw new Error('Data tautan tidak lengkap.');
    var lama = cariBaris_('Data', it.id);
    simpanBaris_('Data', it);
    catat_(oleh, b.baru ? 'Tambah tautan' : 'Ubah tautan', it.judul + ' → ' + it.url);
    if (!lama || lama.url !== it.url) { try { simpanStatus_([cekSatu_({ id: it.id, url: it.url })]); } catch (e) { /* izin Drive belum ada */ } }
  } else if (b.aksi === 'hapusItem') {
    var d = cariBaris_('Data', String(b.id));
    if (!d) throw new Error('Tautan tidak ditemukan. Muat ulang halaman.');
    keSampah_(oleh, 'tautan', d.judul, d);
    hapusBaris_('Data', d.id);
    catat_(oleh, 'Hapus tautan', d.judul + ' (bisa dipulihkan ' + HARI_SAMPAH + ' hari)');
  } else if (b.aksi === 'simpanKategori') {
    var k = rapikanKategori_(b.kategori || {});
    if (!k.id || !k.nama) throw new Error('Data kategori tidak lengkap.');
    simpanBaris_('Kategori', k);
    catat_(oleh, b.baru ? 'Tambah kategori' : 'Ubah kategori', k.nama);
  } else if (b.aksi === 'hapusKategori') {
    var id = String(b.id);
    var kat = cariBaris_('Kategori', id);
    if (!kat) throw new Error('Kategori tidak ditemukan. Muat ulang halaman.');
    var terkait = [];
    var data = baca_('Data').map(function (x) {
      if ((x.kategori || []).indexOf(id) > -1) terkait.push(x.id);
      x.kategori = (x.kategori || []).filter(function (y) { return y !== id; });
      return x;
    });
    keSampah_(oleh, 'kategori', kat.nama, { kategori: kat, item: terkait });
    hapusBaris_('Kategori', id);
    tulis_('Data', data);
    catat_(oleh, 'Hapus kategori', kat.nama + ' (bisa dipulihkan ' + HARI_SAMPAH + ' hari)');
  } else if (b.aksi === 'simpanPengaturan') {
    var kunci = String(b.kunciSet || '');
    if (PENGATURAN_BOLEH.indexOf(kunci) === -1) throw new Error('Pengaturan tidak dikenal.');
    setPengaturan_(kunci, b.nilai == null ? '' : b.nilai);
    if (kunci === 'dasborSumber') props_().deleteProperty('DASBOR_WAKTU');
    catat_(oleh, 'Ubah ' + kunci, JSON.stringify(b.nilai == null ? '' : b.nilai).slice(0, 300));
  } else if (b.aksi === 'tandaiDiperbarui') {
    var t = cariBaris_('Data', String(b.id));
    if (!t) throw new Error('Tautan tidak ditemukan.');
    t.diperbarui = hariIni_();
    simpanBaris_('Data', t);
    catat_(oleh, 'Tandai diperbarui', t.judul);
  } else if (b.aksi === 'abaikan') {
    var ids = {};
    (b.ids || []).forEach(function (x) { ids[String(x)] = 1; });
    var n = 0;
    var kotak = baca_('KotakMasuk').map(function (r) { if (ids[r.id] && r.status !== 'abaikan') { r.status = 'abaikan'; n++; } return r; });
    tulis_('KotakMasuk', kotak);
    if (n) catat_(oleh, 'Abaikan kotak masuk', n + ' berkas');
  } else if (b.aksi === 'pulihkan') {
    pulihkan_(String(b.sid || ''), oleh);
  } else if (b.aksi === 'impor') {
    var adaIsi = baca_('Kategori').length || baca_('Data').length;
    if (adaIsi && !b.paksa) throw new Error('Database sudah berisi data. Impor dibatalkan agar tidak menimpa.');
    tulis_('Kategori', (b.kategori || []).map(rapikanKategori_));
    tulis_('Data', (b.data || []).map(rapikanItem_));
    var p = b.pengaturan || {};
    PENGATURAN_BOLEH.forEach(function (x) { if (p[x] != null && p[x] !== '') setPengaturan_(x, p[x]); });
    catat_(oleh, 'Impor data awal', (b.data || []).length + ' tautan, ' + (b.kategori || []).length + ' kategori');
  } else {
    throw new Error('Aksi tidak dikenal: ' + b.aksi + '. Pastikan Apps Script sudah versi terbaru.');
  }
}

/* =====================================================================
   STATUS UNTUK WEBSITE
   ===================================================================== */
function statusLengkap_() {
  var status = {};
  baca_('Status').forEach(function (s) { status[s.id] = { cek: s.cek, pesan: s.pesan, diubahDrive: s.diubahDrive, akses: s.akses, dicek: s.dicek }; });
  var data = baca_('Data');
  return {
    ok: true,
    versi: VERSI,
    kategori: baca_('Kategori'),
    data: data,
    pengaturan: bacaPengaturan_(),
    status: status,
    info: info_(data),
    kunciSiap: cocokKunci_('') !== null,
    waktu: new Date().toISOString()
  };
}

function info_(data) {
  var p = props_().getProperties();
  var tercatat = idTercatat_(data);
  var baru = 0, lama = 0;
  baca_('KotakMasuk').forEach(function (r) {
    if (tercatat[r.id]) return;
    if (r.status === 'baru') baru++; else if (r.status === 'lama') lama++;
  });
  return {
    otomatis: p.OTOMATIS || '',
    cekTerakhir: p.CEK_TERAKHIR || '',
    cekBerjalan: +(p.CEK_I || 0) > 0,
    pindaiTerakhir: p.PINDAI_TERAKHIR ? tglJam_(new Date(+p.PINDAI_TERAKHIR)) : '',
    pindaiPenuhTerakhir: p.PENUH_TERAKHIR || '',
    pindaiPenuhBerjalan: p.PENUH_JALAN === '1',
    cadanganTerakhir: p.CADANGAN_TERAKHIR || '',
    emailTerakhir: p.EMAIL_TERAKHIR ? tglJam_(new Date(+p.EMAIL_TERAKHIR)) : '',
    dasborTerakhir: p.DASBOR_TERAKHIR || '',
    kotakBaru: baru,
    kotakLama: lama
  };
}

/* =====================================================================
   BACA INFO TAUTAN DRIVE
   ===================================================================== */
function infoTautan_(url) {
  var id = idDrive_(url);
  if (!id) return { ok: true, drive: false };
  var r = ambilDrive_(id);
  if (!r) return { ok: false, kode: 'tidak-ada', pesan: 'Berkas tidak ditemukan, atau akun pengelola SDDS belum diberi akses ke berkas ini.' };
  var o = r.obj;
  var mime = r.folder ? MIME_FOLDER : o.getMimeType();
  var induk = indukPertama_(o);
  return {
    ok: true, drive: true, id: id,
    nama: o.getName(),
    mime: mime,
    jenis: jenisDariMime_(mime, o.getName()),
    folder: r.folder,
    dibuat: tgl_(o.getDateCreated()),
    diubah: tgl_(terakhirDiubah_(o, r.folder)),
    akses: aksesTeks_(o),
    dihapus: o.isTrashed(),
    lokasi: induk ? jalurFolder_(induk) : '',
    ukuran: r.folder ? 0 : o.getSize()
  };
}

/* =====================================================================
   UNGGAH BERKAS
   ===================================================================== */
function unggah_(b, oleh) {
  var f = b.berkas || {};
  if (!f.data || !f.nama) throw new Error('Berkas kosong.');
  var bytes = Utilities.base64Decode(String(f.data));
  if (bytes.length > BATAS_UNGGAH) throw new Error('Berkas lebih dari 20 MB. Unggah langsung di Google Drive, lalu tempel link-nya.');
  var fid = idDrive_(b.folder) || String(b.folder || '');
  if (!fid) throw new Error('Folder tujuan belum dipilih.');
  var folder;
  try { folder = DriveApp.getFolderById(fid); folder.getName(); }
  catch (e) { throw new Error('Folder tujuan tidak ditemukan, atau akun pengelola SDDS tidak punya akses ke folder itu.'); }
  var nama = String(f.nama).replace(/[\\/:*?"<>|]+/g, ' ').trim().slice(0, 180) || 'berkas';
  var file;
  try { file = folder.createFile(Utilities.newBlob(bytes, f.mime || 'application/octet-stream', nama)); }
  catch (e) { throw new Error('Berkas tidak bisa disimpan ke folder "' + folder.getName() + '". Pastikan akun pengelola SDDS punya izin Edit di folder itu.'); }
  var src = b.item || {};
  var it = rapikanItem_({
    id: src.id || idBaru_(),
    judul: src.judul || nama.replace(/\.[^.]+$/, ''),
    kategori: src.kategori || [],
    jenis: jenisDariMime_(file.getMimeType(), nama),
    url: file.getUrl(),
    lokasi: jalurFolder_(folder),
    diperbarui: hariIni_(),
    ket: src.ket || '',
    terbatas: !!src.terbatas, utama: false, unggulan: !!src.unggulan,
    frekuensi: src.frekuensi || '', pj: src.pj || '', pjEmail: src.pjEmail || ''
  });
  var akses = aksesTeks_(file);
  return denganKunci_(function () {
    pastikanId_();
    simpanBaris_('Data', it);
    simpanStatus_([{ id: it.id, cek: 'ok', pesan: '', diubahDrive: hariIni_(), akses: akses, dicek: sekarang_() }]);
    catat_(oleh, 'Unggah berkas', it.judul + ' → ' + it.lokasi);
    var st = statusLengkap_();
    st.itemBaru = it.id;
    return st;
  });
}

/* =====================================================================
   TUGAS OTOMATIS (pemicu harian + tombol di website)
   ===================================================================== */
function tugasHarian() { jalankanSemua_(5 * 60 * 1000 - 20000); }

function lanjutkanTugas() {
  hapusPemicu_('lanjutkanTugas');
  jalankanSemua_(5 * 60 * 1000 - 20000);
}

function jalankanSemua_(batasMs) {
  var mulai = Date.now();
  function sisa() { return batasMs - (Date.now() - mulai); }
  var p = props_(), belum = false, r;
  var jam20 = 20 * 3600 * 1000;

  if (+(p.getProperty('CEK_I') || 0) > 0 || umur_(p.getProperty('CEK_WAKTU')) > jam20) {
    r = tugasCek_(Math.max(sisa() * 0.45, 20000), false);
    if (!r.selesai) belum = true;
  }
  if (sisa() > 30000) { r = tugasPindai_(Math.min(sisa() * 0.5, 90000)); if (!r.selesai) belum = true; }
  if (p.getProperty('PENUH_JALAN') === '1' && sisa() > 40000) { r = tugasPindaiPenuh_(sisa() - 30000, false); if (!r.selesai) belum = true; }
  try { bersihkanSampah_(); } catch (e) { /* abaikan */ }
  if (sisa() > 30000 && umur_(p.getProperty('DASBOR_WAKTU')) > jam20) { try { hitungDasbor_(); } catch (e) { /* abaikan */ } }
  if (umur_(p.getProperty('CADANGAN_WAKTU')) > 6.5 * 24 * 3600 * 1000) { try { cadangkan_('Sistem'); } catch (e) { /* abaikan */ } }
  if (!belum && umur_(p.getProperty('EMAIL_TERAKHIR')) > 6.5 * 24 * 3600 * 1000) { try { kirimLaporan_(false); } catch (e) { /* abaikan */ } }
  if (belum) jadwalkanLanjutan_();
  return { belum: belum };
}

function jalankanDariWeb_(tugas, mulaiBaru, oleh) {
  var batas = 20000, r;
  if (tugas === 'cek') r = tugasCek_(batas, mulaiBaru);
  else if (tugas === 'pindai') r = tugasPindai_(batas);
  else if (tugas === 'pindaiPenuh') r = tugasPindaiPenuh_(batas, mulaiBaru);
  else if (tugas === 'cadangan') r = cadangkan_(oleh);
  else if (tugas === 'dasbor') { r = hitungDasbor_(); if (!r.ok) throw new Error(r.pesan); r = { selesai: true, total: r.total }; }
  else if (tugas === 'email') r = kirimLaporan_(true);
  else throw new Error('Tugas tidak dikenal.');
  var hasil = { ok: true, tugas: tugas, selesai: r.selesai !== false, progres: r };
  if (hasil.selesai) {
    var st = statusLengkap_();
    for (var k in st) if (st.hasOwnProperty(k)) hasil[k] = st[k];
    hasil.ok = true;
  }
  return hasil;
}

/* ---------- 1. cek tautan ---------- */
function tugasCek_(batasMs, mulaiBaru) {
  var p = props_();
  var i = mulaiBaru ? 0 : +(p.getProperty('CEK_I') || 0);
  var target = daftarTarget_();
  if (i >= target.length) i = 0;
  var t0 = Date.now(), hasil = [];
  while (i < target.length && Date.now() - t0 < batasMs) { hasil.push(cekSatu_(target[i])); i++; }
  var selesai = i >= target.length;
  denganKunci_(function () { simpanStatus_(hasil, selesai ? target : null); });
  if (selesai) {
    p.setProperty('CEK_I', '0');
    p.setProperty('CEK_WAKTU', String(Date.now()));
    p.setProperty('CEK_TERAKHIR', sekarang_());
  } else p.setProperty('CEK_I', String(i));
  return { selesai: selesai, i: i, total: target.length };
}

function daftarTarget_() {
  var t = baca_('Data').map(function (d) { return { id: d.id, url: d.url }; });
  var pg = bacaPengaturan_();
  (pg.alur || []).forEach(function (a, i) {
    (a.tautan || []).forEach(function (x, j) { if (x.url) t.push({ id: 'alur:' + i + ':' + j, url: x.url }); });
  });
  (pg.menu || []).forEach(function (m, i) { if (m.url) t.push({ id: 'menu:' + i, url: m.url }); });
  return t;
}

function cekSatu_(t) {
  var hasil = { id: t.id, cek: 'ok', pesan: '', diubahDrive: '', akses: '', dicek: sekarang_() };
  var url = String(t.url || '').trim();
  if (!/^https?:\/\//i.test(url)) { hasil.cek = 'rusak'; hasil.pesan = 'Link tidak lengkap (harus diawali https://).'; return hasil; }
  var id = idDrive_(url);
  if (id) {
    var r = ambilDrive_(id);
    if (!r) { hasil.cek = 'hilang'; hasil.pesan = 'Tidak ditemukan di Drive, atau akun pengelola tidak punya akses.'; return hasil; }
    try {
      if (r.obj.isTrashed()) { hasil.cek = 'dihapus'; hasil.pesan = 'Berkas ada di sampah Google Drive.'; }
      hasil.diubahDrive = tgl_(terakhirDiubah_(r.obj, r.folder));
      hasil.akses = aksesTeks_(r.obj);
    } catch (e) { hasil.pesan = 'Sebagian info tidak terbaca.'; }
    return hasil;
  }
  if (/(^|\.)google\.com\//i.test(url.replace(/^https?:\/\//i, ''))) return hasil;   // tautan Google lain: lewati
  try {
    var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true, method: 'get' });
    var kode = res.getResponseCode();
    if (kode >= 400 && kode !== 401 && kode !== 403 && kode !== 429) { hasil.cek = 'rusak'; hasil.pesan = 'Halaman tidak bisa dibuka (kode ' + kode + ').'; }
  } catch (e) { hasil.cek = 'rusak'; hasil.pesan = 'Alamat tidak bisa dihubungi.'; }
  return hasil;
}

function simpanStatus_(baris, semuaTarget) {
  if (!baris.length && !semuaTarget) return;
  var peta = {}, urut = [];
  baca_('Status').forEach(function (s) { peta[s.id] = s; urut.push(s.id); });
  baris.forEach(function (s) { if (!peta[s.id]) urut.push(s.id); peta[s.id] = s; });
  if (semuaTarget) {
    var ada = {};
    semuaTarget.forEach(function (t) { ada[t.id] = 1; });
    urut = urut.filter(function (id) { return ada[id]; });
  }
  tulis_('Status', urut.map(function (id) { return peta[id]; }));
}

/* ---------- 2. pindai berkas baru (cepat, lewat pencarian Drive) ---------- */
function tugasPindai_(batasMs) {
  var p = props_();
  var t0 = Date.now();
  var akhir = +(p.getProperty('PINDAI_TERAKHIR') || 0);
  var sejak = new Date(akhir ? akhir - 2 * 86400000 : Date.now() - 30 * 86400000);
  var q = "createdDate > '" + Utilities.formatDate(sejak, 'UTC', "yyyy-MM-dd'T'HH:mm:ss") + "' and trashed = false";
  var akar = daftarAkar_(), tercatat = idTercatat_(), ada = idKotak_(), kecuali = idKecuali_();
  var cache = {}, baru = [], habis = false;
  var sumber = [[DriveApp.searchFolders(q), true], [DriveApp.searchFiles(q), false]];
  for (var s = 0; s < sumber.length && !habis; s++) {
    var it = sumber[s][0], isFolder = sumber[s][1];
    while (it.hasNext()) {
      if (Date.now() - t0 > batasMs) { habis = true; break; }
      var o = it.next(), id = o.getId();
      if (tercatat[id] || ada[id] || kecuali[id] || akar[id]) continue;
      if (!isFolder && MIME_LEWATI[o.getMimeType()]) continue;
      var pos = posisi_(o, akar, cache, kecuali);
      if (!pos) continue;
      baru.push(barisKotak_(o, isFolder, pos, 'baru'));
      ada[id] = 1;
    }
  }
  if (baru.length) denganKunci_(function () { tambahBaris_('KotakMasuk', baru); });
  if (!habis) p.setProperty('PINDAI_TERAKHIR', String(t0));
  return { selesai: !habis, ditemukan: baru.length };
}

/* ---------- 3. pindai seluruh folder (berkas lama yang belum tercatat) ---------- */
function tugasPindaiPenuh_(batasMs, mulaiBaru) {
  var p = props_(), t0 = Date.now();
  var akar = daftarAkar_(), kecuali = idKecuali_();
  var tabel;
  if (mulaiBaru || p.getProperty('PENUH_JALAN') !== '1') {
    tabel = Object.keys(akar).map(function (id) {
      var nama = id;
      try { nama = DriveApp.getFolderById(id).getName(); } catch (e) { /* abaikan */ }
      return { id: id, nama: nama, induk: '', status: 'antri' };
    });
    p.setProperty('PENUH_JALAN', '1');
  } else tabel = baca_('_Pindai');
  var peta = {};
  tabel.forEach(function (r) { peta[r.id] = r; });
  var tercatat = idTercatat_(), ada = idKotak_(), kotak = [], diproses = 0;

  for (var i = 0; i < tabel.length; i++) {
    var row = tabel[i];
    if (row.status !== 'antri') continue;
    if (Date.now() - t0 > batasMs) break;
    try {
      var f = DriveApp.getFolderById(row.id);
      var pos = jalurTabel_(row.id, peta);
      var subs = f.getFolders();
      while (subs.hasNext()) {
        var s = subs.next(), sid = s.getId();
        if (kecuali[sid]) continue;
        if (!peta[sid]) { var nr = { id: sid, nama: s.getName(), induk: row.id, status: 'antri' }; peta[sid] = nr; tabel.push(nr); }
        if (!tercatat[sid] && !ada[sid]) { kotak.push(barisKotak_(s, true, pos, 'lama')); ada[sid] = 1; }
      }
      var fs = f.getFiles();
      while (fs.hasNext()) {
        var x = fs.next(), xid = x.getId();
        if (tercatat[xid] || ada[xid] || kecuali[xid] || MIME_LEWATI[x.getMimeType()]) continue;
        if (x.isTrashed()) continue;
        kotak.push(barisKotak_(x, false, pos, 'lama'));
        ada[xid] = 1;
      }
      row.status = 'selesai';
    } catch (e) { row.status = 'gagal'; }
    diproses++;
  }
  var sisa = tabel.filter(function (r) { return r.status === 'antri'; }).length;
  var selesai = sisa === 0;
  denganKunci_(function () {
    if (kotak.length) tambahBaris_('KotakMasuk', kotak);
    tulis_('_Pindai', selesai ? [] : tabel);
  });
  if (selesai) { p.setProperty('PENUH_JALAN', '0'); p.setProperty('PENUH_TERAKHIR', sekarang_()); }
  return {
    selesai: selesai,
    folderSelesai: tabel.length - sisa,
    folderTotal: tabel.length,
    ditemukan: kotak.length
  };
}

function jalurTabel_(id, peta) {
  var nama = [], ids = [], n = 0, cur = peta[id];
  while (cur && n < 20) { nama.unshift(cur.nama); ids.unshift(cur.id); cur = cur.induk ? peta[cur.induk] : null; n++; }
  return { jalur: nama.join(' / '), leluhur: ids };
}

function posisi_(o, akar, cache, kecuali) {
  var ps = o.getParents();
  if (!ps.hasNext()) return null;
  return infoFolder_(ps.next(), akar, cache, kecuali, 0);
}

function infoFolder_(folder, akar, cache, kecuali, dalam) {
  var id = folder.getId();
  if (cache.hasOwnProperty(id)) return cache[id];
  var hasil = null;
  if (kecuali[id]) hasil = null;
  else if (akar[id]) hasil = { jalur: folder.getName(), leluhur: [id] };
  else if (dalam < 15) {
    var ps = folder.getParents();
    if (ps.hasNext()) {
      var up = infoFolder_(ps.next(), akar, cache, kecuali, dalam + 1);
      if (up) hasil = { jalur: up.jalur + ' / ' + folder.getName(), leluhur: up.leluhur.concat([id]) };
    }
  }
  cache[id] = hasil;
  return hasil;
}

function barisKotak_(o, isFolder, pos, status) {
  return {
    id: o.getId(),
    nama: o.getName(),
    url: o.getUrl(),
    mime: isFolder ? MIME_FOLDER : o.getMimeType(),
    jalur: pos.jalur,
    leluhur: pos.leluhur.join(','),
    dibuat: tgl_(o.getDateCreated()),
    diubah: tgl_(o.getLastUpdated()),
    status: status,
    ditemukan: sekarang_()
  };
}

function bacaKotakMasuk_() {
  var tercatat = idTercatat_();
  var semua = baca_('KotakMasuk').filter(function (r) { return !tercatat[r.id] && (r.status === 'baru' || r.status === 'lama'); });
  semua.sort(function (a, b) { return (b.dibuat || '').localeCompare(a.dibuat || ''); });
  var baru = semua.filter(function (r) { return r.status === 'baru'; });
  var lama = semua.filter(function (r) { return r.status === 'lama'; });
  return { ok: true, baru: baru.slice(0, 300), lama: lama.slice(0, 400), jumlahBaru: baru.length, jumlahLama: lama.length, info: info_() };
}

function daftarAkar_() {
  var pg = bacaPengaturan_(), akar = {};
  var daftar = Array.isArray(pg.folderPantau) && pg.folderPantau.length ? pg.folderPantau : [FOLDER_INDUK_ID];
  daftar.forEach(function (u) { var id = idDrive_(u) || String(u || '').trim(); if (id) akar[id] = 1; });
  return akar;
}

function idTercatat_(data) {
  var ids = {};
  (data || baca_('Data')).forEach(function (d) { var id = idDrive_(d.url); if (id) ids[id] = 1; });
  var pg = bacaPengaturan_();
  (pg.alur || []).forEach(function (a) { (a.tautan || []).forEach(function (x) { var id = idDrive_(x.url); if (id) ids[id] = 1; }); });
  (pg.menu || []).forEach(function (m) { var id = idDrive_(m.url); if (id) ids[id] = 1; });
  return ids;
}

function idKotak_() {
  var ids = {};
  baca_('KotakMasuk').forEach(function (r) { ids[r.id] = 1; });
  return ids;
}

function idKecuali_() {
  var ids = {};
  ids[ss_().getId()] = 1;
  var c = props_().getProperty('CADANGAN_FOLDER');
  if (c) ids[c] = 1;
  return ids;
}

/* ---------- 4. email pengingat & laporan mingguan ---------- */
function kirimLaporan_(paksa) {
  var m = kumpulkanMasalah_();
  var pg = bacaPengaturan_();
  var notif = pg.notifikasi || {};
  var tujuan = String(notif.email || EMAIL_DESA).trim();
  var p = props_();
  if (notif.aktif === false && !paksa) return { selesai: true, terkirim: 0 };
  var jumlah = m.rusak.length + m.bocor.length + m.terlambat.length + m.segera.length + m.kotakBaru;
  var terkirim = 0;
  if (jumlah || paksa) {
    MailApp.sendEmail({
      to: tujuan,
      subject: 'SDDS Sumber Sari · ' + (jumlah ? jumlah + ' hal perlu perhatian' : 'semua data aman'),
      htmlBody: htmlLaporan_(m, null),
      name: 'SDDS Sumber Sari'
    });
    terkirim++;
  }
  var perPj = {};
  m.terlambat.concat(m.segera).forEach(function (x) {
    var e = String(x.pjEmail || '').trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e) || e === tujuan.toLowerCase()) return;
    (perPj[e] = perPj[e] || []).push(x);
  });
  Object.keys(perPj).forEach(function (e) {
    MailApp.sendEmail({
      to: e,
      subject: 'Pengingat SDDS: ' + perPj[e].length + ' data perlu diperbarui',
      htmlBody: htmlLaporan_({ rusak: [], bocor: [], terlambat: perPj[e].filter(function (x) { return x.jadwal.status === 'terlambat'; }), segera: perPj[e].filter(function (x) { return x.jadwal.status === 'segera'; }), kotakBaru: 0 }, perPj[e][0].pj),
      name: 'SDDS Sumber Sari'
    });
    terkirim++;
  });
  p.setProperty('EMAIL_TERAKHIR', String(Date.now()));
  return { selesai: true, terkirim: terkirim, tujuan: tujuan };
}

function kumpulkanMasalah_() {
  var status = {};
  baca_('Status').forEach(function (s) { status[s.id] = s; });
  var out = { rusak: [], bocor: [], terlambat: [], segera: [], kotakBaru: info_().kotakBaru };
  baca_('Data').forEach(function (d) {
    var s = status[d.id] || {};
    if (s.cek && s.cek !== 'ok') out.rusak.push({ judul: d.judul, url: d.url, pesan: s.pesan });
    if (d.terbatas && /^ANYONE/.test(s.akses || '')) out.bocor.push({ judul: d.judul, url: d.url });
    var j = jadwal_(d, s);
    if (j && (j.status === 'terlambat' || j.status === 'segera')) {
      var x = { judul: d.judul, url: d.url, pj: d.pj, pjEmail: d.pjEmail, jadwal: j };
      (j.status === 'terlambat' ? out.terlambat : out.segera).push(x);
    }
  });
  return out;
}

function htmlLaporan_(m, namaPj) {
  function daftar(judul, arr, fn) {
    if (!arr.length) return '';
    return '<h3 style="margin:18px 0 6px;font-size:15px">' + judul + ' (' + arr.length + ')</h3><ul style="margin:0;padding-left:18px">' +
      arr.map(function (x) { return '<li style="margin:4px 0"><a href="' + esc_(x.url) + '">' + esc_(x.judul) + '</a>' + (fn ? ' — ' + fn(x) : '') + '</li>'; }).join('') + '</ul>';
  }
  var isi = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#14241B;max-width:620px">' +
    '<p>Halo' + (namaPj ? ' ' + esc_(namaPj) : '') + ',</p>' +
    '<p>Berikut ringkasan mingguan <b>SDDS – Satu Data Desa Sumber Sari</b>.</p>' +
    daftar('Data perlu diperbarui', m.terlambat, function (x) { return 'jadwal ' + x.jadwal.frekuensi + ', seharusnya diperbarui ' + x.jadwal.jatuhTempo + (x.pj && !namaPj ? ' · PJ: ' + esc_(x.pj) : ''); }) +
    daftar('Segera diperbarui (7 hari lagi)', m.segera, function (x) { return 'batas ' + x.jadwal.jatuhTempo; }) +
    daftar('Tautan bermasalah', m.rusak, function (x) { return esc_(x.pesan || 'tidak bisa dibuka'); }) +
    daftar('Berlabel Terbatas tapi terbuka untuk siapa saja yang punya link', m.bocor, null) +
    (m.kotakBaru ? '<h3 style="margin:18px 0 6px;font-size:15px">Kotak masuk</h3><p style="margin:0">' + m.kotakBaru + ' berkas baru di Google Drive belum dicatat di SDDS.</p>' : '') +
    (!m.terlambat.length && !m.segera.length && !m.rusak.length && !m.bocor.length && !m.kotakBaru ? '<p>Semua tautan aman dan tidak ada data yang lewat jadwal.</p>' : '') +
    '<p style="margin-top:22px"><a href="' + SITUS_URL + '" style="background:#1F6B45;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Buka SDDS</a></p>' +
    '<p style="color:#66766C;font-size:12px;margin-top:22px">Email otomatis dari SDDS. Ubah alamat penerima di website: Edit → Lainnya → Pengaturan otomatis.</p></div>';
  return isi;
}

/* ---------- 5. cadangan database ---------- */
function cadangkan_(oleh) {
  var folder = folderCadangan_();
  var stamp = Utilities.formatDate(new Date(), zona_(), 'yyyy-MM-dd HH.mm');
  var nama = 'SDDS – Database Katalog · cadangan ' + stamp;
  var salinan = DriveApp.getFileById(ss_().getId()).makeCopy(nama, folder);
  var semua = [], it = folder.getFiles();
  while (it.hasNext()) { var f = it.next(); if (!f.isTrashed()) semua.push(f); }
  semua.sort(function (a, b) { return b.getDateCreated() - a.getDateCreated(); });
  semua.slice(JUMLAH_CADANGAN).forEach(function (f) { f.setTrashed(true); });
  var p = props_();
  p.setProperty('CADANGAN_TERAKHIR', sekarang_());
  p.setProperty('CADANGAN_WAKTU', String(Date.now()));
  catat_(oleh || 'Sistem', 'Cadangkan database', nama);
  return { selesai: true, nama: nama, url: salinan.getUrl() };
}

function folderCadangan_() {
  var p = props_(), id = p.getProperty('CADANGAN_FOLDER');
  if (id) { try { var f = DriveApp.getFolderById(id); if (!f.isTrashed()) return f; } catch (e) { /* buat ulang */ } }
  var induk;
  try { var ps = DriveApp.getFileById(ss_().getId()).getParents(); induk = ps.hasNext() ? ps.next() : DriveApp.getRootFolder(); }
  catch (e) { induk = DriveApp.getRootFolder(); }
  var baru = induk.createFolder('SDDS – Cadangan Database');
  p.setProperty('CADANGAN_FOLDER', baru.getId());
  return baru;
}

function daftarCadangan_() {
  var id = props_().getProperty('CADANGAN_FOLDER');
  if (!id) return [];
  var out = [];
  try {
    var it = DriveApp.getFolderById(id).getFiles();
    while (it.hasNext()) { var f = it.next(); if (!f.isTrashed()) out.push({ nama: f.getName(), url: f.getUrl(), waktu: tglJam_(f.getDateCreated()) }); }
  } catch (e) { return []; }
  out.sort(function (a, b) { return b.waktu.localeCompare(a.waktu); });
  return out;
}

/* ---------- 6. sampah & riwayat ---------- */
function keSampah_(oleh, jenis, judul, isi) {
  tambahBaris_('Sampah', [{ sid: 'x' + Utilities.getUuid().replace(/-/g, '').slice(0, 12), waktu: sekarang_(), oleh: oleh, jenis: jenis, judul: judul, isi: JSON.stringify(isi) }]);
}

function pulihkan_(sid, oleh) {
  var semua = baca_('Sampah');
  var r = null;
  semua.forEach(function (x) { if (x.sid === sid) r = x; });
  if (!r) throw new Error('Data di sampah tidak ditemukan (mungkin sudah lewat ' + HARI_SAMPAH + ' hari).');
  var isi = JSON.parse(r.isi || '{}');
  if (r.jenis === 'tautan') {
    var it = rapikanItem_(isi);
    var kat = {};
    baca_('Kategori').forEach(function (k) { kat[k.id] = 1; });
    it.kategori = it.kategori.filter(function (k) { return kat[k]; });
    if (cariBaris_('Data', it.id)) it.id = idBaru_();
    simpanBaris_('Data', it);
  } else if (r.jenis === 'kategori') {
    var k = rapikanKategori_(isi.kategori || {});
    if (cariBaris_('Kategori', k.id)) throw new Error('Sudah ada kategori dengan id "' + k.id + '". Ganti nama kategori itu dulu.');
    simpanBaris_('Kategori', k);
    var ikut = {};
    (isi.item || []).forEach(function (x) { ikut[x] = 1; });
    tulis_('Data', baca_('Data').map(function (d) {
      if (ikut[d.id] && d.kategori.indexOf(k.id) === -1) d.kategori.push(k.id);
      return d;
    }));
  }
  tulis_('Sampah', semua.filter(function (x) { return x.sid !== sid; }));
  catat_(oleh, 'Pulihkan ' + r.jenis, r.judul);
}

function bersihkanSampah_() {
  var batas = Date.now() - HARI_SAMPAH * 86400000;
  var semua = baca_('Sampah');
  var sisa = semua.filter(function (x) { var t = parseWaktu_(x.waktu); return !t || t.getTime() >= batas; });
  if (sisa.length !== semua.length) denganKunci_(function () { tulis_('Sampah', sisa); });
}

function bacaLog_() {
  try { bersihkanSampah_(); } catch (e) { /* abaikan */ }
  var riw = baca_('Riwayat').filter(function (r) { return r.waktu || r.aksi; });
  var sampah = baca_('Sampah').map(function (x) {
    var t = parseWaktu_(x.waktu);
    var sisaHari = t ? Math.max(0, Math.ceil(HARI_SAMPAH - (Date.now() - t.getTime()) / 86400000)) : HARI_SAMPAH;
    return { sid: x.sid, waktu: x.waktu, oleh: x.oleh, jenis: x.jenis, judul: x.judul, sisaHari: sisaHari };
  }).reverse();
  var cad = [];
  try { cad = daftarCadangan_(); } catch (e) { cad = []; }
  return { ok: true, riwayat: riw.slice(-200).reverse(), sampah: sampah, cadangan: cad, info: info_() };
}

/* =====================================================================
   DASBOR STATISTIK (hanya angka ringkasan; nama & NIK tidak pernah dikirim)
   ===================================================================== */
function bacaDasbor_() {
  var simpan = null;
  baca_('Pengaturan').forEach(function (r) { if (r.kunci === 'dasbor') { try { simpan = JSON.parse(r.nilai); } catch (e) { simpan = null; } } });
  if (!simpan || umur_(props_().getProperty('DASBOR_WAKTU')) > 26 * 3600 * 1000) {
    var baru = hitungDasbor_();
    if (baru.ok || !simpan) return baru;
  }
  return simpan;
}

function hitungDasbor_() {
  var pg = bacaPengaturan_();
  var id = idDrive_(pg.dasborSumber) || DATA_PENDUDUK_ID;
  var src;
  try { src = SpreadsheetApp.openById(id); }
  catch (e) { return { ok: false, pesan: 'Spreadsheet data penduduk tidak bisa dibuka oleh akun pengelola SDDS.' }; }

  var A = { total: 0, L: 0, P: 0, kk: {}, rt: {}, umur: {}, pendidikan: {}, pekerjaan: {}, kawin: {}, agama: {}, bpjs: {}, bansos: {}, desil: {}, usaha: {}, suku: {}, umurList: [],
    kualitas: { nikKosong: 0, nikGanda: 0, usiaKosong: 0, jkKosong: 0, rtKosong: 0 } };
  var nikDilihat = {}, tabDipakai = [], tahunIni = new Date().getFullYear();

  src.getSheets().forEach(function (sh) {
    var nb = sh.getLastRow(), nk = sh.getLastColumn();
    if (nb < 2 || nk < 3) return;
    var v = sh.getRange(1, 1, nb, nk).getValues();
    var h = -1, kol = null;
    for (var r = 0; r < Math.min(15, v.length); r++) {
      var m = petaKolom_(v[r]);
      if (m.nama > -1 && m.jk > -1) { h = r; kol = m; break; }
    }
    if (h < 0) return;
    tabDipakai.push(sh.getName());
    for (var i = h + 1; i < v.length; i++) {
      var row = v[i];
      var nama = kol.nama > -1 ? String(row[kol.nama]).trim() : '';
      var nik = kol.nik > -1 ? String(row[kol.nik]).replace(/\D/g, '') : '';
      if (!nama && !nik) continue;
      if (nik) { if (nikDilihat[nik]) { A.kualitas.nikGanda++; continue; } nikDilihat[nik] = 1; }
      else A.kualitas.nikKosong++;
      A.total++;
      var jk = normJk_(kol.jk > -1 ? row[kol.jk] : '');
      if (jk === 'L') A.L++; else if (jk === 'P') A.P++; else A.kualitas.jkKosong++;
      if (kol.kk > -1) { var kk = String(row[kol.kk]).replace(/\D/g, ''); if (kk) A.kk[kk] = 1; }
      var rt = kol.rt > -1 ? String(row[kol.rt]).replace(/\D/g, '').replace(/^0+(?=\d)/, '') : '';
      if (!rt) { rt = '?'; A.kualitas.rtKosong++; }
      A.rt[rt] = A.rt[rt] || { L: 0, P: 0, X: 0 };
      A.rt[rt][jk || 'X']++;
      var usia = hitungUsia_(kol.usia > -1 ? row[kol.usia] : '', kol.tgl > -1 ? row[kol.tgl] : '', tahunIni);
      if (usia == null) A.kualitas.usiaKosong++;
      else {
        A.umurList.push(usia);
        var g = Math.min(Math.floor(usia / 5), 15);
        A.umur[g] = A.umur[g] || { L: 0, P: 0, X: 0 };
        A.umur[g][jk || 'X']++;
      }
      tambah_(A.pendidikan, kol.pendidikan > -1 ? row[kol.pendidikan] : '', 'Tidak tercatat');
      tambah_(A.pekerjaan, kol.pekerjaan > -1 ? row[kol.pekerjaan] : '', 'Tidak tercatat');
      tambah_(A.kawin, kol.kawin > -1 ? row[kol.kawin] : '', 'Tidak tercatat');
      tambah_(A.agama, kol.agama > -1 ? row[kol.agama] : '', 'Tidak tercatat');
      tambah_(A.bpjs, kol.bpjs > -1 ? row[kol.bpjs] : '', 'Tidak punya / tidak tercatat');
      tambah_(A.suku, kol.suku > -1 ? row[kol.suku] : '', 'Tidak tercatat');
      if (kol.bansos > -1 && String(row[kol.bansos]).trim()) tambah_(A.bansos, row[kol.bansos], '');
      if (kol.usaha > -1 && String(row[kol.usaha]).trim()) tambah_(A.usaha, row[kol.usaha], '');
      if (kol.desil > -1) {
        var ds = String(row[kol.desil]).replace(/\D/g, '');
        if (ds && +ds >= 1 && +ds <= 10) A.desil[+ds] = (A.desil[+ds] || 0) + 1;
      }
    }
  });
  if (!A.total) return { ok: false, pesan: 'Tidak menemukan tabel penduduk (kolom NAMA dan JENIS KELAMIN) di spreadsheet sumber.' };

  var kelompok = [];
  for (var g = 0; g <= 15; g++) {
    var x = A.umur[g] || { L: 0, P: 0, X: 0 };
    kelompok.push({ kelompok: g === 15 ? '75+' : (g * 5) + '–' + (g * 5 + 4), L: x.L, P: x.P, X: x.X });
  }
  var anak = 0, produktif = 0, lansia = 0;
  A.umurList.forEach(function (u) { if (u < 15) anak++; else if (u < 65) produktif++; else lansia++; });
  var urutUmur = A.umurList.slice().sort(function (a, b) { return a - b; });
  var median = urutUmur.length ? urutUmur[Math.floor(urutUmur.length / 2)] : null;
  var rtList = Object.keys(A.rt).sort(function (a, b) { return (a === '?' ? 999 : +a) - (b === '?' ? 999 : +b); })
    .map(function (k) { return { rt: k === '?' ? 'Tanpa RT' : 'RT ' + k, L: A.rt[k].L, P: A.rt[k].P, X: A.rt[k].X }; });
  var desil = [];
  for (var d = 1; d <= 10; d++) desil.push({ label: 'Desil ' + d, n: A.desil[d] || 0 });

  var hasil = {
    ok: true,
    sumber: { nama: src.getName(), tab: tabDipakai },
    diperbarui: sekarang_(),
    total: A.total, laki: A.L, perempuan: A.P, kk: Object.keys(A.kk).length,
    anak: anak, produktif: produktif, lansia: lansia, medianUmur: median,
    rt: rtList,
    piramida: kelompok,
    pendidikan: urutPendidikan_(A.pendidikan),
    pekerjaan: puncak_(A.pekerjaan, 10),
    kawin: puncak_(A.kawin, 6),
    agama: puncak_(A.agama, 6),
    bpjs: puncak_(A.bpjs, 6),
    bansos: puncak_(A.bansos, 8),
    usaha: puncak_(A.usaha, 10),
    suku: puncak_(A.suku, 8),
    desil: desil,
    kualitas: A.kualitas
  };
  denganKunci_(function () { setPengaturan_('dasbor', hasil); });
  var p = props_();
  p.setProperty('DASBOR_WAKTU', String(Date.now()));
  p.setProperty('DASBOR_TERAKHIR', hasil.diperbarui);
  return hasil;
}

function petaKolom_(row) {
  var m = { rt: -1, kk: -1, nik: -1, nama: -1, desil: -1, jk: -1, tgl: -1, usia: -1, agama: -1, suku: -1, pendidikan: -1, pekerjaan: -1, kawin: -1, bansos: -1, usaha: -1, bpjs: -1 };
  row.forEach(function (c, i) {
    var t = String(c).toUpperCase().replace(/\s+/g, ' ').trim();
    if (!t) return;
    function set(k) { if (m[k] === -1) m[k] = i; }
    if (/^RT\b|^NO\.? ?RT$/.test(t)) set('rt');
    else if (/NOMOR KK|^NO\.? ?KK|^KK$/.test(t)) set('kk');
    else if (/NOMOR KTP|^NIK|NO\.? ?KTP/.test(t)) set('nik');
    else if (/^NAMA( LENGKAP)?$/.test(t)) set('nama');
    else if (/DESIL/.test(t)) set('desil');
    else if (/JENIS KELAMIN|^JK$|^L\/P$/.test(t)) set('jk');
    else if (/TANGGAL LAHIR|TGL\.? LAHIR/.test(t)) set('tgl');
    else if (/^USIA|^UMUR/.test(t)) set('usia');
    else if (/AGAMA/.test(t)) set('agama');
    else if (/SUKU/.test(t)) set('suku');
    else if (/PENDIDIKAN/.test(t)) set('pendidikan');
    else if (/PEKERJAAN/.test(t)) set('pekerjaan');
    else if (/PERKAWINAN|STATUS KAWIN/.test(t)) set('kawin');
    else if (/BANTUAN|BANSOS/.test(t)) set('bansos');
    else if (/^USAHA|JENIS USAHA/.test(t)) set('usaha');
    else if (/BPJS|JAMINAN KESEHATAN|JKN/.test(t)) set('bpjs');
  });
  return m;
}

function normJk_(v) {
  var t = String(v).toUpperCase().trim();
  if (/^(L|LK|LAKI)/.test(t)) return 'L';
  if (/^(P|PR|PEREMPUAN|WANITA)/.test(t)) return 'P';
  return '';
}

function hitungUsia_(usia, tgl, tahunIni) {
  var n = typeof usia === 'number' ? usia : parseFloat(String(usia).replace(',', '.'));
  if (!isNaN(n) && n >= 0 && n <= 120 && String(usia).trim() !== '') return Math.floor(n);
  var th = null;
  if (tgl instanceof Date && !isNaN(tgl)) th = tgl.getFullYear();
  else {
    var mm = String(tgl).match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/);
    if (mm) {
      th = +mm[3];
      if (mm[3].length === 2) th += th > tahunIni % 100 ? 1900 : 2000;
    }
  }
  if (th && th > 1900 && th <= tahunIni) return tahunIni - th;
  return null;
}

function labelRapi_(s) {
  var t = String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  if (!t) return '';
  var besar = /^(SD|SMP|SMA|SLTP|SLTA|SMK|MI|MTS|MA|D1|D2|D3|D4|DI|DII|DIII|DIV|S1|S2|S3|PNS|ASN|TNI|POLRI|BPJS|PBI|KIS|PKH|BPNT|BLT|WNI|WNA|UMKM|RT|RW|TK|PAUD|KK|DD|ADD|I|II|III|IV|V)$/;
  return t.toLowerCase().split(/(\s|\/|-|\()/).map(function (w) {
    if (!w || /^(\s|\/|-|\()$/.test(w)) return w;
    return besar.test(w.toUpperCase()) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1);
  }).join('');
}

function tambah_(peta, v, kosong) {
  var k = labelRapi_(v) || kosong;
  if (!k) return;
  peta[k] = (peta[k] || 0) + 1;
}

/* Kategori berisi kurang dari 3 orang digabung ke "Lainnya" agar tidak bisa menunjuk orang tertentu */
function puncak_(peta, maks) {
  var arr = Object.keys(peta).map(function (k) { return { label: k, n: peta[k] }; }).sort(function (a, b) { return b.n - a.n; });
  var tampil = [], lain = 0;
  arr.forEach(function (x) {
    if (tampil.length < maks && x.n >= 3 && !/^lain/i.test(x.label)) tampil.push(x); else lain += x.n;
  });
  if (lain) tampil.push({ label: 'Lainnya', n: lain });
  return tampil;
}

function urutPendidikan_(peta) {
  var aturan = [
    [/tidak.*sekolah|belum sekolah|tidak\/belum/i, 0], [/belum tamat sd|tidak tamat sd|tidak tamat/i, 1],
    [/\bsd\b|\bmi\b|sederajat.*sd|dasar/i, 2], [/smp|sltp|mts/i, 3], [/sma|slta|smk|\bma\b/i, 4],
    [/d1|d2|diploma i\b|dii\b|\bdi\b/i, 5], [/d3|diii|akademi/i, 6], [/d4|div|s1|strata i\b|sarjana/i, 7],
    [/s2|strata ii\b|magister/i, 8], [/s3|doktor|strata iii/i, 9]
  ];
  function tingkat(l) { for (var i = 0; i < aturan.length; i++) if (aturan[i][0].test(l)) return aturan[i][1]; return 20; }
  var arr = Object.keys(peta).map(function (k) { return { label: k, n: peta[k], t: /tidak tercatat/i.test(k) ? 30 : tingkat(k) }; });
  arr.sort(function (a, b) { return a.t - b.t || b.n - a.n; });
  return arr.map(function (x) { return { label: x.label, n: x.n }; });
}

/* =====================================================================
   JADWAL PEMBARUAN
   ===================================================================== */
function jadwal_(d, s) {
  var bln = FREKUENSI_BULAN[d.frekuensi];
  if (!bln) return null;
  var terakhir = [d.diperbarui, s && s.diubahDrive].filter(Boolean).sort().pop() || '';
  var hari = new Date(); hari.setHours(0, 0, 0, 0);
  if (!terakhir) return { frekuensi: d.frekuensi, terakhir: '', jatuhTempo: '', sisaHari: -1, status: 'terlambat' };
  var p = terakhir.split('-');
  var jt = new Date(+p[0], +p[1] - 1 + bln, +p[2]);
  var sisa = Math.round((jt - hari) / 86400000);
  return { frekuensi: d.frekuensi, terakhir: terakhir, jatuhTempo: tgl_(jt), sisaHari: sisa, status: sisa < 0 ? 'terlambat' : sisa <= 7 ? 'segera' : 'aman' };
}

/* =====================================================================
   DRIVE: UTILITAS
   ===================================================================== */
function idDrive_(url) {
  var u = String(url || '');
  var m = u.match(/\/d\/([\w-]{20,})/) || u.match(/\/folders\/([\w-]{20,})/) || u.match(/[?&]id=([\w-]{20,})/);
  return m ? m[1] : '';
}

function ambilDrive_(id) {
  try {
    var f = DriveApp.getFileById(id);
    if (f.getMimeType() !== MIME_FOLDER) return { obj: f, folder: false };
  } catch (e) { /* mungkin folder */ }
  try { var d = DriveApp.getFolderById(id); d.getName(); return { obj: d, folder: true }; } catch (e) { return null; }
}

function indukPertama_(o) {
  try { var ps = o.getParents(); return ps.hasNext() ? ps.next() : null; } catch (e) { return null; }
}

var AKAR_SAYA_ = null;
function jalurFolder_(folder) {
  if (AKAR_SAYA_ === null) { try { AKAR_SAYA_ = DriveApp.getRootFolder().getId(); } catch (e) { AKAR_SAYA_ = ''; } }
  var nama = [], cur = folder, n = 0;
  while (cur && n < 10) {
    if (cur.getId() === AKAR_SAYA_) break;
    nama.unshift(cur.getName());
    cur = indukPertama_(cur);
    n++;
  }
  return nama.join(' / ');
}

function terakhirDiubah_(obj, isFolder) {
  var t = obj.getLastUpdated();
  if (!isFolder) return t;
  var n = 0, antri = [{ f: obj, d: 0 }];
  while (antri.length && n < 300) {
    var x = antri.shift();
    var fs = x.f.getFiles();
    while (fs.hasNext() && n < 300) { var f = fs.next(); n++; var u = f.getLastUpdated(); if (u > t) t = u; }
    if (x.d < 1) {
      var ds = x.f.getFolders();
      while (ds.hasNext() && n < 300) { var s = ds.next(); n++; var u2 = s.getLastUpdated(); if (u2 > t) t = u2; antri.push({ f: s, d: x.d + 1 }); }
    }
  }
  return t;
}

function aksesTeks_(o) {
  try { return String(o.getSharingAccess()); } catch (e) { return ''; }
}

function jenisDariMime_(mime, nama) {
  var m = String(mime || ''), n = String(nama || '').toLowerCase();
  if (m === MIME_FOLDER) return 'folder';
  if (m === 'application/vnd.google-apps.spreadsheet') return 'sheet';
  if (m === 'application/vnd.google-apps.document') return 'docx';
  if (m === 'application/vnd.google-apps.presentation') return 'slide';
  if (m === 'application/pdf' || /\.pdf$/.test(n)) return 'pdf';
  if (/spreadsheetml|ms-excel|csv/.test(m) || /\.(xlsx?|csv)$/.test(n)) return 'xlsx';
  if (/wordprocessingml|msword|opendocument\.text/.test(m) || /\.docx?$/.test(n)) return 'docx';
  if (/presentationml|powerpoint/.test(m) || /\.pptx?$/.test(n)) return 'slide';
  if (/^image\//.test(m)) return 'gambar';
  if (/^video\//.test(m)) return 'video';
  return 'tautan';
}

/* =====================================================================
   PEMICU (jadwal)
   ===================================================================== */
function hapusPemicu_(nama) {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === nama) ScriptApp.deleteTrigger(t); });
}

function jadwalkanLanjutan_() {
  var ada = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === 'lanjutkanTugas'; });
  if (!ada) ScriptApp.newTrigger('lanjutkanTugas').timeBased().after(2 * 60 * 1000).create();
}

/* =====================================================================
   BACA & TULIS TABEL
   ===================================================================== */
function ss_() {
  var a = null;
  try { a = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) { a = null; }
  return a || SpreadsheetApp.openById(SHEET_ID);
}

function sheet_(nama) {
  var ss = ss_();
  var sh = ss.getSheetByName(nama);
  if (!sh) {
    sh = ss.insertSheet(nama);
    var kol = KOLOM[nama];
    if (sh.getMaxColumns() < kol.length) sh.insertColumnsAfter(sh.getMaxColumns(), kol.length - sh.getMaxColumns());
    sh.getRange(1, 1, 1, kol.length).setValues([kol]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.getRange(1, 1, sh.getMaxRows(), kol.length).setNumberFormat('@');
    if (nama === 'Pengaturan') sh.getRange(2, 1, 1, 2).setValues([['kunciEditor', '']]);
    if (nama.charAt(0) === '_') { try { sh.hideSheet(); } catch (e) { /* abaikan */ } }
  }
  return sh;
}

function teks_(v) {
  if (v instanceof Date) {
    var jam = v.getHours() || v.getMinutes();
    return Utilities.formatDate(v, zona_(), jam ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd');
  }
  return v == null ? '' : String(v);
}

function baca_(nama) {
  var sh = sheet_(nama), kol = KOLOM[nama];
  var n = sh.getLastRow() - 1;
  if (n < 1) return [];
  var header = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0].map(String);
  var nilai = sh.getRange(2, 1, n, header.length).getValues();
  return nilai.map(function (baris) {
    var o = {};
    kol.forEach(function (k) {
      var idx = header.indexOf(k);
      var v = idx > -1 ? baris[idx] : '';
      if (BOOL[k]) o[k] = v === true || /^(true|ya|y|1|x)$/i.test(String(v).trim());
      else if (k === 'kategori' && nama === 'Data') o[k] = teks_(v).split(',').map(function (s) { return s.trim(); }).filter(String);
      else o[k] = teks_(v).trim();
    });
    return o;
  }).filter(function (o) {
    if (nama === 'Pengaturan' || nama === 'Riwayat') return true;
    if (nama === 'Sampah') return !!o.sid;
    return o.id || o.judul || o.nama;
  });
}

function keBaris_(nama, o) {
  return KOLOM[nama].map(function (k) {
    var v = o[k];
    if (BOOL[k]) return v ? 'TRUE' : '';
    if (Array.isArray(v)) return v.join(',');
    return v == null ? '' : String(v);
  });
}

/* Menulis ulang seluruh tabel (baris judul ikut ditulis, jadi kolom baru otomatis ada) */
function tulis_(nama, daftar) {
  var sh = sheet_(nama), kol = KOLOM[nama];
  var lebar = Math.max(sh.getLastColumn(), kol.length);
  if (sh.getMaxColumns() < kol.length) sh.insertColumnsAfter(sh.getMaxColumns(), kol.length - sh.getMaxColumns());
  var lama = Math.max(sh.getLastRow() - 1, 0);
  if (lama > 0) sh.getRange(2, 1, lama, lebar).clearContent();
  sh.getRange(1, 1, 1, kol.length).setValues([kol]);
  if (!daftar.length) return;
  var perlu = daftar.length + 1;
  if (sh.getMaxRows() < perlu) sh.insertRowsAfter(sh.getMaxRows(), perlu - sh.getMaxRows());
  var rng = sh.getRange(2, 1, daftar.length, kol.length);
  rng.setNumberFormat('@');
  rng.setValues(daftar.map(function (o) { return keBaris_(nama, o); }));
}

function tambahBaris_(nama, daftar) {
  if (!daftar.length) return;
  var sh = sheet_(nama), kol = KOLOM[nama];
  var awal = sh.getLastRow() + 1;
  var perlu = awal + daftar.length - 1;
  if (sh.getMaxRows() < perlu) sh.insertRowsAfter(sh.getMaxRows(), perlu - sh.getMaxRows());
  var rng = sh.getRange(awal, 1, daftar.length, kol.length);
  rng.setNumberFormat('@');
  rng.setValues(daftar.map(function (o) { return keBaris_(nama, o); }));
}

function cariBaris_(nama, id) {
  var hasil = null;
  baca_(nama).forEach(function (o) { if (o.id === id) hasil = o; });
  return hasil;
}

function simpanBaris_(nama, obj) {
  var daftar = baca_(nama), ketemu = false;
  daftar = daftar.map(function (o) { if (o.id === obj.id) { ketemu = true; return obj; } return o; });
  if (!ketemu) daftar.push(obj);
  tulis_(nama, daftar);
}

function hapusBaris_(nama, id) {
  tulis_(nama, baca_(nama).filter(function (o) { return o.id !== id; }));
}

function bacaPengaturan_() {
  var hasil = {};
  baca_('Pengaturan').forEach(function (r) {
    if (!r.kunci || PENGATURAN_TERSEMBUNYI[r.kunci]) return;
    try { hasil[r.kunci] = JSON.parse(r.nilai); } catch (e) { hasil[r.kunci] = r.nilai; }
  });
  return hasil;
}

function setPengaturan_(kunci, nilai) {
  var daftar = baca_('Pengaturan').filter(function (r) { return r.kunci && r.kunci !== kunci; });
  daftar.push({ kunci: kunci, nilai: JSON.stringify(nilai) });
  tulis_('Pengaturan', daftar);
}

function catat_(oleh, aksi, ket) {
  tambahBaris_('Riwayat', [{ waktu: sekarang_(), oleh: oleh, aksi: aksi, keterangan: String(ket || '').slice(0, 500) }]);
}

/* Baris yang ditambah langsung di spreadsheet tanpa id diberi id otomatis */
function pastikanId_() {
  ['Kategori', 'Data'].forEach(function (nama) {
    var daftar = baca_(nama), ubah = false, pakai = {};
    daftar.forEach(function (o) { if (o.id) pakai[o.id] = 1; });
    daftar.forEach(function (o) {
      if (o.id) return;
      var dasar = nama === 'Kategori'
        ? String(o.nama || 'kategori').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 32) || 'kategori'
        : idBaru_();
      var id = dasar, n = 2;
      while (pakai[id]) id = dasar + '-' + n++;
      o.id = id; pakai[id] = 1; ubah = true;
    });
    if (ubah) tulis_(nama, daftar);
  });
}

/* ---------------- perapian data ---------------- */
function rapikanItem_(d) {
  var frek = String(d.frekuensi || '').toLowerCase();
  var email = String(d.pjEmail || '').trim().slice(0, 120);
  return {
    id: String(d.id || '').slice(0, 60),
    judul: String(d.judul || '').slice(0, 200),
    kategori: (Array.isArray(d.kategori) ? d.kategori : String(d.kategori || '').split(',')).map(function (s) { return String(s).trim(); }).filter(String),
    jenis: String(d.jenis || 'tautan').slice(0, 20),
    url: String(d.url || '').slice(0, 500),
    lokasi: String(d.lokasi || '').slice(0, 300),
    diperbarui: String(d.diperbarui || '').slice(0, 10),
    ket: String(d.ket || '').slice(0, 500),
    terbatas: !!d.terbatas, utama: !!d.utama, unggulan: !!d.unggulan,
    frekuensi: FREKUENSI_BULAN[frek] ? frek : '',
    pj: String(d.pj || '').slice(0, 80),
    pjEmail: /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? email : ''
  };
}

function rapikanKategori_(k) {
  return {
    id: String(k.id || '').slice(0, 40),
    nama: String(k.nama || '').slice(0, 60),
    namaPanjang: String(k.namaPanjang || '').slice(0, 120),
    ikon: String(k.ikon || 'folder').slice(0, 20),
    warna: /^#[0-9a-fA-F]{6}$/.test(String(k.warna)) ? String(k.warna) : '#1F6B45',
    deskripsi: String(k.deskripsi || '').slice(0, 400),
    sorot: !!k.sorot,
    folder: String(k.folder || '').slice(0, 300)
  };
}

/* ---------------- kunci editor ---------------- */
/* null = belum diatur, true = cocok, false = salah */
function cocokKunci_(k) {
  var h = props_().getProperty('KUNCI_HASH');
  if (h) return !!k && hash_(String(k)) === h;
  var sel = '';
  baca_('Pengaturan').forEach(function (r) { if (r.kunci === 'kunciEditor') sel = String(r.nilai || '').trim(); });
  if (!sel) return null;
  return !!k && String(k).trim() === sel;
}

/* ---------------- utilitas ---------------- */
function props_() { return PropertiesService.getScriptProperties(); }
function zona_() { return Session.getScriptTimeZone() || 'Asia/Makassar'; }
function tgl_(d) { return d ? Utilities.formatDate(d, zona_(), 'yyyy-MM-dd') : ''; }
function tglJam_(d) { return d ? Utilities.formatDate(d, zona_(), 'yyyy-MM-dd HH:mm') : ''; }
function hariIni_() { return tgl_(new Date()); }
function sekarang_() { return tglJam_(new Date()); }
function umur_(ms) { return ms ? Date.now() - +ms : Infinity; }
function idBaru_() { return 's' + Utilities.getUuid().replace(/-/g, '').slice(0, 10); }

function parseWaktu_(s) {
  var m = String(s || '').match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/);
  return m ? new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0)) : null;
}

function denganKunci_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try { return fn(); } finally { lock.releaseLock(); }
}

function pesan_(t) {
  try { SpreadsheetApp.getUi().alert(t); } catch (e) { console.log(t); }
}

function pesanGalat_(err) {
  var t = String(err && err.message || err);
  if (/permission|izin|authoriz|otoris/i.test(t) && /DriveApp|MailApp|UrlFetch|ScriptApp|Drive/i.test(t))
    return 'Apps Script belum diberi izin Google Drive/email. Buka editor Apps Script, jalankan fungsi aktifkanOtomatis, lalu klik Izinkan.';
  if (/Lock|kunci waktu|timed out waiting/i.test(t)) return 'Server sedang sibuk. Coba lagi beberapa detik lagi.';
  return t;
}

function esc_(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
}

function hash_(s) {
  var b = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'sdds-editor:' + s, Utilities.Charset.UTF_8);
  return b.map(function (x) { return ('0' + (x & 0xff).toString(16)).slice(-2); }).join('');
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
