/* ==========================================================================
   LOGICA FASE 02: DECODIFICA & DISCO DI CESARE (decodifica.js)
   ========================================================================== */

(function () {
  const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const SLICE_ANGLE = 360 / ALFABETO.length;
  const CENTER = 220;
  const REQUIRED_WORDS = 3;

// Dizionario di parole (solo lettere A-Z, tema Informatica e Meme recenti)
  const WORD_BANK = [
    // Informatica & Cyber Security
    { word: "HACKER", category: "Informatica" },
    { word: "SERVER", category: "Informatica" },
    { word: "PYTHON", category: "Informatica" },
    { word: "ROUTER", category: "Informatica" },
    { word: "PIXEL", category: "Informatica" },
    { word: "BINARY", category: "Informatica" },
    { word: "KERNEL", category: "Informatica" },
    { word: "FIREWALL", category: "Informatica" },
    { word: "BACKUP", category: "Informatica" },
    { word: "CRYPTO", category: "Informatica" },
    { word: "CYBER", category: "Informatica" },
    { word: "MOUSE", category: "Informatica" },
    { word: "CLOUD", category: "Informatica" },
    { word: "LINUX", category: "Informatica" },
    { word: "TOKEN", category: "Informatica" },
    { word: "CODING", category: "Informatica" },
    { word: "SCRIPT", category: "Informatica" },
    { word: "DEBUG", category: "Informatica" },
    { word: "SOCKET", category: "Informatica" },
    { word: "COOKIE", category: "Informatica" },
    { word: "BOTNET", category: "Informatica" },

    // Meme & Trend recenti
    { word: "FORTNITE", category: "Meme" },
    { word: "GTAVI", category: "Meme" },
    { word: "LARP", category: "Meme" },
    { word: "TUNGTUNG", category: "Meme" },
    { word: "CHILLGUY", category: "Meme" },
    { word: "MEWING", category: "Meme" },
    { word: "MOGGING", category: "Meme" },
    { word: "AURA", category: "Meme" },
    { word: "COOKED", category: "Meme" },
    { word: "YAPPING", category: "Meme" },
    { word: "BRUH", category: "Meme" },
    { word: "POOKIE", category: "Meme" },
    { word: "GANG", category: "Meme" },
    { word: "VBUCK", category: "Meme" },
    { word: "OHIO", category: "Meme" },
    { word: "GLAZING", category: "Meme" },
    { word: "LOCKIN", category: "Meme" },
    { word: "SKIBIDI", category: "Meme" },
    { word: "SIGMA", category: "Meme" },
    { word: "RIZZ", category: "Meme" },
    { word: "GOATED", category: "Meme" },
    { word: "DAMN", category: "Meme" },
    { word: "NPC", category: "Meme" },
  ];

  // Stato della sfida
  let wheelKey = 0;
  let currentWordObj = null;
  let currentShiftKey = null;
  let currentCipherWord = null;
  let completedCount = 0;

  /**
   * Cifra una stringa maiuscola A-Z con il Cifrario di Cesare
   * (usato per generare la parola cifrata da sottoporre allo studente)
   */
  function caesarEncrypt(plainText, shift) {
    const cleanShift = ((shift % 26) + 26) % 26;
    return plainText
      .toUpperCase()
      .split("")
      .map((char) => {
        const idx = ALFABETO.indexOf(char);
        if (idx === -1) return char;
        return ALFABETO[(idx + cleanShift) % 26];
      })
      .join("");
  }

  /**
   * Estrae una parola random, la cifra con chiave casuale (+1 .. +25)
   * e mostra il testo cifrato da decodificare
   */
  function generateRandomChallenge() {
    let candidate = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
    if (currentWordObj && WORD_BANK.length > 1) {
      while (candidate.word === currentWordObj.word) {
        candidate = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
      }
    }

    currentWordObj = candidate;
    currentShiftKey = Math.floor(Math.random() * 25) + 1;
    currentCipherWord = caesarEncrypt(currentWordObj.word, currentShiftKey);

    const wordDisplay = document.getElementById("target-word-display");
    const keyDisplay = document.getElementById("target-key-display");
    const categoryBadge = document.getElementById("word-category-badge");
    const wordBox = document.getElementById("random-word-box");
    const input = document.getElementById("user-solution-input");

    if (wordDisplay) wordDisplay.textContent = currentCipherWord;
    if (keyDisplay) keyDisplay.textContent = `+${currentShiftKey}`;

    if (categoryBadge) {
      if (currentWordObj.category === "Meme") {
        categoryBadge.textContent = "🐸 MEME";
        categoryBadge.className =
          "font-cyber-mono text-xs px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/40 text-purple-300";
      } else {
        categoryBadge.textContent = "💻 INFORMATICA";
        categoryBadge.className =
          "font-cyber-mono text-xs px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/40 text-sky-300";
      }
    }

    if (wordBox) {
      wordBox.classList.remove("animate-shake");
      void wordBox.offsetWidth;
    }

    if (input) {
      input.value = "";
      input.focus();
    }
  }

  /**
   * Mostra il messaggio di feedback (corretto, sbagliato o avviso)
   */
  function showFeedback(type, title, message) {
    const box = document.getElementById("feedback-box");
    const titleEl = document.getElementById("feedback-title");
    const msgEl = document.getElementById("feedback-message");
    if (!box || !titleEl || !msgEl) return;

    box.classList.remove(
      "hidden",
      "bg-emerald-500/15",
      "border-emerald-400/50",
      "text-emerald-200",
      "bg-rose-500/15",
      "border-rose-400/50",
      "text-rose-200",
      "bg-amber-500/15",
      "border-amber-400/50",
      "text-amber-200"
    );

    if (type === "success") {
      box.classList.add("bg-emerald-500/15", "border-emerald-400/50", "text-emerald-200");
    } else if (type === "error") {
      box.classList.add("bg-rose-500/15", "border-rose-400/50", "text-rose-200");
    } else {
      box.classList.add("bg-amber-500/15", "border-amber-400/50", "text-amber-200");
    }

    titleEl.textContent = title;
    msgEl.textContent = message;
  }

  /**
   * Aggiorna il contatore 0/3 -> 3/3 e sblocca il pulsante "Torna alla Home"
   */
  function updateProgressAndLockState() {
    const counterText = document.getElementById("progress-counter-text");
    if (counterText) {
      counterText.textContent = `${Math.min(completedCount, REQUIRED_WORDS)}/${REQUIRED_WORDS}`;
    }

    document.querySelectorAll(".progress-slot[data-slot]").forEach((slot) => {
      const slotNum = Number(slot.getAttribute("data-slot"));
      if (completedCount >= slotNum) {
        slot.classList.add("progress-slot-done");
        slot.textContent = "✓";
      }
    });

    if (completedCount >= REQUIRED_WORDS) {
      const lockBadge = document.getElementById("home-lock-badge");
      const iconClosed = document.getElementById("icon-padlock-closed");
      const iconOpen = document.getElementById("icon-padlock-open");
      const btnHome = document.getElementById("btn-back-home");

      if (lockBadge) {
        lockBadge.classList.remove("lock-badge-locked");
        lockBadge.classList.add("lock-badge-unlocked");
        lockBadge.setAttribute("title", "Sbloccato! Ora puoi tornare alla Home");
      }

      if (iconClosed) iconClosed.classList.add("hidden");
      if (iconOpen) iconOpen.classList.remove("hidden");

      if (btnHome) {
        btnHome.classList.remove("btn-home-locked");
        btnHome.classList.add("btn-home-unlocked");
        btnHome.setAttribute("aria-disabled", "false");
      }
    }
  }

  /**
   * Mostra il toast informativo se lo studente prova a uscire prima delle 3 parole
   */
  function showLockedExitToast() {
    const toast = document.getElementById("preview-toast");
    const toastTitle = document.getElementById("toast-title");
    const toastBody = document.getElementById("toast-body");
    const mancanti = REQUIRED_WORDS - completedCount;

    if (toast && toastTitle && toastBody) {
      toastTitle.textContent = "Tasto bloccato dal lucchetto!";
      toastBody.textContent =
        mancanti === 1
          ? "Decodifica ancora 1 parola correttamente per sbloccare il pulsante e tornare alla Home."
          : `Decodifica ancora ${mancanti} parole correttamente per sbloccare il pulsante e tornare alla Home.`;
      toast.classList.remove("hidden");
    }
  }

  /**
   * Verifica che la parola inserita dallo studente corrisponda al testo originale
   */
  function handleVerifySubmit(event) {
    event.preventDefault();

    if (!currentWordObj || currentShiftKey === null || !currentCipherWord) {
      showFeedback(
        "warning",
        "⚠️ Nessun messaggio attivo",
        "Clicca prima sul pulsante «Genera parola cifrata» per iniziare!"
      );
      return;
    }

    const input = document.getElementById("user-solution-input");
    const rawValue = input ? input.value.trim().toUpperCase().replace(/[^A-Z]/g, "") : "";

    if (!rawValue) {
      showFeedback(
        "warning",
        "⚠️ Campo vuoto",
        "Scrivi la parola originale decodificata prima di cliccare su Verifica risposta."
      );
      if (input) input.focus();
      return;
    }

    const expectedPlain = currentWordObj.word;

    if (rawValue === expectedPlain) {
      // RISPOSTA CORRETTA
      completedCount += 1;
      const solvedCipher = currentCipherWord;
      const solvedKey = currentShiftKey;

      updateProgressAndLockState();

      if (completedCount >= REQUIRED_WORDS) {
        showFeedback(
          "success",
          `🏆 Corretto! "${solvedCipher}" (chiave +${solvedKey}) = "${expectedPlain}"`,
          "Missione compiuta! Hai decodificato 3 parole: il lucchetto si è aperto e ora puoi cliccare su «Torna alla Home»."
        );
      } else {
        const restanti = REQUIRED_WORDS - completedCount;
        showFeedback(
          "success",
          `✅ Decodifica corretta! "${solvedCipher}" (chiave +${solvedKey}) = "${expectedPlain}"`,
          `Ottimo lavoro (${completedCount}/${REQUIRED_WORDS})! Te ne ${restanti === 1 ? "manca solo 1" : `mancano ${restanti}`}: ecco subito un nuovo messaggio cifrato.`
        );
      }

      // Genera automaticamente la prossima parola cifrata
      generateRandomChallenge();
    } else {
      // RISPOSTA SBAGLIATA -> avvisa e genera subito una nuova parola cifrata random
      const wrongCipher = currentCipherWord;
      const wrongKey = currentShiftKey;

      showFeedback(
        "error",
        `❌ Decodifica errata per "${wrongCipher}" (chiave +${wrongKey})`,
        `Hai scritto "${rawValue}", ma non corrisponde al messaggio originale. È comparsa una nuova parola cifrata: riprova!`
      );

      generateRandomChallenge();

      const wordBox = document.getElementById("random-word-box");
      if (wordBox) {
        wordBox.classList.add("animate-shake");
      }
    }
  }

  /**
   * Costruisce i 26 settori SVG del Disco di Cesare
   */
  function buildCaesarWheelSVG() {
    const outerGroup = document.getElementById("outer-wheel-group");
    const innerGroup = document.getElementById("inner-wheel-group");
    if (!outerGroup || !innerGroup) return;

    outerGroup.innerHTML = "";
    innerGroup.innerHTML = "";

    for (let i = 0; i < ALFABETO.length; i++) {
      const letter = ALFABETO[i];
      const angleDeg = i * SLICE_ANGLE - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      const dividerRad = ((i - 0.5) * SLICE_ANGLE - 90) * (Math.PI / 180);

      // Anello esterno (testo in chiaro - soluzione)
      const outLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      outLine.setAttribute("x1", (CENTER + 148 * Math.cos(dividerRad)).toFixed(2));
      outLine.setAttribute("y1", (CENTER + 148 * Math.sin(dividerRad)).toFixed(2));
      outLine.setAttribute("x2", (CENTER + 198 * Math.cos(dividerRad)).toFixed(2));
      outLine.setAttribute("y2", (CENTER + 198 * Math.sin(dividerRad)).toFixed(2));
      outLine.setAttribute("stroke", "rgba(56, 189, 248, 0.18)");
      outLine.setAttribute("stroke-width", "1");
      outerGroup.appendChild(outLine);

      const outText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      outText.setAttribute("x", (CENTER + 173 * Math.cos(angleRad)).toFixed(2));
      outText.setAttribute("y", (CENTER + 173 * Math.sin(angleRad)).toFixed(2));
      outText.setAttribute("text-anchor", "middle");
      outText.setAttribute("dominant-baseline", "central");
      outText.setAttribute("fill", i === 0 ? "#38bdf8" : "#e2e8f0");
      outText.setAttribute("font-size", i === 0 ? "17" : "15");
      outText.setAttribute("font-weight", i === 0 ? "800" : "600");
      outText.setAttribute("font-family", "monospace");
      outText.textContent = letter;
      outerGroup.appendChild(outText);

      // Anello interno (testo cifrato da leggere)
      const inLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      inLine.setAttribute("x1", (CENTER + 88 * Math.cos(dividerRad)).toFixed(2));
      inLine.setAttribute("y1", (CENTER + 88 * Math.sin(dividerRad)).toFixed(2));
      inLine.setAttribute("x2", (CENTER + 148 * Math.cos(dividerRad)).toFixed(2));
      inLine.setAttribute("y2", (CENTER + 148 * Math.sin(dividerRad)).toFixed(2));
      inLine.setAttribute("stroke", "rgba(16, 185, 129, 0.2)");
      inLine.setAttribute("stroke-width", "1");
      innerGroup.appendChild(inLine);

      const inText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      inText.setAttribute("x", (CENTER + 118 * Math.cos(angleRad)).toFixed(2));
      inText.setAttribute("y", (CENTER + 118 * Math.sin(angleRad)).toFixed(2));
      inText.setAttribute("text-anchor", "middle");
      inText.setAttribute("dominant-baseline", "central");
      inText.setAttribute("fill", "#6ee7b7");
      inText.setAttribute("font-size", "15");
      inText.setAttribute("font-weight", "700");
      inText.setAttribute("font-family", "monospace");
      inText.setAttribute("data-inner-index", String(i));
      inText.textContent = letter;
      innerGroup.appendChild(inText);
    }
  }

  /**
   * Ruota il disco SVG del Cifrario di Cesare e mostra la corrispondenza inversa (Interno -> Esterno)
   */
  function updateWheelKey(newKey) {
    wheelKey = ((newKey % 26) + 26) % 26;

    const innerGroup = document.getElementById("inner-wheel-group");
    const centerKey = document.getElementById("wheel-center-key");
    const centerMap = document.getElementById("wheel-center-map");
    const badgeKey = document.getElementById("badge-chiave");
    const slider = document.getElementById("key-slider");
    const sliderBadge = document.getElementById("slider-value-badge");
    const caption = document.getElementById("wheel-live-caption");

    const cipherLetterAtTop = ALFABETO[wheelKey];
    const rotationDeg = -(wheelKey * SLICE_ANGLE);

    if (innerGroup) {
      innerGroup.style.transform = `rotate(${rotationDeg}deg)`;
      innerGroup.querySelectorAll("text[data-inner-index]").forEach((el) => {
        const idx = Number(el.getAttribute("data-inner-index"));
        if (idx === wheelKey) {
          el.setAttribute("fill", "#ffffff");
          el.setAttribute("font-size", "18");
        } else {
          el.setAttribute("fill", "#6ee7b7");
          el.setAttribute("font-size", "15");
        }
      });
    }

    if (centerKey) centerKey.textContent = `+${wheelKey}`;
    if (centerMap) centerMap.textContent = `${cipherLetterAtTop} ➔ A`;
    if (badgeKey) badgeKey.textContent = `CHIAVE: +${wheelKey}`;
    if (slider) slider.value = String(wheelKey);
    if (sliderBadge) {
      sliderBadge.textContent = wheelKey === 1 ? "+1 posizione" : `+${wheelKey} posizioni`;
    }

    if (caption) {
      caption.innerHTML =
        `Con chiave <strong class="text-sky-400">+${wheelKey}</strong>, la lettera cifrata ` +
        `<strong class="text-emerald-400">${cipherLetterAtTop}</strong> (interno) torna ad essere ` +
        `<strong class="text-sky-400">A</strong> (esterno).`;
    }
  }

  /**
   * Blocca anche l'uscita dai link della navbar finché non sono decodificate 3 parole
   */
  function guardNavbarNavigation() {
    document.addEventListener(
      "click",
      (event) => {
        const anchor = event.target.closest("header a[href]");
        if (!anchor) return;

        const href = anchor.getAttribute("href");
        if (href && href !== "decodifica.html" && completedCount < REQUIRED_WORDS) {
          event.preventDefault();
          event.stopImmediatePropagation();
          showLockedExitToast();
        }
      },
      true
    );
  }

  // Inizializzazione al caricamento
  window.addEventListener("DOMContentLoaded", () => {
    buildCaesarWheelSVG();
    updateWheelKey(0);
    guardNavbarNavigation();

    const btnGenerate = document.getElementById("btn-generate-word");
    const verifyForm = document.getElementById("verify-form");
    const input = document.getElementById("user-solution-input");
    const btnBackHome = document.getElementById("btn-back-home");
    const slider = document.getElementById("key-slider");
    const btnMinus = document.getElementById("btn-key-minus");
    const btnPlus = document.getElementById("btn-key-plus");
    const toastClose = document.getElementById("toast-close");
    const toast = document.getElementById("preview-toast");

    if (btnGenerate) {
      btnGenerate.addEventListener("click", () => {
        generateRandomChallenge();
      });
    }

    if (verifyForm) {
      verifyForm.addEventListener("submit", handleVerifySubmit);
    }

    // Pulisce e converte in maiuscolo in tempo reale mentre lo studente digita
    if (input) {
      input.addEventListener("input", () => {
        input.value = input.value.toUpperCase().replace(/[^A-Z]/g, "");
      });
    }

    // Gestione click sul tasto Torna alla Home con lucchetto
    if (btnBackHome) {
      btnBackHome.addEventListener("click", () => {
        if (completedCount < REQUIRED_WORDS) {
          btnBackHome.classList.remove("animate-shake");
          void btnBackHome.offsetWidth;
          btnBackHome.classList.add("animate-shake");
          showLockedExitToast();
        } else {
          window.location.href = "/";
        }
      });
    }

    if (slider) {
      slider.addEventListener("input", (e) => updateWheelKey(Number(e.target.value)));
    }
    if (btnMinus) {
      btnMinus.addEventListener("click", () => updateWheelKey(wheelKey - 1));
    }
    if (btnPlus) {
      btnPlus.addEventListener("click", () => updateWheelKey(wheelKey + 1));
    }
    if (toastClose && toast) {
      toastClose.addEventListener("click", () => toast.classList.add("hidden"));
    }
  });
})();