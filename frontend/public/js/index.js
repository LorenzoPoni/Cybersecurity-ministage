/* ==========================================================================
   LOGICA PAGINA PRINCIPALE & SIMULATORE DISCO DI CESARE (index.js)
   ========================================================================== */

(function () {
  const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const SLICE_ANGLE = 360 / ALFABETO.length;
  const CENTER = 220;

  let currentKey = 0;

  /**
   * Costruisce dinamicamente i 26 settori (lettere + tacche radiali)
   * sia per l'anello esterno fisso sia per quello interno rotante.
   */
  function buildCaesarWheelSVG() {
    const outerGroup = document.getElementById("outer-wheel-group");
    const innerGroup = document.getElementById("inner-wheel-group");
    if (!outerGroup || !innerGroup) return;

    outerGroup.innerHTML = "";
    innerGroup.innerHTML = "";

    for (let i = 0; i < ALFABETO.length; i++) {
      const letter = ALFABETO[i];
      // Angolo centrato in alto (ore 12 = -90 gradi)
      const angleDeg = i * SLICE_ANGLE - 90;
      const angleRad = (angleDeg * Math.PI) / 180;

      // Angolo per la linea separatrice tra una lettera e la successiva
      const dividerRad = ((i - 0.5) * SLICE_ANGLE - 90) * (Math.PI / 180);

      // --- 1. Settore Anello Esterno (Testo in Chiaro) ---
      const xDivOut1 = CENTER + 148 * Math.cos(dividerRad);
      const yDivOut1 = CENTER + 148 * Math.sin(dividerRad);
      const xDivOut2 = CENTER + 198 * Math.cos(dividerRad);
      const yDivOut2 = CENTER + 198 * Math.sin(dividerRad);

      const outLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      outLine.setAttribute("x1", xDivOut1.toFixed(2));
      outLine.setAttribute("y1", yDivOut1.toFixed(2));
      outLine.setAttribute("x2", xDivOut2.toFixed(2));
      outLine.setAttribute("y2", yDivOut2.toFixed(2));
      outLine.setAttribute("stroke", "rgba(56, 189, 248, 0.18)");
      outLine.setAttribute("stroke-width", "1");
      outerGroup.appendChild(outLine);

      const xOutText = CENTER + 173 * Math.cos(angleRad);
      const yOutText = CENTER + 173 * Math.sin(angleRad);

      const outText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      outText.setAttribute("x", xOutText.toFixed(2));
      outText.setAttribute("y", yOutText.toFixed(2));
      outText.setAttribute("text-anchor", "middle");
      outText.setAttribute("dominant-baseline", "central");
      outText.setAttribute("fill", i === 0 ? "#38bdf8" : "#e2e8f0");
      outText.setAttribute("font-size", i === 0 ? "17" : "15");
      outText.setAttribute("font-weight", i === 0 ? "800" : "600");
      outText.setAttribute("font-family", "monospace");
      outText.textContent = letter;
      outerGroup.appendChild(outText);

      // --- 2. Settore Anello Interno (Testo Cifrato) ---
      const xDivIn1 = CENTER + 88 * Math.cos(dividerRad);
      const yDivIn1 = CENTER + 88 * Math.sin(dividerRad);
      const xDivIn2 = CENTER + 148 * Math.cos(dividerRad);
      const yDivIn2 = CENTER + 148 * Math.sin(dividerRad);

      const inLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      inLine.setAttribute("x1", xDivIn1.toFixed(2));
      inLine.setAttribute("y1", yDivIn1.toFixed(2));
      inLine.setAttribute("x2", xDivIn2.toFixed(2));
      inLine.setAttribute("y2", yDivIn2.toFixed(2));
      inLine.setAttribute("stroke", "rgba(16, 185, 129, 0.2)");
      inLine.setAttribute("stroke-width", "1");
      innerGroup.appendChild(inLine);

      const xInText = CENTER + 118 * Math.cos(angleRad);
      const yInText = CENTER + 118 * Math.sin(angleRad);

      const inText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      inText.setAttribute("x", xInText.toFixed(2));
      inText.setAttribute("y", yInText.toFixed(2));
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
   * Aggiorna la rotazione del disco SVG, i badge e l'esempio visivo
   */
  function updateWheelKey(newKey) {
    currentKey = ((newKey % 26) + 26) % 26;

    const innerGroup = document.getElementById("inner-wheel-group");
    const centerKey = document.getElementById("wheel-center-key");
    const centerMap = document.getElementById("wheel-center-map");
    const badgeKey = document.getElementById("badge-chiave");
    const slider = document.getElementById("key-slider");
    const sliderBadge = document.getElementById("slider-value-badge");
    const caption = document.getElementById("wheel-live-caption");

    const mappedLetter = ALFABETO[currentKey];
    // Ruota in senso antiorario affinché la lettera spostata si allinei sotto la 'A' in alto
    const rotationDeg = -(currentKey * SLICE_ANGLE);

    if (innerGroup) {
      innerGroup.style.transform = `rotate(${rotationDeg}deg)`;

      // Evidenzia la lettera attiva allineata con la A
      const innerTexts = innerGroup.querySelectorAll("text[data-inner-index]");
      innerTexts.forEach((el) => {
        const idx = Number(el.getAttribute("data-inner-index"));
        if (idx === currentKey) {
          el.setAttribute("fill", "#ffffff");
          el.setAttribute("font-size", "18");
        } else {
          el.setAttribute("fill", "#6ee7b7");
          el.setAttribute("font-size", "15");
        }
      });
    }

    if (centerKey) centerKey.textContent = `+${currentKey}`;
    if (centerMap) centerMap.textContent = `A ➔ ${mappedLetter}`;
    if (badgeKey) badgeKey.textContent = `CHIAVE: +${currentKey}`;
    if (slider) slider.value = String(currentKey);
    if (sliderBadge) {
      sliderBadge.textContent =
        currentKey === 1 ? "+1 posizione" : `+${currentKey} posizioni`;
    }

    if (caption) {
      caption.innerHTML =
        `Con chiave <strong class="text-emerald-400">+${currentKey}</strong>, la lettera ` +
        `<strong class="text-sky-400">A</strong> (anello esterno) diventa ` +
        `<strong class="text-emerald-400">${mappedLetter}</strong> (anello interno).`;
    }
  }

  /**
   * Effetto animato stile hacker/decodifica sul titolo principale "Cyber Security"
   */
  function animateHeroDecryption() {
    const titleEl = document.getElementById("hero-title");
    if (!titleEl) return;

    const targetText = "Cyber Security";
    const cipherChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
    let iteration = 0;

    clearInterval(titleEl._scrambleTimer);

    titleEl._scrambleTimer = setInterval(() => {
      titleEl.textContent = targetText
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < iteration) return targetText[index];
          return cipherChars[Math.floor(Math.random() * cipherChars.length)];
        })
        .join("");

      if (iteration >= targetText.length) {
        clearInterval(titleEl._scrambleTimer);
        titleEl.textContent = targetText;
      }

      iteration += 1 / 2;
    }, 35);
  }

  // Inizializzazione al caricamento della pagina
  window.addEventListener("DOMContentLoaded", () => {
    buildCaesarWheelSVG();
    updateWheelKey(0);
    animateHeroDecryption();

    const slider = document.getElementById("key-slider");
    const btnMinus = document.getElementById("btn-key-minus");
    const btnPlus = document.getElementById("btn-key-plus");
    const btnDemoSpin = document.getElementById("btn-demo-spin");
    const heroTitle = document.getElementById("hero-title");

    if (slider) {
      slider.addEventListener("input", (e) => {
        updateWheelKey(Number(e.target.value));
      });
    }

    // Pulsanti - e + per regolazione fine di 1 unità alla volta
    if (btnMinus) {
      btnMinus.addEventListener("click", () => {
        updateWheelKey(currentKey - 1);
      });
    }

    if (btnPlus) {
      btnPlus.addEventListener("click", () => {
        updateWheelKey(currentKey + 1);
      });
    }

    // Pulsante automatico: avanza sempre di +5 unità
    if (btnDemoSpin) {
      btnDemoSpin.addEventListener("click", () => {
        const nextKey =
          currentKey === 25
            ? 0
            : currentKey + 5 === 25
              ? 25
              : (currentKey + 5) % 26;
        updateWheelKey(nextKey);
      });
    }

    if (heroTitle) {
      heroTitle.addEventListener("click", animateHeroDecryption);
    }
  });
})();