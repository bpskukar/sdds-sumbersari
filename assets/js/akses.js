/* =====================================================================
   SDDS — gerbang masuk perangkat desa
   Kata sandi tidak pernah disimpan. Situs hanya menyimpan hash
   PBKDF2-SHA256 dari (email/ID + kata sandi) di data/katalog.js.
   ===================================================================== */
(function () {
  "use strict";

  var S = window.SDDS || {};
  var A = S.akses || {};
  var KEY = "sdds-sesi";
  var GARAM = A.garam || "sdds-sumbersari-2026";
  var ITER = A.iterasi || 150000;
  var WAJIB = A.wajibMasuk !== false;
  var AKUN = (A.akun || []).filter(function (a) { return a && /^[0-9a-f]{64}$/.test(String(a.hash || "")); });

  function $(s, r) { return (r || document).querySelector(s); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function hex(buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
  }
  function siapKripto() { return !!(window.crypto && window.crypto.subtle && window.TextEncoder); }
  function rapikanId(id) { return String(id || "").trim().toLowerCase(); }

  /* hash = PBKDF2(kata sandi, garam + ":" + id, ITER, SHA-256) */
  function buatHash(id, sandi) {
    var enc = new TextEncoder();
    return crypto.subtle.importKey("raw", enc.encode(sandi), "PBKDF2", false, ["deriveBits"]).then(function (key) {
      return crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: enc.encode(GARAM + ":" + rapikanId(id)), iterations: ITER }, key, 256);
    }).then(hex);
  }
  function cariAkun(h) {
    for (var i = 0; i < AKUN.length; i++) if (AKUN[i].hash === h) return AKUN[i];
    return null;
  }

  /* ---------- sesi ---------- */
  function bacaSesi() {
    var raw = null;
    try { raw = sessionStorage.getItem(KEY) || localStorage.getItem(KEY); } catch (e) { return null; }
    if (!raw) return null;
    var s;
    try { s = JSON.parse(raw); } catch (e) { return null; }
    if (!s || !s.h || (s.exp && Date.now() > s.exp)) return null;
    return cariAkun(s.h);
  }
  function simpanSesi(akun, ingat) {
    var v = JSON.stringify({ h: akun.hash, exp: ingat ? Date.now() + 30 * 864e5 : 0 });
    try { (ingat ? localStorage : sessionStorage).setItem(KEY, v); } catch (e) { /* sesi hanya bertahan di halaman ini */ }
  }
  function hapusSesi() {
    try { sessionStorage.removeItem(KEY); localStorage.removeItem(KEY); } catch (e) { /* abaikan */ }
  }

  /* ---------- pembuat kode akun (dipakai di layar penyiapan & ganti-sandi.html) ---------- */
  function renderGenerator(el) {
    if (!el) return;
    el.innerHTML =
      '<form class="gen" novalidate>' +
      '<div class="gf"><label for="gen-nama">Nama akun</label><input id="gen-nama" type="text" value="Perangkat Desa Sumber Sari" autocomplete="off"><p class="gf-hint">Nama yang tampil setelah masuk, mis. “Perangkat Desa Sumber Sari” atau “Pak Dedi — Kasi Pemerintahan”.</p></div>' +
      '<div class="gf"><label for="gen-id">Email / ID untuk masuk</label><input id="gen-id" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="mis. perangkat@sumbersari"></div>' +
      '<div class="gf"><label for="gen-pw">Kata sandi</label><input id="gen-pw" type="password" autocomplete="new-password"><p class="gf-hint">Minimal 8 karakter. Jangan pakai kata sandi akun Gmail.</p></div>' +
      '<div class="gf"><label for="gen-pw2">Ulangi kata sandi</label><input id="gen-pw2" type="password" autocomplete="new-password"></div>' +
      '<p class="gate-err" role="alert" hidden></p>' +
      '<button class="btn gold gate-btn" type="submit">Buat kode akun</button>' +
      '</form>' +
      '<div class="gen-out" hidden>' +
      '<p class="gen-lbl">Kode akun — tempel di <code>data/katalog.js</code> bagian <code>akun: [ ]</code></p>' +
      '<pre class="gen-code" tabindex="0"></pre>' +
      '<button class="btn gen-copy" type="button">Salin kode</button>' +
      '<ol class="gen-steps"><li>Buka repositori di GitHub → <code>data/katalog.js</code> → ikon pensil.</li><li>Cari tulisan <code>tempel kode akun di sini</code>, lalu tempel kode tepat di atasnya.</li><li>Commit. Dalam ±1 menit situs meminta login dengan email/ID dan kata sandi tadi.</li></ol>' +
      '</div>';

    var form = $(".gen", el), err = $(".gate-err", el), out = $(".gen-out", el), code = $(".gen-code", el), btn = $(".gate-btn", el);
    function salah(m) { err.textContent = m; err.hidden = false; }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      err.hidden = true;
      var nama = $("#gen-nama", el).value.trim() || "Perangkat desa";
      var id = $("#gen-id", el).value, pw = $("#gen-pw", el).value, pw2 = $("#gen-pw2", el).value;
      if (!rapikanId(id)) return salah("Isi email atau ID untuk masuk.");
      if (pw.length < 8) return salah("Kata sandi minimal 8 karakter.");
      if (pw !== pw2) return salah("Kedua kata sandi belum sama.");
      if (!siapKripto()) return salah("Browser ini tidak mendukung pembuatan kode. Buka lewat alamat https (GitHub Pages) dengan Chrome/Edge/Firefox terbaru.");
      btn.disabled = true; btn.textContent = "Membuat kode…";
      buatHash(id, pw).then(function (h) {
        code.textContent = '{ nama: "' + nama.replace(/["\\]/g, "") + '", hash: "' + h + '" },';
        out.hidden = false;
        $("#gen-pw", el).value = ""; $("#gen-pw2", el).value = "";
        out.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, function () {
        salah("Gagal membuat kode. Muat ulang halaman lalu coba lagi.");
      }).then(function () { btn.disabled = false; btn.textContent = "Buat kode akun"; });
    });
    $(".gen-copy", el).addEventListener("click", function () {
      var b = this, t = code.textContent;
      function ok() { b.textContent = "Tersalin ✓"; setTimeout(function () { b.textContent = "Salin kode"; }, 1800); }
      function manual() {
        var r = document.createRange(); r.selectNodeContents(code);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        try { document.execCommand("copy") ? ok() : (b.textContent = "Tekan Ctrl+C"); } catch (e) { b.textContent = "Tekan Ctrl+C"; }
      }
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(t).then(ok, manual); else manual();
    });
  }

  window.SDDSAkses = { buatHash: buatHash, renderGenerator: renderGenerator, keluar: keluar };

  /* ---------- gerbang ---------- */
  var gate = $("#gate"), app = $("#app");
  if (!gate || !app) return; /* halaman lain (mis. ganti-sandi.html) */

  var booted = false;
  function masuk(akun, baruMasuk) {
    gate.hidden = true;
    app.hidden = false;
    if (!booted) {
      booted = true;
      if (typeof window.SDDSBoot === "function") window.SDDSBoot({ akun: akun, baruMasuk: !!baruMasuk, keluar: WAJIB ? keluar : null });
    }
  }
  function keluar() {
    hapusSesi();
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { /* abaikan */ }
    location.reload();
  }

  if (!WAJIB) { masuk(null); return; }
  var sesi = bacaSesi();
  if (sesi) { masuk(sesi); return; }

  app.hidden = true;
  gate.hidden = false;
  var email = (S.kontak && S.kontak.email) || "";
  var help = $("#g-help");
  if (help) help.href = "mailto:" + email + "?subject=" + encodeURIComponent("Akun SDDS perangkat desa");

  if (!AKUN.length) {
    /* belum ada akun: tampilkan layar penyiapan, situs tetap terkunci */
    $("#gate-login").hidden = true;
    $("#gate-setup").hidden = false;
    renderGenerator($("#gate-gen"));
    return;
  }

  var form = $("#gate-form"), fId = $("#g-id"), fPw = $("#g-pw"), fIngat = $("#g-ingat"), err = $("#g-err"), btn = $("#g-btn"), eye = $("#g-eye");
  function salah(m) { err.textContent = m; err.hidden = false; }
  eye.addEventListener("click", function () {
    var show = fPw.type === "password";
    fPw.type = show ? "text" : "password";
    eye.setAttribute("aria-pressed", show ? "true" : "false");
    eye.setAttribute("aria-label", show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi");
    eye.classList.toggle("on", show);
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    err.hidden = true;
    if (!rapikanId(fId.value) || !fPw.value) return salah("Isi email/ID dan kata sandi.");
    if (!siapKripto()) return salah("Browser ini tidak mendukung login aman. Buka situs lewat alamat https dengan Chrome/Edge/Firefox terbaru.");
    btn.disabled = true; btn.textContent = "Memeriksa…";
    buatHash(fId.value, fPw.value).then(function (h) {
      var akun = cariAkun(h);
      if (!akun) { salah("Email/ID atau kata sandi salah. Periksa lagi, atau hubungi admin desa."); fPw.value = ""; fPw.focus(); return; }
      simpanSesi(akun, fIngat.checked);
      fPw.value = "";
      masuk(akun, true);
    }, function () {
      salah("Terjadi kendala saat memeriksa. Muat ulang halaman lalu coba lagi.");
    }).then(function () { btn.disabled = false; btn.textContent = "Masuk"; });
  });
  try { fId.focus({ preventScroll: true }); } catch (e) { fId.focus(); }
})();
