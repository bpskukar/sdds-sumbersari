/* =====================================================================
   SDDS — Satu Data Desa Sumber Sari
   Backend Google Sheet untuk mode edit website.

   CARA PASANG (sekali saja):
   1. Buka spreadsheet "SDDS – Database Katalog".
   2. Menu Ekstensi → Apps Script. Hapus isi Code.gs, tempel seluruh file ini, Simpan.
   3. Kembali ke spreadsheet, muat ulang halaman. Muncul menu "SDDS".
   4. SDDS → 1. Siapkan database  (izinkan akses saat diminta).
   5. SDDS → 2. Atur kunci editor  (kunci untuk menyimpan dari website).
   6. Di Apps Script: Terapkan → Deployment baru → jenis "Aplikasi web"
      - Jalankan sebagai: Saya
      - Yang memiliki akses: Siapa saja
      Salin URL aplikasi web, tempel di data/katalog.js → backend.url.
   ===================================================================== */

var KOLOM = {
  Kategori: ['id', 'nama', 'namaPanjang', 'ikon', 'warna', 'deskripsi', 'sorot'],
  Data: ['id', 'judul', 'kategori', 'jenis', 'url', 'lokasi', 'diperbarui', 'ket', 'terbatas', 'utama', 'unggulan'],
  Pengaturan: ['kunci', 'nilai'],
  Riwayat: ['waktu', 'oleh', 'aksi', 'keterangan']
};
var BOOL = { sorot: 1, terbatas: 1, utama: 1, unggulan: 1 };

/* ---------------- menu di spreadsheet ---------------- */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('SDDS')
    .addItem('1. Siapkan database', 'siapkan')
    .addItem('2. Atur kunci editor', 'aturKunci')
    .addSeparator()
    .addItem('Lihat alamat web app', 'lihatUrl')
    .addToUi();
}

function siapkan() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(KOLOM).forEach(function (nama) {
    var sh = ss.getSheetByName(nama) || ss.insertSheet(nama);
    var kol = KOLOM[nama];
    if (sh.getMaxColumns() < kol.length) sh.insertColumnsAfter(sh.getMaxColumns(), kol.length - sh.getMaxColumns());
    sh.getRange(1, 1, 1, kol.length).setValues([kol]).setFontWeight('bold').setBackground('#dcebdf');
    sh.setFrozenRows(1);
    sh.getRange(1, 1, sh.getMaxRows(), kol.length).setNumberFormat('@');
  });
  ['Sheet1', 'Lembar1', 'Sheet 1'].forEach(function (n) {
    var s = ss.getSheetByName(n);
    if (s && ss.getSheets().length > 1 && s.getLastRow() === 0) ss.deleteSheet(s);
  });
  SpreadsheetApp.getUi().alert('Database SDDS siap.\n\nLanjutkan: menu SDDS → 2. Atur kunci editor.');
}

