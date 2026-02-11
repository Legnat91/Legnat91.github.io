/*  FP DAW — Mini app estática (sin frameworks)
    - Carga temas desde /temario/manifest.json (OBLIGATORIO para listar temas)
    - Cada tema es texto plano .app
    - Analiza el texto y extrae: título, secciones, puntos clave, glosario, trampas
    - Genera banco de preguntas SIN inventar contenido fuera del texto:
        * MCQ (hasta 12), V/F (hasta 4), cortas (hasta 2)
      Si el temario no da para todo: muestra aviso en UI y console.warn
    - Progreso en localStorage: últimos tests, % por tema, preguntas falladas

    IMPORTANTE (navegadores):
    No se puede listar directorios por seguridad (no hay API estándar para "leer /temario").
    Por eso se requiere manifest.json.

    TRAZABILIDAD:
    Cada pregunta incluye sourceHint (interno). NO se renderiza en la UI.
*/

(() => {
  "use strict";

  /* ------------------------------ DOM helpers ------------------------------ */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function el(tag, opts = {}) {
    const node = document.createElement(tag);
    if (opts.className) node.className = opts.className;
    if (opts.text != null) node.textContent = String(opts.text); // sanitizado: textContent
    if (opts.attrs) {
      for (const [k, v] of Object.entries(opts.attrs)) node.setAttribute(k, String(v));
    }
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  /* ------------------------------ Storage ---------------------------------- */
  const STORAGE_KEY = "dawRepaso:v1";

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { topics: {} };
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return { topics: {} };
      if (!parsed.topics) parsed.topics = {};
      return parsed;
    } catch {
      return { topics: {} };
    }
  }

  function saveStore(store) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  function resetStore() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function topicProgress(store, fileName) {
    return store.topics[fileName] || {
      lastScores: [],          // array of {ts, score, total, correct, wrong}
      bestScore: null,
      lastScore: null,
      wrongQuestionIds: [],    // unique list
      attempts: 0
    };
  }

  function updateTopicProgress(store, fileName, patch) {
    const cur = topicProgress(store, fileName);
    const next = { ...cur, ...patch };
    store.topics[fileName] = next;
    saveStore(store);
    return next;
  }

  /* ------------------------------ Data model ------------------------------- */
  const state = {
    manifest: [],
    topics: new Map(), // fileName -> { fileName, rawText, analysis, questionBank }
    selected: null,    // fileName
    view: "study",     // "study" | "test"
    test: null,        // active test session
    store: loadStore()
  };

  /* ------------------------------ UI nodes --------------------------------- */
  const ui = {
    topicSearch: $("#topicSearch"),
    topicList: $("#topicList"),
    sidebarStatus: $("#sidebarStatus"),

    globalMessage: $("#globalMessage"),

    btnViewStudy: $("#btnViewStudy"),
    btnViewTest: $("#btnViewTest"),
    btnResetProgress: $("#btnResetProgress"),

    viewStudy: $("#viewStudy"),
    viewTest: $("#viewTest"),

    topicTitle: $("#topicTitle"),
    topicMeta: $("#topicMeta"),
    keyPoints: $("#keyPoints"),
    keyPointsEmpty: $("#keyPointsEmpty"),
    traps: $("#traps"),
    trapsEmpty: $("#trapsEmpty"),
    sections: $("#sections"),
    sectionsEmpty: $("#sectionsEmpty"),
    rawText: $("#rawText"),
    glossary: $("#glossary"),
    glossaryEmpty: $("#glossaryEmpty"),
    toggleGlossaryCompact: $("#toggleGlossaryCompact"),
    btnStartTest: $("#btnStartTest"),

    testTitle: $("#testTitle"),
    testMeta: $("#testMeta"),
    toggleInstant: $("#toggleInstant"),
    btnExitTest: $("#btnExitTest"),
    progressBar: $("#progressBar"),
    progressText: $("#progressText"),
    progressKind: $("#progressKind"),
    questionHost: $("#questionHost"),
    btnPrev: $("#btnPrev"),
    btnConfirm: $("#btnConfirm"),
    btnNext: $("#btnNext"),
    instantFeedback: $("#instantFeedback"),

    results: $("#results"),
    scoreChip: $("#scoreChip"),
    rCorrect: $("#rCorrect"),
    rWrong: $("#rWrong"),
    rBlank: $("#rBlank"),
    btnRetryWrong: $("#btnRetryWrong"),
    btnRestartFull: $("#btnRestartFull"),
    wrongReview: $("#wrongReview"),
    wrongReviewEmpty: $("#wrongReviewEmpty")
  };

  /* ------------------------------ Messaging -------------------------------- */
  function showMessage(text, kind = "info") {
    ui.globalMessage.classList.remove("hidden", "warn");
    ui.globalMessage.textContent = text;
    if (kind === "warn") ui.globalMessage.classList.add("warn");
  }

  function hideMessage() {
    ui.globalMessage.classList.add("hidden");
    ui.globalMessage.textContent = "";
    ui.globalMessage.classList.remove("warn");
  }

  /* ------------------------------ Loading ---------------------------------- */
  async function fetchText(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} al cargar ${url}`);
    return await res.text();
  }

  async function loadManifest() {
    // Opción A (preferida): /temario/manifest.json
    try {
      const text = await fetchText("temario/manifest.json");
      const list = JSON.parse(text);
      if (!Array.isArray(list)) throw new Error("manifest.json no es un array JSON");

      const cleaned = list
        .filter(v => typeof v === "string")
        .map(v => v.trim())
        .filter(v => v && v.toLowerCase().endsWith(".app"));

      return cleaned;
    } catch (err) {
      console.warn("[DAW Repaso] No se pudo cargar manifest.json. Se requiere para listar temas.", err);
      showMessage(
        "Falta /temario/manifest.json o es inválido. Por seguridad del navegador no se pueden listar directorios: crea/edita manifest.json con los .app disponibles.",
        "warn"
      );
      return [];
    }
  }

  async function loadTopic(fileName) {
    const url = `temario/${encodeURIComponent(fileName)}`;
    const rawText = await fetchText(url);
    const analysis = analyzeTopicText(rawText);
    const questionBank = buildQuestionBank(rawText, analysis);

    const topic = { fileName, rawText, analysis, questionBank };
    state.topics.set(fileName, topic);
    return topic;
  }

  /* ------------------------------ Text analysis ----------------------------- */
  function normalizeLines(text) {
    return text
      .replace(/\r\n/g, "\n")
      .replace(/\t/g, " ")
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 0);
  }

  function analyzeTopicText(rawText) {
    const lines = normalizeLines(rawText);

    // Title heuristic
    let title = "Tema sin título";
    for (const l of lines.slice(0, 25)) {
      if (/^índice$/i.test(l)) continue;
      if (/^uf\d+/i.test(l) && l.length < 10) continue;
      if (l.length >= 12 && !/^\d+$/.test(l)) {
        title = l;
        break;
      }
    }

    // Section extraction (heurístico y conservador)
    const sectionHeaders = [];
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];

      const isNumbered =
        /^\d{1,2}\s+\S/.test(l) ||
        /^\d+(?:\.\d+)+\.\s+\S/.test(l) ||
        /^[A-Z]\.\s+\S/.test(l);

      if (/^esquema\s+\d+/i.test(l) || /^tabla\s+\d+/i.test(l)) continue;

      if (isNumbered) sectionHeaders.push({ idx: i, title: l });
    }

    const sections = [];
    if (sectionHeaders.length > 0) {
      sectionHeaders.sort((a, b) => a.idx - b.idx);

      for (let s = 0; s < sectionHeaders.length; s++) {
        const start = sectionHeaders[s].idx;
        const end = (sectionHeaders[s + 1]?.idx ?? lines.length);
        const titleLine = lines[start];
        const bodyLines = lines.slice(start + 1, end);
        if (bodyLines.length < 2) continue;

        const bullets = bodyLines
          .filter(x => /^>>\s+/.test(x) || /^[•\-–]\s+/.test(x))
          .map(x => x.replace(/^>>\s+/, "").replace(/^[•\-–]\s+/, "").trim())
          .filter(Boolean);

        const paragraphs = [];
        let buf = [];
        for (const bl of bodyLines) {
          if (/^>>\s+/.test(bl) || /^[•\-–]\s+/.test(bl)) {
            if (buf.length) {
              paragraphs.push(buf.join(" "));
              buf = [];
            }
            continue;
          }
          buf.push(bl);
          if (buf.join(" ").length > 320) {
            paragraphs.push(buf.join(" "));
            buf = [];
          }
        }
        if (buf.length) paragraphs.push(buf.join(" "));

        sections.push({ title: titleLine, paragraphs, bullets });
      }
    }

    // Global key points: bullets explícitos
    const keyPoints = [];
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (/^>>\s+/.test(l)) keyPoints.push(l.replace(/^>>\s+/, "").trim());
      if (/^[•\-–]\s+/.test(l)) keyPoints.push(l.replace(/^[•\-–]\s+/, "").trim());
    }

    // Glossary heuristic:
    // - "TÉRMINO  (dos espacios) definición"
    // - "TÉRMINO:" definición en la misma línea
    const glossary = [];
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];

      const m1 = l.match(/^([A-Za-zÁÉÍÓÚÜÑ][A-Za-zÁÉÍÓÚÜÑ0-9/ \-]{1,30})\s{2,}(.{10,})$/);
      if (m1) {
        const term = m1[1].trim();
        const def = m1[2].trim();
        if (term.split(" ").length <= 5) glossary.push({ term, def, sourceHint: `línea ${i + 1}` });
        continue;
      }

      const m2 = l.match(/^([A-Za-zÁÉÍÓÚÜÑ][A-Za-zÁÉÍÓÚÜÑ0-9/ \-]{1,30})\s*:\s*(.{10,})$/);
      if (m2) {
        const term = m2[1].trim();
        const def = m2[2].trim();
        if (term.split(" ").length <= 5) glossary.push({ term, def, sourceHint: `línea ${i + 1}` });
      }
    }

    // Traps: detecta marcadores típicos (sin inventar)
    const traps = [];
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (/^importante\b/i.test(l) && lines[i + 1]) traps.push(lines[i + 1]);
      if (/\b(no confundir|trampa|ojo con|cuidado con)\b/i.test(l)) traps.push(l);
    }

    const uniqText = (arr) => {
      const s = new Set();
      const out = [];
      for (const x of arr) {
        const k = x.toLowerCase();
        if (s.has(k)) continue;
        s.add(k);
        out.push(x);
      }
      return out;
    };

    return {
      title,
      sections,
      keyPoints: uniqText(keyPoints).slice(0, 18),
      glossary: glossary.slice(0, 30),
      traps: uniqText(traps).slice(0, 12)
    };
  }

  /* ------------------------------ Question gen ------------------------------ */
  // Regla: NO inventar. Solo generar preguntas a partir de "hechos" extraídos.
  // Si no hay material, generar menos y marcar incomplete.
  function buildQuestionBank(rawText, analysis) {
    const lines = normalizeLines(rawText);

    // Hechos (facts) conservadores: glosario + frases “X es ...”
    const facts = [];

    for (const g of analysis.glossary) {
      facts.push({
        type: "def",
        term: g.term,
        def: g.def,
        sourceHint: g.sourceHint
      });
    }

    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      const m = l.match(/^([A-Za-zÁÉÍÓÚÜÑ][A-Za-zÁÉÍÓÚÜÑ0-9/ \-]{2,40})\s+es\s+(.{15,})$/i);
      if (m) {
        const term = m[1].trim();
        const def = m[2].trim();
        if (term.split(" ").length <= 6) {
          facts.push({ type: "is", term, def, sourceHint: `línea ${i + 1}` });
        }
      }
    }

    // De-dup
    const seen = new Set();
    const uniqFacts = [];
    for (const f of facts) {
      const k = `${f.term.toLowerCase()}::${f.def.toLowerCase().slice(0, 80)}`;
      if (seen.has(k)) continue;
      seen.add(k);
      uniqFacts.push(f);
    }

    const terms = uniqFacts.map(f => f.term);

    function shuffleInPlace(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    function difficultyByIndex(i, total) {
      const r = (i + 1) / Math.max(1, total);
      if (r <= 0.40) return "fácil";
      if (r <= 0.80) return "media";
      return "difícil";
    }

    const mcq = [];
    const tf = [];
    const short = [];

    // MCQ: “¿Qué término corresponde a esta definición?”
    // Requiere al menos 4 términos para 4 opciones reales.
    if (uniqFacts.length >= 4) {
      const target = Math.min(12, uniqFacts.length);
      for (let i = 0; i < target; i++) {
        const f = uniqFacts[i];
        const distractPool = terms.filter(t => t !== f.term);
        shuffleInPlace(distractPool);
        const distractors = distractPool.slice(0, 3);
        if (distractors.length < 3) break; // sin opciones suficientes

        const opts = shuffleInPlace([
          { id: "A", text: f.term, correct: true },
          { id: "B", text: distractors[0], correct: false },
          { id: "C", text: distractors[1], correct: false },
          { id: "D", text: distractors[2], correct: false }
        ]);

        mcq.push({
          id: `mcq_${i + 1}`,
          type: "mcq",
          difficulty: difficultyByIndex(i, target),
          prompt: `¿Qué término corresponde a esta definición?\n\n“${f.def}”`,
          options: opts.map(o => ({ id: o.id, text: o.text })),
          correctOptionId: opts.find(o => o.correct).id,
          explanation: `La definición citada corresponde a “${f.term}” según el temario.`,
          sourceHint: f.sourceHint
        });
      }
    }

    // V/F: solo si hay frases suficientemente literales.
    // Verdadero: usamos una frase del temario (línea) “X es ...”
    // Falso: la misma frase cambiando el término por otro (si hay al menos 2 términos).
    const isStatements = [];
    for (let i = 0; i < lines.length; i++) {
      if (/\bes\b/i.test(lines[i]) && lines[i].length >= 25 && lines[i].length <= 180) {
        const m = lines[i].match(/^(.{3,60})\s+es\s+(.{10,})$/i);
        if (m) isStatements.push({ line: lines[i], sourceHint: `línea ${i + 1}` });
      }
    }

    // True (hasta 2)
    for (let i = 0; i < Math.min(2, isStatements.length); i++) {
      tf.push({
        id: `tf_${tf.length + 1}`,
        type: "tf",
        difficulty: i === 0 ? "fácil" : "media",
        prompt: isStatements[i].line,
        correctBool: true,
        explanation: "Esta afirmación aparece en el temario.",
        sourceHint: isStatements[i].sourceHint
      });
    }

    // False (hasta 2) si podemos sustituir término por otro
    if (terms.length >= 2) {
      for (let i = 0; i < Math.min(2, isStatements.length); i++) {
        const orig = isStatements[i].line;
        const m = orig.match(/^(.{3,60})\s+es\s+(.{10,})$/i);
        if (!m) continue;
        const termLike = m[1].trim();

        const replacement = terms.find(t => t.toLowerCase() !== termLike.toLowerCase());
        if (!replacement) continue;

        const fake = orig.replace(termLike, replacement);
        tf.push({
          id: `tf_${tf.length + 1}`,
          type: "tf",
          difficulty: "difícil",
          prompt: fake,
          correctBool: false,
          explanation: "Es falsa: el temario define ese predicado para otro término (la frase original no dice esto).",
          sourceHint: isStatements[i].sourceHint
        });
      }
    }

    // recorta a 4
    while (tf.length > 4) tf.pop();

    // Cortas (hasta 2): solo si encontramos anclas claras en el texto
    // Heurística: si detectamos “diferencia entre” / “ventajas” / “inconvenientes”
    const needles = [
      "diferencia entre",
      "ventaja",
      "inconveniente",
      "explica",
      "describe"
    ];
    const shortAnchors = [];
    for (let i = 0; i < lines.length; i++) {
      const low = lines[i].toLowerCase();
      if (needles.some(n => low.includes(n))) shortAnchors.push({ i, line: lines[i] });
    }

    for (let i = 0; i < Math.min(2, shortAnchors.length); i++) {
      const a = shortAnchors[i];
      // Respuesta esperada: usamos el propio bloque siguiente (muy conservador)
      const ctx = [lines[a.i], lines[a.i + 1], lines[a.i + 2]].filter(Boolean).join(" ");
      short.push({
        id: `short_${i + 1}`,
        type: "short",
        difficulty: i === 0 ? "media" : "difícil",
        prompt: `Respuesta corta basada en el temario:\n\n${lines[a.i]}`,
        expectedAnswer: ctx,
        rubric: [
          "Debe basarse en el texto del temario.",
          "Debe cubrir las ideas mencionadas en las líneas inmediatamente relacionadas.",
          "Debe evitar añadir conceptos no presentes."
        ],
        explanation: "Respuesta abierta: se corrige con criterios del temario.",
        sourceHint: `líneas ${a.i + 1}-${Math.min(lines.length, a.i + 3)}`
      });
    }

    const incomplete = (mcq.length < 12) || (tf.length < 4) || (short.length < 2);
    if (incomplete) {
      console.warn("[DAW Repaso] Banco de preguntas incompleto por falta de información en el temario.", {
        mcq: mcq.length, tf: tf.length, short: short.length
      });
    }

    return {
      mcq, tf, short,
      incomplete,
      counts: { mcq: mcq.length, tf: tf.length, short: short.length }
    };
  }

  /* ------------------------------ Rendering: Sidebar ------------------------ */
  function getTopicStateLabel(progress) {
    if (!progress || progress.attempts === 0) return { state: "Pendiente", pct: null };
    const pct = progress.lastScore ?? null;
    if (pct == null) return { state: "En progreso", pct: null };
    if (pct >= 85) return { state: "Dominado", pct };
    return { state: "En progreso", pct };
  }

  function renderTopicList(filterText = "") {
    clear(ui.topicList);

    const q = filterText.trim().toLowerCase();
    const files = state.manifest;

    if (files.length === 0) {
      ui.sidebarStatus.textContent = "No hay temas cargados (revisa manifest.json).";
      return;
    }

    let shown = 0;

    for (const fileName of files) {
      const topic = state.topics.get(fileName);
      const title = topic?.analysis?.title || fileName;

      if (q && !title.toLowerCase().includes(q) && !fileName.toLowerCase().includes(q)) continue;
      shown++;

      const prog = topicProgress(state.store, fileName);
      const st = getTopicStateLabel(prog);

      const btn = el("button", { className: "topic-item" });
      btn.type = "button";
      btn.setAttribute("data-file", fileName);
      btn.setAttribute("aria-current", state.selected === fileName ? "true" : "false");

      const left = el("div", { className: "topic-name" });
      left.append(el("strong", { text: title }));
      left.append(el("span", { text: fileName }));

      const right = el("div", { className: "topic-badge" });
      right.append(el("span", { className: "badge-state", text: st.state }));
      right.append(el("div", { text: st.pct != null ? `${st.pct}%` : "—" }));

      btn.append(left, right);
      btn.addEventListener("click", () => selectTopic(fileName));
      ui.topicList.append(btn);
    }

    ui.sidebarStatus.textContent = `${shown} tema(s) mostrado(s).`;
  }

  /* ------------------------------ Rendering: Study -------------------------- */
  function renderStudy(topic) {
    ui.btnViewTest.disabled = false;
    ui.btnStartTest.disabled = false;

    ui.topicTitle.textContent = topic.analysis.title || topic.fileName;

    const prog = topicProgress(state.store, topic.fileName);
    const st = getTopicStateLabel(prog);
    const bank = topic.questionBank;

    const metaParts = [];
    metaParts.push(`Estado: ${st.state}`);
    if (st.pct != null) metaParts.push(`Última nota: ${st.pct}%`);
    metaParts.push(`Preguntas: ${bank.counts.mcq} test · ${bank.counts.tf} V/F · ${bank.counts.short} cortas`);
    ui.topicMeta.textContent = metaParts.join(" · ");

    clear(ui.keyPoints);
    if (topic.analysis.keyPoints.length === 0) {
      ui.keyPointsEmpty.classList.remove("hidden");
    } else {
      ui.keyPointsEmpty.classList.add("hidden");
      for (const kp of topic.analysis.keyPoints) ui.keyPoints.append(el("li", { text: kp }));
    }

    clear(ui.traps);
    if (topic.analysis.traps.length === 0) {
      ui.trapsEmpty.classList.remove("hidden");
    } else {
      ui.trapsEmpty.classList.add("hidden");
      for (const t of topic.analysis.traps) ui.traps.append(el("li", { text: t }));
    }

    clear(ui.sections);
    if (topic.analysis.sections.length === 0) {
      ui.sectionsEmpty.classList.remove("hidden");
      ui.rawText.classList.remove("hidden");
      ui.rawText.textContent = topic.rawText;
    } else {
      ui.sectionsEmpty.classList.add("hidden");
      ui.rawText.classList.add("hidden");
      ui.rawText.textContent = "";

      topic.analysis.sections.forEach((s, idx) => {
        const item = el("div", { className: "acc-item" });
        const head = el("button", { className: "acc-head" });
        head.type = "button";
        head.setAttribute("aria-expanded", "false");
        head.setAttribute("aria-controls", `sec_${idx}`);
        head.append(el("span", { text: s.title }));
        head.append(el("span", { className: "muted", text: "Mostrar" }));

        const body = el("div", { className: "acc-body hidden", attrs: { id: `sec_${idx}` } });

        if (s.paragraphs.length) body.append(el("p", { text: s.paragraphs[0] }));
        if (s.bullets.length) {
          const ul = el("ul");
          s.bullets.slice(0, 12).forEach(b => ul.append(el("li", { text: b })));
          body.append(ul);
        }

        head.addEventListener("click", () => {
          const expanded = head.getAttribute("aria-expanded") === "true";
          head.setAttribute("aria-expanded", expanded ? "false" : "true");
          body.classList.toggle("hidden", expanded);
          head.lastChild.textContent = expanded ? "Mostrar" : "Ocultar";
        });

        item.append(head, body);
        ui.sections.append(item);
      });
    }

    clear(ui.glossary);
    if (topic.analysis.glossary.length === 0) {
      ui.glossaryEmpty.classList.remove("hidden");
    } else {
      ui.glossaryEmpty.classList.add("hidden");
      for (const g of topic.analysis.glossary) {
        const card = el("div", { className: "gloss-card" });
        card.append(el("h4", { text: g.term }));
        card.append(el("p", { text: g.def }));
        ui.glossary.append(card);
      }
    }

    if (topic.questionBank.incomplete) {
      showMessage("Banco de preguntas incompleto por falta de información en el temario.", "warn");
    } else {
      hideMessage();
    }
  }

  /* ------------------------------ Views ------------------------------------ */
  function setView(view) {
    state.view = view;

    const isStudy = view === "study";
    ui.viewStudy.classList.toggle("hidden", !isStudy);
    ui.viewTest.classList.toggle("hidden", isStudy);

    ui.btnViewStudy.setAttribute("aria-pressed", isStudy ? "true" : "false");
    ui.btnViewTest.setAttribute("aria-pressed", !isStudy ? "true" : "false");

    const main = $("#main");
    if (main) main.focus({ preventScroll: true });
  }

  /* ------------------------------ Topic selection -------------------------- */
  async function selectTopic(fileName) {
    try {
      hideMessage();
      state.selected = fileName;

      let topic = state.topics.get(fileName);
      if (!topic) {
        showMessage("Cargando tema…");
        topic = await loadTopic(fileName);
        hideMessage();
      }

      $$(".topic-item").forEach(b => {
        b.setAttribute("aria-current", b.getAttribute("data-file") === fileName ? "true" : "false");
      });

      ui.btnViewTest.disabled = false;
      setView("study");
      renderStudy(topic);
    } catch (err) {
      console.error(err);
      showMessage(`Error al cargar el tema "${fileName}". Revisa que exista en /temario/.`, "warn");
    }
  }

  /* ------------------------------ Test engine ------------------------------ */
  function buildTestSequence(questionBank, mode = "full", onlyIds = null) {
    let seq = [
      ...questionBank.mcq.map(q => ({ ...q, kind: "Test" })),
      ...questionBank.tf.map(q => ({ ...q, kind: "V/F" })),
      ...questionBank.short.map(q => ({ ...q, kind: "Corta" }))
    ];

    if (mode === "wrongOnly" && Array.isArray(onlyIds) && onlyIds.length > 0) {
      const set = new Set(onlyIds);
      seq = seq.filter(q => set.has(q.id));
    }

    return seq;
  }

  function startTest(mode = "full") {
    const topic = state.topics.get(state.selected);
    if (!topic) return;

    const prog = topicProgress(state.store, topic.fileName);
    const wrongIds = prog.wrongQuestionIds || [];

    const seq = (mode === "wrongOnly")
      ? buildTestSequence(topic.questionBank, "wrongOnly", wrongIds)
      : buildTestSequence(topic.questionBank, "full");

    if (seq.length === 0) {
      showMessage("No hay preguntas disponibles para este tema.", "warn");
      return;
    }

    state.test = {
      topicFile: topic.fileName,
      topicTitle: topic.analysis.title || topic.fileName,
      mode,
      idx: 0,
      seq,
      answers: new Map(),
      instant: ui.toggleInstant.checked
    };

    ui.results.classList.add("hidden");
    clear(ui.wrongReview);
    ui.wrongReviewEmpty.classList.add("hidden");
    ui.instantFeedback.classList.add("hidden");

    setView("test");
    renderTestFrame();
  }

  function currentQ() {
    return state.test?.seq?.[state.test.idx] || null;
  }

  function renderTestFrame() {
    const t = state.test;
    if (!t) return;

    const q = currentQ();
    if (!q) return;

    ui.testTitle.textContent = `Test · ${t.topicTitle}`;
    ui.testMeta.textContent = (t.mode === "wrongOnly")
      ? "Modo: repetir solo falladas"
      : "Modo: test completo";

    const total = t.seq.length;
    const pos = t.idx + 1;

    ui.progressText.textContent = `${pos}/${total}`;
    ui.progressKind.textContent = `${q.kind} · ${q.difficulty}`;
    ui.progressBar.style.width = `${Math.round((pos / total) * 100)}%`;

    ui.btnPrev.disabled = t.idx === 0;
    ui.btnNext.disabled = true;
    ui.btnConfirm.disabled = true;

    clear(ui.questionHost);

    const title = el("h3", { className: "q-title", text: q.prompt });
    ui.questionHost.append(title);

    // sourceHint es interno (NO visible). Se conserva en q.sourceHint.

    const answer = t.answers.get(q.id);

    if (q.type === "mcq") {
      const optWrap = el("div", { className: "options", attrs: { role: "radiogroup" } });

      q.options.forEach((opt, i) => {
        const row = el("label", { className: "option" });
        const input = el("input", { attrs: { type: "radio", name: `q_${q.id}`, value: opt.id } });
        input.checked = !!answer && answer.choiceId === opt.id;

        input.addEventListener("change", () => {
          t.answers.set(q.id, { choiceId: opt.id, confirmed: false, correct: null });
          ui.btnConfirm.disabled = false;
          ui.btnNext.disabled = true;
          ui.instantFeedback.classList.add("hidden");
        });

        const chip = el("span", { className: "chip", text: String(i + 1) });
        row.append(input, chip, el("div", { text: opt.text }));
        optWrap.append(row);
      });

      ui.questionHost.append(optWrap);

      ui.btnConfirm.disabled = !(answer && answer.choiceId);
      if (answer && answer.confirmed) {
        ui.btnNext.disabled = t.idx >= total - 1;
        ui.btnConfirm.disabled = true;
      }

    } else if (q.type === "tf") {
      const optWrap = el("div", { className: "options", attrs: { role: "radiogroup" } });
      const opts = [
        { id: "T", label: "Verdadero" },
        { id: "F", label: "Falso" }
      ];

      opts.forEach((opt, i) => {
        const row = el("label", { className: "option" });
        const input = el("input", { attrs: { type: "radio", name: `q_${q.id}`, value: opt.id } });
        input.checked = !!answer && answer.choiceId === opt.id;

        input.addEventListener("change", () => {
          t.answers.set(q.id, { choiceId: opt.id, confirmed: false, correct: null });
          ui.btnConfirm.disabled = false;
          ui.btnNext.disabled = true;
          ui.instantFeedback.classList.add("hidden");
        });

        const chip = el("span", { className: "chip", text: String(i + 1) });
        row.append(input, chip, el("div", { text: opt.label }));
        optWrap.append(row);
      });

      ui.questionHost.append(optWrap);

      ui.btnConfirm.disabled = !(answer && answer.choiceId);
      if (answer && answer.confirmed) {
        ui.btnNext.disabled = t.idx >= total - 1;
        ui.btnConfirm.disabled = true;
      }

    } else if (q.type === "short") {
      const hint = el("p", { className: "q-hint", text: "Respuesta libre (se guarda tu texto; corrección guiada al final)." });
      const textarea = el("textarea", { className: "free", attrs: { placeholder: "Escribe tu respuesta…" } });
      textarea.value = answer?.text ?? "";

      textarea.addEventListener("input", () => {
        const v = textarea.value;
        t.answers.set(q.id, { text: v, confirmed: false, correct: null });
        ui.btnConfirm.disabled = v.trim().length === 0;
        ui.btnNext.disabled = true;
        ui.instantFeedback.classList.add("hidden");
      });

      ui.questionHost.append(hint, textarea);

      ui.btnConfirm.disabled = !(answer && (answer.text || "").trim().length > 0);
      if (answer && answer.confirmed) {
        ui.btnNext.disabled = t.idx >= total - 1;
        ui.btnConfirm.disabled = true;
      }
    }

    if (answer && answer.confirmed && ui.toggleInstant.checked) {
      showInstantFeedback(q, answer);
    } else {
      ui.instantFeedback.classList.add("hidden");
    }
  }

  function confirmAnswer() {
    const t = state.test;
    if (!t) return;

    const q = currentQ();
    if (!q) return;

    const a = t.answers.get(q.id);
    if (!a) return;

    let correct = null;
    if (q.type === "mcq") {
      correct = a.choiceId === q.correctOptionId;
    } else if (q.type === "tf") {
      const isTrueChosen = a.choiceId === "T";
      correct = isTrueChosen === q.correctBool;
    } else if (q.type === "short") {
      correct = null;
    }

    t.answers.set(q.id, { ...a, confirmed: true, correct });

    ui.btnConfirm.disabled = true;
    ui.btnNext.disabled = t.idx >= t.seq.length - 1;

    if (ui.toggleInstant.checked) {
      showInstantFeedback(q, { ...a, confirmed: true, correct });
    } else {
      ui.instantFeedback.classList.add("hidden");
    }

    if (t.idx === t.seq.length - 1) finishTest();
  }

  function showInstantFeedback(q, a) {
    ui.instantFeedback.classList.remove("hidden", "good", "bad");

    if (q.type === "short") {
      ui.instantFeedback.classList.add("good");
      clear(ui.instantFeedback);
      ui.instantFeedback.append(
        el("strong", { text: "Guía de corrección (respuesta corta)" }),
        el("p", { text: `Respuesta esperada (contexto temario): ${q.expectedAnswer}` })
      );
      const ul = el("ul", { className: "bullets" });
      (q.rubric || []).forEach(r => ul.append(el("li", { text: r })));
      ui.instantFeedback.append(ul);
      return;
    }

    const ok = a.correct === true;
    ui.instantFeedback.classList.add(ok ? "good" : "bad");
    clear(ui.instantFeedback);
    ui.instantFeedback.append(
      el("strong", { text: ok ? "Correcto" : "Incorrecto" }),
      el("p", { text: q.explanation || "Sin explicación." })
    );
  }

  function goPrev() {
    const t = state.test;
    if (!t || t.idx === 0) return;
    t.idx -= 1;
    ui.instantFeedback.classList.add("hidden");
    renderTestFrame();
  }

  function goNext() {
    const t = state.test;
    if (!t) return;
    if (t.idx >= t.seq.length - 1) return;
    t.idx += 1;
    ui.instantFeedback.classList.add("hidden");
    renderTestFrame();
  }

  function computeScore(t) {
    const gradable = t.seq.filter(q => q.type !== "short");
    let correct = 0, wrong = 0, blank = 0;

    for (const q of gradable) {
      const a = t.answers.get(q.id);
      if (!a || !a.confirmed) {
        blank++;
        continue;
      }
      if (a.correct === true) correct++;
      else wrong++;
    }

    const total = gradable.length;
    const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
    return { pct, total, correct, wrong, blank };
  }

  function finishTest() {
    const t = state.test;
    if (!t) return;

    const topic = state.topics.get(t.topicFile);
    if (!topic) return;

    const score = computeScore(t);

    const wrongIds = [];
    for (const q of t.seq) {
      if (q.type === "short") continue;
      const a = t.answers.get(q.id);
      if (!a || !a.confirmed) continue;
      if (a.correct === false) wrongIds.push(q.id);
    }

    const prog = topicProgress(state.store, topic.fileName);
    const now = Date.now();
    const newLastScores = [{ ts: now, score: score.pct, total: score.total, correct: score.correct, wrong: score.wrong }, ...prog.lastScores].slice(0, 6);
    const mergedWrong = uniqueArray([...(prog.wrongQuestionIds || []), ...wrongIds]);

    updateTopicProgress(state.store, topic.fileName, {
      lastScores: newLastScores,
      lastScore: score.pct,
      bestScore: prog.bestScore == null ? score.pct : Math.max(prog.bestScore, score.pct),
      wrongQuestionIds: mergedWrong,
      attempts: (prog.attempts || 0) + 1
    });

    renderTopicList(ui.topicSearch.value);

    ui.results.classList.remove("hidden");
    ui.scoreChip.textContent = `${score.pct}%`;
    ui.rCorrect.textContent = String(score.correct);
    ui.rWrong.textContent = String(score.wrong);
    ui.rBlank.textContent = String(score.blank);

    clear(ui.wrongReview);
    if (wrongIds.length === 0) {
      ui.wrongReviewEmpty.classList.remove("hidden");
    } else {
      ui.wrongReviewEmpty.classList.add("hidden");
      for (const qid of wrongIds) {
        const q = t.seq.find(x => x.id === qid);
        if (!q) continue;

        const item = el("div", { className: "review-item" });
        item.append(el("h5", { text: q.prompt }));

        const a = t.answers.get(qid);
        if (q.type === "mcq" || q.type === "tf") {
          const your = a?.choiceId ?? "—";
          const correct = (q.type === "mcq") ? q.correctOptionId : (q.correctBool ? "T" : "F");
          item.append(el("p", { text: `Tu respuesta: ${your} · Correcta: ${correct}` }));
        }

        item.append(el("p", { text: q.explanation || "Sin explicación." }));

        // NO mostrar sourceHint (requisito). Se mantiene interno en q.sourceHint.

        ui.wrongReview.append(item);
      }
    }

    ui.btnRetryWrong.disabled = wrongIds.length === 0;
  }

  function uniqueArray(arr) {
    const s = new Set();
    const out = [];
    for (const x of arr) {
      if (s.has(x)) continue;
      s.add(x);
      out.push(x);
    }
    return out;
  }

  /* ------------------------------ Events ----------------------------------- */
  function wireEvents() {
    ui.topicSearch.addEventListener("input", () => renderTopicList(ui.topicSearch.value));

    ui.btnViewStudy.addEventListener("click", () => setView("study"));
    ui.btnViewTest.addEventListener("click", () => {
      if (!state.selected) return;
      setView("test");
      if (!state.test) startTest("full");
    });

    ui.btnStartTest.addEventListener("click", () => startTest("full"));

    ui.btnExitTest.addEventListener("click", () => {
      setView("study");
      ui.instantFeedback.classList.add("hidden");
    });

    ui.toggleGlossaryCompact.addEventListener("change", () => {
      ui.glossary.classList.toggle("compact", ui.toggleGlossaryCompact.checked);
    });

    ui.toggleInstant.addEventListener("change", () => {
      if (!state.test) return;
      state.test.instant = ui.toggleInstant.checked;
      const q = currentQ();
      const a = q ? state.test.answers.get(q.id) : null;
      if (q && a && a.confirmed && ui.toggleInstant.checked) showInstantFeedback(q, a);
      else ui.instantFeedback.classList.add("hidden");
    });

    ui.btnPrev.addEventListener("click", goPrev);
    ui.btnNext.addEventListener("click", goNext);
    ui.btnConfirm.addEventListener("click", confirmAnswer);

    ui.btnRetryWrong.addEventListener("click", () => startTest("wrongOnly"));
    ui.btnRestartFull.addEventListener("click", () => startTest("full"));

    ui.btnResetProgress.addEventListener("click", () => {
      resetStore();
      state.store = loadStore();
      renderTopicList(ui.topicSearch.value);
      if (state.selected) {
        const topic = state.topics.get(state.selected);
        if (topic) renderStudy(topic);
      }
      showMessage("Progreso reiniciado (solo en este navegador).");
      setTimeout(() => hideMessage(), 1800);
    });

    document.addEventListener("keydown", (ev) => {
      if (state.view !== "test" || !state.test) return;

      const q = currentQ();
      if (!q) return;

      if (ev.key === "ArrowLeft") { goPrev(); return; }
      if (ev.key === "ArrowRight") { goNext(); return; }

      if (ev.key === "Enter") {
        if (!ui.btnConfirm.disabled) confirmAnswer();
        return;
      }

      if (q.type === "mcq" && ["1","2","3","4"].includes(ev.key)) {
        const idx = Number(ev.key) - 1;
        const opt = q.options[idx];
        if (!opt) return;
        const input = $(`input[name="q_${q.id}"][value="${opt.id}"]`, ui.questionHost);
        if (input) input.click();
      }

      if (q.type === "tf" && ["1","2"].includes(ev.key)) {
        const optId = ev.key === "1" ? "T" : "F";
        const input = $(`input[name="q_${q.id}"][value="${optId}"]`, ui.questionHost);
        if (input) input.click();
      }
    });
  }

  /* ------------------------------ Init ------------------------------------- */
  async function init() {
    wireEvents();

    state.manifest = await loadManifest();
    if (state.manifest.length === 0) {
      renderTopicList("");
      ui.btnViewTest.disabled = true;
      ui.btnStartTest.disabled = true;
      return;
    }

    showMessage("Cargando lista de temas…");
    for (const fileName of state.manifest) {
      try {
        await loadTopic(fileName);
      } catch (err) {
        console.error(err);
      }
    }
    hideMessage();

    renderTopicList("");

    const first = state.manifest.find(fn => state.topics.has(fn));
    if (first) selectTopic(first);
  }

  init();
})();
