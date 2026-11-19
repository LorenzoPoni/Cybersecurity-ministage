/* ==========================================================================
   LOGICA BARRA DI NAVIGAZIONE (navbar.js)
   ========================================================================== */

(function () {
  const NAVBAR_FALLBACK_HTML = `
    <nav class="navbar" aria-label="Navigazione principale">
      <div class="nav-logo">
        <a href="/">Lab <span>Pascal</span></a>
      </div>
      <div id="nome"></div>
      <ul class="nav-links">
        <li><a href="/" data-nav-page="/">Home</a></li>
        <li><a href="/codifica" data-nav-page="/codifica">01. Codifica</a></li>
        <li><a href="/decodifica" data-nav-page="/decodifica">02. Decodifica</a></li>
        <li><a href="/bruteforce" data-nav-page="/bruteforce">03. Brute Force</a></li>
      </ul>
    </nav>
  `;

  /**
   * Evidenzia il link attivo in base alla rotta corrente del server
   */
  function highlightActiveNavLink() {
    const currentRoute = window.location.pathname.replace(/\/+$/, "") || "/";

    document.querySelectorAll(".nav-links a[data-nav-page]").forEach((link) => {
      const targetRoute = link.getAttribute("data-nav-page");
      if (targetRoute === currentRoute) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function setupToastClose() {
    const toast = document.getElementById("preview-toast");
    const toastClose = document.getElementById("toast-close");

    if (toastClose && toast && !toastClose.dataset.bound) {
      toastClose.dataset.bound = "true";
      toastClose.addEventListener("click", () => toast.classList.add("hidden"));
    }
  }

  async function loadNavbar() {
    const placeholder = document.getElementById("navbar-placeholder");
    if (!placeholder) return;

    try {
      const response = await fetch("/navbar.html");
      if (!response.ok) throw new Error("Impossibile caricare /navbar.html");
      placeholder.innerHTML = await response.text();
    } catch (_) {
      placeholder.innerHTML = NAVBAR_FALLBACK_HTML;
    }

    highlightActiveNavLink();
    setupToastClose();
  }

  window.addEventListener("DOMContentLoaded", () => {
    loadNavbar();
    setupToastClose();
  });
})();