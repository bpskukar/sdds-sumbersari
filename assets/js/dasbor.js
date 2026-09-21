/* =====================================================================
   SDDS — Dasbor statistik penduduk
   Menampilkan angka ringkasan dari Apps Script (?aksi=dasbor).
   Data per orang (nama, NIK) tidak pernah sampai ke browser.
   ===================================================================== */
(function () {
  "use strict";

  var tip = null;

  function pct(n, total) {
    if (!total || !n) return "0%";
    var v = (n / total) * 100;
    return (v < 10 ? v.toFixed(1) : Math.round(v).toString()).replace(".", ",") + "%";
  }
  function niceMax(v) {
    if (v <= 0) return 1;
    var p = Math.pow(10, Math.floor(Math.log10(v)));
    var m = v / p;
    return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
  }
  function jumlah(arr) { return arr.reduce(function (a, x) { return a + (x.n || 0); }, 0); }

  function render(el, o) {
    var esc = o.esc, ic = o.ic, fA = o.fmtAngka;
    var d = o.data;
    var head =
      '<section class="kat-head dash-head" style="--c:#2F7FC1"><div class="wrap">' +
      '<nav class="crumbs" aria-label="Jejak halaman"><a href="#/">Beranda</a><span aria-hidden="true">/</span><span aria-current="page">Statistik penduduk</span></nav>' +
      '<div class="kat-title"><span class="chip-ico">' + ic("chart") + '</span><div><h1>Statistik Penduduk</h1><p class="full">Desa Sumber Sari' +
      (d && d.sumber ? " · diolah dari spreadsheet " + esc(d.sumber.nama) : "") + "</p></div></div>" +
      '<p class="kat-desc">Angka ringkasan yang dihitung otomatis dari data penduduk per orang. Nama, NIK, dan alamat tidak pernah ditampilkan di halaman ini.</p>' +
      '<div class="kat-meta">' +
      (d && d.diperbarui ? '<span class="count">Dihitung ' + esc(o.fmtDate(String(d.diperbarui).slice(0, 10))) + " pukul " + esc(String(d.diperbarui).slice(11, 16)) + "</span>" : "") +
      (o.sumberUrl ? '<a class="btn ghost" href="' + esc(o.sumberUrl) + '" target="_blank" rel="noopener">' + ic("lock") + "Buka data sumber</a>" : "") +
      (o.mode === "sheet" ? '<button class="btn ghost" type="button" data-act="dasbor-muat">' + ic("cycle") + "Muat ulang</button>" : "") +
      (o.editing && o.mode === "sheet" ? '<button class="btn gold" type="button" data-act="dasbor-hitung">' + ic("chart") + "Hitung ulang sekarang</button>" : "") +
      "</div></div></section>";

    var body;
    if (o.mode !== "sheet") {
      body = kosong(ic("database"), "Dasbor aktif setelah website tersambung ke Google Sheet",
        "Angka statistik dihitung oleh Google Apps Script dari spreadsheet DATA SUMBER SARI. Sambungkan website ke spreadsheet database lebih dulu (README bagian <i>Mode edit</i>).");
    } else if (o.galat === "versi-lama") {
      body = '<div class="viz-empty">' + ic("alert") + "<h2>Apps Script perlu diperbarui</h2>" + o.teksPerbarui() + "</div>";
    } else if (!d && o.memuat) {
      body = '<div class="viz-empty"><span class="spin besar" aria-hidden="true"></span><h2>Menghitung statistik…</h2><p>Pertama kali bisa sampai setengah menit karena spreadsheet penduduk cukup besar.</p></div>';
    } else if (!d) {
      body = kosong(ic("alert"), "Dasbor belum bisa dimuat", esc(o.galat || "Coba muat ulang.") + ' <br><button class="btn" type="button" data-act="dasbor-muat">Coba lagi</button>');
    } else {
      body = isi(d, o) + (o.galat ? '<p class="viz-note warn">' + ic("alert") + "Data terbaru belum bisa dimuat (" + esc(o.galat) + "). Yang tampil adalah hitungan terakhir.</p>" : "");
    }
    el.innerHTML = head + '<section class="wrap dash-body viz-root' + (d && o.memuat ? " refetch" : "") + '" aria-busy="' + (o.memuat ? "true" : "false") + '">' + body + "</section>";
    pasangTooltip(el);

    function kosong(ikon, judul, teks) {
      return '<div class="viz-empty">' + ikon + "<h2>" + judul + "</h2><p>" + teks + "</p></div>";
    }
  }

  /* ---------------- isi dasbor ---------------- */
  function isi(d, o) {
    var esc = o.esc, ic = o.ic, fA = o.fmtAngka;
    var T = d.total || 0;
    var rasioJk = d.perempuan ? Math.round((d.laki / d.perempuan) * 100) : 0;
    var tanggungan = d.produktif ? Math.round(((d.anak + d.lansia) / d.produktif) * 100) : 0;
    var perKk = d.kk ? (T / d.kk).toFixed(2).replace(".", ",") : "–";

    var kpi =
      '<div class="kpi-row">' +
      tile("Penduduk", fA(T), "jiwa", "tercatat di data per orang", "hero") +
      tile("Kepala keluarga", fA(d.kk), "KK", "rata-rata " + perKk + " jiwa per KK") +
      tile("Laki-laki", fA(d.laki), "jiwa", pct(d.laki, T) + " dari penduduk", "", "l") +
      tile("Perempuan", fA(d.perempuan), "jiwa", pct(d.perempuan, T) + " dari penduduk", "", "p") +
      tile("Rasio jenis kelamin", String(rasioJk), "", "laki-laki per 100 perempuan") +
      tile("Usia produktif", pct(d.produktif, d.anak + d.produktif + d.lansia), "", "umur 15–64 · anak " + pct(d.anak, d.anak + d.produktif + d.lansia) + " · lansia " + pct(d.lansia, d.anak + d.produktif + d.lansia)) +
      tile("Rasio ketergantungan", String(tanggungan), "", "anak & lansia per 100 usia produktif") +
      (d.medianUmur != null ? tile("Median umur", String(d.medianUmur), "tahun", "separuh penduduk lebih muda dari ini") : "") +
      "</div>";

    function tile(label, nilai, satuan, ket, kelas, seri) {
      return '<div class="kpi' + (kelas ? " " + kelas : "") + '"><p class="kpi-label">' + (seri ? '<span class="key ' + seri + '" aria-hidden="true"></span>' : "") + esc(label) + '</p><p class="kpi-val"><b>' + esc(nilai) + "</b>" + (satuan ? "<span>" + esc(satuan) + "</span>" : "") + '</p><p class="kpi-ket">' + esc(ket) + "</p></div>";
    }

    var legenda = '<div class="legend"><span><i class="sw l"></i>Laki-laki <b>' + fA(d.laki) + '</b></span><span><i class="sw p"></i>Perempuan <b>' + fA(d.perempuan) + "</b></span></div>";

    /* piramida */
    var pir = (d.piramida || []).slice().reverse();
    var mx = niceMax(Math.max.apply(null, pir.map(function (x) { return Math.max(x.L, x.P); }).concat([1])));
    var piramida = '<div class="pyr" role="group" aria-label="Piramida penduduk menurut kelompok umur dan jenis kelamin. Rincian ada di tabel.">' +
      pir.map(function (x) {
        return '<div class="pyr-row"><span class="pyr-side l">' + (x.L ? '<span class="pyr-bar l" style="width:' + (x.L / mx * 100) + '%" tabindex="0" data-tip="' + esc(fA(x.L) + " jiwa|Laki-laki · umur " + x.kelompok) + '"></span>' : "") + "</span>" +
          '<span class="pyr-age">' + esc(x.kelompok) + '</span>' +
          '<span class="pyr-side p">' + (x.P ? '<span class="pyr-bar p" style="width:' + (x.P / mx * 100) + '%" tabindex="0" data-tip="' + esc(fA(x.P) + " jiwa|Perempuan · umur " + x.kelompok) + '"></span>' : "") + "</span></div>";
      }).join("") +
      '<div class="pyr-row pyr-axis" aria-hidden="true"><span class="pyr-side l"><span>' + fA(mx) + "</span><span>" + fA(mx / 2) + '</span><span>0</span></span><span class="pyr-age">umur</span><span class="pyr-side p"><span>0</span><span>' + fA(mx / 2) + "</span><span>" + fA(mx) + "</span></span></div></div>";
    var tabPir = tabel(["Kelompok umur", "Laki-laki", "Perempuan", "Jumlah"], (d.piramida || []).map(function (x) { return [x.kelompok, fA(x.L), fA(x.P), fA(x.L + x.P + (x.X || 0))]; }));

    /* per RT (bertumpuk L/P) */
    var rt = d.rt || [];
    var mxRt = Math.max.apply(null, rt.map(function (x) { return x.L + x.P + (x.X || 0); }).concat([1]));
    var perRt = '<div class="bl" role="group" aria-label="Jumlah penduduk per RT menurut jenis kelamin. Rincian ada di tabel.">' + rt.map(function (x) {
      var tot = x.L + x.P + (x.X || 0);
      return '<div class="bl-row"><span class="bl-label">' + esc(x.rt) + '</span><span class="bl-track stk">' +
        '<span class="seg l" style="width:' + (x.L / mxRt * 100) + '%" tabindex="0" data-tip="' + esc(fA(x.L) + " jiwa|Laki-laki · " + x.rt) + '"></span>' +
        '<span class="seg p" style="width:' + (x.P / mxRt * 100) + '%" tabindex="0" data-tip="' + esc(fA(x.P) + " jiwa|Perempuan · " + x.rt) + '"></span>' +
        '</span><span class="bl-val"><b>' + fA(tot) + '</b><small>' + pct(tot, T) + "</small></span></div>";
    }).join("") + "</div>";
    var tabRt = tabel(["RT", "Laki-laki", "Perempuan", "Jumlah", "% penduduk"], rt.map(function (x) { var t = x.L + x.P + (x.X || 0); return [x.rt, fA(x.L), fA(x.P), fA(t), pct(t, T)]; }));

    function daftarBatang(arr, total, satuan) {
      var m = Math.max.apply(null, arr.map(function (x) { return x.n; }).concat([1]));
      return '<div class="bl">' + arr.map(function (x) {
        return '<div class="bl-row"><span class="bl-label">' + esc(x.label) + '</span><span class="bl-track">' + (x.n ? '<span class="bar" style="width:' + (x.n / m * 100) + '%" tabindex="0" data-tip="' + esc(fA(x.n) + " " + satuan + " · " + pct(x.n, total) + "|" + x.label) + '"></span>' : "") + "</span>" +
          '<span class="bl-val"><b>' + fA(x.n) + "</b><small>" + pct(x.n, total) + "</small></span></div>";
      }).join("") + "</div>";
    }
    function kartuBatang(judul, sub, arr, total, satuan, lebar, catatan) {
      if (!arr || !arr.length) return "";
      return kartu(judul, sub, daftarBatang(arr, total, satuan) + (catatan ? '<p class="viz-note">' + catatan + "</p>" : ""), tabel(["Kategori", "Jumlah", "Persen"], arr.map(function (x) { return [x.label, fA(x.n), pct(x.n, total)]; })), lebar);
    }
    function kartu(judul, sub, isiHtml, tabelHtml, lebar, legendHtml) {
      return '<article class="viz-card' + (lebar ? " wide" : "") + '"><header><h3>' + judul + "</h3>" + (sub ? "<p>" + sub + "</p>" : "") + "</header>" + (legendHtml || "") + isiHtml + (tabelHtml || "") + "</article>";
    }
    function tabel(kolom, baris) {
      return '<details class="viz-tabel"><summary>' + ic("table") + "Lihat tabel</summary><div class=\"tbl-wrap\"><table><thead><tr>" +
        kolom.map(function (k, i) { return "<th" + (i ? ' class="num"' : "") + ">" + esc(k) + "</th>"; }).join("") + "</tr></thead><tbody>" +
        baris.map(function (b) { return "<tr>" + b.map(function (c, i) { return "<td" + (i ? ' class="num"' : "") + ">" + esc(c) + "</td>"; }).join("") + "</tr>"; }).join("") +
        "</tbody></table></div></details>";
    }

    var desilTot = jumlah(d.desil || []);
    var bansosTot = jumlah(d.bansos || []);
    var usahaTot = jumlah(d.usaha || []);
    var q = d.kualitas || {};
    var cekKualitas = [
      ["NIK tercatat ganda", q.nikGanda, "Baris dengan NIK yang sama muncul lebih dari sekali (dihitung satu kali)."],
      ["NIK kosong", q.nikKosong, "Baris tanpa NIK tetap dihitung, tetapi tidak bisa dicek ganda."],
      ["Jenis kelamin kosong", q.jkKosong, "Tidak masuk hitungan laki-laki/perempuan."],
      ["Umur tidak terbaca", q.usiaKosong, "Kolom Usia kosong dan tanggal lahir tidak valid."],
      ["RT kosong", q.rtKosong, "Masuk kelompok “Tanpa RT”."]
    ];
    var adaMasalah = cekKualitas.some(function (c) { return c[1] > 0; });
    var kualitas = kartu("Kualitas data sumber", adaMasalah ? "Perlu dirapikan di spreadsheet agar angka makin tepat" : "Tidak ada masalah yang terdeteksi",
      '<ul class="q-list">' + cekKualitas.map(function (c) {
        var ok = !c[1];
        return '<li class="' + (ok ? "ok" : "warn") + '"><span class="q-ico">' + ic(ok ? "check" : "alert") + '</span><div><b>' + esc(c[0]) + '</b><span class="q-n">' + (ok ? "tidak ada" : fA(c[1]) + " baris") + "</span>" + (ok ? "" : "<p>" + esc(c[2]) + "</p>") + "</div></li>";
      }).join("") + "</ul>", "");

    return kpi +
      '<div class="viz-grid">' +
      kartu("Piramida penduduk", "Jumlah jiwa per kelompok umur 5 tahunan", piramida, tabPir, true, legenda) +
      kartu("Penduduk per RT", "Batang dibagi laki-laki dan perempuan; angka di ujung = jumlah jiwa", perRt, tabRt, false, legenda) +
      kartuBatang("Pendidikan terakhir", "Urut dari jenjang terendah", d.pendidikan, T, "jiwa") +
      kartuBatang("Pekerjaan", "10 pekerjaan terbanyak", d.pekerjaan, T, "jiwa") +
      kartuBatang("Status perkawinan", "", d.kawin, T, "jiwa") +
      kartuBatang("Jaminan kesehatan", "Kepesertaan BPJS", d.bpjs, T, "jiwa") +
      kartuBatang("Peringkat desil DTSEN", fA(desilTot) + " jiwa punya peringkat desil", d.desil, desilTot, "jiwa", false, "Desil 1 = 10% keluarga paling rendah kesejahteraannya secara nasional.") +
      kartuBatang("Penerima bantuan sosial", fA(bansosTot) + " jiwa tercatat menerima (" + pct(bansosTot, T) + ")", d.bansos, bansosTot, "jiwa") +
      kartuBatang("Agama", "", d.agama, T, "jiwa") +
      kartuBatang("Suku", "", d.suku, T, "jiwa") +
      (usahaTot ? kartuBatang("Usaha warga", fA(usahaTot) + " jiwa mencatat usaha", d.usaha, usahaTot, "jiwa") : "") +
      kualitas +
      "</div>" +
      '<p class="viz-note">Kategori berisi kurang dari 3 orang digabung ke “Lainnya” agar tidak menunjuk warga tertentu. Tab yang dibaca: ' + esc((d.sumber && d.sumber.tab || []).join(", ")) + ".</p>";
  }

  /* ---------------- tooltip ---------------- */
  function pasangTooltip(root) {
    if (!tip) {
      tip = document.createElement("div");
      tip.className = "viz-tip";
      tip.setAttribute("role", "tooltip");
      tip.hidden = true;
      document.body.appendChild(tip);
    }
    if (root.__tipPasang) return;
    root.__tipPasang = true;
    function isi(t) {
      var p = String(t.getAttribute("data-tip") || "").split("|");
      tip.textContent = "";
      var b = document.createElement("b"); b.textContent = p[0] || "";
      var s = document.createElement("span"); s.textContent = p[1] || "";
      tip.appendChild(b); tip.appendChild(s);
      tip.hidden = false;
    }
    function posisi(x, y) {
      var w = tip.offsetWidth, h = tip.offsetHeight;
      var left = Math.min(Math.max(8, x + 14), window.innerWidth - w - 8);
      var top = y - h - 12 < 8 ? y + 18 : y - h - 12;
      tip.style.left = left + "px"; tip.style.top = top + "px";
    }
    root.addEventListener("pointermove", function (e) {
      var t = e.target.closest && e.target.closest("[data-tip]");
      if (!t) { tip.hidden = true; return; }
      isi(t); posisi(e.clientX, e.clientY);
    });
    root.addEventListener("pointerleave", function () { tip.hidden = true; });
    root.addEventListener("focusin", function (e) {
      var t = e.target.closest && e.target.closest("[data-tip]");
      if (!t) return;
      isi(t);
      var r = t.getBoundingClientRect();
      posisi(r.left + r.width / 2, r.top);
    });
    root.addEventListener("focusout", function () { tip.hidden = true; });
    window.addEventListener("scroll", function () { if (tip) tip.hidden = true; }, { passive: true });
  }

  window.SDDSDasbor = { render: render };
})();
