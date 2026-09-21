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
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1"/>',
    alert: '<path d="m21.7 18-8-14a2 2 0 0 0-3.5 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    history: '<path d="M3 12a9 9 0 1 0 9-9 9.7 9.7 0 0 0-6.7 2.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
    restore: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    phone: '<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    gear: '<path d="M12.2 2h-.4a2 2 0 0 0-2 2v.2a2 2 0 0 1-1 1.7l-.4.3a2 2 0 0 1-2 0l-.2-.1a2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7l.2.1a2 2 0 0 1 1 1.7v.5a2 2 0 0 1-1 1.7l-.2.1a2 2 0 0 0-.7 2.7l.2.4a2 2 0 0 0 2.7.7l.2-.1a2 2 0 0 1 2 0l.4.3a2 2 0 0 1 1 1.7v.2a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2v-.2a2 2 0 0 1 1-1.7l.4-.3a2 2 0 0 1 2 0l.2.1a2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7l-.2-.1a2 2 0 0 1-1-1.7v-.5a2 2 0 0 1 1-1.7l.2-.1a2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7l-.2.1a2 2 0 0 1-2 0l-.4-.3a2 2 0 0 1-1-1.7V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    dots: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    table: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>'
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
        menu: clone(S.menu || []),
        statistik: clone(S.statistik || []),
        statistikSumber: S.statistikSumber || "",
        folderPantau: [],
        folderUnggah: "",
        notifikasi: {},
        dasborSumber: ""
      };
    }
    var db = { state: dataAwal(), sumber: "katalog", kosong: false, memuat: false, galat: "", kunciSiap: true, cek: {}, info: null, versi: 0 };
    function v2() { return MODE === "sheet" && db.versi >= 2; }

    function terapkan(res) {
      var st = dataAwal();
      var ada = (res.kategori && res.kategori.length) || (res.data && res.data.length);
      if (ada) { st.kategori = res.kategori || []; st.data = res.data || []; }
      var p = res.pengaturan || {};
      if (Array.isArray(p.alur) && p.alur.length) st.alur = p.alur;
      if (Array.isArray(p.menu)) st.menu = p.menu;
      if (Array.isArray(p.statistik) && p.statistik.length) st.statistik = p.statistik;
      if (typeof p.statistikSumber === "string" && p.statistikSumber) st.statistikSumber = p.statistikSumber;
      if (Array.isArray(p.folderPantau)) st.folderPantau = p.folderPantau;
      if (typeof p.folderUnggah === "string") st.folderUnggah = p.folderUnggah;
      if (p.notifikasi && typeof p.notifikasi === "object") st.notifikasi = p.notifikasi;
      if (typeof p.dasborSumber === "string") st.dasborSumber = p.dasborSumber;
      db.state = st;
      db.kosong = !ada;
      db.kunciSiap = res.kunciSiap !== false;
      db.sumber = ada ? "sheet" : "katalog";
      db.cek = res.status || {};
      db.info = res.info || null;
      db.versi = res.versi || 1;
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
            if (/Aksi tidak dikenal|Pengaturan tidak dikenal/.test(err.message)) err.message = "Kode Apps Script masih versi lama. Perbarui dulu (README → Memperbarui Apps Script).";
            if (err.kode === "kunci" || err.kode === "belum-ada-kunci") { kunciMem = ""; simpanLokal(K_KUNCI, null); }
            if (err.kode === "belum-ada-kunci") db.kunciSiap = false;
            throw err;
          }
          if (payload.aksi !== "cek" && payload.aksi !== "buatKunci") {
            terapkan(res);
            simpanLokal(K_CACHE, JSON.stringify(res));
            renderSemua();
          }
          return res;
        });
    }

    /* Permintaan baca/tugas ke Apps Script (tidak mengubah tampilan sendiri) */
    function tanya(payload) {
      if (MODE !== "sheet") return Promise.reject(new Error("Fitur ini aktif setelah website tersambung ke Google Sheet."));
      payload.kunci = kunciMem;
      payload.oleh = namaAkun;
      return fetch(BACKEND, { method: "POST", body: JSON.stringify(payload) })
        .then(function (r) { return r.json(); }, function () { throw new Error("Tidak terhubung ke Google Sheet. Periksa internet lalu coba lagi."); })
        .then(function (res) {
          if (!res || !res.ok) {
            var err = new Error((res && res.pesan) || "Permintaan gagal.");
            err.kode = res && res.kode;
            if (err.kode === "kunci" || err.kode === "belum-ada-kunci") { kunciMem = ""; simpanLokal(K_KUNCI, null); }
            if (err.kode === "belum-ada-kunci") db.kunciSiap = false;
            if (/Aksi tidak dikenal|Pengaturan tidak dikenal/.test(err.message)) err.message = "Kode Apps Script masih versi lama. Perbarui dulu (README → Memperbarui Apps Script).";
            throw err;
          }
          return res;
        });
    }
    function terapkanHasil(res) {
      if (res && res.kategori) { terapkan(res); simpanLokal(K_CACHE, JSON.stringify(res)); renderSemua(); }
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
      else if (p.aksi === "tandaiDiperbarui") { var t = null; st.data.forEach(function (d) { if (d.id === p.id) t = d; }); if (t) t.diperbarui = hariIni(); }
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
        var c = db.cek[d.id] || null;
        var tgl = [d.diperbarui || "", (c && c.diubahDrive) || ""].sort().pop();
        var jd = jadwal(d, tgl);
        var rusak = !!(c && c.cek && c.cek !== "ok");
        var bocor = !!(d.terbatas && c && /^ANYONE/.test(c.akses || ""));
        return Object.assign({}, d, {
          _i: i,
          kategori: kats,
          _j: j,
          _tgl: tgl,
          _cek: c,
          _rusak: rusak,
          _bocor: bocor,
          _jadwal: jd,
          _perhatian: rusak || bocor || !!(jd && jd.status !== "aman"),
          _t: norm(d.judul),
          _s: norm([d.judul, d.ket, d.lokasi, j.label, d.pj, kats.map(function (id) { return KAT[id].nama + " " + (KAT[id].namaPanjang || ""); }).join(" ")].join(" "))
        });
      });
    }
    var FREK = { bulanan: { label: "Bulanan", bln: 1 }, triwulan: { label: "Triwulan (3 bulan)", bln: 3 }, semester: { label: "Semester (6 bulan)", bln: 6 }, tahunan: { label: "Tahunan", bln: 12 } };
    function tglISO(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
    function jadwal(d, terakhir) {
      var f = FREK[d.frekuensi];
      if (!f) return null;
      var hari = new Date(); hari.setHours(0, 0, 0, 0);
      if (!terakhir) return { status: "terlambat", jatuhTempo: "", sisaHari: -1, label: f.label };
      var p = terakhir.split("-");
      var jt = new Date(+p[0], +p[1] - 1 + f.bln, +p[2]);
      var sisa = Math.round((jt - hari) / 86400000);
      return { status: sisa < 0 ? "terlambat" : sisa <= 7 ? "segera" : "aman", jatuhTempo: tglISO(jt), sisaHari: sisa, label: f.label };
    }
    function byDateDesc(a, b) { return (b._tgl || "").localeCompare(a._tgl || "") || a._i - b._i; }
    function itemsOf(katId) { return ITEMS.filter(function (d) { return d.kategori.indexOf(katId) > -1; }); }
    function latest(list) { return list.reduce(function (m, d) { return (d._tgl || "") > m ? d._tgl : m; }, ""); }
    function idDrive(u) { var m = String(u || "").match(/\/d\/([\w-]{20,})/) || String(u || "").match(/\/folders\/([\w-]{20,})/) || String(u || "").match(/[?&]id=([\w-]{20,})/); return m ? m[1] : ""; }
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
    function lencanaStatus(d) {
      var h = "";
      if (d._rusak) h += '<span class="badge bad" title="' + esc((d._cek && d._cek.pesan) || "Tautan tidak bisa dibuka") + '">' + ic("alert") + "Tautan bermasalah</span>";
      if (d._bocor) h += '<span class="badge bad" title="Berlabel Terbatas, tetapi di Google Drive bisa dibuka siapa saja yang punya link">' + ic("globe") + "Terbuka publik</span>";
      if (d._jadwal && d._jadwal.status === "terlambat") h += '<span class="badge due" title="Jadwal ' + esc(d._jadwal.label.toLowerCase()) + (d._jadwal.jatuhTempo ? ", seharusnya diperbarui " + esc(fmtDate(d._jadwal.jatuhTempo)) : "") + '">' + ic("clock") + "Perlu diperbarui</span>";
      else if (d._jadwal && d._jadwal.status === "segera") h += '<span class="badge soon" title="Batas pembaruan ' + esc(fmtDate(d._jadwal.jatuhTempo)) + '">' + ic("clock") + "Segera diperbarui</span>";
      return h;
    }
    function infoTanggal(d) {
      if (!d._tgl) return "";
      var dariDrive = d._cek && d._cek.diubahDrive && d._cek.diubahDrive === d._tgl && d._tgl !== d.diperbarui;
      return '<span class="date" title="' + (dariDrive ? "Perubahan terakhir di Google Drive" : "Tanggal data diperbarui") + '">' + ic("calendar") + esc(fmtDate(d._tgl)) + (dariDrive ? " · Drive" : "") + "</span>";
    }
    function renderItem(d, skipKat) {
      var tags = d.kategori.filter(function (id) { return id !== skipKat; }).map(catTag).join("");
      var perluTandai = editing && d._jadwal && d._jadwal.status !== "aman";
      return (
        '<li class="item' + (d._rusak ? " is-bad" : "") + '">' +
        typeBadge(d) +
        '<div class="item-main">' +
        '<div class="item-title"><a href="' + esc(d.url) + '" target="_blank" rel="noopener">' + esc(d.judul) + "</a>" +
        (d.utama ? '<span class="badge main">Folder utama</span>' : "") +
        (d.terbatas ? '<span class="badge lock" title="Memuat data pribadi warga. Izin buka diatur di Google Drive.">' + ic("lock") + "Terbatas</span>" : "") +
        lencanaStatus(d) +
        "</div>" +
        (d.lokasi ? '<p class="item-path">' + esc(d.lokasi) + "</p>" : "") +
        (d.ket ? '<p class="item-ket">' + esc(d.ket) + "</p>" : "") +
        '<div class="item-meta">' + tags + infoTanggal(d) +
        (d._jadwal ? '<span class="sched" title="Jadwal pembaruan">' + ic("cycle") + esc(d._jadwal.label.replace(/ \(.*/, "")) + (d.pj ? " · " + esc(d.pj) : "") + "</span>" : (d.pj ? '<span class="sched">' + ic("users") + esc(d.pj) + "</span>" : "")) +
        "</div>" +
        "</div>" +
        '<div class="item-act">' +
        (perluTandai ? '<button class="btn sm ghost" type="button" data-act="tandai" data-id="' + esc(d.id) + '" title="Catat bahwa data ini sudah diperbarui hari ini">' + ic("check") + "Sudah diperbarui</button>" : "") +
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
      }).join("") + NAV_TETAP.map(function (n) { return '<a href="#' + n[0] + '">' + n[1] + "</a>"; }).join("") +
        '<a href="#/statistik" class="nav-stat">Statistik</a>';
      navA = $$(".nav-links a[href^='#']");
    }

    function renderStats() {
      var html = (db.state.statistik || []).map(function (s) {
        return '<div class="stat"><p class="stat-label">' + esc(s.label) + '</p><p class="stat-val"><b>' + esc(s.nilai) + "</b><span>" + esc(s.satuan) + '</span></p><p class="stat-ket">' + esc(s.ket) + "</p></div>";
      }).join("");
      html += '<div class="stat own"><p class="stat-label">Terdokumentasi</p><p class="stat-val"><b>' + ITEMS.length + '</b><span>tautan</span></p><p class="stat-ket">dalam ' + KATS.length + " kategori data</p></div>";
      $("#stats").innerHTML = html;
      $("#stats-src").innerHTML = (db.state.statistikSumber ? "<span>Sumber: " + esc(db.state.statistikSumber) + "</span> " : "") +
        '<a class="stats-more" href="#/statistik">' + ic("chart") + "Lihat dasbor statistik penduduk</a>" +
        (editing ? ' <button class="btn sm ghost" type="button" data-act="edit-stat">' + ic("pencil") + "Ubah angka</button>" : "");
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
    var cat = { q: "", kat: "semua", grup: "semua", sort: "baru", limit: 12, perhatian: false };
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
      var nPerhatian = base.filter(function (d) { return d._perhatian; }).length;
      if (!nPerhatian) cat.perhatian = false;
      if (cat.perhatian) base = base.filter(function (d) { return d._perhatian; });
      var found = search(base, cat.q);
      var counts = { semua: found.length };
      found.forEach(function (d) { counts[d._j.grup] = (counts[d._j.grup] || 0) + 1; });

      $("#f-jenis").innerHTML = GRUP.map(function (g) {
        var n = counts[g.id] || 0;
        if (g.id !== "semua" && !n && cat.grup !== g.id) return "";
        return '<button class="chip" type="button" data-grup="' + g.id + '" aria-pressed="' + (cat.grup === g.id) + '">' + esc(g.label) + ' <span class="n">' + n + "</span></button>";
      }).join("") + (nPerhatian ? '<span class="chip-sep" aria-hidden="true"></span><button class="chip warn" type="button" data-perhatian="1" aria-pressed="' + cat.perhatian + '">' + ic("alert") + "Perlu perhatian <span class=\"n\">" + nPerhatian + "</span></button>" : "");

      var list = cat.grup === "semua" ? found : found.filter(function (d) { return d._j.grup === cat.grup; });
      list = sortList(list, cat.sort, cat.q.trim());

      var shown = list.slice(0, cat.limit);
      $("#list").innerHTML = shown.length ? shown.map(function (d) { return renderItem(d); }).join("") : emptyState(cat.q, "reset-cat");
      var more = $("#more");
      var rest = list.length - shown.length;
      more.hidden = rest <= 0;
      more.textContent = "Tampilkan " + rest + " tautan lainnya";
      $("#katalog-note").textContent = list.length === ITEMS.length && !cat.perhatian
        ? ITEMS.length + " tautan tercatat." + (db.sumber === "sheet" || db.sumber === "cache" ? " Tersambung ke Google Sheet." : "")
        : list.length + " dari " + ITEMS.length + " tautan cocok dengan saringan.";
      var r = $("#reset-cat");
      if (r) r.addEventListener("click", resetCatalog);
      $("#katalog-add").hidden = !editing;
    }
    function resetCatalog() {
      cat.q = ""; cat.kat = "semua"; cat.grup = "semua"; cat.limit = 12; cat.perhatian = false;
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
      if (e.target.closest("[data-perhatian]")) { cat.perhatian = !cat.perhatian; cat.limit = 12; renderCatalog(); return; }
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
        ? (db.versi === 1
          ? '<button class="eb-mode warn" type="button" data-act="versi-lama">' + ic("alert") + "Apps Script perlu diperbarui</button>"
          : '<span class="eb-mode ok">' + ic("database") + "Tersimpan ke Google Sheet</span>")
        : '<span class="eb-mode uji">' + ic("key") + "Mode uji · hanya di browser ini</span>";
      var nf = db.info || {};
      var nPerhatian = ITEMS.filter(function (d) { return d._perhatian; }).length + masalahLain().length;
      function hit(n) { return n ? '<span class="eb-n">' + (n > 99 ? "99+" : n) + "</span>" : ""; }
      bar.innerHTML =
        '<div class="eb-inner">' + info +
        '<div class="eb-actions">' +
        '<button class="btn sm" type="button" data-act="add-item">' + ic("plus") + "Tautan</button>" +
        '<button class="btn sm" type="button" data-act="unggah">' + ic("upload") + "Unggah</button>" +
        '<button class="btn sm ghost" type="button" data-act="add-kat">' + ic("plus") + "Kategori</button>" +
        '<button class="btn sm ghost" type="button" data-act="panel-kotak" aria-label="Kotak masuk">' + ic("inbox") + 'Kotak<span class="m-hide"> masuk</span>' + hit(nf.kotakBaru) + "</button>" +
        '<button class="btn sm ghost" type="button" data-act="panel-perhatian" aria-label="Perlu perhatian">' + ic("alert") + '<span class="m-hide">Perlu perhatian</span><span class="m-show">Perhatian</span>' + hit(nPerhatian) + "</button>" +
        '<div class="eb-more"><button class="btn sm ghost" type="button" data-act="lainnya" aria-expanded="false" aria-haspopup="true">' + ic("dots") + "Lainnya</button>" +
        '<div class="eb-menu" role="menu" hidden>' +
        '<button type="button" role="menuitem" data-act="edit-stat">' + ic("chart") + "Angka beranda</button>" +
        '<button type="button" role="menuitem" data-act="edit-menu">' + ic("menu") + "Menu atas</button>" +
        '<button type="button" role="menuitem" data-act="panel-log">' + ic("history") + "Riwayat, sampah &amp; cadangan</button>" +
        '<button type="button" role="menuitem" data-act="panel-atur">' + ic("gear") + "Pengaturan otomatis</button>" +
        (S.backend && S.backend.sheet ? '<a role="menuitem" href="' + esc(S.backend.sheet) + '" target="_blank" rel="noopener">' + ic("sheet") + "Buka spreadsheet database</a>" : "") +
        "</div></div>" +
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
    var viewHome = $("#view-home"), viewKat = $("#view-kategori"), viewStat = $("#view-statistik");
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
        (editing ? '<button class="btn gold" type="button" data-act="add-item" data-kat="' + esc(id) + '">' + ic("plus") + 'Tambah tautan di sini</button><button class="btn" type="button" data-act="unggah" data-kat="' + esc(id) + '">' + ic("upload") + 'Unggah berkas ke sini</button><button class="btn ghost" type="button" data-act="edit-kat" data-id="' + esc(id) + '">' + ic("pencil") + "Ubah kategori</button>" : "") +
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
      viewStat.hidden = true;
      viewKat.hidden = false;
      document.title = k.nama + " · Satu Data Desa Sumber Sari";
      if (!pertahankan) window.scrollTo(0, 0);
      setActiveNav(null);
    }

    function showHome(hash) {
      var wasKat = !viewKat.hidden || !viewStat.hidden;
      katAktif = null;
      viewKat.hidden = true;
      viewStat.hidden = true;
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
      else if (/^#\/statistik/.test(location.hash)) showDasbor();
      else showHome(location.hash);
    }

    /* =================================================================
       DASBOR STATISTIK PENDUDUK (angka ringkasan dari Apps Script)
       ================================================================= */
    var dasbor = { data: null, memuat: false, galat: "", waktu: 0 };
    try {
      var dc = JSON.parse(simpanLokal("sdds-dasbor") || "null");
      if (dc && dc.ok && dc.total) { dasbor.data = dc; }
    } catch (e) { /* abaikan */ }
    function muatDasbor(paksa) {
      if (MODE !== "sheet") { renderDasbor(); return; }
      if (dasbor.memuat) return;
      if (!paksa && dasbor.data && dasbor.waktu && Date.now() - dasbor.waktu < 10 * 60 * 1000) return;
      dasbor.memuat = true;
      renderDasbor();
      fetch(BACKEND + (BACKEND.indexOf("?") > -1 ? "&" : "?") + "aksi=dasbor&t=" + Date.now())
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.ok && res.total == null && res.kategori) throw new Error("versi-lama");
          if (!res || !res.ok) throw new Error((res && res.pesan) || "Dasbor belum tersedia.");
          dasbor.data = res; dasbor.galat = ""; dasbor.waktu = Date.now();
          simpanLokal("sdds-dasbor", JSON.stringify(res));
        })
        .catch(function (err) {
          dasbor.galat = err && err.message === "versi-lama" ? "versi-lama" : (err && err.message) || "Dasbor belum bisa dimuat.";
          if (err && err.message === "Failed to fetch") dasbor.galat = "Tidak terhubung ke Google Sheet. Periksa internet lalu coba lagi.";
        })
        .then(function () { dasbor.memuat = false; renderDasbor(); });
    }
    function hitungUlangDasbor(btn) {
      if (!butuhV2("Hitung ulang dasbor")) return;
      tombolTugas(btn, "dasbor", null, "Dasbor dihitung ulang", function () { muatDasbor(true); });
    }
    function renderDasbor() {
      if (viewStat.hidden || !window.SDDSDasbor) return;
      var sumber = db.state.dasborSumber || ((db.state.menu || [])[0] || {}).url || "";
      window.SDDSDasbor.render(viewStat, {
        data: dasbor.data, memuat: dasbor.memuat, galat: dasbor.galat,
        mode: MODE, editing: editing, sumberUrl: sumber,
        ic: ic, esc: esc, fmtDate: fmtDate, fmtAngka: fmtAngka, teksPerbarui: teksPerbarui
      });
    }
    function showDasbor() {
      var dariLain = viewStat.hidden;
      katAktif = null;
      viewHome.hidden = true;
      viewKat.hidden = true;
      viewStat.hidden = false;
      document.title = "Statistik Penduduk · Satu Data Desa Sumber Sari";
      if (dariLain) window.scrollTo(0, 0);
      setActiveNav(null);
      var a = $(".nav-stat");
      if (a) a.classList.add("aktif");
      renderDasbor();
      muatDasbor(false);
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
      if (!viewStat.hidden) { var an = $(".nav-stat"); if (an) an.classList.add("aktif"); renderDasbor(); }
      if (qHero.value.trim() && !sug.hidden) renderSug();
    }

    /* =================================================================
       DIALOG (formulir mode edit)
       ================================================================= */
    var dlg = $("#dlg");
    function bukaDialog(html, lebar) {
      dlg.classList.toggle("wide", !!lebar);
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
        if (err && err.kode === "belum-ada-kunci") { tutupDialog(); editing = false; renderSemua(); dialogBuatKunci(); return; }
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
    var AKSES_LABEL = { ANYONE: "Publik (siapa saja)", ANYONE_WITH_LINK: "Siapa saja yang punya link", DOMAIN: "Organisasi", DOMAIN_WITH_LINK: "Organisasi (dengan link)", PRIVATE: "Dibatasi" };
    function jenisDariMime(mime, nama) {
      var m = String(mime || ""), n = String(nama || "").toLowerCase();
      if (m === "application/vnd.google-apps.folder") return "folder";
      if (m === "application/vnd.google-apps.spreadsheet") return "sheet";
      if (m === "application/vnd.google-apps.document") return "docx";
      if (m === "application/vnd.google-apps.presentation") return "slide";
      if (m === "application/pdf" || /\.pdf$/.test(n)) return "pdf";
      if (/spreadsheetml|ms-excel|csv/.test(m) || /\.(xlsx?|csv)$/.test(n)) return "xlsx";
      if (/wordprocessingml|msword|opendocument\.text/.test(m) || /\.docx?$/.test(n)) return "docx";
      if (/presentationml|powerpoint/.test(m) || /\.pptx?$/.test(n)) return "slide";
      if (/^image\//.test(m) || /\.(jpe?g|png|webp|gif|heic)$/.test(n)) return "gambar";
      if (/^video\//.test(m) || /\.(mp4|mov|3gp|mkv)$/.test(n)) return "video";
      return "tautan";
    }
    function opsiFrekuensi(nilai) {
      return '<option value="">Tidak dijadwalkan</option>' + Object.keys(FREK).map(function (k) {
        return '<option value="' + k + '"' + (nilai === k ? " selected" : "") + ">" + esc(FREK[k].label) + "</option>";
      }).join("");
    }
    function dialogItem(item, presetKat, opsi) {
      opsi = opsi || {};
      var baru = !item;
      var d = item ? clone(item) : Object.assign({ id: uid("i"), judul: "", kategori: presetKat && KAT[presetKat] ? [presetKat] : [], jenis: "folder", url: "", lokasi: "", diperbarui: hariIni(), ket: "", terbatas: false, utama: false, unggulan: false, frekuensi: "", pj: "", pjEmail: "" }, opsi.awal || {});
      var pilihKat = KATS.map(function (k) {
        var on = (d.kategori || []).indexOf(k.id) > -1;
        return '<label class="pick" style="--c:' + esc(k.warna) + '"><input type="checkbox" name="fi-kat" value="' + esc(k.id) + '"' + (on ? " checked" : "") + "><span>" + ic(k.ikon) + esc(k.nama) + "</span></label>";
      }).join("");
      var opsiJenis = Object.keys(JENIS).map(function (j) { return '<option value="' + j + '"' + (d.jenis === j ? " selected" : "") + ">" + esc(JENIS[j].label) + "</option>"; }).join("");
      bukaDialog(
        '<form class="dlg-form" id="dlgf-item" novalidate>' +
        kepala(baru ? (opsi.judulDialog || "Tambah tautan") : "Ubah tautan", baru ? (opsi.subDialog || "Tautan baru ke Google Drive") : d.judul) +
        '<div class="dlg-body">' +
        bidang("fi-url", "Link Google Drive", '<input id="fi-url" type="url" inputmode="url" autocomplete="off" value="' + esc(d.url) + '" placeholder="https://drive.google.com/…">', "Di Drive: klik kanan berkas/folder → <b>Bagikan</b> → <b>Salin link</b>, lalu tempel di sini." + (v2() ? " Judul, jenis, tanggal, dan letak terisi otomatis." : "") + '<span class="detect" id="fi-detect"></span>') +
        '<div class="fi-info" id="fi-info" role="status" hidden></div>' +
        bidang("fi-judul", "Judul data", '<input id="fi-judul" type="text" autocomplete="off" value="' + esc(d.judul) + '" placeholder="mis. Data DTSEN Desil 2">') +
        '<div class="gf-row">' +
        bidang("fi-jenis", "Jenis", '<select id="fi-jenis">' + opsiJenis + "</select>") +
        bidang("fi-tgl", "Tanggal diperbarui", '<input id="fi-tgl" type="date" value="' + esc(d.diperbarui || hariIni()) + '">') +
        "</div>" +
        '<fieldset class="gf"><legend>Kategori</legend><div class="picks">' + (pilihKat || '<p class="gf-hint">Belum ada kategori.</p>') + "</div></fieldset>" +
        bidang("fi-lokasi", "Letak di Drive (opsional)", '<input id="fi-lokasi" type="text" autocomplete="off" value="' + esc(d.lokasi) + '" placeholder="mis. DESA CANTIK / Kegiatan Statistik / 4. Pengumpulan Data">') +
        bidang("fi-ket", "Keterangan (opsional)", '<textarea id="fi-ket" rows="2" placeholder="Isi singkat berkas ini">' + esc(d.ket) + "</textarea>") +
        (MODE === "sheet" && !v2() ? '<p class="gf-hint">' + ic("alert") + " Jadwal pembaruan & penanggung jawab aktif setelah Apps Script diperbarui ke versi 2.</p>" : "") +
        '<fieldset class="gf jadwal-box"' + (MODE === "sheet" && !v2() ? " hidden" : "") + '><legend>' + ic("cycle") + "Jadwal pembaruan (opsional)</legend>" +
        '<div class="gf-row">' +
        bidang("fi-frek", "Diperbarui setiap", '<select id="fi-frek">' + opsiFrekuensi(d.frekuensi) + "</select>") +
        bidang("fi-pj", "Penanggung jawab", '<input id="fi-pj" type="text" autocomplete="off" maxlength="80" value="' + esc(d.pj) + '" placeholder="mis. Bu Eni (Posyandu)">') +
        "</div>" +
        bidang("fi-pjmail", "Email penanggung jawab", '<input id="fi-pjmail" type="email" autocomplete="off" value="' + esc(d.pjEmail) + '" placeholder="nama@gmail.com">', "Bila diisi, pengingat dikirim ke email ini setiap minggu saat data lewat jadwal.") +
        "</fieldset>" +
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
      var form = $("#dlgf-item"), fUrl = $("#fi-url"), fJenis = $("#fi-jenis"), det = $("#fi-detect"), fInfo = $("#fi-info");
      var jenisDisentuh = false, judulOtomatis = baru && !d.judul ? "" : null, lokasiOtomatis = baru && !d.lokasi ? "" : null, tglDisentuh = !baru || !!opsi.awal;
      fJenis.addEventListener("change", function () { jenisDisentuh = true; });
      $("#fi-tgl").addEventListener("change", function () { tglDisentuh = true; });
      function cekUrl(terapkanJenis) {
        var j = deteksiJenis(fUrl.value);
        det.textContent = j ? "Terdeteksi: " + JENIS[j].label : "";
        if (j && terapkanJenis && !jenisDisentuh) fJenis.value = j;
      }
      var infoTimer, infoUrl = "";
      function tampilInfo(html, kelas) { fInfo.innerHTML = html; fInfo.className = "fi-info" + (kelas ? " " + kelas : ""); fInfo.hidden = !html; }
      function bacaDrive() {
        var u = fUrl.value.trim();
        if (!v2() || !urlValid(u) || !idDrive(u) || u === infoUrl) return;
        infoUrl = u;
        tampilInfo('<span class="spin" aria-hidden="true"></span>Membaca info dari Google Drive…', "muat");
        tanya({ aksi: "infoTautan", url: u }).then(function (r) {
          if (fUrl.value.trim() !== u || !r.drive) { if (!r.drive) tampilInfo(""); return; }
          var jJudul = $("#fi-judul");
          var namaBersih = r.folder ? r.nama : r.nama.replace(/\.[a-z0-9]{2,5}$/i, "");
          if (judulOtomatis !== null && (jJudul.value.trim() === "" || jJudul.value === judulOtomatis)) { jJudul.value = namaBersih; judulOtomatis = namaBersih; }
          if (!jenisDisentuh && JENIS[r.jenis]) { fJenis.value = r.jenis; det.textContent = "Terdeteksi: " + JENIS[r.jenis].label; }
          if (!tglDisentuh && r.diubah) $("#fi-tgl").value = r.diubah;
          var fl = $("#fi-lokasi");
          if (lokasiOtomatis !== null && (fl.value.trim() === "" || fl.value === lokasiOtomatis) && r.lokasi) { fl.value = r.lokasi; lokasiOtomatis = r.lokasi; }
          var publik = /^ANYONE/.test(r.akses || "");
          var warn = r.dihapus ? "Berkas ini ada di <b>sampah Google Drive</b>." : "";
          tampilInfo(ic(r.folder ? "folder" : "file") + '<span><b>' + esc(r.nama) + "</b> · diubah " + esc(fmtDate(r.diubah)) + " · akses: " + esc(AKSES_LABEL[r.akses] || r.akses || "–") +
            (warn ? "<br>" + warn : "") + '<span class="fi-warn" id="fi-bocor"' + (publik ? "" : " hidden") + '><br>' + ic("globe") + "Berkas ini bisa dibuka siapa saja yang punya link. Bila memuat data pribadi, ubah aksesnya ke <b>Dibatasi</b> di Drive.</span></span>", r.dihapus ? "warn" : "ok");
        }, function (err) {
          if (fUrl.value.trim() !== u) return;
          tampilInfo(ic("alert") + "<span>" + esc(err.message) + "</span>", "warn");
        });
      }
      fUrl.addEventListener("input", function () { cekUrl(true); clearTimeout(infoTimer); infoTimer = setTimeout(bacaDrive, 650); });
      cekUrl(baru);
      if (baru && fUrl.value) setTimeout(bacaDrive, 50);
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var judul = $("#fi-judul").value.trim(), url = fUrl.value.trim(), mail = $("#fi-pjmail").value.trim();
        if (!url || !urlValid(url)) return tampilGalat(form, "Tempel link lengkap yang diawali https://");
        if (!judul) return tampilGalat(form, "Isi judul data supaya mudah dicari.");
        if (mail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) return tampilGalat(form, "Email penanggung jawab belum benar.");
        var baruItem = {
          id: d.id, judul: judul, url: url, jenis: fJenis.value,
          kategori: $$("input[name=fi-kat]:checked", form).map(function (x) { return x.value; }),
          diperbarui: $("#fi-tgl").value || hariIni(),
          lokasi: $("#fi-lokasi").value.trim(), ket: $("#fi-ket").value.trim(),
          terbatas: $("#fi-terbatas").checked, utama: $("#fi-utama").checked, unggulan: $("#fi-unggulan").checked,
          frekuensi: $("#fi-frek").value, pj: $("#fi-pj").value.trim(), pjEmail: mail
        };
        prosesSimpan(form, function () { return kirim({ aksi: "simpanItem", item: baruItem, baru: baru }); }, baru ? "Tautan ditambahkan" : "Tautan disimpan")
          .then(function () { if (!dlg.open && opsi.setelah) opsi.setelah(); });
      });
      pasangHapus(form, "Yakin hapus? Klik lagi", function () { return kirim({ aksi: "hapusItem", id: d.id, judul: d.judul }); }, v2() ? "Tautan dipindah ke sampah (bisa dipulihkan 30 hari)" : "Tautan dihapus");
    }

    /* ---------- kategori ---------- */
    function dialogKategori(k) {
      var baru = !k;
      var d = k ? clone(k) : { id: "", nama: "", namaPanjang: "", deskripsi: "", ikon: "folder", warna: WARNA[KATS.length % WARNA.length], sorot: false, folder: "" };
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
        (MODE === "sheet" && !v2() ? "" : bidang("fk-folder", "Folder unggahan (opsional)", '<input id="fk-folder" type="url" inputmode="url" autocomplete="off" value="' + esc(d.folder || "") + '" placeholder="https://drive.google.com/drive/folders/…">', "Berkas yang diunggah lewat SDDS ke kategori ini disimpan di folder ini. Kosongkan untuk memakai folder utama kategori.")) +
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
        var nama = $("#fk-nama").value.trim(), folder = $("#fk-folder") ? $("#fk-folder").value.trim() : (d.folder || "");
        if (!nama) return tampilGalat(form, "Isi nama kategori.");
        if (folder && !urlValid(folder)) return tampilGalat(form, "Link folder unggahan harus lengkap (https://…).");
        var id = d.id;
        if (baru) {
          id = slug(nama);
          var dasar = id, n = 2;
          while (KAT[id]) id = dasar + "-" + n++;
        }
        var kat = {
          id: id, nama: nama, namaPanjang: $("#fk-panjang").value.trim(), deskripsi: $("#fk-desk").value.trim(),
          ikon: ($("input[name=fk-ikon]:checked", form) || {}).value || "folder", warna: nilaiWarna(), sorot: $("#fk-sorot").checked, folder: folder
        };
        prosesSimpan(form, function () {
          return kirim({ aksi: "simpanKategori", kategori: kat, baru: baru }).then(function () {
            if (baru) location.hash = "#/k/" + id;
          });
        }, baru ? "Kategori dibuat — sekarang tambahkan tautannya" : "Kategori disimpan");
      });
      pasangHapus(form, jumlah ? "Yakin? " + jumlah + " tautan akan dilepas dari kategori ini" : "Yakin hapus? Klik lagi",
        function () { return kirim({ aksi: "hapusKategori", id: d.id, nama: d.nama }); }, v2() ? "Kategori dipindah ke sampah (bisa dipulihkan 30 hari)" : "Kategori dihapus");
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
        bidang("fkey", "Kunci editor", '<input id="fkey" type="password" autocomplete="off">', "Minta kunci editor ke admin desa. Kunci dibuat saat website pertama kali tersambung ke Google Sheet.") +
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
          if (err && err.kode === "belum-ada-kunci") { db.kunciSiap = false; dialogBuatKunci(setelahKunci); return; }
          tampilGalat(form, (err && err.message) || "Kunci tidak bisa diperiksa.");
        });
      });
    }
    function dialogBuatKunci(lanjut) {
      bukaDialog(
        '<form class="dlg-form" id="dlgf-buatkunci" novalidate>' +
        kepala("Buat kunci editor", "Langkah pertama setelah website tersambung ke Google Sheet") +
        '<div class="dlg-body"><p>Kunci editor dipakai semua perangkat desa untuk menyimpan perubahan dari website. Buat sekali di sini, lalu bagikan hanya kepada perangkat yang boleh mengedit.</p>' +
        bidang("fbk-1", "Kunci editor baru", '<input id="fbk-1" type="password" autocomplete="new-password" minlength="8">', "Minimal 8 karakter. Jangan sama dengan kata sandi Gmail.") +
        bidang("fbk-2", "Ulangi kunci editor", '<input id="fbk-2" type="password" autocomplete="new-password">') +
        '<p class="gate-err dlg-err" role="alert" hidden></p></div>' +
        kaki("", "Buat kunci") + "</form>"
      );
      var form = $("#dlgf-buatkunci");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var k1 = $("#fbk-1").value.trim(), k2 = $("#fbk-2").value.trim();
        if (k1.length < 8) return tampilGalat(form, "Kunci minimal 8 karakter.");
        if (k1 !== k2) return tampilGalat(form, "Kedua kunci belum sama.");
        var b = $("[data-simpan]", form); b.disabled = true; b.textContent = "Menyimpan…";
        kirim({ aksi: "buatKunci", kunciBaru: k1 }).then(function () {
          kunciMem = k1; simpanLokal(K_KUNCI, k1); db.kunciSiap = true;
          tutupDialog();
          nyalakanEdit();
          toast("Kunci editor dibuat", "check");
          if (db.kosong) impor(); else if (lanjut) lanjut();
        }, function (err) {
          b.disabled = false; b.textContent = "Buat kunci";
          tampilGalat(form, (err && err.message) || "Kunci belum bisa dibuat.");
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
      if (!db.kunciSiap) { kunciMem = ""; simpanLokal(K_KUNCI, null); dialogBuatKunci(lanjut); return; }
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
          return kirim({ aksi: "impor", kategori: st.kategori, data: st.data, pengaturan: { alur: st.alur, menu: st.menu, statistik: st.statistik, statistikSumber: st.statistikSumber } });
        }, "Data awal masuk ke Google Sheet");
      });
    }

    /* =================================================================
       PENGELOLA: unggah, kotak masuk, perlu perhatian, riwayat, pengaturan
       ================================================================= */
    var fmtAngka = (function () {
      var f;
      try { f = new Intl.NumberFormat("id-ID"); } catch (e) { f = null; }
      return function (n) { return f ? f.format(n) : String(n); };
    })();
    function teksPerbarui() {
      return '<p>Website sudah memakai fitur baru, tetapi kode Apps Script di spreadsheet masih versi lama. Perbarui sekali (±5 menit):</p><ol class="langkah">' +
        "<li>Buka spreadsheet <b>SDDS – Database Katalog</b> → <b>Ekstensi → Apps Script</b>.</li>" +
        "<li>Hapus semua isi editor, tempel isi terbaru <code>apps-script/Kode.gs</code> dari GitHub, lalu klik <b>Simpan</b>.</li>" +
        "<li>Di bilah atas editor pilih fungsi <b>aktifkanOtomatis</b> → <b>Jalankan</b> → <b>Izinkan</b>.</li>" +
        "<li><b>Terapkan → Kelola deployment</b> → ikon pensil → Versi: <b>Versi baru</b> → <b>Terapkan</b>.</li></ol>" +
        "<p>Setelah itu muat ulang halaman ini.</p>";
    }
    function butuhV2(judul) {
      if (v2()) return true;
      bukaDialog('<div class="dlg-form" id="dlgf-v2">' + kepala(judul, MODE === "sheet" ? "Apps Script perlu diperbarui" : "Website belum tersambung ke Google Sheet") +
        '<div class="dlg-body">' + (MODE === "sheet" ? teksPerbarui()
          : "<p>Fitur ini bekerja lewat Google Apps Script yang tersambung ke Google Drive desa, jadi belum bisa dipakai di mode uji.</p><p>Sambungkan website ke spreadsheet <b>SDDS – Database Katalog</b> lebih dulu (README bagian <i>Mode edit</i>).</p>") +
        '</div><div class="dlg-foot"><div></div><div class="dlg-foot-r"><button class="btn" type="button" data-act="dlg-close">Mengerti</button></div></div></div>');
      return false;
    }
    function masalahLain() {
      var out = [];
      (db.state.alur || []).forEach(function (a, i) {
        (a.tautan || []).forEach(function (t, j) {
          var c = db.cek["alur:" + i + ":" + j];
          if (c && c.cek && c.cek !== "ok") out.push({ judul: "Alur " + (i + 1) + ". " + (a.fase || "") + " — " + t.label, url: t.url, pesan: c.pesan, act: 'data-act="edit-alur" data-i="' + i + '" data-j="' + j + '"' });
        });
      });
      (db.state.menu || []).forEach(function (m, i) {
        var c = db.cek["menu:" + i];
        if (c && c.cek && c.cek !== "ok") out.push({ judul: "Menu atas — " + m.label, url: m.url, pesan: c.pesan, act: 'data-act="edit-menu"' });
      });
      return out;
    }

    /* ---------- tugas panjang (dijalankan bertahap ±20 detik per langkah) ---------- */
    function jalankanTugas(tugas, elStatus) {
      var putaran = 0;
      function teks(p) {
        if (!p) return "Memproses…";
        if (tugas === "cek") return "Memeriksa tautan " + (p.i || 0) + " dari " + (p.total || "?") + "…";
        if (tugas === "pindaiPenuh") return "Memindai folder " + (p.folderSelesai || 0) + " dari " + (p.folderTotal || "?") + " · " + (p.ditemukan || 0) + " berkas ditemukan…";
        return "Memproses…";
      }
      function langkah() {
        putaran++;
        return tanya({ aksi: "jalankan", tugas: tugas, mulaiBaru: putaran === 1 }).then(function (res) {
          if (res.selesai) { terapkanHasil(res); return res; }
          if (elStatus) elStatus.textContent = teks(res.progres);
          if (putaran >= 60) throw new Error("Proses masih berjalan. Sisanya dilanjutkan otomatis oleh jadwal harian.");
          return langkah();
        });
      }
      if (elStatus) elStatus.textContent = teks(null);
      return langkah();
    }
    function tombolTugas(btn, tugas, elStatus, pesanOk, lalu) {
      var label = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="spin" aria-hidden="true"></span>Berjalan…';
      if (elStatus) elStatus.classList.remove("err");
      jalankanTugas(tugas, elStatus).then(function (res) {
        btn.disabled = false; btn.innerHTML = label;
        if (elStatus) elStatus.textContent = "";
        toast(typeof pesanOk === "function" ? pesanOk(res) : pesanOk, "check");
        if (lalu) lalu(res);
      }, function (err) {
        btn.disabled = false; btn.innerHTML = label;
        if (elStatus) { elStatus.textContent = err.message; elStatus.classList.add("err"); }
      });
    }
    function panel(id, judul, sub, isi, kakiHtml) {
      bukaDialog('<div class="dlg-form panel" id="' + id + '">' + kepala(judul, sub) + '<div class="dlg-body">' + isi + "</div>" + (kakiHtml ? '<div class="dlg-foot">' + kakiHtml + "</div>" : "") + "</div>", true);
    }
    function tabBar(aktif, tabs) {
      return '<div class="tabs" role="tablist">' + tabs.map(function (t) {
        return '<button type="button" role="tab" data-tab="' + t[0] + '" aria-selected="' + (aktif === t[0]) + '">' + esc(t[1]) + (t[2] != null ? ' <span class="n">' + t[2] + "</span>" : "") + "</button>";
      }).join("") + "</div>";
    }

    /* ---------- perlu perhatian ---------- */
    function panelPerhatian() {
      var rusak = ITEMS.filter(function (d) { return d._rusak; });
      var bocor = ITEMS.filter(function (d) { return d._bocor; });
      var telat = ITEMS.filter(function (d) { return d._jadwal && d._jadwal.status === "terlambat"; }).sort(function (a, b) { return a._jadwal.sisaHari - b._jadwal.sisaHari; });
      var segera = ITEMS.filter(function (d) { return d._jadwal && d._jadwal.status === "segera"; }).sort(function (a, b) { return a._jadwal.sisaHari - b._jadwal.sisaHari; });
      var lain = masalahLain();
      var nf = db.info || {};
      function baris(d, jenis) {
        var ket = jenis === "rusak" ? ((d._cek && d._cek.pesan) || "Tautan tidak bisa dibuka")
          : jenis === "bocor" ? "Di Google Drive bisa dibuka siapa saja yang punya link. Buka berkas → Bagikan → Akses umum: Dibatasi."
          : jenis === "telat" ? "Jadwal " + d._jadwal.label.toLowerCase() + (d._jadwal.jatuhTempo ? " · seharusnya diperbarui " + fmtDate(d._jadwal.jatuhTempo) : " · belum ada tanggal") + (d.pj ? " · PJ: " + d.pj : "")
          : "Batas " + fmtDate(d._jadwal.jatuhTempo) + " (" + d._jadwal.sisaHari + " hari lagi)" + (d.pj ? " · PJ: " + d.pj : "");
        var ikon = jenis === "bocor" ? "globe" : jenis === "rusak" ? "alert" : "clock";
        return '<li class="pr-row"><span class="pr-ico ' + jenis + '">' + ic(ikon) + "</span>" +
          '<div class="pr-main"><a href="' + esc(d.url) + '" target="_blank" rel="noopener">' + esc(d.judul) + "</a><p>" + esc(ket) + "</p></div>" +
          '<div class="pr-act">' +
          (jenis === "telat" || jenis === "segera" ? '<button class="btn sm ghost" type="button" data-act="tandai" data-id="' + esc(d.id) + '">' + ic("check") + "Sudah diperbarui</button>" : "") +
          (jenis === "bocor" ? '<a class="btn sm ghost" href="' + esc(d.url) + '" target="_blank" rel="noopener">' + ic("external") + "Buka di Drive</a>"
            : '<button class="btn sm ghost" type="button" data-act="edit-item" data-id="' + esc(d.id) + '">' + ic("pencil") + "Ubah</button>") +
          "</div></li>";
      }
      function grup(judul, arr, jenis, catatan) {
        if (!arr.length) return "";
        return '<section class="pr-grup"><h3>' + esc(judul) + ' <span class="n">' + arr.length + "</span></h3>" + (catatan ? '<p class="gf-hint">' + catatan + "</p>" : "") +
          '<ul class="pr-list">' + arr.map(function (d) { return baris(d, jenis); }).join("") + "</ul></section>";
      }
      var lainHtml = lain.length ? '<section class="pr-grup"><h3>Link alur &amp; menu bermasalah <span class="n">' + lain.length + '</span></h3><ul class="pr-list">' + lain.map(function (x) {
        return '<li class="pr-row"><span class="pr-ico rusak">' + ic("alert") + '</span><div class="pr-main"><a href="' + esc(x.url) + '" target="_blank" rel="noopener">' + esc(x.judul) + "</a><p>" + esc(x.pesan || "Tautan tidak bisa dibuka") + '</p></div><div class="pr-act"><button class="btn sm ghost" type="button" ' + x.act + ">" + ic("pencil") + "Ubah</button></div></li>";
      }).join("") + "</ul></section>" : "";
      var total = rusak.length + bocor.length + telat.length + segera.length + lain.length;
      var isi = (total
        ? grup("Tautan bermasalah", rusak, "rusak", "Berkas terhapus, dipindah, atau akun pengelola SDDS tidak punya akses. Ganti link-nya lewat <b>Ubah</b>.") + lainHtml +
          grup("Berlabel Terbatas tapi terbuka publik", bocor, "bocor", "Berkas berisi data pribadi sebaiknya diatur <b>Dibatasi</b> di Google Drive.") +
          grup("Perlu diperbarui", telat, "telat") + grup("Segera diperbarui (7 hari lagi)", segera, "segera")
        : '<div class="kosong-besar">' + ic("check") + "<h3>Semua beres</h3><p>Tidak ada tautan rusak dan tidak ada data yang lewat jadwal pembaruan.</p></div>") +
        (!v2() ? '<p class="gf-hint">' + (MODE === "sheet" ? "Pemeriksaan tautan otomatis aktif setelah Apps Script diperbarui ke versi 2." : "Pemeriksaan tautan otomatis aktif setelah website tersambung ke Google Sheet. Di mode uji, yang diperiksa hanya jadwal pembaruan.") + "</p>" : "") +
        '<p class="gf-hint">Jadwal pembaruan dan penanggung jawab diatur lewat tombol <b>Ubah</b> di setiap data. Pengingat dikirim ke email setiap minggu.</p>';
      var kakiHtml = '<div class="job"><span class="job-info">' + (v2() ? (nf.cekTerakhir ? "Pemeriksaan terakhir: " + esc(nf.cekTerakhir) : "Tautan belum pernah diperiksa") : "") + '</span><span class="job-status" id="pr-status" role="status"></span></div>' +
        '<div class="dlg-foot-r">' + (v2() ? '<button class="btn ghost" type="button" id="pr-cek">' + ic("cycle") + "Periksa semua tautan</button>" : "") + '<button class="btn" type="button" data-act="dlg-close">Tutup</button></div>';
      panel("panel-perhatian", "Perlu perhatian", total ? total + " hal perlu ditindaklanjuti" : "Kesehatan data desa", isi, kakiHtml);
      var b = $("#pr-cek");
      if (b) b.addEventListener("click", function () {
        tombolTugas(b, "cek", $("#pr-status"), function (r) { return "Selesai: " + ((r.progres && r.progres.total) || 0) + " tautan diperiksa"; }, function () { if (dlg.open && $("#panel-perhatian")) panelPerhatian(); });
      });
    }

    /* ---------- kotak masuk ---------- */
    var kotakTab = "baru";
    function panelKotak() {
      if (!butuhV2("Kotak masuk")) return;
      var nf = db.info || {};
      panel("panel-kotak", "Kotak masuk", "Berkas di Google Drive desa yang belum dicatat di SDDS",
        '<div class="muat-besar"><span class="spin" aria-hidden="true"></span>Memuat kotak masuk…</div>',
        '<div class="job"><span class="job-info">' + (nf.pindaiTerakhir ? "Pemindaian terakhir: " + esc(nf.pindaiTerakhir) : "Belum pernah dipindai") + '</span><span class="job-status" id="km-status" role="status"></span></div>' +
        '<div class="dlg-foot-r"><button class="btn ghost" type="button" id="km-penuh" title="Memeriksa seluruh isi folder, termasuk berkas lama">' + ic("search") + 'Cari berkas lama</button><button class="btn" type="button" id="km-pindai">' + ic("cycle") + "Pindai berkas baru</button></div>");
      var st = $("#km-status");
      $("#km-pindai").addEventListener("click", function () {
        tombolTugas(this, "pindai", st, function (r) { var n = (r.progres && r.progres.ditemukan) || 0; return n ? n + " berkas baru ditemukan" : "Tidak ada berkas baru"; }, function () { kotakTab = "baru"; panelKotak(); });
      });
      $("#km-penuh").addEventListener("click", function () {
        tombolTugas(this, "pindaiPenuh", st, "Pemindaian seluruh folder selesai", function () { kotakTab = "lama"; panelKotak(); });
      });
      tanya({ aksi: "kotakMasuk" }).then(function (res) { if ($("#panel-kotak")) isiKotak(res); }, function (err) {
        var body = $("#panel-kotak .dlg-body");
        if (body) body.innerHTML = '<p class="gate-err">' + esc(err.message) + "</p>";
      });
    }
    function isiKotak(res) {
      var petaDrive = {};
      ITEMS.forEach(function (d) { var id = idDrive(d.url); if (id) petaDrive[id] = d; });
      /* folder tercatat terdekat di atas berkas (folder pantau paling atas tidak dihitung) */
      function terjangkau(r) {
        var ids = String(r.leluhur || "").split(",").filter(Boolean).slice(1).reverse();
        for (var i = 0; i < ids.length; i++) if (petaDrive[ids[i]]) return petaDrive[ids[i]];
        return null;
      }
      var list = kotakTab === "lama" ? res.lama : res.baru;
      var jangkau = list.filter(terjangkau);
      var jumlah = kotakTab === "lama" ? res.jumlahLama : res.jumlahBaru;
      var body = $("#panel-kotak .dlg-body");
      body.innerHTML = tabBar(kotakTab, [["baru", "Berkas baru", res.jumlahBaru], ["lama", "Berkas lama", res.jumlahLama]]) +
        (list.length
          ? (jangkau.length ? '<div class="km-bulk">' + ic("folder") + "<p><b>" + jangkau.length + "</b> berkas sudah bisa dibuka lewat folder yang tercatat.</p>" + '<button class="btn sm ghost" type="button" id="km-abaikan-jangkau">Abaikan semuanya</button></div>' : "") +
            '<ul class="km-list">' + list.map(function (r) {
              var j = jenisDariMime(r.mime, r.nama), J = JENIS[j] || JENIS.tautan, t = terjangkau(r);
              return '<li class="km-row" data-id="' + esc(r.id) + '"><span class="type ' + j + '">' + ic(J.ikon) + "<small>" + esc(J.kode) + "</small></span>" +
                '<div class="km-main"><a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.nama) + "</a>" +
                '<p class="item-path">' + esc(r.jalur) + "</p>" +
                '<p class="km-meta">' + ic("calendar") + "dibuat " + esc(fmtDate(r.dibuat)) + (t ? ' · <span class="km-reach">sudah terjangkau lewat “' + esc(t.judul) + "”</span>" : "") + "</p></div>" +
                '<div class="km-act"><button class="btn sm" type="button" data-km="catat">' + ic("plus") + 'Catat</button><button class="btn sm ghost" type="button" data-km="abaikan">Abaikan</button></div></li>';
            }).join("") + "</ul>" + (jumlah > list.length ? '<p class="gf-hint">Menampilkan ' + list.length + " dari " + jumlah + " berkas (terbaru lebih dulu).</p>" : "")
          : '<div class="kosong-besar">' + ic("inbox") + "<h3>" + (kotakTab === "baru" ? "Tidak ada berkas baru" : "Belum ada daftar berkas lama") + "</h3><p>" +
            (kotakTab === "baru" ? "Semua berkas baru di folder desa sudah tercatat. Pemindaian berjalan otomatis setiap pagi." : "Klik <b>Cari berkas lama</b> untuk memeriksa seluruh isi folder dan menemukan berkas yang belum pernah dicatat.") + "</p></div>");
      $$("[data-tab]", body).forEach(function (b) { b.addEventListener("click", function () { kotakTab = b.getAttribute("data-tab"); isiKotak(res); }); });
      function buang(ids) {
        var set = {};
        ids.forEach(function (x) { set[x] = 1; });
        var nb = res.baru.length, nl = res.lama.length;
        res.baru = res.baru.filter(function (r) { return !set[r.id]; });
        res.lama = res.lama.filter(function (r) { return !set[r.id]; });
        res.jumlahBaru -= nb - res.baru.length;
        res.jumlahLama -= nl - res.lama.length;
      }
      function abaikan(ids, tombol) {
        if (tombol) { tombol.disabled = true; tombol.textContent = "Menyimpan…"; }
        tanya({ aksi: "abaikan", ids: ids }).then(function (hasil) {
          terapkanHasil(hasil);
          buang(ids);
          if ($("#panel-kotak")) isiKotak(res);
          toast(ids.length + " berkas diabaikan", "check");
        }, function (err) {
          if (tombol) { tombol.disabled = false; tombol.textContent = "Abaikan"; }
          toast(err.message);
        });
      }
      var bulk = $("#km-abaikan-jangkau"), bulkSiap = false;
      if (bulk) bulk.addEventListener("click", function () {
        if (!bulkSiap) { bulkSiap = true; bulk.textContent = "Yakin abaikan " + jangkau.length + " berkas? Klik lagi"; bulk.classList.add("danger", "yakin"); return; }
        abaikan(jangkau.map(function (r) { return r.id; }), bulk);
      });
      $$(".km-row", body).forEach(function (row) {
        var id = row.getAttribute("data-id");
        var r = list.filter(function (x) { return x.id === id; })[0];
        $("[data-km=abaikan]", row).addEventListener("click", function () { abaikan([id], this); });
        $("[data-km=catat]", row).addEventListener("click", function () {
          var t = terjangkau(r), j = jenisDariMime(r.mime, r.nama);
          dialogItem(null, null, {
            awal: {
              url: r.url, jenis: j, lokasi: r.jalur,
              judul: j === "folder" ? r.nama : r.nama.replace(/\.[a-z0-9]{2,5}$/i, ""),
              diperbarui: r.diubah || r.dibuat || hariIni(),
              kategori: t ? t.kategori.slice() : [],
              terbatas: t ? !!t.terbatas : false
            },
            judulDialog: "Catat dari kotak masuk", subDialog: r.nama,
            setelah: function () { buang([id]); panelKotak(); }
          });
        });
      });
    }

    /* ---------- riwayat, sampah, cadangan ---------- */
    var logTab = "riwayat";
    function panelLog() {
      if (!butuhV2("Riwayat, sampah & cadangan")) return;
      panel("panel-log", "Riwayat, sampah & cadangan", "Siapa mengubah apa, data yang dihapus, dan salinan database",
        '<div class="muat-besar"><span class="spin" aria-hidden="true"></span>Memuat…</div>',
        '<div class="job"><span class="job-info" id="lg-info"></span><span class="job-status" id="lg-status" role="status"></span></div><div class="dlg-foot-r"><button class="btn" type="button" data-act="dlg-close">Tutup</button></div>');
      tanya({ aksi: "log" }).then(function (res) { if ($("#panel-log")) isiLog(res); }, function (err) {
        var body = $("#panel-log .dlg-body");
        if (body) body.innerHTML = '<p class="gate-err">' + esc(err.message) + "</p>";
      });
    }
    function isiLog(res) {
      var body = $("#panel-log .dlg-body"), nf = res.info || {};
      var isi = "";
      if (logTab === "riwayat") {
        isi = '<div class="field log-cari"><span class="field-ico">' + ic("search") + '</span><input id="lg-q" type="search" placeholder="Cari di riwayat (nama, aksi, judul)…" autocomplete="off" aria-label="Cari di riwayat"></div>' +
          '<ol class="log-list" id="lg-list"></ol>';
      } else if (logTab === "sampah") {
        isi = res.sampah.length ? '<p class="gf-hint">Data yang dihapus disimpan di sini ' + 30 + " hari, lalu dihapus permanen otomatis.</p>" + '<ul class="pr-list">' + res.sampah.map(function (x) {
          return '<li class="pr-row"><span class="pr-ico sampah">' + ic(x.jenis === "kategori" ? "grid" : "link") + '</span><div class="pr-main"><b>' + esc(x.judul) + "</b><p>" + (x.jenis === "kategori" ? "Kategori" : "Tautan") + " · dihapus " + esc(x.waktu) + " oleh " + esc(x.oleh) + " · hilang permanen dalam " + x.sisaHari + ' hari</p></div><div class="pr-act"><button class="btn sm" type="button" data-sid="' + esc(x.sid) + '">' + ic("restore") + "Pulihkan</button></div></li>";
        }).join("") + "</ul>" : '<div class="kosong-besar">' + ic("trash") + "<h3>Sampah kosong</h3><p>Tautan atau kategori yang dihapus akan muncul di sini dan bisa dipulihkan selama 30 hari.</p></div>";
      } else {
        isi = '<div class="auto ' + (nf.cadanganTerakhir ? "ok" : "warn") + '">' + ic(nf.cadanganTerakhir ? "check" : "alert") + "<div><b>" + (nf.cadanganTerakhir ? "Cadangan terakhir " + esc(nf.cadanganTerakhir) : "Belum ada cadangan") + "</b><p>Salinan spreadsheet database dibuat otomatis setiap minggu di folder <b>SDDS – Cadangan Database</b>. Delapan salinan terbaru disimpan.</p></div></div>" +
          (res.cadangan.length ? '<ul class="pr-list">' + res.cadangan.map(function (c) {
            return '<li class="pr-row"><span class="pr-ico sampah">' + ic("sheet") + '</span><div class="pr-main"><a href="' + esc(c.url) + '" target="_blank" rel="noopener">' + esc(c.nama) + "</a><p>" + esc(c.waktu) + "</p></div></li>";
          }).join("") + "</ul>" : "") +
          '<p class="gf-hint">Untuk memulihkan: buka salinan cadangan, lalu salin isi tab <b>Kategori</b> dan <b>Data</b> ke spreadsheet database.</p>' +
          '<button class="btn ghost" type="button" id="lg-cadang">' + ic("download") + "Cadangkan sekarang</button>";
      }
      body.innerHTML = tabBar(logTab, [["riwayat", "Riwayat", res.riwayat.length], ["sampah", "Sampah", res.sampah.length], ["cadangan", "Cadangan", res.cadangan.length]]) + isi;
      $$("[data-tab]", body).forEach(function (b) { b.addEventListener("click", function () { logTab = b.getAttribute("data-tab"); isiLog(res); }); });
      if (logTab === "riwayat") {
        var q = $("#lg-q"), ol = $("#lg-list");
        var tampil = function () {
          var nq = norm(q.value).trim();
          var arr = res.riwayat.filter(function (r) { return !nq || norm([r.oleh, r.aksi, r.keterangan].join(" ")).indexOf(nq) > -1; }).slice(0, 150);
          ol.innerHTML = arr.length ? arr.map(function (r) {
            return '<li><time>' + esc(r.waktu) + '</time><div><b>' + esc(r.aksi) + "</b>" + (r.keterangan ? ' <span class="log-ket">' + esc(r.keterangan) + "</span>" : "") + '<small>' + esc(r.oleh) + "</small></div></li>";
          }).join("") : '<li class="muted">Tidak ada catatan yang cocok.</li>';
        };
        q.addEventListener("input", tampil);
        tampil();
      }
      $$("[data-sid]", body).forEach(function (b) {
        b.addEventListener("click", function () {
          b.disabled = true; b.textContent = "Memulihkan…";
          kirim({ aksi: "pulihkan", sid: b.getAttribute("data-sid") }).then(function () {
            toast("Data dipulihkan", "check");
            logTab = "sampah"; panelLog();
          }, function (err) { b.disabled = false; b.innerHTML = ic("restore") + "Pulihkan"; toast(err.message); });
        });
      });
      var cad = $("#lg-cadang");
      if (cad) cad.addEventListener("click", function () {
        tombolTugas(cad, "cadangan", $("#lg-status"), "Cadangan database dibuat", function () { logTab = "cadangan"; panelLog(); });
      });
    }

    /* ---------- pengaturan otomatis ---------- */
    function panelAtur() {
      if (!butuhV2("Pengaturan otomatis")) return;
      var st = db.state, nf = db.info || {}, notif = st.notifikasi || {};
      var emailDef = (S.kontak && S.kontak.email) || "";
      var induk = (S.desa && S.desa.folderInduk) || "";
      var pantau = (st.folderPantau && st.folderPantau.length ? st.folderPantau : [induk]).join("\n");
      var sumberDef = ((st.menu || [])[0] || {}).url || "";
      function baris(label, nilai) { return "<dt>" + label + "</dt><dd>" + (nilai ? esc(nilai) : '<span class="muted">belum</span>') + "</dd>"; }
      var isi =
        (nf.otomatis
          ? '<div class="auto ok">' + ic("check") + "<div><b>Fitur otomatis aktif</b><p>Berjalan setiap pagi pukul 06.00 (aktif sejak " + esc(nf.otomatis) + ").</p></div></div>"
          : '<div class="auto warn">' + ic("alert") + "<div><b>Fitur otomatis belum aktif</b><p>Buka editor Apps Script, pilih fungsi <b>aktifkanOtomatis</b>, klik <b>Jalankan</b>, lalu <b>Izinkan</b>. Setelah itu tautan diperiksa, kotak masuk terisi, dan database dicadangkan otomatis.</p></div></div>") +
        '<dl class="auto-list">' + baris("Cek tautan", nf.cekTerakhir) + baris("Pindai berkas baru", nf.pindaiTerakhir) + baris("Cadangan database", nf.cadanganTerakhir) + baris("Email laporan", nf.emailTerakhir) + baris("Dasbor statistik", nf.dasborTerakhir) + "</dl>" +
        '<form class="atur-form" id="dlgf-atur" novalidate>' +
        bidang("fa-email", "Email penerima laporan mingguan", '<input id="fa-email" type="email" autocomplete="off" value="' + esc(notif.email || emailDef) + '">', "Ringkasan tautan rusak, data lewat jadwal, dan berkas baru di kotak masuk. Penanggung jawab data juga menerima pengingat masing-masing.") +
        '<div class="toggles">' + sakelar("fa-aktif", "Kirim laporan & pengingat setiap minggu", notif.aktif !== false, "Hanya dikirim bila ada yang perlu ditindaklanjuti") + "</div>" +
        bidang("fa-pantau", "Folder yang dipantau kotak masuk", '<textarea id="fa-pantau" rows="2" placeholder="Satu link folder per baris">' + esc(pantau) + "</textarea>", "Berkas baru di folder ini (termasuk subfolder) yang belum dicatat akan masuk kotak masuk.") +
        bidang("fa-unggah", "Folder unggahan bawaan", '<input id="fa-unggah" type="url" autocomplete="off" value="' + esc(st.folderUnggah || "") + '" placeholder="' + esc(induk) + '">', "Dipakai bila kategori belum punya folder. Kosongkan untuk memakai folder induk DESA CANTIK.") +
        bidang("fa-dasbor", "Spreadsheet sumber dasbor statistik", '<input id="fa-dasbor" type="url" autocomplete="off" value="' + esc(st.dasborSumber || "") + '" placeholder="' + esc(sumberDef) + '">', "Spreadsheet data penduduk (per orang). Kosongkan untuk memakai DATA SUMBER SARI. Yang tampil di dasbor hanya angka ringkasan.") +
        '<p class="gate-err dlg-err" role="alert" hidden></p>' +
        "</form>" +
        '<div class="alat"><p class="alat-h">Jalankan sekarang</p><div class="alat-row">' +
        '<button class="btn sm ghost" type="button" data-tugas="email">' + ic("inbox") + "Kirim laporan</button>" +
        '<button class="btn sm ghost" type="button" data-tugas="cadangan">' + ic("download") + "Cadangkan database</button>" +
        '<button class="btn sm ghost" type="button" data-tugas="dasbor">' + ic("chart") + "Hitung ulang dasbor</button>" +
        "</div></div>";
      panel("panel-atur", "Pengaturan otomatis", "Pemeriksaan harian, email pengingat, dan folder yang dipantau", isi,
        '<div class="job"><span class="job-status" id="fa-status" role="status"></span></div><div class="dlg-foot-r"><button class="btn ghost" type="button" data-act="dlg-close">Batal</button><button class="btn" type="button" id="fa-simpan">Simpan pengaturan</button></div>');
      var form = $("#dlgf-atur"), stEl = $("#fa-status");
      $$("[data-tugas]").forEach(function (b) {
        b.addEventListener("click", function () {
          var tg = b.getAttribute("data-tugas");
          tombolTugas(b, tg, stEl, function (r) {
            if (tg === "email") return (r.progres && r.progres.terkirim) ? r.progres.terkirim + " email terkirim" : "Tidak ada yang perlu dilaporkan";
            if (tg === "dasbor") { dasbor.waktu = 0; return "Dasbor dihitung ulang"; }
            return "Cadangan database dibuat";
          });
        });
      });
      $("#fa-simpan").addEventListener("click", function () {
        var email = $("#fa-email").value.trim();
        if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return tampilGalat(form, "Email penerima belum benar.");
        var daftar = $("#fa-pantau").value.split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
        if (daftar.some(function (x) { return !idDrive(x); })) return tampilGalat(form, "Setiap baris folder dipantau harus berupa link folder Google Drive.");
        var fu = $("#fa-unggah").value.trim(), fd = $("#fa-dasbor").value.trim();
        if (fu && !idDrive(fu)) return tampilGalat(form, "Folder unggahan harus link folder Google Drive.");
        if (fd && !idDrive(fd)) return tampilGalat(form, "Sumber dasbor harus link spreadsheet Google.");
        var ubah = [];
        var notifBaru = { email: email, aktif: $("#fa-aktif").checked };
        if (JSON.stringify(notifBaru) !== JSON.stringify({ email: notif.email || emailDef, aktif: notif.aktif !== false })) ubah.push(["notifikasi", notifBaru]);
        if (daftar.join("\n") !== pantau) ubah.push(["folderPantau", daftar]);
        if (fu !== (st.folderUnggah || "")) ubah.push(["folderUnggah", fu]);
        if (fd !== (st.dasborSumber || "")) ubah.push(["dasborSumber", fd]);
        if (!ubah.length) { tutupDialog(); return; }
        var b = this; b.disabled = true; b.textContent = "Menyimpan…";
        ubah.reduce(function (p, u) { return p.then(function () { return kirim({ aksi: "simpanPengaturan", kunciSet: u[0], nilai: u[1] }); }); }, Promise.resolve())
          .then(function () { tutupDialog(); toast("Pengaturan disimpan", "check"); if (ubah.some(function (u) { return u[0] === "dasborSumber"; })) dasbor.waktu = 0; },
            function (err) { b.disabled = false; b.textContent = "Simpan pengaturan"; tampilGalat(form, err.message); });
      });
    }

    /* ---------- angka beranda ---------- */
    function dialogStatistik() {
      var rows = clone(db.state.statistik || []);
      var das = dasbor.data && dasbor.data.ok && dasbor.data.total ? dasbor.data : null;
      function baris(s, i) {
        return '<div class="st-row" data-i="' + i + '">' +
          '<input class="st-label" type="text" aria-label="Label angka ' + (i + 1) + '" value="' + esc(s.label) + '" placeholder="Label, mis. Penduduk">' +
          '<input class="st-nilai" type="text" inputmode="decimal" aria-label="Nilai angka ' + (i + 1) + '" value="' + esc(s.nilai) + '" placeholder="3.578">' +
          '<input class="st-satuan" type="text" aria-label="Satuan angka ' + (i + 1) + '" value="' + esc(s.satuan) + '" placeholder="jiwa">' +
          '<input class="st-ket" type="text" aria-label="Keterangan angka ' + (i + 1) + '" value="' + esc(s.ket) + '" placeholder="Keterangan kecil">' +
          '<div class="st-btns"><button type="button" class="icon-btn plain" data-geser="-1" aria-label="Naikkan">↑</button><button type="button" class="icon-btn plain" data-geser="1" aria-label="Turunkan">↓</button><button type="button" class="icon-btn plain" data-hapus-baris aria-label="Hapus angka ini">' + ic("trash") + "</button></div></div>";
      }
      bukaDialog(
        '<form class="dlg-form" id="dlgf-stat" novalidate>' +
        kepala("Angka di beranda", "Ringkasan desa di bawah banner") +
        '<div class="dlg-body">' +
        (das ? '<div class="stat-bantu">' + ic("chart") + "<p>Menurut dasbor (" + esc(das.sumber && das.sumber.nama || "data penduduk") + "): <b>" + fmtAngka(das.total) + "</b> jiwa · <b>" + fmtAngka(das.kk) + '</b> KK.</p><div><button type="button" class="btn sm ghost" data-pakai="penduduk">Pakai untuk Penduduk</button><button type="button" class="btn sm ghost" data-pakai="kk">Pakai untuk KK</button></div></div>' : "") +
        '<div class="st-head" aria-hidden="true"><span>Label</span><span>Nilai</span><span>Satuan</span><span>Keterangan</span></div>' +
        '<div id="st-rows">' + rows.map(baris).join("") + "</div>" +
        '<button type="button" class="btn ghost sm" id="st-add">' + ic("plus") + "Tambah angka</button>" +
        bidang("st-sumber", "Sumber angka", '<textarea id="st-sumber" rows="2">' + esc(db.state.statistikSumber || "") + "</textarea>", "Tampil kecil di bawah angka, mis. nama portal dan bulan data.") +
        '<p class="gate-err dlg-err" role="alert" hidden></p></div>' +
        kaki("", "Simpan") + "</form>"
      );
      var form = $("#dlgf-stat"), box = $("#st-rows");
      function nomori() { $$(".st-row", box).forEach(function (r, i) { r.setAttribute("data-i", i); }); }
      $("#st-add").addEventListener("click", function () { box.insertAdjacentHTML("beforeend", baris({ label: "", nilai: "", satuan: "", ket: "" }, box.children.length)); $(".st-row:last-child .st-label", box).focus(); });
      box.addEventListener("click", function (e) {
        var r = e.target.closest(".st-row");
        if (!r) return;
        if (e.target.closest("[data-hapus-baris]")) { r.remove(); nomori(); return; }
        var g = e.target.closest("[data-geser]");
        if (g) {
          var arah = +g.getAttribute("data-geser");
          if (arah < 0 && r.previousElementSibling) box.insertBefore(r, r.previousElementSibling);
          if (arah > 0 && r.nextElementSibling) box.insertBefore(r.nextElementSibling, r);
          nomori();
        }
      });
      $$("[data-pakai]", form).forEach(function (b) {
        b.addEventListener("click", function () {
          var kk = b.getAttribute("data-pakai") === "kk";
          var pola = kk ? /kepala keluarga|\bkk\b/i : /penduduk/i;
          var r = $$(".st-row", box).filter(function (x) { return pola.test($(".st-label", x).value) || pola.test($(".st-satuan", x).value); })[0];
          if (!r) { box.insertAdjacentHTML("beforeend", baris({ label: kk ? "Kepala keluarga" : "Penduduk", nilai: "", satuan: kk ? "KK" : "jiwa", ket: "" }, box.children.length)); r = box.lastElementChild; }
          $(".st-nilai", r).value = fmtAngka(kk ? das.kk : das.total);
          $(".st-ket", r).value = "dasbor " + (das.sumber && das.sumber.nama ? das.sumber.nama : "data penduduk") + ", " + fmtDate(String(das.diperbarui || "").slice(0, 10));
          r.classList.add("flash");
        });
      });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var hasil = [], salah = "";
        $$(".st-row", box).forEach(function (r) {
          var o = { label: $(".st-label", r).value.trim(), nilai: $(".st-nilai", r).value.trim(), satuan: $(".st-satuan", r).value.trim(), ket: $(".st-ket", r).value.trim() };
          if (!o.label && !o.nilai && !o.satuan && !o.ket) return;
          if (!o.label || !o.nilai) salah = "Setiap angka perlu label dan nilai.";
          hasil.push(o);
        });
        if (salah) return tampilGalat(form, salah);
        var sumber = $("#st-sumber").value.trim();
        prosesSimpan(form, function () {
          return kirim({ aksi: "simpanPengaturan", kunciSet: "statistik", nilai: hasil }).then(function () {
            if (sumber !== (db.state.statistikSumber || "")) return kirim({ aksi: "simpanPengaturan", kunciSet: "statistikSumber", nilai: sumber });
          });
        }, "Angka beranda disimpan");
      });
    }

    /* ---------- unggah berkas ---------- */
    var BATAS_MB = 20;
    function ukuranTeks(b) { return b >= 1048576 ? (b / 1048576).toFixed(1).replace(".", ",") + " MB" : Math.max(1, Math.round(b / 1024)) + " KB"; }
    function opsiFolder(katIds) {
      var out = [], dilihat = {};
      function tambah(label, url, grup) {
        var id = idDrive(url);
        if (!id || dilihat[id]) return;
        dilihat[id] = 1;
        out.push({ label: label, url: url, grup: grup });
      }
      katIds.forEach(function (kid) {
        var k = KAT[kid];
        if (!k) return;
        if (k.folder) tambah(k.nama + " · folder unggahan", k.folder, k.nama);
        itemsOf(kid).filter(function (d) { return d.jenis === "folder"; }).sort(function (a, b) { return (b.utama ? 1 : 0) - (a.utama ? 1 : 0); })
          .forEach(function (d) { tambah(d.judul, d.url, k.nama); });
      });
      (db.state.alur || []).forEach(function (a, i) { (a.tautan || []).forEach(function (t) { tambah((i + 1) + ". " + (a.fase || t.label), t.url, "Tahap GSBPM"); }); });
      tambah("Folder induk DESA CANTIK", db.state.folderUnggah || (S.desa && S.desa.folderInduk) || "", "Lainnya");
      return out;
    }
    function bacaBase64(file) {
      return new Promise(function (ok, gagal) {
        var r = new FileReader();
        r.onload = function () { ok(String(r.result).split(",")[1] || ""); };
        r.onerror = function () { gagal(new Error("Berkas tidak bisa dibaca.")); };
        r.readAsDataURL(file);
      });
    }
    function dialogUnggah(presetKat) {
      if (!butuhV2("Unggah berkas")) return;
      var berkas = [];
      var awalKat = presetKat && KAT[presetKat] ? [presetKat] : [];
      var pilihKat = KATS.map(function (k) {
        return '<label class="pick" style="--c:' + esc(k.warna) + '"><input type="checkbox" name="fu-kat" value="' + esc(k.id) + '"' + (awalKat.indexOf(k.id) > -1 ? " checked" : "") + "><span>" + ic(k.ikon) + esc(k.nama) + "</span></label>";
      }).join("");
      bukaDialog(
        '<form class="dlg-form" id="dlgf-unggah" novalidate>' +
        kepala("Unggah berkas", "Berkas disimpan ke folder Google Drive desa dan langsung tercatat di SDDS") +
        '<div class="dlg-body">' +
        '<label class="drop" id="fu-drop"><input id="fu-file" type="file" multiple>' + ic("upload") + "<b>Pilih berkas</b><span>atau seret ke sini · maks. " + BATAS_MB + " MB per berkas</span></label>" +
        '<ul class="fu-list" id="fu-list"></ul>' +
        '<fieldset class="gf"><legend>Kategori</legend><div class="picks">' + (pilihKat || '<p class="gf-hint">Belum ada kategori.</p>') + "</div></fieldset>" +
        bidang("fu-folder", "Simpan ke folder", '<select id="fu-folder"></select><input id="fu-folder-lain" type="url" inputmode="url" autocomplete="off" placeholder="Tempel link folder Google Drive" hidden>', "Pilihan folder mengikuti kategori yang dicentang.") +
        '<div class="gf-row">' +
        bidang("fu-frek", "Diperbarui setiap", '<select id="fu-frek">' + opsiFrekuensi("") + "</select>") +
        bidang("fu-pj", "Penanggung jawab (opsional)", '<input id="fu-pj" type="text" maxlength="80" autocomplete="off">') +
        "</div>" +
        '<div class="toggles">' + sakelar("fu-terbatas", "Terbatas", false, "Memuat data pribadi warga (NIK, nama, alamat)") + "</div>" +
        '<p class="gate-err dlg-err" role="alert" hidden></p>' +
        "</div>" + kaki("", "Unggah") + "</form>"
      );
      var form = $("#dlgf-unggah"), inp = $("#fu-file"), ul = $("#fu-list"), sel = $("#fu-folder"), lain = $("#fu-folder-lain"), drop = $("#fu-drop");
      function isiFolder() {
        var ids = $$("input[name=fu-kat]:checked", form).map(function (x) { return x.value; });
        var lama = sel.value;
        var ops = opsiFolder(ids), grup = {};
        ops.forEach(function (o) { (grup[o.grup] = grup[o.grup] || []).push(o); });
        sel.innerHTML = Object.keys(grup).map(function (g) {
          return '<optgroup label="' + esc(g) + '">' + grup[g].map(function (o) { return '<option value="' + esc(o.url) + '">' + esc(o.label) + "</option>"; }).join("") + "</optgroup>";
        }).join("") + '<option value="__lain">Folder lain (tempel link)…</option>';
        if (folderDipilih && lama && $$("option", sel).some(function (o) { return o.value === lama; })) sel.value = lama;
        else sel.selectedIndex = 0;
        lain.hidden = sel.value !== "__lain";
      }
      var folderDipilih = false;
      sel.addEventListener("change", function () { folderDipilih = true; lain.hidden = sel.value !== "__lain"; if (!lain.hidden) lain.focus(); });
      form.addEventListener("change", function (e) { if (e.target.name === "fu-kat") isiFolder(); });
      isiFolder();
      function gambar() {
        ul.innerHTML = berkas.map(function (b, i) {
          var j = jenisDariMime(b.file.type, b.file.name), J = JENIS[j] || JENIS.tautan, besar = b.file.size > BATAS_MB * 1048576;
          return '<li class="fu-row' + (besar ? " err" : "") + (b.status === "ok" ? " ok" : "") + '" data-i="' + i + '"><span class="type ' + j + '">' + ic(J.ikon) + "<small>" + esc(J.kode) + "</small></span>" +
            '<div class="fu-main"><input class="fu-judul" type="text" value="' + esc(b.judul) + '" aria-label="Judul untuk ' + esc(b.file.name) + '"' + (b.status ? " disabled" : "") + ">" +
            '<p class="fu-meta">' + esc(b.file.name) + " · " + ukuranTeks(b.file.size) + (besar ? " · <b>lebih dari " + BATAS_MB + " MB</b>, unggah langsung di Drive" : "") +
            (b.status === "jalan" ? ' · <span class="spin" aria-hidden="true"></span>mengunggah…' : b.status === "ok" ? " · " + ic("check") + "tersimpan" : b.status === "gagal" ? ' · <span class="fu-err">' + esc(b.pesan) + "</span>" : "") + "</p></div>" +
            (b.status ? "" : '<button type="button" class="icon-btn plain" data-buang aria-label="Buang ' + esc(b.file.name) + '">' + ic("x") + "</button>") + "</li>";
        }).join("");
        var n = berkas.filter(function (b) { return !b.status && b.file.size <= BATAS_MB * 1048576; }).length;
        $("[data-simpan]", form).textContent = n > 1 ? "Unggah " + n + " berkas" : "Unggah";
      }
      function tambahBerkas(files) {
        Array.prototype.forEach.call(files, function (f) { berkas.push({ file: f, judul: f.name.replace(/\.[a-z0-9]{2,5}$/i, "").replace(/[_]+/g, " ") }); });
        gambar();
      }
      inp.addEventListener("change", function () { tambahBerkas(inp.files); inp.value = ""; });
      ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("over"); }); });
      ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("over"); }); });
      drop.addEventListener("drop", function (e) { if (e.dataTransfer && e.dataTransfer.files) tambahBerkas(e.dataTransfer.files); });
      ul.addEventListener("input", function (e) { var r = e.target.closest(".fu-row"); if (r && e.target.classList.contains("fu-judul")) berkas[+r.getAttribute("data-i")].judul = e.target.value; });
      ul.addEventListener("click", function (e) { var r = e.target.closest(".fu-row"); if (r && e.target.closest("[data-buang]")) { berkas.splice(+r.getAttribute("data-i"), 1); gambar(); } });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var antri = berkas.filter(function (b) { return !b.status && b.file.size <= BATAS_MB * 1048576; });
        if (!antri.length) return tampilGalat(form, berkas.length ? "Tidak ada berkas yang bisa diunggah." : "Pilih berkas dulu.");
        var folder = sel.value === "__lain" ? lain.value.trim() : sel.value;
        if (!idDrive(folder)) return tampilGalat(form, "Pilih folder tujuan, atau tempel link folder Google Drive.");
        if (antri.some(function (b) { return !b.judul.trim(); })) return tampilGalat(form, "Setiap berkas perlu judul.");
        $(".dlg-err", form).hidden = true;
        var tombol = $("[data-simpan]", form);
        tombol.disabled = true;
        var kat = $$("input[name=fu-kat]:checked", form).map(function (x) { return x.value; });
        var umum = { kategori: kat, terbatas: $("#fu-terbatas").checked, frekuensi: $("#fu-frek").value, pj: $("#fu-pj").value.trim() };
        var sukses = 0;
        antri.reduce(function (p, b) {
          return p.then(function () {
            b.status = "jalan"; gambar();
            tombol.textContent = "Mengunggah " + (antri.indexOf(b) + 1) + " dari " + antri.length + "…";
            return bacaBase64(b.file).then(function (data) {
              return tanya({ aksi: "unggah", folder: folder, berkas: { nama: b.file.name, mime: b.file.type || "application/octet-stream", data: data }, item: Object.assign({ judul: b.judul.trim() }, umum) });
            }).then(function (res) { terapkanHasil(res); b.status = "ok"; sukses++; gambar(); }, function (err) {
              b.status = "gagal"; b.pesan = err.message; gambar();
              if (err.kode === "kunci") throw err;
            });
          });
        }, Promise.resolve()).then(function () {
          tombol.disabled = false;
          var gagal = berkas.filter(function (b) { return b.status === "gagal"; }).length;
          if (!gagal) { tutupDialog(); toast(sukses + " berkas diunggah dan tercatat", "check"); }
          else { tombol.textContent = "Tutup"; tombol.onclick = function (ev) { ev.preventDefault(); tutupDialog(); }; tampilGalat(form, gagal + " berkas gagal diunggah. " + (sukses ? sukses + " berkas lain berhasil." : "")); }
        }, function (err) { tutupDialog(); toast(err.message); dialogKunci(); });
      });
    }

    function tandai(id) {
      kirim({ aksi: "tandaiDiperbarui", id: id }).then(function () {
        toast("Ditandai sudah diperbarui hari ini", "check");
        if (dlg.open && $("#panel-perhatian")) panelPerhatian();
      }, function (err) { toast(err.message); });
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
      var menuLain = t.closest(".eb-menu");
      if (menuLain) menuLain.hidden = true;
      if (act === "lainnya") {
        var m = t.parentNode.querySelector(".eb-menu");
        m.hidden = !m.hidden;
        t.setAttribute("aria-expanded", m.hidden ? "false" : "true");
        if (!m.hidden) { var f1 = m.querySelector("button, a"); if (f1) f1.focus(); }
        return;
      }
      if (act === "versi-lama") { butuhV2("Perbarui Apps Script"); return; }
      if (act === "pasang") { pasangAplikasi(); return; }
      if (act === "dasbor-muat") { muatDasbor(true); return; }
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
        else if (act === "unggah") dialogUnggah(t.getAttribute("data-kat") || katAktif);
        else if (act === "panel-kotak") panelKotak();
        else if (act === "panel-perhatian") panelPerhatian();
        else if (act === "panel-log") panelLog();
        else if (act === "panel-atur") panelAtur();
        else if (act === "edit-stat") { if (MODE === "sheet" && !v2()) butuhV2("Angka beranda"); else dialogStatistik(); }
        else if (act === "tandai") tandai(id);
        else if (act === "dasbor-hitung") hitungUlangDasbor(t);
      });
    });
    document.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest(".eb-more")) return;
      $$(".eb-menu").forEach(function (m) { if (!m.hidden) { m.hidden = true; var b = m.parentNode.querySelector("[data-act=lainnya]"); if (b) b.setAttribute("aria-expanded", "false"); } });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      $$(".eb-menu").forEach(function (m) { if (!m.hidden) { m.hidden = true; var b = m.parentNode.querySelector("[data-act=lainnya]"); if (b) { b.setAttribute("aria-expanded", "false"); b.focus(); } } });
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

    /* ---------- pasang di HP (PWA) ---------- */
    function sudahTerpasang() { return (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true; }
    function pasangAplikasi() {
      var ev = window.SDDSPasang && window.SDDSPasang.acara;
      if (ev) {
        ev.prompt();
        (ev.userChoice || Promise.resolve({})).then(function (r) { if (r && r.outcome === "accepted") toast("SDDS dipasang di perangkat ini", "check"); window.SDDSPasang.acara = null; renderPasang(); });
        return;
      }
      var ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
      bukaDialog('<div class="dlg-form" id="dlgf-pasang">' + kepala("Pasang SDDS di HP", "Buka lebih cepat dari layar utama, seperti aplikasi") +
        '<div class="dlg-body">' + (sudahTerpasang() ? "<p>SDDS sudah terpasang di perangkat ini.</p>" :
          (ios ? '<ol class="langkah"><li>Buka situs ini di <b>Safari</b>.</li><li>Ketuk tombol <b>Bagikan</b> (kotak dengan panah ke atas).</li><li>Pilih <b>Tambah ke Layar Utama</b> → <b>Tambah</b>.</li></ol>'
            : '<ol class="langkah"><li>Buka situs ini di <b>Google Chrome</b>.</li><li>Ketuk menu <b>⋮</b> di kanan atas.</li><li>Pilih <b>Instal aplikasi</b> atau <b>Tambahkan ke layar utama</b>.</li></ol>') +
          '<p class="gf-hint">Setelah terpasang, daftar data tetap bisa dibuka walau sinyal lemah (memakai data tersimpan terakhir). Berkas di Google Drive tetap butuh internet.</p>') +
        '</div><div class="dlg-foot"><div></div><div class="dlg-foot-r"><button class="btn" type="button" data-act="dlg-close">Mengerti</button></div></div></div>');
    }
    function renderPasang() {
      var el = $("#link-pasang");
      if (el) el.hidden = sudahTerpasang();
    }
    document.addEventListener("sdds-bisa-pasang", renderPasang);

    renderMeta();
    renderSemua();
    route();
    muatDariSheet();
    renderPasang();

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
