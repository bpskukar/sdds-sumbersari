/* SDDS — pasang di HP (Progressive Web App) */
(function () {
  "use strict";
  window.SDDSPasang = { acara: null };
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    window.SDDSPasang.acara = e;
    try { document.dispatchEvent(new Event("sdds-bisa-pasang")); } catch (err) { /* abaikan */ }
  });
  window.addEventListener("appinstalled", function () {
    window.SDDSPasang.acara = null;
    try { document.dispatchEvent(new Event("sdds-bisa-pasang")); } catch (err) { /* abaikan */ }
  });
  if ("serviceWorker" in navigator && window.isSecureContext) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () { /* abaikan */ }); });
  }
})();
