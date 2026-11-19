/* ==========================================================================
   LOGICA FOOTER (footer.js)
   ========================================================================== */

(function () {
  const FOOTER_FALLBACK_HTML = `
    <footer class="footer-main border-t border-slate-800/80 bg-slate-950/60 mt-12">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-5 text-center text-xs sm:text-sm text-slate-400">
        Laboratorio Pascal
      </div>
    </footer>
  `;

  /**
   * Carica footer.html nel placeholder (con fallback se aperto senza server HTTP)
   */
  async function loadFooter() {
    const placeholder = document.getElementById("footer-placeholder");
    if (!placeholder) return;

    try {
      const response = await fetch("components/footer.html");
      if (!response.ok) throw new Error("Impossibile caricare footer.html");
      placeholder.innerHTML = await response.text();
    } catch (_) {
      placeholder.innerHTML = FOOTER_FALLBACK_HTML;
    }
  }

  window.addEventListener("DOMContentLoaded", loadFooter);
})();