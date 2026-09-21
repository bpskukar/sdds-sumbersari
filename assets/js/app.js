/* =====================================================================
   SDDS — Satu Data Desa Sumber Sari
   Logika tampilan. Data ada di data/katalog.js (tidak perlu mengedit file ini).
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
    arrowR: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    arrowL: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    cycle: '<path d="M21 12a9 9 0 0 1-15.4 6.4L3 16"/><path d="M3 21v-5h5"/><path d="M3 12a9 9 0 0 1 15.4-6.4L21 8"/><path d="M21 3v5h-5"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>'
  };
  function ic(name) {
    return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || "") + "</svg>";
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

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
  /* ---------- model data ---------- */
  var JENIS = {
    folder: { label: "Folder", ikon: "folder", grup: "folder", kode: "DIR" },
    pdf: { label: "PDF", ikon: "file", grup: "pdf", kode: "PDF" },
    xlsx: { label: "Excel", ikon: "sheet", grup: "tabel", kode: "XLSX" },
    sheet: { label: "Google Sheets", ikon: "sheet", grup: "tabel", kode: "SHEET" },
    docx: { label: "Word", ikon: "file", grup: "dokumen", kode: "DOCX" },
    gambar: { label: "Gambar", ikon: "image", grup: "media", kode: "IMG" },
    video: { label: "Video", ikon: "video", grup: "media", kode: "VID" }
  };
  var GRUP = [
    { id: "semua", label: "Semua" },
    { id: "folder", label: "Folder" },
    { id: "pdf", label: "PDF" },
    { id: "tabel", label: "Excel & Sheets" },
    { id: "dokumen", label: "Word" },
    { id: "media", label: "Gambar & video" }
  ];

  var KAT = {};
  S.kategori.forEach(function (k) { KAT[k.id] = k; });

  var ITEMS = S.data.map(function (d, i) {
    var kats = (d.kategori || []).filter(function (id) { return KAT[id]; });
    var j = JENIS[d.jenis] || JENIS.file || { label: d.jenis || "Tautan", ikon: "link", grup: "dokumen", kode: "URL" };
    return Object.assign({}, d, {
      _i: i,
      kategori: kats,
      _j: j,
      _t: norm(d.judul),
      _s: norm([d.judul, d.ket, d.lokasi, j.label, kats.map(function (id) { return KAT[id].nama + " " + KAT[id].namaPanjang; }).join(" ")].join(" "))
    });
  });

  function byDateDesc(a, b) { return (b.diperbarui || "").localeCompare(a.diperbarui || "") || a._i - b._i; }
  function itemsOf(katId) { return ITEMS.filter(function (d) { return d.kategori.indexOf(katId) > -1; }); }
  function latest(list) { return list.reduce(function (m, d) { return (d.diperbarui || "") > m ? d.diperbarui : m; }, ""); }

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

  /* ---------- tautan email ---------- */
  function mailto(subject, body) {
    var e = (S.kontak && S.kontak.email) || "";
    return "mailto:" + e + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }
  var MAIL_AKSES = mailto("Permintaan akses data SDDS", "Halo Admin Desa Cantik Sumber Sari,\n\nSaya ingin meminta akses ke data berikut:\n- Judul data: \n\nNama: \nInstansi / RT: \nKeperluan: \n\nTerima kasih.");
  var MAIL_LAPOR = mailto("Laporan tautan rusak SDDS", "Halo Admin,\n\nTautan berikut tidak bisa dibuka:\n- Judul data: \n- Masalah (tidak ada izin / berkas hilang / salah berkas): \n\nTerima kasih.");

  /* ---------- komponen ---------- */
  function typeBadge(d) {
    return '<span class="type ' + esc(d.jenis) + '" title="' + esc(d._j.label) + '">' + ic(d._j.ikon) + "<small>" + esc(d._j.kode) + "</small></span>";
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
      '<button class="copy" type="button" data-copy="' + esc(d.url) + '" aria-label="Salin tautan ' + esc(d.judul) + '" title="Salin tautan">' + ic("copy") + "</button>" +
      '<a class="btn sm" href="' + esc(d.url) + '" target="_blank" rel="noopener">Buka ' + ic("external") + "</a>" +
      "</div>" +
      "</li>"
    );
  }
  function emptyState(q, resetId) {
    return '<li class="empty"><p>Tidak ada data yang cocok' + (q ? " dengan <b>“" + esc(q) + "”</b>" : "") + ".</p><p>Coba kata lain, atau hapus saringan.</p>" +
      (resetId ? '<button class="btn ghost" type="button" id="' + resetId + '">Hapus saringan</button>' : "") + "</li>";
  }

  /* ---------- toast & salin ---------- */
  var toastTimer;
  function toast(msg, icon) {
    var t = $("#toast");
    t.innerHTML = (icon ? ic(icon) : "") + "<span>" + esc(msg) + "</span>";
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2200);
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
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { toast("Tautan disalin", "check"); }, fallback);
    } else fallback();
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-copy]");
    if (b) { e.preventDefault(); copyText(b.getAttribute("data-copy")); }
  });

  /* ---------- isi ikon statis ---------- */
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

  /* ---------- statistik ---------- */
  function renderStats() {
    var html = (S.statistik || []).map(function (s) {
      return '<div class="stat"><p class="stat-label">' + esc(s.label) + '</p><p class="stat-val"><b>' + esc(s.nilai) + "</b><span>" + esc(s.satuan) + '</span></p><p class="stat-ket">' + esc(s.ket) + "</p></div>";
    }).join("");
    html += '<div class="stat own"><p class="stat-label">Terdokumentasi</p><p class="stat-val"><b>' + ITEMS.length + '</b><span>tautan</span></p><p class="stat-ket">dalam ' + S.kategori.length + " kategori data</p></div>";
    $("#stats").innerHTML = html;
    $("#stats-src").textContent = "Sumber: " + (S.statistikSumber || "");
  }

  /* ---------- pintasan hero ---------- */
  function renderQuick() {
    var pick = [["dtsen", "DTSEN"], ["rddk", "RDDK"], ["umkm", "UMKM"], ["kesehatan", "Posyandu"], ["rt", "Data RT"], ["publikasi", "Profil Desa"]];
    $("#quick").innerHTML = '<span class="quick-label">Populer</span>' + pick.filter(function (p) { return KAT[p[0]]; }).map(function (p) {
      return '<a href="#/k/' + p[0] + '">' + ic(KAT[p[0]].ikon) + esc(p[1]) + "</a>";
    }).join("");
  }

  /* ---------- kategori ---------- */
  function renderCategories() {
    var sorot = S.kategori.filter(function (k) { return k.sorot; });
    var lain = S.kategori.filter(function (k) { return !k.sorot; });

    $("#cat-feature").innerHTML = sorot.map(function (k) {
      var list = itemsOf(k.id);
      var locked = list.filter(function (d) { return d.terbatas; }).length;
      var preview = list.filter(function (d) { return !d.utama; }).sort(byDateDesc).slice(0, 3);
      return (
        '<article class="feat" style="--c:' + esc(k.warna) + '">' +
        '<div class="feat-top"><span class="chip-ico">' + ic(k.ikon) + "</span>" +
        '<div><h3><a href="#/k/' + esc(k.id) + '">' + esc(k.nama) + '</a></h3><p class="full">' + esc(k.namaPanjang) + "</p></div></div>" +
        '<p class="desc">' + esc(k.deskripsi) + "</p>" +
        '<ul class="feat-files">' + preview.map(function (d) {
          return "<li>" + ic(d._j.ikon) + '<span class="n">' + esc(d.judul) + "</span></li>";
        }).join("") + "</ul>" +
        '<div class="feat-foot"><span class="count">' + list.length + " tautan" + (locked ? " · " + locked + " terbatas" : "") + '</span><span class="feat-go">Lihat data ' + ic("arrowR") + "</span></div>" +
        "</article>"
      );
    }).join("");

    $("#cat-grid").innerHTML = lain.map(function (k) {
      var n = itemsOf(k.id).length;
      return (
        '<a class="tile" href="#/k/' + esc(k.id) + '" style="--c:' + esc(k.warna) + '">' +
        '<span class="chip-ico">' + ic(k.ikon) + "</span>" +
        '<div class="tile-body"><div class="tile-title"><h3>' + esc(k.nama) + '</h3><span class="count">' + n + "</span></div>" +
        "<p>" + esc(k.deskripsi) + "</p></div></a>"
      );
    }).join("");
  }

  /* ---------- alur ---------- */
  function renderFlow() {
    var alur = S.alur || [];
    $("#flow").innerHTML = alur.map(function (a) {
      var links = (a.tautan || (a.url ? [{ label: "Buka folder", kode: a.kode, url: a.url }] : []));
      return (
        '<li class="flow-card">' +
        '<div class="flow-head"><span class="flow-num" aria-hidden="true"></span>' +
        '<div><h3>' + esc(a.fase || a.langkah) + "</h3>" +
        (a.en ? '<p class="code">' + esc(a.en) + "</p>" : "") + "</div></div>" +
        '<p class="flow-ket">' + esc(a.ket) + "</p>" +
        (a.isi ? '<p class="flow-isi"><b>Isi folder:</b> ' + esc(a.isi) + "</p>" : "") +
        '<ul class="flow-links">' + links.map(function (t) {
          return '<li><a href="' + esc(t.url) + '" target="_blank" rel="noopener">' + ic("folder") +
            '<span class="lbl">' + esc(t.label) + "</span>" +
            (t.kode ? '<span class="k">' + esc(t.kode) + "</span>" : "") + "</a></li>";
        }).join("") + "</ul></li>"
      );
    }).join("");
    $("#flow-support").innerHTML = alur.length > 1
      ? '<span class="cycle">' + ic("cycle") + "</span><p>Hasil <b>" + esc(alur[alur.length - 1].fase || "") + "</b> menjadi masukan <b>" + esc(alur[0].fase || "") + "</b> pada siklus berikutnya." +
        (S.alurRujukan ? ' <span class="ref">Rujukan: ' + esc(S.alurRujukan) + ".</span>" : "") + "</p>" +
        (S.alurFolder ? '<a class="btn ghost sm" href="' + esc(S.alurFolder) + '" target="_blank" rel="noopener">' + ic("folder") + "Semua folder tahap</a>" : "")
      : "";
  }

  /* ---------- katalog ---------- */
  var cat = { q: "", kat: "semua", grup: "semua", sort: "baru", limit: 12 };
  var qCat = $("#q-cat"), fKat = $("#f-kat"), fSort = $("#f-sort");

  fKat.innerHTML = '<option value="semua">Semua kategori</option>' + S.kategori.map(function (k) {
    return '<option value="' + esc(k.id) + '">' + esc(k.nama) + " (" + itemsOf(k.id).length + ")</option>";
  }).join("");

  function sortList(list, mode, q) {
    if (mode === "az") return list.sort(function (a, b) { return a.judul.localeCompare(b.judul, "id"); });
    if (mode === "lama") return list.sort(function (a, b) { return -byDateDesc(a, b); });
    if (q) return list; /* hasil pencarian: urut relevansi */
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
      ? ITEMS.length + " tautan tercatat. Terakhir diperbarui " + fmtDate(S.situs.diperbarui) + "."
      : list.length + " dari " + ITEMS.length + " tautan cocok dengan saringan.";
    var r = $("#reset-cat");
    if (r) r.addEventListener("click", resetCatalog);
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
    $("#shelf").innerHTML = books.map(function (d, i) {
      return (
        '<a class="book" href="' + esc(d.url) + '" target="_blank" rel="noopener">' +
        '<span class="cover" style="--cv:' + colors[i % colors.length] + '">' +
        '<span class="cover-top">Desa Sumber Sari</span>' +
        '<span class="cover-title">' + esc(d.judul) + "</span>" +
        '<span class="cover-year"><span>' + esc(d._j.kode) + "</span>" + ic("external") + "</span>" +
        "</span>" +
        '<span class="book-cap"><b>' + esc(d._j.label) + "</b><span>" + esc(fmtDate(d.diperbarui)) + "</span></span>" +
        "</a>"
      );
    }).join("");
  }

  /* ---------- pencarian hero ---------- */
  var qHero = $("#q-hero"), sug = $("#suggest");
  var sugIdx = -1;
  function sugLinks() { return $$(".sg-item", sug); }
  function closeSug() { sug.hidden = true; qHero.setAttribute("aria-expanded", "false"); sugIdx = -1; }
  function renderSug() {
    var q = qHero.value.trim();
    if (!q) { closeSug(); return; }
    var nq = norm(q);
    var kats = S.kategori.filter(function (k) { return norm(k.nama + " " + k.namaPanjang).indexOf(nq) > -1; }).slice(0, 2);
    var res = search(ITEMS, q).slice(0, 6);
    var html = kats.map(function (k) {
      return '<a class="sg-item" role="option" href="#/k/' + esc(k.id) + '" style="--c:' + esc(k.warna) + '">' +
        '<span class="chip-ico" style="width:36px;height:36px;font-size:17px;border-radius:10px">' + ic(k.ikon) + "</span>" +
        '<span><span class="t">Kategori ' + esc(k.nama) + '</span><br><span class="s">' + itemsOf(k.id).length + " tautan · " + esc(k.namaPanjang) + "</span></span>" +
        '<span class="go">' + ic("arrowR") + "</span></a>";
    }).join("");
    html += res.map(function (d) {
      return '<a class="sg-item" role="option" href="' + esc(d.url) + '" target="_blank" rel="noopener">' +
        typeBadge(d).replace('class="type', 'style="width:36px;height:36px;font-size:17px;border-radius:10px" class="type') +
        '<span><span class="t">' + esc(d.judul) + '</span><br><span class="s">' + esc(d.kategori.map(function (id) { return KAT[id].nama; }).join(" · ")) + (d.terbatas ? " · terbatas" : "") + "</span></span>" +
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
    if (t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || e.target.isContentEditable) return;
    e.preventDefault();
    var target = viewKat.hidden ? qHero : ($("#q-kat-in") || qHero);
    target.focus();
    if (target === qHero) window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- halaman kategori ---------- */
  var viewHome = $("#view-home"), viewKat = $("#view-kategori");
  var kstate = { q: "", grup: "semua" };

  function relatedOf(id) {
    var score = {};
    itemsOf(id).forEach(function (d) {
      d.kategori.forEach(function (o) { if (o !== id) score[o] = (score[o] || 0) + 1; });
    });
    var ids = Object.keys(score).sort(function (a, b) { return score[b] - score[a]; });
    S.kategori.forEach(function (k) { if (k.sorot && k.id !== id && ids.indexOf(k.id) === -1) ids.push(k.id); });
    return ids.slice(0, 3).map(function (x) { return KAT[x]; });
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
    $("#klist").innerHTML = list.length ? list.map(function (d) { return renderItem(d, id); }).join("") : emptyState(kstate.q, "reset-k");
    var r = $("#reset-k");
    if (r) r.addEventListener("click", function () { kstate.q = ""; kstate.grup = "semua"; $("#q-kat-in").value = ""; renderKatList(id); });
  }

  function showKategori(id) {
    var k = KAT[id];
    var list = itemsOf(id);
    var main = list.filter(function (d) { return d.utama; })[0];
    var locked = list.filter(function (d) { return d.terbatas; }).length;
    kstate = { q: "", grup: "semua" };

    viewKat.innerHTML =
      '<section class="kat-head" style="--c:' + esc(k.warna) + '"><div class="wrap">' +
      '<nav class="crumbs" aria-label="Jejak halaman"><a href="#/">Beranda</a><span aria-hidden="true">/</span><a href="#kategori">Kategori</a><span aria-hidden="true">/</span><span aria-current="page">' + esc(k.nama) + "</span></nav>" +
      '<div class="kat-title"><span class="chip-ico">' + ic(k.ikon) + '</span><div><h1>' + esc(k.nama) + '</h1><p class="full">' + esc(k.namaPanjang) + "</p></div></div>" +
      '<p class="kat-desc">' + esc(k.deskripsi) + "</p>" +
      '<div class="kat-meta"><span class="count">' + list.length + " tautan · diperbarui " + esc(fmtDate(latest(list))) + "</span>" +
      (main ? '<a class="btn" href="' + esc(main.url) + '" target="_blank" rel="noopener">' + ic(main._j.ikon) + (main.jenis === "folder" ? "Buka folder utama" : "Buka data utama") + "</a>" : "") +
      '<button class="btn ghost" type="button" data-copy="' + esc(location.href.split("#")[0] + "#/k/" + id) + '">' + ic("link") + "Salin tautan halaman</button>" +
      "</div>" +
      (locked ? '<div class="notice">' + ic("lock") + "<p><b>" + locked + " berkas berlabel Terbatas</b> karena memuat data pribadi warga. Bila tidak bisa dibuka, <a href=\"" + esc(MAIL_AKSES) + "\">minta akses ke admin desa</a>.</p></div>" : "") +
      "</div></section>" +
      '<section class="wrap kat-body">' +
      '<div class="toolbar"><div class="field grow"><label for="q-kat-in" class="sr-only">Cari di kategori ' + esc(k.nama) + '</label><span class="field-ico">' + ic("search") + '</span><input id="q-kat-in" type="search" placeholder="Cari di ' + esc(k.nama) + '…" autocomplete="off"></div></div>' +
      '<div class="chips" id="kgrup" role="group" aria-label="Saring jenis berkas"></div>' +
      '<ul class="list" id="klist"></ul>' +
      '<div class="related"><h2>Kategori terkait</h2><div class="cat-grid">' +
      relatedOf(id).map(function (r) {
        return '<a class="tile" href="#/k/' + esc(r.id) + '" style="--c:' + esc(r.warna) + '"><span class="chip-ico">' + ic(r.ikon) + '</span><div class="tile-body"><div class="tile-title"><h3>' + esc(r.nama) + '</h3><span class="count">' + itemsOf(r.id).length + "</span></div><p>" + esc(r.deskripsi) + "</p></div></a>";
      }).join("") +
      "</div></div></section>";

    renderKatList(id);
    var qi = $("#q-kat-in"), kt;
    qi.addEventListener("input", function () { clearTimeout(kt); kt = setTimeout(function () { kstate.q = qi.value; renderKatList(id); }, 120); });
    $("#kgrup").addEventListener("click", function (e) {
      var b = e.target.closest("[data-grup]");
      if (!b) return;
      kstate.grup = b.getAttribute("data-grup"); renderKatList(id);
    });

    viewHome.hidden = true;
    viewKat.hidden = false;
    document.title = k.nama + " · Satu Data Desa Sumber Sari";
    window.scrollTo(0, 0);
    setActiveNav(null);
  }

  function showHome(hash) {
    var wasKat = !viewKat.hidden;
    viewKat.hidden = true;
    viewHome.hidden = false;
    document.title = "Satu Data Desa Sumber Sari";
    var id = hash && hash.charAt(1) !== "/" ? hash.slice(1) : "";
    var el = id && document.getElementById(id);
    if (el) {
      requestAnimationFrame(function () { el.scrollIntoView({ behavior: wasKat ? "auto" : "smooth" }); });
    } else if (wasKat || hash === "#/") {
      window.scrollTo(0, 0);
    }
  }

  function route() {
    var m = location.hash.match(/^#\/k\/([\w-]+)/);
    if (m && KAT[m[1]]) showKategori(m[1]);
    else showHome(location.hash);
  }
  window.addEventListener("hashchange", route);

  /* ---------- sorot menu aktif ---------- */
  var navA = $$(".nav-links a");
  function setActiveNav(id) {
    navA.forEach(function (a) { a.classList.toggle("aktif", !!id && a.getAttribute("href") === "#" + id); });
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting && !viewHome.hidden) setActiveNav(en.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["kategori", "alur", "katalog", "publikasi", "panduan"].forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }

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
      $("#footer-upd").textContent = "Katalog diperbarui " + fmtDate(S.situs.diperbarui);
      if (S.situs.program) $("#program-label").textContent = S.situs.program;
    }
  }

  renderStats();
  renderQuick();
  renderCategories();
  renderFlow();
  renderCatalog();
  renderShelf();
  renderMeta();
  route();

  /* ---------- akun & keluar ---------- */
  var logoutBtn = $("#logout");
  if (sesi.keluar) {
    logoutBtn.hidden = false;
    logoutBtn.innerHTML = ic("logout");
    var nm = sesi.akun && sesi.akun.nama ? sesi.akun.nama : "akun ini";
    logoutBtn.title = "Keluar (" + nm + ")";
    logoutBtn.setAttribute("aria-label", "Keluar dari " + nm);
    logoutBtn.addEventListener("click", sesi.keluar);
  }
  if (sesi.baruMasuk && sesi.akun) toast("Masuk sebagai " + (sesi.akun.nama || "perangkat desa"), "check");
  };
})();
