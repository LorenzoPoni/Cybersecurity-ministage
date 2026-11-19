/* ==========================================================================
   LOGICA FASE 03: SIMULAZIONE BRUTE FORCE PYTHON (bruteforce.js)
   ========================================================================== */

(function () {
  const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const PLAIN_QUOTE =
    "THE ONLY WAY TO DO GREAT WORK IS TO LOVE WHAT YOU DO. STAY HUNGRY, STAY FOOLISH.";
  const SECRET_KEY = 7;

  let runTimer = null;

  /**
   * Applica uno spostamento di Cesare (positivo per cifrare, negativo per decifrare)
   */
  function caesarShift(text, shift) {
    const cleanShift = ((shift % 26) + 26) % 26;
    return text
      .split("")
      .map((char) => {
        const idx = ALFABETO.indexOf(char);
        if (idx === -1) return char;
        return ALFABETO[(idx + cleanShift) % 26];
      })
      .join("");
  }

  /**
   * Simula l'esecuzione del ciclo for Python da chiave 1 a 25 nel terminale
   */
  function runPythonBruteForceSimulation() {
    const terminal = document.getElementById("terminal-output");
    const statusBadge = document.getElementById("terminal-status-badge");
    const btnRun = document.getElementById("btn-run-bruteforce");
    if (!terminal) return;

    clearInterval(runTimer);

    const cipherQuote = caesarShift(PLAIN_QUOTE, SECRET_KEY);
    terminal.innerHTML = `<p class="text-slate-500">$ python3 brute_force_cesare.py</p>`;

    if (statusBadge) {
      statusBadge.textContent = "In esecuzione...";
      statusBadge.className =
        "font-cyber-mono text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300";
    }
    if (btnRun) {
      btnRun.disabled = true;
      btnRun.classList.add("opacity-70");
    }

    let key = 1;
    runTimer = setInterval(() => {
      if (key > 25) {
        clearInterval(runTimer);
        const doneLine = document.createElement("p");
        doneLine.className = "text-sky-400 pt-1";
        doneLine.textContent = "✓ Scansione completata: chiave corretta trovata (-07)!";
        terminal.appendChild(doneLine);
        terminal.scrollTop = terminal.scrollHeight;

        if (statusBadge) {
          statusBadge.textContent = "Completato";
          statusBadge.className =
            "font-cyber-mono text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300";
        }
        if (btnRun) {
          btnRun.disabled = false;
          btnRun.classList.remove("opacity-70");
        }
        return;
      }

      const candidate = caesarShift(cipherQuote, -key);
      const paddedKey = String(key).padStart(2, "0");
      const line = document.createElement("p");

      if (key === SECRET_KEY) {
        line.className = "terminal-row-match font-bold";
        line.textContent = `Chiave -${paddedKey}: ${candidate}  <-- TROVATA!`;
      } else {
        line.className = "text-slate-400 break-words";
        line.textContent = `Chiave -${paddedKey}: ${candidate}`;
      }

      terminal.appendChild(line);
      terminal.scrollTop = terminal.scrollHeight;
      key += 1;
    }, 65);
  }

  /**
   * Copia il codice Python negli appunti
   */
  async function copyPythonCode() {
    const codeEl = document.getElementById("python-code-block");
    const btnCopy = document.getElementById("btn-copy-python");
    if (!codeEl || !btnCopy) return;

    try {
      await navigator.clipboard.writeText(codeEl.innerText);
      const original = btnCopy.textContent;
      btnCopy.textContent = "✅ Copiato!";
      setTimeout(() => {
        btnCopy.textContent = original;
      }, 1800);
    } catch (_) {
      // Fallback silenzioso
    }
  }

  window.addEventListener("DOMContentLoaded", () => {
    const cipherEl = document.getElementById("cipher-quote-text");
    const plainEl = document.getElementById("plain-quote-text");
    const btnRun = document.getElementById("btn-run-bruteforce");
    const btnCopy = document.getElementById("btn-copy-python");

    if (cipherEl) cipherEl.textContent = `"${caesarShift(PLAIN_QUOTE, SECRET_KEY)}"`;
    if (plainEl) plainEl.textContent = `"${PLAIN_QUOTE}"`;

    if (btnRun) {
      btnRun.addEventListener("click", runPythonBruteForceSimulation);
    }
    if (btnCopy) {
      btnCopy.addEventListener("click", copyPythonCode);
    }
  });
})();