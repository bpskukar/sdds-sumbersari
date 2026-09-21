/* =====================================================================
   SDDS — Satu Data Desa Sumber Sari
   Tampilan + pengelolaan data (mode edit).

   Sumber data:
   - Google Sheet lewat Web App Apps Script, bila SDDS.backend.url diisi
     di data/katalog.js. Perubahan dari mode edit tersimpan untuk semua.
   - Bila belum terhubung: data di data/katalog.js. Mode edit berjalan
     sebagai uji coba dan hanya tersimpan di browser ini.
   ===================================================================== */
(function () {
  "use strict";

  var S = window.SDDS;
  if (!S) { console.error("data/katalog.js tidak termuat"); return; }

  /* ---------- ikon (gaya garis 24px) ---------- */
  var ICONS = {
    search: '<circle cx="11" cy="11" r="7.5"/><path d="m20.5 20.5-4.2-4.2"/>',
    folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
    sheet: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 12h8v6H8z"/><path d="M12 12v6"/><path d="M8 15h8"/>',
    image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
    video: '<path d="m16 13 5.2 3.5a.5.5 0 0 0 .8-.4V7.9a.5.5 0 0 0-.8-.4L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
    external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    copy: '<rect width="13" height="13" x="9" y="9" rx="2"/><path d="M5 15a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    lock: '<rect width="16" height="11" x="4" y="11" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    home: '<path d="M3 10a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>',
    store: '<path d="M3 9 5 3h14l2 6"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12v9h14v-9"/><path d="M10 21v-5h4v5"/>',
    map: '<path d="M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/><path d="M3.2 12h6.3l.5-1 2 4.5 2-7 1.5 3.5h5.3"/>',
    school: '<path d="M21.4 10.9a1 1 0 0 0 0-1.8l-8.6-3.9a2 2 0 0 0-1.6 0L2.6 9.1a1 1 0 0 0 0 1.8l8.6 3.9a2 2 0 0 0 1.6 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
    clipboard: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
    landmark: '<path d="M3 22h18"/><path d="M6 18v-7"/><path d="M10 18v-7"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M12 2 20 7H4z"/>',
    layers: '<path d="M12.8 2.2a2 2 0 0 0-1.6 0L2.6 6.1a1 1 0 0 0 0 1.8l8.6 3.9a2 2 0 0 0 1.6 0l8.6-3.9a1 1 0 0 0 0-1.8Z"/><path d="m22 17.6-9.2 4.2a2 2 0 0 1-1.6 0L2 17.6"/><path d="m22 12.6-9.2 4.2a2 2 0 0 1-1.6 0L2 12.6"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
    archive: '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
    chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12"/>',
    fish: '<path d="M6.5 12c.9-3.5 4.9-6 8.5-6s6.1 2.5 7 6c-.9 3.5-3.4 6-7 6s-7.6-2.5-8.5-6Z"/><path d="M18 12v.5"/><path d="M7 10.7C7 8 5.6 6 2.7 5.5c-1 1.5-1 5 .2 6.5-1.2 1.5-1.2 5-.2 6.5C5.6 18 7 16 7 13.3"/>',
    briefcase: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    star: '<path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9Z"/>',
    grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    arrowR: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    cycle: '<path d="M21 12a9 9 0 0 1-15.4 6.4L3 16"/><path d="M3 21v-5h5"/><path d="M3 12a9 9 0 0 1 15.4-6.4L21 8"/><path d="M21 3v5h-5"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    pencil: '<path d="M21.2 6.8a1 1 0 0 0-4-4L3.8 16.2a2 2 0 0 0-.5.8l-1.3 4.4a.5.5 0 0 0 .6.6l4.4-1.3a2 2 0 0 0 .8-.5z"/><path d="m15 5 4 4"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>'
  };
  function ic(name) {
    return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.folder) + "</svg>";
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function hariIni() { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function uid(p) { return (p || "i") + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function slug(s) { return norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32) || "kategori"; }
  function simpanLokal(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k);
      if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v);
    } catch (e) { return null; }
    return null;
  }

  var fmtDate = (function () {
    var f;
    try { f = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }); } catch (e) { f = null; }
    return function (iso) {
      if (!iso) return "";
      var d = new Date(iso + "T00:00:00");
      if (isNaN(d)) return iso;
      return f ? f.format(d) : iso;
    };
  })();

  /* Dijalankan oleh assets/js/akses.js setelah pengguna berhasil masuk */
  window.SDDSBoot = function (sesi) {
    sesi = sesi || {};
    var namaAkun = (sesi.akun && sesi.akun.nama) || "Perangkat desa";

    /* =================================================================
       KONSTANTA
       ================================================================= */
    var JENIS = {
      folder: { label: "Folder", ikon: "folder", grup: "folder", kode: "DIR" },
      pdf: { label: "PDF", ikon: "file", grup: "pdf", kode: "PDF" },
      xlsx: { label: "Excel", ikon: "sheet", grup: "tabel", kode: "XLSX" },
      sheet: { label: "Google Sheets", ikon: "sheet", grup: "tabel", kode: "SHEET" },
      docx: { label: "Word / Docs", ikon: "file", grup: "dokumen", kode: "DOC" },
      slide: { label: "Slide", ikon: "file", grup: "dokumen", kode: "SLIDE" },
      gambar: { label: "Gambar", ikon: "image", grup: "media", kode: "IMG" },
      video: { label: "Video", ikon: "video", grup: "media", kode: "VID" },
      tautan: { label: "Tautan lain", ikon: "link", grup: "dokumen", kode: "URL" }
    };
    var GRUP = [
      { id: "semua", label: "Semua" },
      { id: "folder", label: "Folder" },
      { id: "pdf", label: "PDF" },
      { id: "tabel", label: "Excel & Sheets" },
      { id: "dokumen", label: "Dokumen" },
      { id: "media", label: "Gambar & video" }
    ];
    var IKON_KATEGORI = ["users", "home", "store", "map", "heart", "school", "book", "clipboard", "landmark", "layers", "camera", "archive", "folder", "chart", "leaf", "fish", "briefcase", "wallet", "star", "grid"];
    var WARNA = ["#D0473B", "#2F7FC1", "#C9821A", "#1E9A8A", "#CF4A86", "#6B5FD3", "#2E8B57", "#8A6A3A", "#4B6A88", "#3F8F3A", "#B8612E", "#737D78"];

    function deteksiJenis(url) {
      var u = String(url || "");
      if (/\/folders\//.test(u) || /[?&]id=.*folder/i.test(u)) return "folder";
      if (/docs\.google\.com\/spreadsheets/.test(u)) return "sheet";
      if (/docs\.google\.com\/document/.test(u)) return "docx";
      if (/docs\.google\.com\/presentation/.test(u)) return "slide";
      if (/\.pdf(\?|#|$)/i.test(u)) return "pdf";
      if (/\.xlsx?(\?|#|$)/i.test(u)) return "xlsx";
      if (/\.docx?(\?|#|$)/i.test(u)) return "docx";
      if (/\.(jpe?g|png|webp)(\?|#|$)/i.test(u)) return "gambar";
      if (/\.(mp4|mov)(\?|#|$)/i.test(u)) return "video";
      return null;
    }

    /* =================================================================
       LAPISAN DATA
       ================================================================= */
    var BACKEND = String((S.backend && S.backend.url) || "").trim();
    var MODE = BACKEND ? "sheet" : "lokal";
    var K_CACHE = "sdds-cache", K_LOKAL = "sdds-lokal", K_KUNCI = "sdds-kunci";

    function dataAwal() {
      return {
        kategori: clone(S.kategori || []),
        data: (S.data || []).map(function (d, i) { var x = clone(d); x.id = x.id || ("k" + i); return x; }),
        alur: clone(S.alur || []),
        menu: clone(S.menu || [])
      };
    }
    var db = { state: dataAwal(), sumber: "katalog", kosong: false, memuat: false, galat: "" };

    function terapkan(res) {
      var st = dataAwal();
      var ada = (res.kategori && res.kategori.length) || (res.data && res.data.length);
      if (ada) { st.kategori = res.kategori || []; st.data = res.data || []; }
      var p = res.pengaturan || {};
      if (Array.isArray(p.alur) && p.alur.length) st.alur = p.alur;
      if (Array.isArray(p.menu)) st.menu = p.menu;
      db.state = st;
      db.kosong = !ada;
      db.sumber = ada ? "sheet" : "katalog";
    }

    if (MODE === "lokal") {
      var lokal = simpanLokal(K_LOKAL);
      if (lokal) {
        try {
          var l = JSON.parse(lokal);
          if (l && Array.isArray(l.kategori) && Array.isArray(l.data)) { db.state = Object.assign(dataAwal(), l); db.sumber = "lokal"; }
        } catch (e) { /* abaikan */ }
      }
    } else {
      var cache = simpanLokal(K_CACHE);
      if (cache) { try { terapkan(JSON.parse(cache)); db.sumber = db.kosong ? "katalog" : "cache"; } catch (e) { /* abaikan */ } }
    }

    function muatDariSheet() {
      if (MODE !== "sheet") return;
      db.memuat = true;
      renderSync();
      fetch(BACKEND + (BACKEND.indexOf("?") > -1 ? "&" : "?") + "aksi=baca&t=" + Date.now())
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res || !res.ok) throw new Error((res && res.pesan) || "Respons tidak dikenal");
          terapkan(res);
          simpanLokal(K_CACHE, JSON.stringify(res));
          db.galat = "";
        })
        .catch(function () {
          db.galat = "Data terbaru dari Google Sheet belum bisa dimuat. Yang tampil adalah data " + (db.sumber === "cache" ? "tersimpan terakhir" : "cadangan") + ".";
        })
        .then(function () { db.memuat = false; renderSemua(); });
    }

    var kunciMem = simpanLokal(K_KUNCI) || "";
    function kirim(payload) {
      if (MODE === "lokal") {
        terapkanLokal(payload);
        db.sumber = "lokal";
        simpanLokal(K_LOKAL, JSON.stringify(db.state));
        renderSemua();
        return Promise.resolve();
      }
      payload.kunci = kunciMem;
      payload.oleh = namaAkun;
      return fetch(BACKEND, { method: "POST", body: JSON.stringify(payload) })
        .then(function (r) { return r.json(); }, function () { throw new Error("Tidak terhubung ke Google Sheet. Periksa internet lalu coba lagi."); })
        .then(function (res) {
          if (!res || !res.ok) {
            var err = new Error((res && res.pesan) || "Gagal menyimpan.");
            err.kode = res && res.kode;
            if (err.kode === "kunci") { kunciMem = ""; simpanLokal(K_KUNCI, null); }
            throw err;
          }
          if (payload.aksi !== "cek") {
            terapkan(res);
            simpanLokal(K_CACHE, JSON.stringify(res));
            renderSemua();
          }
          return res;
        });
    }

    function terapkanLokal(p) {
      var st = db.state;
      function ganti(arr, obj) {
        for (var i = 0; i < arr.length; i++) if (arr[i].id === obj.id) { arr[i] = obj; return; }
        arr.push(obj);
      }
      if (p.aksi === "simpanItem") ganti(st.data, p.item);
      else if (p.aksi === "hapusItem") st.data = st.data.filter(function (d) { return d.id !== p.id; });
      else if (p.aksi === "simpanKategori") ganti(st.kategori, p.kategori);
      else if (p.aksi === "hapusKategori") {
        st.kategori = st.kategori.filter(function (k) { return k.id !== p.id; });
        st.data.forEach(function (d) { d.kategori = (d.kategori || []).filter(function (x) { return x !== p.id; }); });
      } else if (p.aksi === "simpanPengaturan") st[p.kunciSet] = p.nilai;
    }

    /* =================================================================
       INDEKS (dibangun ulang setiap data berubah)
       ================================================================= */
    var KAT = {}, KATS = [], ITEMS = [];
    function bangunIndeks() {
      KATS = db.state.kategori.slice();
      KAT = {};
      KATS.forEach(function (k) { KAT[k.id] = k; });
      ITEMS = db.state.data.map(function (d, i) {
        var kats = (d.kategori || []).filter(function (id) { return KAT[id]; });
        var j = JENIS[d.jenis] || JENIS.tautan;
        return Object.assign({}, d, {
          _i: i,
          kategori: kats,
          _j: j,
          _t: norm(d.judul),
          _s: norm([d.judul, d.ket, d.lokasi, j.label, kats.map(function (id) { return KAT[id].nama + " " + (KAT[id].namaPanjang || ""); }).join(" ")].join(" "))
        });
      });
    }
    function byDateDesc(a, b) { return (b.diperbarui || "").localeCompare(a.diperbarui || "") || a._i - b._i; }
    function itemsOf(katId) { return ITEMS.filter(function (d) { return d.kategori.indexOf(katId) > -1; }); }
    function latest(list) { return list.reduce(function (m, d) { return (d.diperbarui || "") > m ? d.diperbarui : m; }, ""); }
    function cariItem(id) { for (var i = 0; i < db.state.data.length; i++) if (db.state.data[i].id === id) return db.state.data[i]; return null; }

    function search(list, q) {
      var nq = norm(q).trim();
      if (!nq) return list.slice();
      var toks = nq.split(/\s+/);
      return list
        .map(function (d) {
          var score = 0;
          for (var i = 0; i < toks.length; i++) {
            var t = toks[i];
            if (d._s.indexOf(t) === -1) return null;
            score += d._t.indexOf(t) > -1 ? 3 : 1;
          }
          if (d._t.indexOf(nq) > -1) score += 10;
          if (d.utama) score += 1;
          return { d: d, s: score };
        })
        .filter(Boolean)
        .sort(function (a, b) { return b.s - a.s || byDateDesc(a.d, b.d); })
        .map(function (x) { return x.d; });
    }

    /* ---------- email ---------- */
    function mailto(subject, body) {
      var e = (S.kontak && S.kontak.email) || "";
      return "mailto:" + e + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    }
    var MAIL_AKSES = mailto("Permintaan akses data SDDS", "Halo Admin Desa Cantik Sumber Sari,\n\nSaya ingin meminta akses ke data berikut:\n- Judul data: \n\nNama: \nInstansi / RT: \nKeperluan: \n\nTerima kasih.");
    var MAIL_LAPOR = mailto("Laporan tautan rusak SDDS", "Halo Admin,\n\nTautan berikut tidak bisa dibuka:\n- Judul data: \n- Masalah (tidak ada izin / berkas hilang / salah berkas): \n\nTerima kasih.");

    /* =================================================================
       STATUS EDIT
       ================================================================= */
    var editing = false;
    function btnEdit(act, attrs, label) {
      return '<button class="edit-chip" type="button" data-act="' + act + '"' + (attrs || "") + ' title="' + esc(label || "Ubah") + '" aria-label="' + esc(label || "Ubah") + '">' + ic("pencil") + "</button>";
    }

    /* =================================================================
       KOMPONEN
       ================================================================= */
    function typeBadge(d, small) {
      return '<span class="type ' + esc(d.jenis) + (small ? " sm" : "") + '" title="' + esc(d._j.label) + '">' + ic(d._j.ikon) + (small ? "" : "<small>" + esc(d._j.kode) + "</small>") + "</span>";
    }
    function catTag(id) {
      var k = KAT[id];
      return '<a class="cat-tag" href="#/k/' + esc(id) + '" style="--c:' + esc(k.warna) + '">' + esc(k.nama) + "</a>";
    }
    function renderItem(d, skipKat) {
      var tags = d.kategori.filter(function (id) { return id !== skipKat; }).map(catTag).join("");
      return (
        '<li class="item">' +
        typeBadge(d) +
        '<div class="item-main">' +
        '<div class="item-title"><a href="' + esc(d.url) + '" target="_blank" rel="noopener">' + esc(d.judul) + "</a>" +
        (d.utama ? '<span class="badge main">Folder utama</span>' : "") +
        (d.terbatas ? '<span class="badge lock" title="Memuat data pribadi warga. Izin buka diatur di Google Drive.">' + ic("lock") + "Terbatas</span>" : "") +
        "</div>" +
        (d.lokasi ? '<p class="item-path">' + esc(d.lokasi) + "</p>" : "") +
        (d.ket ? '<p class="item-ket">' + esc(d.ket) + "</p>" : "") +
        '<div class="item-meta">' + tags + (d.diperbarui ? '<span class="date">' + ic("calendar") + esc(fmtDate(d.diperbarui)) + "</span>" : "") + "</div>" +
        "</div>" +
        '<div class="item-act">' +
        (editing ? '<button class="btn sm ghost edit-btn" type="button" data-act="edit-item" data-id="' + esc(d.id) + '">' + ic("pencil") + "Ubah</button>" : "") +
        '<button class="copy" type="button" data-copy="' + esc(d.url) + '" aria-label="Salin tautan ' + esc(d.judul) + '" title="Salin tautan">' + ic("copy") + "</button>" +
        '<a class="btn sm" href="' + esc(d.url) + '" target="_blank" rel="noopener">Buka ' + ic("external") + "</a>" +
        "</div>" +
        "</li>"
      );
    }
    function emptyState(q, resetId, katId) {
      return '<li class="empty"><p>' + (q ? "Tidak ada data yang cocok dengan <b>“" + esc(q) + "”</b>." : "Belum ada tautan di sini.") + "</p>" +
        (q ? "<p>Coba kata lain, atau hapus saringan.</p>" : "") +
        (resetId && q ? '<button class="btn ghost" type="button" id="' + resetId + '">Hapus saringan</button>' : "") +
        (editing && !q ? '<button class="btn" type="button" data-act="add-item"' + (katId ? ' data-kat="' + esc(katId) + '"' : "") + ">" + ic("plus") + "Tambah tautan</button>" : "") +
        "</li>";
    }

    /* ---------- toast & salin ---------- */
    var toastTimer;
    function toast(msg, icon) {
      var t = $("#toast");
      t.innerHTML = (icon ? ic(icon) : "") + "<span>" + esc(msg) + "</span>";
      t.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { t.hidden = true; }, 2600);
    }
    function copyText(text) {
      function fallback() {
        try {
          var ta = document.createElement("textarea");
          ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
          document.body.appendChild(ta); ta.select();
          var ok = document.execCommand("copy");
          document.body.removeChild(ta);
          ok ? toast("Tautan disalin", "check") : toast("Tidak bisa menyalin otomatis — buka tautan lalu salin dari browser");
        } catch (e) { toast("Tidak bisa menyalin otomatis — buka tautan lalu salin dari browser"); }
      }
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { toast("Tautan disalin", "check"); }, fallback);
      else fallback();
    }

    /* ---------- ikon statis ---------- */
    $$("[data-icon]").forEach(function (el) { el.innerHTML = ic(el.getAttribute("data-icon")); });

    /* ---------- tema ---------- */
    var root = document.documentElement;
    var themeBtn = $("#theme-toggle");
    try {
      var saved = localStorage.getItem("sdds-tema");
      if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
    } catch (e) { /* abaikan */ }
    function resolvedTheme() {
      var t = root.getAttribute("data-theme");
      if (t === "light" || t === "dark") return t;
      return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    function paintTheme() {
      var dark = resolvedTheme() === "dark";
      themeBtn.innerHTML = ic(dark ? "sun" : "moon");
      themeBtn.setAttribute("aria-label", dark ? "Pakai tema terang" : "Pakai tema gelap");
      themeBtn.title = themeBtn.getAttribute("aria-label");
    }
    themeBtn.addEventListener("click", function () {
      var next = resolvedTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("sdds-tema", next); } catch (e) { /* abaikan */ }
      paintTheme();
    });
    if (window.matchMedia) {
      var mq = matchMedia("(prefers-color-scheme: dark)");
      (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(paintTheme);
    }
    new MutationObserver(paintTheme).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    paintTheme();

    /* ---------- menu ponsel ---------- */
    var burger = $("#nav-burger"), navLinks = $("#nav-links");
    function setMenu(open) {
      navLinks.classList.toggle("buka", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
      burger.innerHTML = ic(open ? "x" : "menu");
    }
    burger.addEventListener("click", function () { setMenu(!navLinks.classList.contains("buka")); });
    navLinks.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    setMenu(false);

    /* =================================================================
       RENDER BAGIAN HALAMAN
       ================================================================= */
    var NAV_TETAP = [["kategori", "Kategori"], ["alur", "Alur Data"], ["katalog", "Katalog"], ["publikasi", "Publikasi"], ["panduan", "Panduan"]];
    function renderNav() {
      var menu = (db.state.menu || []).filter(function (m) { return m && m.label && m.url; });
      navLinks.innerHTML = menu.map(function (m) {
        return '<a class="nav-ext" href="' + esc(m.url) + '" target="_blank" rel="noopener">' + (m.terbatas ? ic("lock") : ic("sheet")) + esc(m.label) + "</a>";
      }).join("") + NAV_TETAP.map(function (n) { return '<a href="#' + n[0] + '">' + n[1] + "</a>"; }).join("");
      navA = $$(".nav-links a[href^='#']");
    }

    function renderStats() {
      var html = (S.statistik || []).map(function (s) {
        return '<div class="stat"><p class="stat-label">' + esc(s.label) + '</p><p class="stat-val"><b>' + esc(s.nilai) + "</b><span>" + esc(s.satuan) + '</span></p><p class="stat-ket">' + esc(s.ket) + "</p></div>";
      }).join("");
      html += '<div class="stat own"><p class="stat-label">Terdokumentasi</p><p class="stat-val"><b>' + ITEMS.length + '</b><span>tautan</span></p><p class="stat-ket">dalam ' + KATS.length + " kategori data</p></div>";
      $("#stats").innerHTML = html;
      $("#stats-src").textContent = "Sumber: " + (S.statistikSumber || "");
    }

    function renderQuick() {
      var sorot = KATS.filter(function (k) { return k.sorot; });
      var lain = KATS.filter(function (k) { return !k.sorot; }).sort(function (a, b) { return itemsOf(b.id).length - itemsOf(a.id).length; });
      var urut = sorot.concat(lain).slice(0, 6);
      $("#quick").innerHTML = '<span class="quick-label">Populer</span>' + urut.map(function (k) {
        return '<a href="#/k/' + esc(k.id) + '">' + ic(k.ikon) + esc(k.nama) + "</a>";
      }).join("");
    }

    function renderCategories() {
      var sorot = KATS.filter(function (k) { return k.sorot; });
      var lain = KATS.filter(function (k) { return !k.sorot; });

      $("#cat-feature").innerHTML = sorot.map(function (k) {
        var list = itemsOf(k.id);
        var locked = list.filter(function (d) { return d.terbatas; }).length;
        var preview = list.filter(function (d) { return !d.utama; }).sort(byDateDesc).slice(0, 3);
        return (
          '<article class="feat" style="--c:' + esc(k.warna) + '">' +
          (editing ? btnEdit("edit-kat", ' data-id="' + esc(k.id) + '"', "Ubah kategori " + k.nama) : "") +
          '<div class="feat-top"><span class="chip-ico">' + ic(k.ikon) + "</span>" +
          '<div><h3><a href="#/k/' + esc(k.id) + '">' + esc(k.nama) + '</a></h3><p class="full">' + esc(k.namaPanjang || "") + "</p></div></div>" +
          '<p class="desc">' + esc(k.deskripsi || "") + "</p>" +
          '<ul class="feat-files">' + (preview.length ? preview.map(function (d) {
            return "<li>" + ic(d._j.ikon) + '<span class="n">' + esc(d.judul) + "</span></li>";
          }).join("") : '<li class="muted">Belum ada tautan</li>') + "</ul>" +
          '<div class="feat-foot"><span class="count">' + list.length + " tautan" + (locked ? " · " + locked + " terbatas" : "") + '</span><span class="feat-go">Lihat data ' + ic("arrowR") + "</span></div>" +
          "</article>"
        );
      }).join("");
      $("#cat-feature").hidden = !sorot.length;

      $("#cat-grid").innerHTML = lain.map(function (k) {
        var n = itemsOf(k.id).length;
        return (
          '<div class="tile-wrap">' +
          '<a class="tile" href="#/k/' + esc(k.id) + '" style="--c:' + esc(k.warna) + '">' +
          '<span class="chip-ico">' + ic(k.ikon) + "</span>" +
          '<div class="tile-body"><div class="tile-title"><h3>' + esc(k.nama) + '</h3><span class="count">' + n + "</span></div>" +
          "<p>" + esc(k.deskripsi || "") + "</p></div></a>" +
          (editing ? btnEdit("edit-kat", ' data-id="' + esc(k.id) + '"', "Ubah kategori " + k.nama) : "") +
          "</div>"
        );
      }).join("") + (editing ? '<button class="tile tile-add" type="button" data-act="add-kat"><span class="chip-ico">' + ic("plus") + '</span><div class="tile-body"><div class="tile-title"><h3>Tambah kategori</h3></div><p>Buat kelompok data baru, lalu isi dengan tautan Google Drive.</p></div></button>' : "");
    }

    function renderFlow() {
      var alur = db.state.alur || [];
      $("#flow").innerHTML = alur.map(function (a, i) {
        var links = a.tautan || (a.url ? [{ label: "Buka folder", kode: a.kode, url: a.url }] : []);
        return (
          '<li class="flow-card">' +
          '<div class="flow-head"><span class="flow-num" aria-hidden="true"></span>' +
          '<div><h3>' + esc(a.fase || a.langkah) + "</h3>" +
          (a.en ? '<p class="code">' + esc(a.en) + "</p>" : "") + "</div></div>" +
          '<p class="flow-ket">' + esc(a.ket || "") + "</p>" +
          (a.isi ? '<p class="flow-isi"><b>Isi folder:</b> ' + esc(a.isi) + "</p>" : "") +
          '<ul class="flow-links">' + links.map(function (t, j) {
            return '<li><a href="' + esc(t.url) + '" target="_blank" rel="noopener">' + ic("folder") +
              '<span class="lbl">' + esc(t.label) + "</span>" +
              (t.kode ? '<span class="k">' + esc(t.kode) + "</span>" : "") + "</a>" +
              (editing ? btnEdit("edit-alur", ' data-i="' + i + '" data-j="' + j + '"', "Ubah link " + t.label) : "") + "</li>";
          }).join("") + "</ul></li>"
        );
      }).join("");
      var folder = S.alurFolder;
      $("#flow-support").innerHTML = alur.length > 1
        ? '<span class="cycle">' + ic("cycle") + "</span><p>Hasil <b>" + esc(alur[alur.length - 1].fase || "") + "</b> menjadi masukan <b>" + esc(alur[0].fase || "") + "</b> pada siklus berikutnya." +
          (S.alurRujukan ? ' <span class="ref">Rujukan: ' + esc(S.alurRujukan) + ".</span>" : "") + "</p>" +
          (folder ? '<a class="btn ghost sm" href="' + esc(folder) + '" target="_blank" rel="noopener">' + ic("folder") + "Semua folder tahap</a>" : "")
        : "";
    }

    /* ---------- katalog ---------- */
    var cat = { q: "", kat: "semua", grup: "semua", sort: "baru", limit: 12 };
    var qCat = $("#q-cat"), fKat = $("#f-kat"), fSort = $("#f-sort");

    function isiPilihanKategori() {
      if (cat.kat !== "semua" && !KAT[cat.kat]) cat.kat = "semua";
      fKat.innerHTML = '<option value="semua">Semua kategori (' + ITEMS.length + ")</option>" + KATS.map(function (k) {
        return '<option value="' + esc(k.id) + '">' + esc(k.nama) + " (" + itemsOf(k.id).length + ")</option>";
      }).join("");
      fKat.value = cat.kat;
    }
    function sortList(list, mode, q) {
      if (mode === "az") return list.sort(function (a, b) { return a.judul.localeCompare(b.judul, "id"); });
      if (mode === "lama") return list.sort(function (a, b) { return -byDateDesc(a, b); });
      if (q) return list;
      return list.sort(byDateDesc);
    }
    function renderCatalog() {
      var base = cat.kat === "semua" ? ITEMS : itemsOf(cat.kat);
      var found = search(base, cat.q);
      var counts = { semua: found.length };
      found.forEach(function (d) { counts[d._j.grup] = (counts[d._j.grup] || 0) + 1; });

      $("#f-jenis").innerHTML = GRUP.map(function (g) {
        var n = counts[g.id] || 0;
        if (g.id !== "semua" && !n && cat.grup !== g.id) return "";
        return '<button class="chip" type="button" data-grup="' + g.id + '" aria-pressed="' + (cat.grup === g.id) + '">' + esc(g.label) + ' <span class="n">' + n + "</span></button>";
      }).join("");

      var list = cat.grup === "semua" ? found : found.filter(function (d) { return d._j.grup === cat.grup; });
      list = sortList(list, cat.sort, cat.q.trim());

      var shown = list.slice(0, cat.limit);
      $("#list").innerHTML = shown.length ? shown.map(function (d) { return renderItem(d); }).join("") : emptyState(cat.q, "reset-cat");
      var more = $("#more");
      var rest = list.length - shown.length;
      more.hidden = rest <= 0;
      more.textContent = "Tampilkan " + rest + " tautan lainnya";
      $("#katalog-note").textContent = list.length === ITEMS.length
        ? ITEMS.length + " tautan tercatat." + (db.sumber === "sheet" || db.sumber === "cache" ? " Tersambung ke Google Sheet." : "")
        : list.length + " dari " + ITEMS.length + " tautan cocok dengan saringan.";
      var r = $("#reset-cat");
      if (r) r.addEventListener("click", resetCatalog);
      $("#katalog-add").hidden = !editing;
    }
    function resetCatalog() {
      cat.q = ""; cat.kat = "semua"; cat.grup = "semua"; cat.limit = 12;
      qCat.value = ""; fKat.value = "semua";
      renderCatalog();
    }
    var qTimer;
    qCat.addEventListener("input", function () {
      clearTimeout(qTimer);
      qTimer = setTimeout(function () { cat.q = qCat.value; cat.limit = 12; renderCatalog(); }, 120);
    });
    fKat.addEventListener("change", function () { cat.kat = fKat.value; cat.limit = 12; renderCatalog(); });
    fSort.addEventListener("change", function () { cat.sort = fSort.value; renderCatalog(); });
    $("#f-jenis").addEventListener("click", function (e) {
      var b = e.target.closest("[data-grup]");
      if (!b) return;
      cat.grup = b.getAttribute("data-grup"); cat.limit = 12; renderCatalog();
    });
    $("#more").addEventListener("click", function () { cat.limit += 24; renderCatalog(); });

    /* ---------- rak publikasi ---------- */
    function renderShelf() {
      var colors = ["#1F6B45", "#B35A27", "#2C5E8C", "#6E4A99", "#8C6A1F", "#1E7F77"];
      var books = ITEMS.filter(function (d) { return d.unggulan; });
      $("#shelf").innerHTML = books.length ? books.map(function (d, i) {
        return (
          '<div class="book-wrap"><a class="book" href="' + esc(d.url) + '" target="_blank" rel="noopener">' +
          '<span class="cover" style="--cv:' + colors[i % colors.length] + '">' +
          '<span class="cover-top">Desa Sumber Sari</span>' +
          '<span class="cover-title">' + esc(d.judul) + "</span>" +
          '<span class="cover-year"><span>' + esc(d._j.kode) + "</span>" + ic("external") + "</span>" +
          "</span>" +
          '<span class="book-cap"><b>' + esc(d._j.label) + "</b><span>" + esc(fmtDate(d.diperbarui)) + "</span></span>" +
          "</a>" + (editing ? btnEdit("edit-item", ' data-id="' + esc(d.id) + '"', "Ubah " + d.judul) : "") + "</div>"
        );
      }).join("") : '<p class="muted">Belum ada publikasi. Centang “Tampilkan di rak publikasi” saat menambah tautan.</p>';
    }

    /* ---------- bilah edit & status sinkron ---------- */
    function renderEditbar() {
      var bar = $("#editbar");
      document.body.classList.toggle("editing", editing);
      $("#edit-toggle").classList.toggle("on", editing);
      $("#edit-toggle").setAttribute("aria-pressed", editing ? "true" : "false");
      if (!editing) { bar.hidden = true; return; }
      var info = MODE === "sheet"
        ? '<span class="eb-mode ok">' + ic("database") + "Tersimpan ke Google Sheet</span>"
        : '<span class="eb-mode uji">' + ic("key") + "Mode uji · hanya di browser ini</span>";
      bar.innerHTML =
        '<div class="eb-inner">' + info +
        '<div class="eb-actions">' +
        '<button class="btn sm" type="button" data-act="add-item">' + ic("plus") + "Tautan</button>" +
        '<button class="btn sm" type="button" data-act="add-kat">' + ic("plus") + "Kategori</button>" +
        '<button class="btn sm ghost" type="button" data-act="edit-menu">' + ic("menu") + "Menu</button>" +
        (S.backend && S.backend.sheet ? '<a class="btn sm ghost" href="' + esc(S.backend.sheet) + '" target="_blank" rel="noopener">' + ic("sheet") + "Buka Sheet</a>" : "") +
        (MODE === "sheet" && db.kosong ? '<button class="btn sm gold" type="button" data-act="impor">' + ic("upload") + "Impor data awal</button>" : "") +
        (MODE === "lokal" && db.sumber === "lokal" ? '<button class="btn sm ghost" type="button" data-act="reset-lokal">Buang perubahan uji</button>' : "") +
        '<button class="btn sm ghost" type="button" data-act="edit-off">' + ic("check") + "Selesai</button>" +
        "</div></div>";
      bar.hidden = false;
    }
    function renderSync() {
      var el = $("#sync-note");
      var msg = db.memuat ? "Memuat data terbaru dari Google Sheet…" : db.galat;
      el.hidden = !msg;
      el.className = "sync-note" + (db.galat && !db.memuat ? " warn" : "");
      el.innerHTML = msg ? '<div class="wrap">' + (db.memuat ? '<span class="spin" aria-hidden="true"></span>' : ic("cycle")) + "<span>" + esc(msg) + "</span>" + (db.galat && !db.memuat ? ' <button class="linkish" type="button" data-act="muat-ulang">Coba lagi</button>' : "") + "</div>" : "";
    }

    /* =================================================================
       PENCARIAN CEPAT (HERO)
       ================================================================= */
    var qHero = $("#q-hero"), sug = $("#suggest");
    var sugIdx = -1;
    function sugLinks() { return $$(".sg-item", sug); }
    function closeSug() { sug.hidden = true; qHero.setAttribute("aria-expanded", "false"); sugIdx = -1; }
    function renderSug() {
      var q = qHero.value.trim();
      if (!q) { closeSug(); return; }
      var nq = norm(q);
      var kats = KATS.filter(function (k) { return norm(k.nama + " " + (k.namaPanjang || "") + " " + (k.deskripsi || "")).indexOf(nq) > -1; }).slice(0, 3);
      var res = search(ITEMS, q).slice(0, 6);
      var html = kats.map(function (k) {
        return '<a class="sg-item" role="option" href="#/k/' + esc(k.id) + '" style="--c:' + esc(k.warna) + '">' +
          '<span class="chip-ico sm">' + ic(k.ikon) + "</span>" +
          '<span><span class="t">Kategori ' + esc(k.nama) + '</span><br><span class="s">' + itemsOf(k.id).length + " tautan" + (k.namaPanjang ? " · " + esc(k.namaPanjang) : "") + "</span></span>" +
          '<span class="go">' + ic("arrowR") + "</span></a>";
      }).join("");
      html += res.map(function (d) {
        return '<a class="sg-item" role="option" href="' + esc(d.url) + '" target="_blank" rel="noopener">' +
          typeBadge(d, true) +
          '<span><span class="t">' + esc(d.judul) + '</span><br><span class="s">' + esc(d.kategori.map(function (id) { return KAT[id].nama; }).join(" · ") || "Tanpa kategori") + (d.terbatas ? " · terbatas" : "") + "</span></span>" +
          '<span class="go">' + ic("external") + "</span></a>";
      }).join("");
      if (!kats.length && !res.length) html = '<div class="sg-empty">Belum ada data untuk “' + esc(q) + '”. Coba kata lain seperti <b>desil</b>, <b>kuesioner</b>, atau <b>posyandu</b>.</div>';
      else html += '<a class="sg-item sg-all" role="option" href="#katalog" data-all="1">' + ic("search") + "<span>Lihat semua hasil untuk “" + esc(q) + "” di katalog</span></a>";
      sug.innerHTML = html;
      sug.hidden = false;
      qHero.setAttribute("aria-expanded", "true");
      sugIdx = -1;
    }
    function goCatalog(q) {
      cat.q = q; cat.kat = "semua"; cat.grup = "semua"; cat.limit = 12;
      qCat.value = q; fKat.value = "semua";
      renderCatalog();
      closeSug();
      if (location.hash === "#katalog") $("#katalog").scrollIntoView({ behavior: "smooth" });
      else location.hash = "katalog";
    }
    qHero.addEventListener("input", renderSug);
    qHero.addEventListener("focus", function () { if (qHero.value.trim()) renderSug(); });
    qHero.addEventListener("keydown", function (e) {
      var links = sugLinks();
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (sug.hidden || !links.length) return;
        e.preventDefault();
        sugIdx = (sugIdx + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
        links.forEach(function (l, i) { l.classList.toggle("aktif", i === sugIdx); });
        links[sugIdx].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (sugIdx > -1 && links[sugIdx] && !links[sugIdx].hasAttribute("data-all")) links[sugIdx].click();
        else if (qHero.value.trim()) goCatalog(qHero.value.trim());
      } else if (e.key === "Escape") { closeSug(); }
    });
    sug.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a) return;
      if (a.hasAttribute("data-all")) { e.preventDefault(); goCatalog(qHero.value.trim()); }
      else closeSug();
    });
    document.addEventListener("click", function (e) { if (!e.target.closest(".search")) closeSug(); });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      var t = e.target.tagName;
      if (t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || e.target.isContentEditable || dlg.open) return;
      e.preventDefault();
      var target = viewKat.hidden ? qHero : ($("#q-kat-in") || qHero);
      target.focus();
      if (target === qHero) window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* =================================================================
       HALAMAN KATEGORI
       ================================================================= */
    var viewHome = $("#view-home"), viewKat = $("#view-kategori");
    var kstate = { q: "", grup: "semua" };
    var katAktif = null;

    function relatedOf(id) {
      var score = {};
      itemsOf(id).forEach(function (d) {
        d.kategori.forEach(function (o) { if (o !== id) score[o] = (score[o] || 0) + 1; });
      });
      var ids = Object.keys(score).sort(function (a, b) { return score[b] - score[a]; });
      KATS.forEach(function (k) { if (k.sorot && k.id !== id && ids.indexOf(k.id) === -1) ids.push(k.id); });
      return ids.slice(0, 3).map(function (x) { return KAT[x]; }).filter(Boolean);
    }
    function renderKatList(id) {
      var base = itemsOf(id);
      var found = search(base, kstate.q);
      var counts = { semua: found.length };
      found.forEach(function (d) { counts[d._j.grup] = (counts[d._j.grup] || 0) + 1; });
      $("#kgrup").innerHTML = GRUP.map(function (g) {
        var n = counts[g.id] || 0;
        if (g.id !== "semua" && !n && kstate.grup !== g.id) return "";
        return '<button class="chip" type="button" data-grup="' + g.id + '" aria-pressed="' + (kstate.grup === g.id) + '">' + esc(g.label) + ' <span class="n">' + n + "</span></button>";
      }).join("");
      var list = kstate.grup === "semua" ? found : found.filter(function (d) { return d._j.grup === kstate.grup; });
      if (!kstate.q.trim()) list.sort(function (a, b) { return (b.utama ? 1 : 0) - (a.utama ? 1 : 0) || byDateDesc(a, b); });
      $("#klist").innerHTML = list.length ? list.map(function (d) { return renderItem(d, id); }).join("") : emptyState(kstate.q, "reset-k", id);
      var r = $("#reset-k");
      if (r) r.addEventListener("click", function () { kstate.q = ""; kstate.grup = "semua"; $("#q-kat-in").value = ""; renderKatList(id); });
    }

    function showKategori(id, pertahankan) {
      var k = KAT[id];
      var list = itemsOf(id);
      var main = list.filter(function (d) { return d.utama; })[0];
      var locked = list.filter(function (d) { return d.terbatas; }).length;
      if (!pertahankan || katAktif !== id) kstate = { q: "", grup: "semua" };
      katAktif = id;

      viewKat.innerHTML =
        '<section class="kat-head" style="--c:' + esc(k.warna) + '"><div class="wrap">' +
        '<nav class="crumbs" aria-label="Jejak halaman"><a href="#/">Beranda</a><span aria-hidden="true">/</span><a href="#kategori">Kategori</a><span aria-hidden="true">/</span><span aria-current="page">' + esc(k.nama) + "</span></nav>" +
        '<div class="kat-title"><span class="chip-ico">' + ic(k.ikon) + '</span><div><h1>' + esc(k.nama) + "</h1>" + (k.namaPanjang ? '<p class="full">' + esc(k.namaPanjang) + "</p>" : "") + "</div></div>" +
        (k.deskripsi ? '<p class="kat-desc">' + esc(k.deskripsi) + "</p>" : "") +
        '<div class="kat-meta"><span class="count">' + list.length + " tautan" + (list.length ? " · diperbarui " + esc(fmtDate(latest(list))) : "") + "</span>" +
        (main ? '<a class="btn" href="' + esc(main.url) + '" target="_blank" rel="noopener">' + ic(main._j.ikon) + (main.jenis === "folder" ? "Buka folder utama" : "Buka data utama") + "</a>" : "") +
        '<button class="btn ghost" type="button" data-copy="' + esc(location.href.split("#")[0] + "#/k/" + id) + '">' + ic("link") + "Salin tautan halaman</button>" +
        (editing ? '<button class="btn gold" type="button" data-act="add-item" data-kat="' + esc(id) + '">' + ic("plus") + 'Tambah tautan di sini</button><button class="btn ghost" type="button" data-act="edit-kat" data-id="' + esc(id) + '">' + ic("pencil") + "Ubah kategori</button>" : "") +
        "</div>" +
        (locked ? '<div class="notice">' + ic("lock") + "<p><b>" + locked + " berkas berlabel Terbatas</b> karena memuat data pribadi warga. Bila tidak bisa dibuka, <a href=\"" + esc(MAIL_AKSES) + "\">minta akses ke admin desa</a>.</p></div>" : "") +
        "</div></section>" +
        '<section class="wrap kat-body">' +
        '<div class="toolbar"><div class="field grow"><label for="q-kat-in" class="sr-only">Cari di kategori ' + esc(k.nama) + '</label><span class="field-ico">' + ic("search") + '</span><input id="q-kat-in" type="search" placeholder="Cari di ' + esc(k.nama) + '…" autocomplete="off"></div></div>' +
        '<div class="chips" id="kgrup" role="group" aria-label="Saring jenis berkas"></div>' +
        '<ul class="list" id="klist"></ul>' +
        (relatedOf(id).length ? '<div class="related"><h2>Kategori terkait</h2><div class="cat-grid">' +
        relatedOf(id).map(function (r) {
          return '<div class="tile-wrap"><a class="tile" href="#/k/' + esc(r.id) + '" style="--c:' + esc(r.warna) + '"><span class="chip-ico">' + ic(r.ikon) + '</span><div class="tile-body"><div class="tile-title"><h3>' + esc(r.nama) + '</h3><span class="count">' + itemsOf(r.id).length + "</span></div><p>" + esc(r.deskripsi || "") + "</p></div></a></div>";
        }).join("") + "</div></div>" : "") +
        "</section>";

      var qi = $("#q-kat-in"), kt;
      qi.value = kstate.q;
      renderKatList(id);
      qi.addEventListener("input", function () { clearTimeout(kt); kt = setTimeout(function () { kstate.q = qi.value; renderKatList(id); }, 120); });
      $("#kgrup").addEventListener("click", function (e) {
        var b = e.target.closest("[data-grup]");
        if (!b) return;
        kstate.grup = b.getAttribute("data-grup"); renderKatList(id);
      });

      viewHome.hidden = true;
      viewKat.hidden = false;
      document.title = k.nama + " · Satu Data Desa Sumber Sari";
      if (!pertahankan) window.scrollTo(0, 0);
      setActiveNav(null);
    }

    function showHome(hash) {
      var wasKat = !viewKat.hidden;
      katAktif = null;
      viewKat.hidden = true;
      viewHome.hidden = false;
      document.title = "Satu Data Desa Sumber Sari";
      var id = hash && hash.charAt(1) !== "/" ? hash.slice(1) : "";
      var el = id && document.getElementById(id);
      if (el) requestAnimationFrame(function () { el.scrollIntoView({ behavior: wasKat ? "auto" : "smooth" }); });
      else if (wasKat || hash === "#/") window.scrollTo(0, 0);
    }
    function route() {
      var m = location.hash.match(/^#\/k\/([\w-]+)/);
      if (m && KAT[m[1]]) showKategori(m[1]);
      else showHome(location.hash);
    }
    window.addEventListener("hashchange", route);

    /* ---------- sorot menu aktif ---------- */
    var navA = [];
    function setActiveNav(id) {
      navA.forEach(function (a) { a.classList.toggle("aktif", !!id && a.getAttribute("href") === "#" + id); });
    }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting && !viewHome.hidden) setActiveNav(en.target.id); });
      }, { rootMargin: "-45% 0px -50% 0px" });
      NAV_TETAP.forEach(function (n) { var el = document.getElementById(n[0]); if (el) io.observe(el); });
    }

    /* =================================================================
       RENDER SEMUA
       ================================================================= */
    function renderSemua() {
      bangunIndeks();
      renderNav();
      renderStats();
      renderQuick();
      renderCategories();
      renderFlow();
      isiPilihanKategori();
      renderCatalog();
      renderShelf();
      renderEditbar();
      renderSync();
      if (katAktif) {
        if (KAT[katAktif]) showKategori(katAktif, true);
        else location.hash = "#/";
      }
      if (qHero.value.trim() && !sug.hidden) renderSug();
    }

    /* =================================================================
       DIALOG (formulir mode edit)
       ================================================================= */
    var dlg = $("#dlg");
    function bukaDialog(html) {
      dlg.innerHTML = html;
      if (typeof dlg.showModal === "function") { if (!dlg.open) dlg.showModal(); }
      else dlg.setAttribute("open", "");
      var f = dlg.querySelector("input:not([type=hidden]):not([type=checkbox]):not([type=radio]), textarea, select");
      if (f) setTimeout(function () { f.focus(); }, 30);
    }
    function tutupDialog() { if (typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open"); }
    dlg.addEventListener("click", function (e) { if (e.target === dlg) tutupDialog(); });

    function kepala(judul, sub) {
      return '<div class="dlg-head"><div><h2>' + esc(judul) + "</h2>" + (sub ? '<p class="dlg-sub">' + esc(sub) + "</p>" : "") + '</div><button class="icon-btn plain" type="button" data-act="dlg-close" aria-label="Tutup">' + ic("x") + "</button></div>";
    }
    function kaki(kiri, labelSimpan) {
      return '<div class="dlg-foot"><div>' + (kiri || "") + '</div><div class="dlg-foot-r"><button class="btn ghost" type="button" data-act="dlg-close">Batal</button><button class="btn" type="submit" data-simpan>' + esc(labelSimpan || "Simpan") + "</button></div></div>";
    }
    function bidang(id, label, kontrol, hint) {
      return '<div class="gf"><label for="' + id + '">' + esc(label) + "</label>" + kontrol + (hint ? '<p class="gf-hint">' + hint + "</p>" : "") + "</div>";
    }
    function sakelar(id, label, on, hint) {
      return '<label class="toggle" for="' + id + '"><input type="checkbox" id="' + id + '"' + (on ? " checked" : "") + '><span class="tg"></span><span><b>' + esc(label) + "</b>" + (hint ? "<small>" + esc(hint) + "</small>" : "") + "</span></label>";
    }
    function tampilGalat(form, msg) { var e = $(".dlg-err", form); e.textContent = msg; e.hidden = false; e.scrollIntoView({ block: "nearest" }); }
    function prosesSimpan(form, kerja, pesanOk) {
      var b = $("[data-simpan]", form), label = b.textContent;
      b.disabled = true; b.textContent = "Menyimpan…";
      $(".dlg-err", form).hidden = true;
      return kerja().then(function () {
        tutupDialog();
        toast(pesanOk + (MODE === "lokal" ? " (mode uji)" : ""), "check");
      }, function (err) {
        b.disabled = false; b.textContent = label;
        if (err && err.kode === "kunci") { tutupDialog(); toast("Kunci editor salah atau sudah diganti. Masukkan lagi."); dialogKunci(); return; }
        tampilGalat(form, (err && err.message) || "Gagal menyimpan.");
      });
    }
    function tombolHapus(label) {
      return '<button class="btn ghost danger" type="button" data-hapus>' + ic("trash") + esc(label) + "</button>";
    }
    function pasangHapus(form, konfirmasi, kerja, pesanOk) {
      var h = $("[data-hapus]", form);
      if (!h) return;
      var siap = false;
      h.addEventListener("click", function () {
        if (!siap) { siap = true; h.classList.add("yakin"); h.innerHTML = ic("trash") + esc(konfirmasi); return; }
        h.disabled = true; h.textContent = "Menghapus…";
        kerja().then(function () { tutupDialog(); toast(pesanOk, "check"); }, function (err) {
          h.disabled = false; siap = false; h.classList.remove("yakin"); h.innerHTML = ic("trash") + "Hapus";
          if (err && err.kode === "kunci") { tutupDialog(); dialogKunci(); return; }
          tampilGalat(form, (err && err.message) || "Gagal menghapus.");
        });
      });
    }
    function urlValid(u) { return /^https?:\/\/\S+\.\S+/.test(u); }

    /* ---------- tautan (item katalog) ---------- */
    function dialogItem(item, presetKat) {
      var baru = !item;
      var d = item ? clone(item) : { id: uid("i"), judul: "", kategori: presetKat && KAT[presetKat] ? [presetKat] : [], jenis: "folder", url: "", lokasi: "", diperbarui: hariIni(), ket: "", terbatas: false, utama: false, unggulan: false };
      var pilihKat = KATS.map(function (k) {
        var on = (d.kategori || []).indexOf(k.id) > -1;
        return '<label class="pick" style="--c:' + esc(k.warna) + '"><input type="checkbox" name="fi-kat" value="' + esc(k.id) + '"' + (on ? " checked" : "") + "><span>" + ic(k.ikon) + esc(k.nama) + "</span></label>";
      }).join("");
      var opsiJenis = Object.keys(JENIS).map(function (j) { return '<option value="' + j + '"' + (d.jenis === j ? " selected" : "") + ">" + esc(JENIS[j].label) + "</option>"; }).join("");
      bukaDialog(
        '<form class="dlg-form" id="dlgf-item" novalidate>' +
        kepala(baru ? "Tambah tautan" : "Ubah tautan", baru ? "Tautan baru ke Google Drive" : d.judul) +
        '<div class="dlg-body">' +
        bidang("fi-url", "Link Google Drive", '<input id="fi-url" type="url" inputmode="url" autocomplete="off" value="' + esc(d.url) + '" placeholder="https://drive.google.com/…">', "Di Drive: klik kanan berkas/folder → <b>Bagikan</b> → <b>Salin link</b>, lalu tempel di sini." + '<span class="detect" id="fi-detect"></span>') +
        bidang("fi-judul", "Judul data", '<input id="fi-judul" type="text" autocomplete="off" value="' + esc(d.judul) + '" placeholder="mis. Data DTSEN Desil 2">') +
        '<div class="gf-row">' +
        bidang("fi-jenis", "Jenis", '<select id="fi-jenis">' + opsiJenis + "</select>") +
        bidang("fi-tgl", "Tanggal diperbarui", '<input id="fi-tgl" type="date" value="' + esc(d.diperbarui || hariIni()) + '">') +
        "</div>" +
        '<fieldset class="gf"><legend>Kategori</legend><div class="picks">' + (pilihKat || '<p class="gf-hint">Belum ada kategori.</p>') + "</div></fieldset>" +
        bidang("fi-lokasi", "Letak di Drive (opsional)", '<input id="fi-lokasi" type="text" autocomplete="off" value="' + esc(d.lokasi) + '" placeholder="mis. DESA CANTIK / Kegiatan Statistik / 4. Pengumpulan Data">') +
        bidang("fi-ket", "Keterangan (opsional)", '<textarea id="fi-ket" rows="2" placeholder="Isi singkat berkas ini">' + esc(d.ket) + "</textarea>") +
        '<div class="toggles">' +
        sakelar("fi-terbatas", "Terbatas", d.terbatas, "Memuat data pribadi warga (NIK, nama, alamat)") +
        sakelar("fi-utama", "Folder utama kategori", d.utama, "Jadi tombol “Buka folder utama”") +
        sakelar("fi-unggulan", "Tampilkan di rak publikasi", d.unggulan, "Untuk terbitan resmi desa") +
        "</div>" +
        '<p class="gate-err dlg-err" role="alert" hidden></p>' +
        "</div>" +
        kaki(baru ? "" : tombolHapus("Hapus"), baru ? "Tambah" : "Simpan") +
        "</form>"
      );
      var form = $("#dlgf-item"), fUrl = $("#fi-url"), fJenis = $("#fi-jenis"), det = $("#fi-detect");
      var jenisDisentuh = false;
      fJenis.addEventListener("change", function () { jenisDisentuh = true; });
      function cekUrl(terapkanJenis) {
        var j = deteksiJenis(fUrl.value);
        det.textContent = j ? "Terdeteksi: " + JENIS[j].label : "";
        if (j && terapkanJenis && !jenisDisentuh) fJenis.value = j;
      }
      fUrl.addEventListener("input", function () { cekUrl(true); });
      cekUrl(baru);
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var judul = $("#fi-judul").value.trim(), url = fUrl.value.trim();
        if (!url || !urlValid(url)) return tampilGalat(form, "Tempel link lengkap yang diawali https://");
        if (!judul) return tampilGalat(form, "Isi judul data supaya mudah dicari.");
        var baruItem = {
          id: d.id, judul: judul, url: url, jenis: fJenis.value,
          kategori: $$("input[name=fi-kat]:checked", form).map(function (x) { return x.value; }),
          diperbarui: $("#fi-tgl").value || hariIni(),
          lokasi: $("#fi-lokasi").value.trim(), ket: $("#fi-ket").value.trim(),
          terbatas: $("#fi-terbatas").checked, utama: $("#fi-utama").checked, unggulan: $("#fi-unggulan").checked
        };
        prosesSimpan(form, function () { return kirim({ aksi: "simpanItem", item: baruItem, baru: baru }); }, baru ? "Tautan ditambahkan" : "Tautan disimpan");
      });
      pasangHapus(form, "Yakin hapus? Klik lagi", function () { return kirim({ aksi: "hapusItem", id: d.id, judul: d.judul }); }, "Tautan dihapus");
    }

    /* ---------- kategori ---------- */
    function dialogKategori(k) {
      var baru = !k;
      var d = k ? clone(k) : { id: "", nama: "", namaPanjang: "", deskripsi: "", ikon: "folder", warna: WARNA[KATS.length % WARNA.length], sorot: false };
      var jumlah = baru ? 0 : itemsOf(d.id).length;
      var ikonHtml = IKON_KATEGORI.map(function (n) {
        return '<label class="ik"><input type="radio" name="fk-ikon" value="' + n + '"' + (d.ikon === n ? " checked" : "") + '><span title="' + n + '">' + ic(n) + "</span></label>";
      }).join("");
      var adaWarna = WARNA.indexOf(String(d.warna).toUpperCase()) > -1;
      var warnaHtml = WARNA.map(function (w) {
        return '<label class="sw" style="--sw:' + w + '"><input type="radio" name="fk-warna" value="' + w + '"' + (String(d.warna).toUpperCase() === w ? " checked" : "") + '><span aria-label="' + w + '"></span></label>';
      }).join("") + '<label class="sw custom" title="Warna lain"><input type="radio" name="fk-warna" value="custom"' + (!adaWarna ? " checked" : "") + '><input type="color" id="fk-warna-c" value="' + esc(/^#[0-9a-f]{6}$/i.test(d.warna) ? d.warna : "#1F6B45") + '" aria-label="Pilih warna lain"></label>';
      bukaDialog(
        '<form class="dlg-form" id="dlgf-kat" novalidate>' +
        kepala(baru ? "Tambah kategori" : "Ubah kategori", baru ? "Kelompok data baru" : d.nama + " · " + jumlah + " tautan") +
        '<div class="dlg-body">' +
        '<div class="kat-preview" id="fk-prev"></div>' +
        bidang("fk-nama", "Nama kategori", '<input id="fk-nama" type="text" maxlength="40" autocomplete="off" value="' + esc(d.nama) + '" placeholder="mis. Pertanian">') +
        bidang("fk-panjang", "Nama lengkap / singkatan (opsional)", '<input id="fk-panjang" type="text" maxlength="80" autocomplete="off" value="' + esc(d.namaPanjang) + '" placeholder="mis. Kelompok tani dan hasil panen">') +
        bidang("fk-desk", "Deskripsi", '<textarea id="fk-desk" rows="2" maxlength="260" placeholder="Data apa saja yang ada di kategori ini">' + esc(d.deskripsi) + "</textarea>") +
        '<fieldset class="gf"><legend>Ikon</legend><div class="ikons">' + ikonHtml + "</div></fieldset>" +
        '<fieldset class="gf"><legend>Warna</legend><div class="swatches">' + warnaHtml + "</div></fieldset>" +
        '<div class="toggles">' + sakelar("fk-sorot", "Tampilkan besar di depan", d.sorot, "Seperti DTSEN, RDDK, dan UMKM") + "</div>" +
        '<p class="gate-err dlg-err" role="alert" hidden></p>' +
        "</div>" +
        kaki(baru ? "" : tombolHapus("Hapus kategori"), baru ? "Buat kategori" : "Simpan") +
        "</form>"
      );
      var form = $("#dlgf-kat");
      function nilaiWarna() {
        var r = $("input[name=fk-warna]:checked", form);
        return !r || r.value === "custom" ? $("#fk-warna-c").value : r.value;
      }
      function pratinjau() {
        var ikon = ($("input[name=fk-ikon]:checked", form) || {}).value || "folder";
        $("#fk-prev").innerHTML = '<span class="tile static" style="--c:' + esc(nilaiWarna()) + '"><span class="chip-ico">' + ic(ikon) + '</span><span class="tile-body"><span class="tile-title"><b>' + esc($("#fk-nama").value || "Nama kategori") + '</b></span><span class="p">' + esc($("#fk-desk").value || "Deskripsi singkat kategori") + "</span></span></span>";
      }
      form.addEventListener("input", pratinjau);
      form.addEventListener("change", pratinjau);
      $("#fk-warna-c").addEventListener("input", function () { $("input[name=fk-warna][value=custom]", form).checked = true; pratinjau(); });
      pratinjau();
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var nama = $("#fk-nama").value.trim();
        if (!nama) return tampilGalat(form, "Isi nama kategori.");
        var id = d.id;
        if (baru) {
          id = slug(nama);
          var dasar = id, n = 2;
          while (KAT[id]) id = dasar + "-" + n++;
        }
        var kat = {
          id: id, nama: nama, namaPanjang: $("#fk-panjang").value.trim(), deskripsi: $("#fk-desk").value.trim(),
          ikon: ($("input[name=fk-ikon]:checked", form) || {}).value || "folder", warna: nilaiWarna(), sorot: $("#fk-sorot").checked
        };
        prosesSimpan(form, function () {
          return kirim({ aksi: "simpanKategori", kategori: kat, baru: baru }).then(function () {
            if (baru) location.hash = "#/k/" + id;
          });
        }, baru ? "Kategori dibuat — sekarang tambahkan tautannya" : "Kategori disimpan");
      });
      pasangHapus(form, jumlah ? "Yakin? " + jumlah + " tautan akan dilepas dari kategori ini" : "Yakin hapus? Klik lagi",
        function () { return kirim({ aksi: "hapusKategori", id: d.id, nama: d.nama }); }, "Kategori dihapus");
    }

    /* ---------- link tahap alur ---------- */
    function dialogAlur(i, j) {
      var alur = clone(db.state.alur || []);
      var a = alur[i], t = a && a.tautan && a.tautan[j];
      if (!t) return;
      bukaDialog(
        '<form class="dlg-form" id="dlgf-alur" novalidate>' +
        kepala("Ubah link tahap", (i + 1) + ". " + (a.fase || "")) +
        '<div class="dlg-body">' +
        bidang("fa-label", "Nama link", '<input id="fa-label" type="text" autocomplete="off" value="' + esc(t.label) + '">') +
        bidang("fa-url", "Link Google Drive", '<input id="fa-url" type="url" inputmode="url" autocomplete="off" value="' + esc(t.url) + '">', "Tempel link folder tahap ini dari Google Drive.") +
        '<p class="gate-err dlg-err" role="alert" hidden></p>' +
        "</div>" + kaki("", "Simpan") + "</form>"
      );
      var form = $("#dlgf-alur");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var url = $("#fa-url").value.trim(), label = $("#fa-label").value.trim();
        if (!urlValid(url)) return tampilGalat(form, "Tempel link lengkap yang diawali https://");
        alur[i].tautan[j] = Object.assign({}, t, { label: label || t.label, url: url });
        prosesSimpan(form, function () { return kirim({ aksi: "simpanPengaturan", kunciSet: "alur", nilai: alur }); }, "Link tahap disimpan");
      });
    }

    /* ---------- menu navigasi ---------- */
    function dialogMenu() {
      var menu = clone(db.state.menu || []);
      function baris(m, i) {
        return '<div class="menu-row" data-i="' + i + '">' +
          '<input type="text" class="mr-label" aria-label="Nama menu ' + (i + 1) + '" value="' + esc(m.label) + '" placeholder="Nama menu">' +
          '<input type="url" class="mr-url" aria-label="Link menu ' + (i + 1) + '" value="' + esc(m.url) + '" placeholder="https://docs.google.com/…">' +
          '<label class="mr-lock" title="Tandai terbatas"><input type="checkbox" class="mr-terbatas"' + (m.terbatas ? " checked" : "") + ">" + ic("lock") + "</label>" +
          '<button type="button" class="icon-btn plain" data-hapus-baris aria-label="Hapus menu ini">' + ic("trash") + "</button></div>";
      }
      bukaDialog(
        '<form class="dlg-form" id="dlgf-menu" novalidate>' +
        kepala("Menu navigasi", "Tautan cepat di bagian atas, mis. Data Sumber Sari") +
        '<div class="dlg-body"><div id="menu-rows">' + menu.map(baris).join("") + "</div>" +
        '<button type="button" class="btn ghost sm" id="menu-add">' + ic("plus") + "Tambah menu</button>" +
        '<p class="gf-hint">Ikon gembok menandai tautan berisi data pribadi.</p>' +
        '<p class="gate-err dlg-err" role="alert" hidden></p></div>' +
        kaki("", "Simpan") + "</form>"
      );
      var form = $("#dlgf-menu"), rows = $("#menu-rows");
      $("#menu-add").addEventListener("click", function () {
        rows.insertAdjacentHTML("beforeend", baris({ label: "", url: "" }, rows.children.length));
        $(".menu-row:last-child .mr-label", rows).focus();
      });
      rows.addEventListener("click", function (e) { var b = e.target.closest("[data-hapus-baris]"); if (b) b.closest(".menu-row").remove(); });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var hasil = [], salah = "";
        $$(".menu-row", rows).forEach(function (r) {
          var label = $(".mr-label", r).value.trim(), url = $(".mr-url", r).value.trim();
          if (!label && !url) return;
          if (!label || !urlValid(url)) salah = "Setiap menu perlu nama dan link lengkap (https://…).";
          hasil.push({ label: label, url: url, terbatas: $(".mr-terbatas", r).checked });
        });
        if (salah) return tampilGalat(form, salah);
        prosesSimpan(form, function () { return kirim({ aksi: "simpanPengaturan", kunciSet: "menu", nilai: hasil }); }, "Menu disimpan");
      });
    }

    /* ---------- kunci editor ---------- */
    var setelahKunci = null;
    function dialogKunci(lanjut) {
      setelahKunci = lanjut || null;
      bukaDialog(
        '<form class="dlg-form" id="dlgf-kunci" novalidate>' +
        kepala("Masuk mode edit", "Perubahan akan tersimpan ke Google Sheet dan terlihat oleh semua perangkat") +
        '<div class="dlg-body">' +
        bidang("fkey", "Kunci editor", '<input id="fkey" type="password" autocomplete="off">', "Kunci diatur admin lewat menu <b>SDDS → Atur kunci editor</b> di Google Sheet database.") +
        '<p class="gate-err dlg-err" role="alert" hidden></p></div>' +
        kaki("", "Masuk mode edit") + "</form>"
      );
      var form = $("#dlgf-kunci");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var k = $("#fkey").value;
        if (!k) return tampilGalat(form, "Isi kunci editor.");
        var b = $("[data-simpan]", form); b.disabled = true; b.textContent = "Memeriksa…";
        kunciMem = k;
        kirim({ aksi: "cek" }).then(function () {
          simpanLokal(K_KUNCI, k);
          tutupDialog();
          nyalakanEdit();
          if (setelahKunci) setelahKunci();
        }, function (err) {
          kunciMem = "";
          b.disabled = false; b.textContent = "Masuk mode edit";
          tampilGalat(form, (err && err.message) || "Kunci tidak bisa diperiksa.");
        });
      });
    }
    function dialogInfoUji(lanjut) {
      bukaDialog(
        '<form class="dlg-form" id="dlgf-uji" novalidate>' +
        kepala("Mode edit (uji coba)", "Website belum tersambung ke Google Sheet") +
        '<div class="dlg-body"><p>Semua fitur edit bisa dicoba: ubah link, tambah kategori, tambah tautan. Namun perubahan <b>hanya tersimpan di browser ini</b> dan tidak terlihat perangkat lain.</p>' +
        '<p>Agar perubahan tersimpan untuk semua, sambungkan website ke spreadsheet <b>SDDS – Database Katalog</b> (lihat README bagian <i>Mode edit</i>).</p></div>' +
        kaki("", "Mengerti, coba sekarang") + "</form>"
      );
      $("#dlgf-uji").addEventListener("submit", function (e) { e.preventDefault(); simpanLokal("sdds-uji-ok", "1"); tutupDialog(); nyalakanEdit(); if (lanjut) lanjut(); });
    }

    /* ---------- mode edit on/off ---------- */
    function nyalakanEdit() { editing = true; renderSemua(); toast("Mode edit aktif", "pencil"); }
    function mintaEdit(lanjut) {
      if (editing) { if (lanjut) lanjut(); return; }
      if (MODE === "lokal") {
        if (simpanLokal("sdds-uji-ok")) { nyalakanEdit(); if (lanjut) lanjut(); }
        else dialogInfoUji(lanjut);
        return;
      }
      if (kunciMem) { nyalakanEdit(); if (lanjut) lanjut(); return; }
      dialogKunci(lanjut);
    }
    $("#edit-toggle").addEventListener("click", function () {
      if (editing) { editing = false; renderSemua(); return; }
      mintaEdit();
    });

    function impor() {
      var st = db.state;
      bukaDialog(
        '<form class="dlg-form" id="dlgf-impor" novalidate>' +
        kepala("Impor data awal", "Salin isi katalog saat ini ke Google Sheet") +
        '<div class="dlg-body"><p>Google Sheet database masih kosong. Impor akan menyalin <b>' + st.kategori.length + " kategori</b>, <b>" + st.data.length + " tautan</b>, alur GSBPM, dan menu dari website ke spreadsheet.</p>" +
        '<p class="gate-err dlg-err" role="alert" hidden></p></div>' +
        kaki("", "Impor sekarang") + "</form>"
      );
      var form = $("#dlgf-impor");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        prosesSimpan(form, function () {
          return kirim({ aksi: "impor", kategori: st.kategori, data: st.data, pengaturan: { alur: st.alur, menu: st.menu } });
        }, "Data awal masuk ke Google Sheet");
      });
    }

    /* ---------- tombol-tombol [data-act] ---------- */
    document.addEventListener("click", function (e) {
      var cp = e.target.closest && e.target.closest("[data-copy]");
      if (cp) { e.preventDefault(); copyText(cp.getAttribute("data-copy")); return; }
      var t = e.target.closest && e.target.closest("[data-act]");
      if (!t) return;
      var act = t.getAttribute("data-act"), id = t.getAttribute("data-id");
      if (act === "dlg-close") { tutupDialog(); return; }
      if (act === "muat-ulang") { muatDariSheet(); return; }
      e.preventDefault();
      e.stopPropagation();
      if (act === "edit-off") { editing = false; renderSemua(); return; }
      if (act === "reset-lokal") {
        simpanLokal(K_LOKAL, null); db.state = dataAwal(); db.sumber = "katalog"; renderSemua(); toast("Perubahan uji dibuang"); return;
      }
      mintaEdit(function () {
        if (act === "edit-item") { var it = cariItem(id); if (it) dialogItem(it); }
        else if (act === "add-item") dialogItem(null, t.getAttribute("data-kat") || katAktif);
        else if (act === "edit-kat") { if (KAT[id]) dialogKategori(KAT[id]); }
        else if (act === "add-kat") dialogKategori(null);
        else if (act === "edit-alur") dialogAlur(+t.getAttribute("data-i"), +t.getAttribute("data-j"));
        else if (act === "edit-menu") dialogMenu();
        else if (act === "impor") impor();
      });
    });

    /* ---------- footer & tautan ---------- */
    function renderMeta() {
      $("#mail-akses").href = MAIL_AKSES;
      $("#mail-lapor").href = MAIL_LAPOR;
      if (S.desa) {
        $("#link-drive").href = S.desa.folderInduk || "#";
        if (S.desa.website) $("#link-web").href = S.desa.website;
        $("#footer-alamat").textContent = S.desa.nama + ", Kecamatan " + S.desa.kecamatan + ", Kabupaten " + S.desa.kabupaten + ", " + S.desa.provinsi;
      }
      if (S.situs) {
        $("#footer-slogan").textContent = S.situs.slogan || "";
        $("#footer-upd").textContent = MODE === "sheet" ? "Katalog tersambung ke Google Sheet" : "Katalog diperbarui " + fmtDate(S.situs.diperbarui);
        if (S.situs.program) $("#program-label").textContent = S.situs.program;
      }
    }

    renderMeta();
    renderSemua();
    route();
    muatDariSheet();

    /* ---------- akun & keluar ---------- */
    var logoutBtn = $("#logout");
    if (sesi.keluar) {
      logoutBtn.hidden = false;
      logoutBtn.innerHTML = ic("logout");
      logoutBtn.title = "Keluar (" + namaAkun + ")";
      logoutBtn.setAttribute("aria-label", "Keluar dari " + namaAkun);
      logoutBtn.addEventListener("click", sesi.keluar);
    }
    $("#edit-toggle").innerHTML = ic("pencil") + '<span class="et-label">Edit</span>';
    if (sesi.baruMasuk && sesi.akun) toast("Masuk sebagai " + namaAkun, "check");
  };
})();