function aturKunci() {
  var ui = SpreadsheetApp.getUi();
  var r = ui.prompt('Kunci editor SDDS',
    'Tulis kunci editor baru (minimal 8 karakter).\nKunci ini dipakai perangkat desa untuk menyimpan perubahan dari website.',
    ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;
  var k = String(r.getResponseText() || '').trim();
  if (k.length < 8) { ui.alert('Kunci minimal 8 karakter. Coba lagi.'); return; }
  PropertiesService.getScriptProperties().setProperty('KUNCI_HASH', hash_(k));
  catat_('Admin', 'Atur kunci editor', 'Kunci editor diganti');
  ui.alert('Kunci editor tersimpan.\n\nBagikan kunci ini hanya kepada perangkat yang boleh mengubah data.');
}

function lihatUrl() {
  var u = '';
  try { u = ScriptApp.getService().getUrl(); } catch (e) { u = ''; }
  SpreadsheetApp.getUi().alert(u
    ? 'Alamat web app:\n\n' + u + '\n\nTempel alamat ini di data/katalog.js → backend.url'
    : 'Belum di-deploy.\nBuka Ekstensi → Apps Script → Terapkan → Deployment baru → Aplikasi web.');
}

/* ---------------- web app ---------------- */
function doGet(e) {
  try {
    pastikanId_();
    return json_(statusLengkap_());
  } catch (err) {
    return json_({ ok: false, pesan: String(err && err.message || err) });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var terkunci = false;
  try {
    var b = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var h = PropertiesService.getScriptProperties().getProperty('KUNCI_HASH');
    if (!h) return json_({ ok: false, pesan: 'Kunci editor belum diatur. Buka Google Sheet database → menu SDDS → Atur kunci editor.' });
    if (!b.kunci || hash_(String(b.kunci)) !== h) return json_({ ok: false, kode: 'kunci', pesan: 'Kunci editor salah.' });
    if (b.aksi === 'cek') return json_({ ok: true });

    lock.waitLock(20000);
    terkunci = true;
    pastikanId_();
    var oleh = String(b.oleh || 'Perangkat desa').slice(0, 60);

    if (b.aksi === 'simpanItem') {
      var it = rapikanItem_(b.item || {});
      if (!it.id || !it.url) throw new Error('Data tautan tidak lengkap.');
      simpanBaris_('Data', it);
      catat_(oleh, b.baru ? 'Tambah tautan' : 'Ubah tautan', it.judul + ' → ' + it.url);
    } else if (b.aksi === 'hapusItem') {
      hapusBaris_('Data', String(b.id));
      catat_(oleh, 'Hapus tautan', String(b.judul || b.id));
    } else if (b.aksi === 'simpanKategori') {
      var k = rapikanKategori_(b.kategori || {});
      if (!k.id || !k.nama) throw new Error('Data kategori tidak lengkap.');
      simpanBaris_('Kategori', k);
      catat_(oleh, b.baru ? 'Tambah kategori' : 'Ubah kategori', k.nama);
    } else if (b.aksi === 'hapusKategori') {
      var id = String(b.id);
      hapusBaris_('Kategori', id);
      var data = baca_('Data').map(function (d) {
        d.kategori = (d.kategori || []).filter(function (x) { return x !== id; });
        return d;
      });
      tulis_('Data', data);
      catat_(oleh, 'Hapus kategori', String(b.nama || id));
    } else if (b.aksi === 'simpanPengaturan') {
      var kunci = String(b.kunciSet || '');
      if (['alur', 'menu'].indexOf(kunci) === -1) throw new Error('Pengaturan tidak dikenal.');
      setPengaturan_(kunci, b.nilai || []);
      catat_(oleh, 'Ubah ' + kunci, JSON.stringify(b.nilai || []).slice(0, 300));
    } else if (b.aksi === 'impor') {
      var adaIsi = baca_('Kategori').length || baca_('Data').length;
      if (adaIsi && !b.paksa) throw new Error('Database sudah berisi data. Impor dibatalkan agar tidak menimpa.');
      tulis_('Kategori', (b.kategori || []).map(rapikanKategori_));
      tulis_('Data', (b.data || []).map(rapikanItem_));
      var p = b.pengaturan || {};
      if (p.alur) setPengaturan_('alur', p.alur);
      if (p.menu) setPengaturan_('menu', p.menu);
      catat_(oleh, 'Impor data awal', (b.data || []).length + ' tautan, ' + (b.kategori || []).length + ' kategori');
    } else {
      throw new Error('Aksi tidak dikenal: ' + b.aksi);
    }
    return json_(statusLengkap_());
  } catch (err) {
    return json_({ ok: false, pesan: String(err && err.message || err) });
  } finally {
    if (terkunci) lock.releaseLock();
  }
}

/* ---------------- baca & tulis tabel ---------------- */
function sheet_(nama) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(nama);
  if (!sh) {
    sh = ss.insertSheet(nama);
    sh.getRange(1, 1, 1, KOLOM[nama].length).setValues([KOLOM[nama]]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function teks_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone() || 'Asia/Makassar', 'yyyy-MM-dd');
  return v == null ? '' : String(v);
}

function baca_(nama) {
  var sh = sheet_(nama), kol = KOLOM[nama];
  var n = sh.getLastRow() - 1;
  if (n < 1) return [];
  var header = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
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
  }).filter(function (o) { return nama === 'Pengaturan' || nama === 'Riwayat' ? true : (o.id || o.judul || o.nama); });
}

function keBaris_(nama, o) {
  return KOLOM[nama].map(function (k) {
    var v = o[k];
    if (BOOL[k]) return v ? 'TRUE' : '';
    if (Array.isArray(v)) return v.join(',');
    return v == null ? '' : String(v);
  });
}

function tulis_(nama, daftar) {
  var sh = sheet_(nama), kol = KOLOM[nama];
  var lama = Math.max(sh.getLastRow() - 1, 0);
  if (lama > 0) sh.getRange(2, 1, lama, kol.length).clearContent();
  if (!daftar.length) return;
  var perlu = daftar.length + 1;
  if (sh.getMaxRows() < perlu) sh.insertRowsAfter(sh.getMaxRows(), perlu - sh.getMaxRows());
  var rng = sh.getRange(2, 1, daftar.length, kol.length);
  rng.setNumberFormat('@');
  rng.setValues(daftar.map(function (o) { return keBaris_(nama, o); }));
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
    if (!r.kunci) return;
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
  var sh = sheet_('Riwayat');
  sh.appendRow([Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Asia/Makassar', 'yyyy-MM-dd HH:mm'), oleh, aksi, String(ket || '').slice(0, 500)]);
}

function statusLengkap_() {
  return {
    ok: true,
    kategori: baca_('Kategori'),
    data: baca_('Data'),
    pengaturan: bacaPengaturan_(),
    waktu: new Date().toISOString()
  };
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
        : 's' + Utilities.getUuid().replace(/-/g, '').slice(0, 10);
      var id = dasar, n = 2;
      while (pakai[id]) id = dasar + '-' + n++;
      o.id = id; pakai[id] = 1; ubah = true;
    });
    if (ubah) tulis_(nama, daftar);
  });
}

/* ---------------- perapian data ---------------- */
function rapikanItem_(d) {
  return {
    id: String(d.id || '').slice(0, 60),
    judul: String(d.judul || '').slice(0, 200),
    kategori: (Array.isArray(d.kategori) ? d.kategori : String(d.kategori || '').split(',')).map(function (s) { return String(s).trim(); }).filter(String),
    jenis: String(d.jenis || 'tautan').slice(0, 20),
    url: String(d.url || '').slice(0, 500),
    lokasi: String(d.lokasi || '').slice(0, 300),
    diperbarui: String(d.diperbarui || '').slice(0, 10),
    ket: String(d.ket || '').slice(0, 500),
    terbatas: !!d.terbatas, utama: !!d.utama, unggulan: !!d.unggulan
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
    sorot: !!k.sorot
  };
}

/* ---------------- utilitas ---------------- */
function hash_(s) {
  var b = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'sdds-editor:' + s, Utilities.Charset.UTF_8);
  return b.map(function (x) { return ('0' + (x & 0xff).toString(16)).slice(-2); }).join('');
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
