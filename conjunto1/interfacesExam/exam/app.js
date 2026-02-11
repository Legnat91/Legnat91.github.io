/* =========================================================
   Práctica de Exámenes (Local)
   - Sin dependencias
   - Persistencia: localStorage
   - Datos: questions.js (TOPICS, QUESTIONS)
   ========================================================= */

(() => {
  "use strict";

  // -----------------------------
  // Helpers DOM
  // -----------------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const el = (tag, attrs = {}, children = []) => {
    const n = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "class") n.className = v;
      else if (k === "dataset") Object.assign(n.dataset, v);
      else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
      else if (k === "text") n.textContent = v;
      else if (k === "html") n.innerHTML = v;
      else if (v === true) n.setAttribute(k, "");
      else if (v !== false && v != null) n.setAttribute(k, v);
    });
    children.forEach(c => n.append(c));
    return n;
  };

  // -----------------------------
  // Data validation / normalization
  // -----------------------------
  const TOPICS = (window.TOPICS || window.__QBANK__?.TOPICS || []).slice();
  const QUESTIONS_RAW = (window.QUESTIONS || window.__QBANK__?.QUESTIONS || []).slice();

  function normalizeQuestion(q) {
    const nq = { ...q };
    if (!nq.id) throw new Error("Pregunta sin id");
    if (!nq.topic) nq.topic = "UF1";
    if (!nq.type) nq.type = "test";
    if (!nq.prompt) nq.prompt = "";
    nq.tags = Array.isArray(nq.tags) ? nq.tags : [];
    nq.difficulty = clampInt(nq.difficulty ?? 3, 1, 5);
    nq.source = nq.source === "profesor" ? "profesor" : (nq.source === "temario" ? "temario" : "temario");
    nq.explanation = nq.explanation ?? "";

    if (nq.type === "tf") {
      nq.options = Array.isArray(nq.options) && nq.options.length === 2 ? nq.options : ["Verdadero", "Falso"];
      nq.answer = clampInt(nq.answer ?? 0, 0, 1);
      return nq;
    }

    if (nq.type === "test") {
      nq.options = Array.isArray(nq.options) ? nq.options.slice() : [];
      if (nq.options.length < 2) nq.options = ["Opción A", "Opción B"];
      if (nq.options.length > 6) nq.options = nq.options.slice(0, 6);
      nq.answer = clampInt(nq.answer ?? 0, 0, nq.options.length - 1);
      return nq;
    }

    if (nq.type === "fill") {
      nq.answers = Array.isArray(nq.answers) ? nq.answers.filter(Boolean).map(String) : [];
      if (!nq.answers.length && typeof nq.answer === "string") nq.answers = [nq.answer];
      if (!nq.answers.length) nq.answers = [""];
      return nq;
    }

    // fallback
    nq.type = "test";
    nq.options = ["Opción A", "Opción B"];
    nq.answer = 0;
    return nq;
  }

  const QUESTIONS = QUESTIONS_RAW.map(normalizeQuestion);

  const TOPIC_BY_ID = new Map(TOPICS.map(t => [t.id, t]));
  const QUESTION_BY_ID = new Map(QUESTIONS.map(q => [q.id, q]));

  // -----------------------------
  // Storage
  // -----------------------------
  const LS_KEY = "exam_practice_v1";

  const defaultState = () => ({
    settings: {
      mode: "training",
      selectedTopics: TOPICS.map(t => t.id),
      numQuestions: 20,
      onlyProfesor: false,
      onlyFailed: false,
      onlyMarked: false,
      difficulty: "all",
      tagFilter: "",
      shuffleOptions: false,
      tolerantMode: true,
      allowSkip: true,
      skipCountsWrong: false,
      useTimer: "off",
      timerMinutes: 20,
      profWeight: 70,
      seed: ""
    },
    progress: {
      // per question id:
      // stats: { attempts, correct, wrong, streak, lastAttempt }
      stats: {},
      marked: {},
      // store "ever wrong" as boolean + lastWrong timestamp
      failed: {}
    }
  });

  function loadState() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      // shallow merge for forward compatibility
      const base = defaultState();
      return {
        settings: { ...base.settings, ...(parsed.settings || {}) },
        progress: {
          stats: parsed.progress?.stats || {},
          marked: parsed.progress?.marked || {},
          failed: parsed.progress?.failed || {}
        }
      };
    } catch {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }

  function resetAllProgress() {
    state = defaultState();
    saveState();
    syncHomeUIFromState();
    refreshAvailableCount();
  }

  let state = loadState();

  // -----------------------------
  // Random with seed (deterministic)
  // -----------------------------
  // xmur3 + mulberry32 combo
  function xmur3(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function() {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      h ^= h >>> 16;
      return h >>> 0;
    };
  }

  function mulberry32(a) {
    return function() {
      let t = (a += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function seededRng(seedStr) {
    const seed = xmur3(seedStr || String(Date.now()))();
    return mulberry32(seed);
  }

  function shuffleInPlace(arr, rng) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // -----------------------------
  // Normalization for tolerant answers
  // -----------------------------
  function normalizeText(s, tolerant) {
    const raw = String(s ?? "");
    if (!tolerant) return raw.trim();
    return raw
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/\s+/g, " ");
  }

  // -----------------------------
  // Filtering / selection
  // -----------------------------
  function isMarked(qid) { return !!state.progress.marked[qid]; }
  function isFailed(qid) { return !!state.progress.failed[qid]; }

  function passesFilters(q, s) {
    if (s.selectedTopics?.length && !s.selectedTopics.includes(q.topic)) return false;

    if (s.onlyProfesor && q.source !== "profesor") return false;
    if (s.onlyFailed && !isFailed(q.id)) return false;
    if (s.onlyMarked && !isMarked(q.id)) return false;

    if (s.difficulty !== "all") {
      const d = Number(s.difficulty);
      if (Number.isFinite(d) && q.difficulty !== d) return false;
    }

    const tagNeedle = (s.tagFilter || "").trim().toLowerCase();
    if (tagNeedle) {
      const hay = (q.tags || []).join(" ").toLowerCase();
      if (!hay.includes(tagNeedle)) return false;
    }
    return true;
  }

  function buildQuestionPool(settings) {
    return QUESTIONS.filter(q => passesFilters(q, settings));
  }

  function pickWeightedExam(pool, settings) {
    const nWanted = clampInt(settings.numQuestions, 1, 9999);
    const rng = seededRng(settings.seed || `seed-${Date.now()}`);

    const prof = pool.filter(q => q.source === "profesor");
    const other = pool.filter(q => q.source !== "profesor");

    const weight = clampInt(settings.profWeight, 0, 100) / 100;
    let nProf = Math.round(nWanted * weight);
    let nOther = nWanted - nProf;

    // adjust if not enough in either bucket
    if (prof.length < nProf) {
      nOther += (nProf - prof.length);
      nProf = prof.length;
    }
    if (other.length < nOther) {
      nProf += (nOther - other.length);
      nOther = other.length;
    }
    nProf = Math.min(nProf, prof.length);
    nOther = Math.min(nOther, other.length);

    const chosen = [];
    shuffleInPlace(prof.slice(), rng).slice(0, nProf).forEach(q => chosen.push(q));
    shuffleInPlace(other.slice(), rng).slice(0, nOther).forEach(q => chosen.push(q));

    // final shuffle (avoid patterns)
    shuffleInPlace(chosen, rng);

    // ensure no duplicates (shouldn't happen)
    const seen = new Set();
    return chosen.filter(q => (seen.has(q.id) ? false : (seen.add(q.id), true)));
  }

  // -----------------------------
  // Session state (in-memory)
  // -----------------------------
  let session = null;
  /*
    session = {
      mode,
      questions: [question objects],
      idx,
      answersById: { [id]: { correct, user, correctAnswerText } },
      startedAt,
      timer: { enabled, endAt, intervalId },
      allowSkip,
      skipCountsWrong
    }
  */

  // -----------------------------
  // Screens
  // -----------------------------
  const screenHome = $("#screenHome");
  const screenQuestion = $("#screenQuestion");
  const screenResults = $("#screenResults");

  function showScreen(which) {
    [screenHome, screenQuestion, screenResults].forEach(s => s.classList.add("hidden"));
    which.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // -----------------------------
  // UI: Home
  // -----------------------------
  const topicsBox = $("#topicsBox");
  const btnSelectAllTopics = $("#btnSelectAllTopics");
  const btnSelectNoneTopics = $("#btnSelectNoneTopics");
  const availableCount = $("#availableCount");

  const modeSel = $("#mode");
  const numQuestions = $("#numQuestions");
  const onlyProfesor = $("#onlyProfesor");
  const onlyFailed = $("#onlyFailed");
  const onlyMarked = $("#onlyMarked");
  const difficulty = $("#difficulty");
  const tagFilter = $("#tagFilter");

  const shuffleOptions = $("#shuffleOptions");
  const tolerantMode = $("#tolerantMode");
  const allowSkip = $("#allowSkip");
  const skipCountsWrong = $("#skipCountsWrong");

  const useTimer = $("#useTimer");
  const timerMinutes = $("#timerMinutes");
  const profWeight = $("#profWeight");
  const seed = $("#seed");

  const btnStart = $("#btnStart");

  function renderTopicsChips() {
    topicsBox.innerHTML = "";
    TOPICS.forEach(t => {
      const on = state.settings.selectedTopics.includes(t.id);
      const chip = el("div", { class: "chip", dataset: { on: String(on) }, role: "button", tabindex: "0" }, [
        el("span", { text: t.name })
      ]);

      function toggle() {
        const set = new Set(state.settings.selectedTopics);
        if (set.has(t.id)) set.delete(t.id);
        else set.add(t.id);
        state.settings.selectedTopics = Array.from(set);
        chip.dataset.on = String(set.has(t.id));
        saveState();
        refreshAvailableCount();
      }

      chip.addEventListener("click", toggle);
      chip.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
      });

      topicsBox.appendChild(chip);
    });
  }

  function syncHomeUIFromState() {
    modeSel.value = state.settings.mode;
    numQuestions.value = String(state.settings.numQuestions);

    onlyProfesor.checked = !!state.settings.onlyProfesor;
    onlyFailed.checked = !!state.settings.onlyFailed;
    onlyMarked.checked = !!state.settings.onlyMarked;
    difficulty.value = String(state.settings.difficulty);
    tagFilter.value = state.settings.tagFilter || "";

    shuffleOptions.checked = !!state.settings.shuffleOptions;
    tolerantMode.checked = !!state.settings.tolerantMode;
    allowSkip.checked = !!state.settings.allowSkip;
    skipCountsWrong.checked = !!state.settings.skipCountsWrong;

    useTimer.value = state.settings.useTimer;
    timerMinutes.value = String(state.settings.timerMinutes);
    profWeight.value = String(state.settings.profWeight);
    seed.value = state.settings.seed || "";
  }

  function syncStateFromHomeUI() {
    state.settings.mode = modeSel.value;
    state.settings.numQuestions = clampInt(numQuestions.value, 1, 9999);

    state.settings.onlyProfesor = !!onlyProfesor.checked;
    state.settings.onlyFailed = !!onlyFailed.checked;
    state.settings.onlyMarked = !!onlyMarked.checked;
    state.settings.difficulty = difficulty.value;
    state.settings.tagFilter = tagFilter.value || "";

    state.settings.shuffleOptions = !!shuffleOptions.checked;
    state.settings.tolerantMode = !!tolerantMode.checked;
    state.settings.allowSkip = !!allowSkip.checked;
    state.settings.skipCountsWrong = !!skipCountsWrong.checked;

    state.settings.useTimer = useTimer.value;
    state.settings.timerMinutes = clampInt(timerMinutes.value, 1, 9999);
    state.settings.profWeight = clampInt(profWeight.value, 0, 100);
    state.settings.seed = seed.value || "";

    saveState();
  }

  function refreshAvailableCount() {
    syncStateFromHomeUI(); // keep live
    renderTopicsChips();   // keep chip state in sync

    const pool = buildQuestionPool(state.settings);
    const prof = pool.filter(q => q.source === "profesor").length;
    const total = pool.length;

    // Auto-adjust N if needed (but don't overwrite user's input aggressively; just show)
    availableCount.textContent =
      `Disponibles: ${total} (profesor: ${prof}) · Seleccionadas: ${Math.min(total, clampInt(state.settings.numQuestions, 1, 9999))}`;
  }

  // -----------------------------
  // UI: Question screen
  // -----------------------------
  const qMeta = $("#qMeta");
  const qPrompt = $("#qPrompt");
  const qBody = $("#qBody");
  const btnSubmit = $("#btnSubmit");
  const btnNext = $("#btnNext");
  const feedback = $("#feedback");
  const btnMark = $("#btnMark");
  const btnSkip = $("#btnSkip");
  const btnEnd = $("#btnEnd");
  const progressFill = $("#progressFill");

  const timerPill = $("#timerPill");

  function formatDifficulty(d) {
    return "★".repeat(d) + "☆".repeat(5 - d);
  }

  function renderMeta(q, idx, total) {
    qMeta.innerHTML = "";
    const topicName = TOPIC_BY_ID.get(q.topic)?.name || q.topic;
    const badges = [
      `Progreso ${idx + 1}/${total}`,
      topicName,
      `Dificultad ${formatDifficulty(q.difficulty)}`,
      `Fuente: ${q.source}`,
      ...(q.tags || []).slice(0, 6).map(t => `#${t}`)
    ];
    badges.forEach(b => qMeta.appendChild(el("span", { class: "badge", text: b })));
  }

  function setMarkButton(qid) {
    const on = isMarked(qid);
    btnMark.textContent = on ? "★ Marcada" : "☆ Marcar";
  }

  function renderQuestion() {
    const q = session.questions[session.idx];
    renderMeta(q, session.idx, session.questions.length);
    progressFill.style.width = `${((session.idx) / session.questions.length) * 100}%`;

    qPrompt.textContent = q.prompt;
    qBody.innerHTML = "";
    feedback.classList.add("hidden");
    feedback.classList.remove("good", "bad");
    feedback.textContent = "";

    setMarkButton(q.id);

    btnNext.classList.add("hidden");
    btnSubmit.classList.remove("hidden");
    btnSubmit.disabled = false;

    // Skip button
    btnSkip.disabled = !session.allowSkip;

    if (q.type === "test" || q.type === "tf") {
      const rng = seededRng((state.settings.seed || "session") + "::" + q.id);
      const baseOptions = q.options.map((text, i) => ({ text, i }));
      const options = state.settings.shuffleOptions ? shuffleInPlace(baseOptions, rng) : baseOptions;

      const wrap = el("div", { class: "options", role: "radiogroup", "aria-label": "Opciones" });
      options.forEach(opt => {
        const id = `opt_${q.id}_${opt.i}`;
        const radio = el("input", { type: "radio", name: "opt", id, value: String(opt.i) });
        const label = el("label", { class: "opt", for: id }, [
          radio,
          el("div", {}, [el("div", { text: opt.text })])
        ]);
        wrap.appendChild(label);
      });
      qBody.appendChild(wrap);

    } else if (q.type === "fill") {
      const inp = el("input", { type: "text", id: "fillAnswer", placeholder: "Escribe tu respuesta..." });
      const hint = el("small", { class: "muted", text: state.settings.tolerantMode ? "Modo tolerante activado." : "Modo tolerante desactivado." });
      qBody.appendChild(el("div", { class: "field" }, [
        el("label", { for: "fillAnswer", text: "Respuesta" }),
        inp,
        hint
      ]));
      setTimeout(() => inp.focus(), 50);
    }
  }

  function getUserAnswer(q) {
    if (q.type === "test" || q.type === "tf") {
      const checked = $('input[name="opt"]:checked', qBody);
      if (!checked) return null;
      return Number(checked.value);
    }
    if (q.type === "fill") {
      const inp = $("#fillAnswer", qBody);
      return inp ? inp.value : "";
    }
    return null;
  }

  function checkAnswer(q, user) {
    if (q.type === "test" || q.type === "tf") {
      const isCorrect = Number(user) === Number(q.answer);
      return {
        correct: isCorrect,
        correctAnswerText: q.options[q.answer]
      };
    }
    if (q.type === "fill") {
      const tolerant = !!state.settings.tolerantMode;
      const u = normalizeText(user, tolerant);
      const valids = (q.answers || []).map(a => normalizeText(a, tolerant)).filter(Boolean);

      const correct = valids.some(v => v === u);
      return {
        correct,
        correctAnswerText: (q.answers || [])[0] || ""
      };
    }
    return { correct: false, correctAnswerText: "" };
  }

  function updateStats(qid, wasCorrect) {
    const now = new Date().toISOString();
    const st = state.progress.stats[qid] || { attempts: 0, correct: 0, wrong: 0, streak: 0, lastAttempt: null };

    st.attempts += 1;
    st.lastAttempt = now;

    if (wasCorrect) {
      st.correct += 1;
      st.streak = Math.max(0, st.streak) + 1;
      // if correct, you may still keep failed flag as "ever failed" for filter (we keep it)
    } else {
      st.wrong += 1;
      st.streak = Math.min(0, st.streak) - 1;
      state.progress.failed[qid] = { at: now };
    }
    state.progress.stats[qid] = st;
    saveState();
  }

  function showFeedback(q, result, user) {
    const title = result.correct ? "✅ Correcto" : "❌ Incorrecto";
    const extra =
      q.type === "fill"
        ? `Tu respuesta: "${String(user ?? "").trim()}". Respuesta válida: "${result.correctAnswerText}".`
        : `Respuesta correcta: "${result.correctAnswerText}".`;

    const expl = q.explanation ? `<br><br><strong>Explicación:</strong> ${escapeHtml(q.explanation)}` : "";
    feedback.innerHTML = `<strong>${title}</strong><br>${escapeHtml(extra)}${expl}`;
    feedback.classList.remove("hidden");
    feedback.classList.toggle("good", result.correct);
    feedback.classList.toggle("bad", !result.correct);
  }

  function lockQuestionUI() {
    // disable inputs
    $$('input, textarea, select', qBody).forEach(n => n.disabled = true);
    btnSubmit.disabled = true;
    btnSubmit.classList.add("hidden");
    btnNext.classList.remove("hidden");
  }

  function goNextOrFinish() {
    session.idx += 1;
    if (session.idx >= session.questions.length) {
      finishSession();
      return;
    }
    renderQuestion();
  }

  // -----------------------------
  // Timer
  // -----------------------------
  function startTimerIfNeeded() {
    if (session.timer?.enabled) {
      timerPill.hidden = false;
      tickTimer();
      session.timer.intervalId = window.setInterval(tickTimer, 250);
    } else {
      timerPill.hidden = true;
    }
  }

  function stopTimer() {
    if (session?.timer?.intervalId) {
      clearInterval(session.timer.intervalId);
      session.timer.intervalId = null;
    }
  }

  function tickTimer() {
    if (!session?.timer?.enabled) return;
    const msLeft = session.timer.endAt - Date.now();
    const clamped = Math.max(0, msLeft);
    timerPill.textContent = `⏱️ ${formatMs(clamped)}`;

    if (msLeft <= 0) {
      stopTimer();
      // auto-finish
      finishSession(true);
    }
  }

  function formatMs(ms) {
    const totalSec = Math.floor(ms / 1000);
    const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
    const ss = String(totalSec % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  // -----------------------------
  // Results screen
  // -----------------------------
  const rSubtitle = $("#rSubtitle");
  const statScore = $("#statScore");
  const statCorrect = $("#statCorrect");
  const statWrong = $("#statWrong");
  const resultList = $("#resultList");
  const btnRetryWrong = $("#btnRetryWrong");
  const btnBackHome = $("#btnBackHome");

  function finishSession(fromTimeout = false) {
    stopTimer();

    // In exam mode, evaluate unanswered as wrong? We'll treat unanswered as wrong only if user ended early.
    // Here: compute based on recorded answersById.
    const total = session.questions.length;
    let correct = 0;
    let wrong = 0;

    session.questions.forEach(q => {
      const rec = session.answersById[q.id];
      if (rec?.correct) correct++;
      else wrong++;
    });

    const pct = total ? (correct / total) * 100 : 0;
    statCorrect.textContent = `${correct}/${total}`;
    statWrong.textContent = `${wrong}/${total}`;
    statScore.textContent = `${pct.toFixed(0)}%`;

    const modeName = session.mode === "exam" ? "Examen" : "Entrenamiento";
    const why = fromTimeout ? " (tiempo agotado)" : "";
    rSubtitle.textContent = `${modeName}${why} · ${new Date().toLocaleString()}`;

    // list
    resultList.innerHTML = "";
    session.questions.forEach(q => {
      const rec = session.answersById[q.id] || { correct: false, user: null, correctAnswerText: "" };
      const pill = el("span", { class: `pill ${rec.correct ? "good" : "bad"}`, text: rec.correct ? "Correcta" : "Fallo" });
      const topicName = TOPIC_BY_ID.get(q.topic)?.name || q.topic;

      const userLine =
        q.type === "fill"
          ? `Tu respuesta: ${rec.user == null ? "—" : `"${String(rec.user).trim()}"`}`
          : `Tu respuesta: ${rec.user == null ? "—" : `"${q.options?.[rec.user] ?? "—"}"`}`;

      const rightLine = `Correcta: "${rec.correctAnswerText}"`;

      const meta = `${topicName} · Dif ${q.difficulty} · ${q.source}${q.tags?.length ? " · " + q.tags.map(t => "#" + t).join(" ") : ""}`;

      const expl = q.explanation ? `\nExplicación: ${q.explanation}` : "";

      const card = el("div", { class: "item" }, [
        el("div", { class: "row between wrap" }, [
          el("div", { class: "item-title", text: q.prompt }),
          pill
        ]),
        el("small", { text: meta }),
        el("small", { text: `${userLine} · ${rightLine}${expl ? " · " + expl : ""}` })
      ]);

      resultList.appendChild(card);
    });

    // enable retry wrong if any
    const anyWrong = session.questions.some(q => !(session.answersById[q.id]?.correct));
    btnRetryWrong.disabled = !anyWrong;

    showScreen(screenResults);
  }

  // -----------------------------
  // Start session
  // -----------------------------
  function startSession(custom = null) {
    syncStateFromHomeUI();
    const s = { ...state.settings, ...(custom || {}) };

    const pool = buildQuestionPool(s);
    if (!pool.length) {
      alert("No hay preguntas disponibles con los filtros actuales.");
      return;
    }

    // clamp n to available
    const n = Math.min(clampInt(s.numQuestions, 1, 9999), pool.length);

    // pick questions
    let chosen = pickWeightedExam(pool, { ...s, numQuestions: n });

    // avoid repeats (already ensured)
    session = {
      mode: s.mode,
      questions: chosen,
      idx: 0,
      answersById: {},
      startedAt: Date.now(),
      allowSkip: !!s.allowSkip,
      skipCountsWrong: !!s.skipCountsWrong,
      timer: {
        enabled: s.mode === "exam" && s.useTimer === "on",
        endAt: Date.now() + (clampInt(s.timerMinutes, 1, 9999) * 60 * 1000),
        intervalId: null
      }
    };

    // Question screen controls
    btnNext.onclick = () => goNextOrFinish();

    btnSubmit.onclick = () => {
      const q = session.questions[session.idx];
      const user = getUserAnswer(q);
      if (user == null || (q.type === "fill" && String(user).trim() === "")) {
        alert("Responde antes de continuar.");
        return;
      }

      const res = checkAnswer(q, user);
      session.answersById[q.id] = { correct: res.correct, user, correctAnswerText: res.correctAnswerText };

      // persist stats always
      updateStats(q.id, res.correct);

      if (session.mode === "training") {
        showFeedback(q, res, user);
        lockQuestionUI();
      } else {
        // exam: no feedback now
        lockQuestionUI();
        // auto-next for exam? keep manual "Siguiente" for control
      }
    };

    btnMark.onclick = () => {
      const q = session.questions[session.idx];
      if (isMarked(q.id)) delete state.progress.marked[q.id];
      else state.progress.marked[q.id] = { at: new Date().toISOString() };
      saveState();
      setMarkButton(q.id);
    };

    btnSkip.onclick = () => {
      if (!session.allowSkip) return;
      const q = session.questions[session.idx];

      if (session.skipCountsWrong) {
        session.answersById[q.id] = { correct: false, user: null, correctAnswerText: (q.type === "fill") ? (q.answers?.[0] || "") : (q.options?.[q.answer] || "") };
        updateStats(q.id, false);
      } else {
        // mark as unanswered but for results we treat as wrong to be strict:
        session.answersById[q.id] = { correct: false, user: null, correctAnswerText: (q.type === "fill") ? (q.answers?.[0] || "") : (q.options?.[q.answer] || "") };
      }

      goNextOrFinish();
    };

    btnEnd.onclick = () => {
      // finalize with whatever answered (unanswered counted as wrong because not in answersById? we prefill on skip only)
      // Ensure unanswered are marked wrong for consistency:
      session.questions.forEach(q => {
        if (!session.answersById[q.id]) {
          session.answersById[q.id] = {
            correct: false,
            user: null,
            correctAnswerText: (q.type === "fill") ? (q.answers?.[0] || "") : (q.options?.[q.answer] || "")
          };
          if (session.mode === "training") {
            // If user ends training mid-way, don't count as attempt
          } else {
            // If exam ended early, count as wrong attempt
            updateStats(q.id, false);
          }
        }
      });
      finishSession(false);
    };

    // go
    showScreen(screenQuestion);
    renderQuestion();
    startTimerIfNeeded();
  }

  // -----------------------------
  // Modals
  // -----------------------------
  const dlgStats = $("#dlgStats");
  const dlgData = $("#dlgData");

  $("#btnStats").onclick = () => {
    renderStatsModal();
    dlgStats.showModal();
  };
  $("#btnData").onclick = () => {
    $("#importMsg").hidden = true;
    dlgData.showModal();
  };
  $("#btnResetAll").onclick = () => {
    if (confirm("¿Seguro que quieres borrar TODO el progreso y ajustes guardados?")) {
      localStorage.removeItem(LS_KEY);
      state = defaultState();
      syncHomeUIFromState();
      renderTopicsChips();
      refreshAvailableCount();
      alert("Progreso borrado.");
    }
  };

  // Stats modal rendering
  const stTotal = $("#stTotal");
  const stMarked = $("#stMarked");
  const stWrongTotal = $("#stWrongTotal");
  const statsSearch = $("#statsSearch");
  const statsTable = $("#statsTable");

  function renderStatsModal() {
    const markedCount = Object.keys(state.progress.marked || {}).length;
    const totalStats = Object.keys(state.progress.stats || {}).length;
    const wrongTotal = Object.values(state.progress.stats || {}).reduce((acc, s) => acc + (s.wrong || 0), 0);

    stTotal.textContent = String(QUESTIONS.length);
    stMarked.textContent = String(markedCount);
    stWrongTotal.textContent = String(wrongTotal);

    statsSearch.value = "";
    renderStatsTable("");
    statsSearch.oninput = () => renderStatsTable(statsSearch.value || "");
  }

  function renderStatsTable(query) {
    const needle = (query || "").trim().toLowerCase();

    const rows = QUESTIONS
      .filter(q => {
        if (!needle) return true;
        const hay = [
          q.id,
          q.prompt,
          (TOPIC_BY_ID.get(q.topic)?.name || q.topic),
          (q.tags || []).join(" ")
        ].join(" ").toLowerCase();
        return hay.includes(needle);
      })
      .slice(0, 200); // keep it snappy

    statsTable.innerHTML = "";
    statsTable.appendChild(el("div", { class: "trow header" }, [
      el("div", { text: "ID" }),
      el("div", { text: "Pregunta" }),
      el("div", { text: "Aciertos" }),
      el("div", { text: "Fallos" }),
      el("div", { text: "Racha" })
    ]));

    rows.forEach(q => {
      const st = state.progress.stats[q.id] || { correct: 0, wrong: 0, streak: 0 };
      statsTable.appendChild(el("div", { class: "trow" }, [
        el("div", { text: q.id }),
        el("div", { text: q.prompt }),
        el("div", { text: String(st.correct || 0) }),
        el("div", { text: String(st.wrong || 0) }),
        el("div", { text: String(st.streak || 0) })
      ]));
    });

    if (!rows.length) {
      statsTable.appendChild(el("div", { class: "callout", text: "Sin resultados para esa búsqueda." }));
    }
  }

  // Export/Import
  const btnExport = $("#btnExport");
  const importFile = $("#importFile");
  const importMsg = $("#importMsg");

  btnExport.onclick = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      app: "exam_practice_v1",
      state
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = el("a", { href: url, download: `progreso-examen-${new Date().toISOString().slice(0,10)}.json` });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  importFile.onchange = async () => {
    try {
      const f = importFile.files && importFile.files[0];
      if (!f) return;

      const text = await f.text();
      const json = JSON.parse(text);

      const importedState = json?.state;
      if (!importedState?.settings || !importedState?.progress) throw new Error("Formato inválido.");

      // Merge: keep only known keys, but allow stats/marked/failed freely
      const base = defaultState();
      state = {
        settings: { ...base.settings, ...(importedState.settings || {}) },
        progress: {
          stats: importedState.progress.stats || {},
          marked: importedState.progress.marked || {},
          failed: importedState.progress.failed || {}
        }
      };
      saveState();
      syncHomeUIFromState();
      renderTopicsChips();
      refreshAvailableCount();

      importMsg.hidden = false;
      importMsg.className = "callout good";
      importMsg.textContent = "Importación completada. Tu progreso ya está cargado.";
    } catch (e) {
      importMsg.hidden = false;
      importMsg.className = "callout bad";
      importMsg.textContent = "No se pudo importar: " + (e?.message || "error");
    } finally {
      importFile.value = "";
    }
  };

  // Results buttons
  btnBackHome.onclick = () => {
    session = null;
    showScreen(screenHome);
    refreshAvailableCount();
  };

  btnRetryWrong.onclick = () => {
    if (!session) return;
    // Build a new session using only the wrong ones from last run (same mode as training by default)
    const wrongIds = session.questions
      .filter(q => !(session.answersById[q.id]?.correct))
      .map(q => q.id);

    const wrongQs = wrongIds.map(id => QUESTION_BY_ID.get(id)).filter(Boolean);
    if (!wrongQs.length) return;

    // Start as training for quicker learning, but keep user's chosen mode if you want:
    const mode = "training";

    session = {
      mode,
      questions: wrongQs,
      idx: 0,
      answersById: {},
      startedAt: Date.now(),
      allowSkip: !!state.settings.allowSkip,
      skipCountsWrong: !!state.settings.skipCountsWrong,
      timer: { enabled: false, endAt: 0, intervalId: null }
    };

    showScreen(screenQuestion);
    renderQuestion();
    startTimerIfNeeded();
  };

  // Start button
  btnStart.onclick = () => startSession();

  // Live update home filters
  const homeInputs = [
    modeSel, numQuestions, onlyProfesor, onlyFailed, onlyMarked, difficulty, tagFilter,
    shuffleOptions, tolerantMode, allowSkip, skipCountsWrong, useTimer, timerMinutes, profWeight, seed
  ];
  homeInputs.forEach(n => n.addEventListener("input", refreshAvailableCount));
  homeInputs.forEach(n => n.addEventListener("change", refreshAvailableCount));

  btnSelectAllTopics.onclick = () => {
    state.settings.selectedTopics = TOPICS.map(t => t.id);
    saveState();
    renderTopicsChips();
    refreshAvailableCount();
  };
  btnSelectNoneTopics.onclick = () => {
    state.settings.selectedTopics = [];
    saveState();
    renderTopicsChips();
    refreshAvailableCount();
  };

  // -----------------------------
  // Utils
  // -----------------------------
  function clampInt(v, min, max) {
    const n = Number(v);
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, Math.trunc(n)));
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // -----------------------------
  // Init
  // -----------------------------
  (function init() {
    // If no topics loaded, fallback minimal
    if (!TOPICS.length) {
      console.warn("TOPICS vacío. Revisa questions.js.");
    }

    renderTopicsChips();
    syncHomeUIFromState();
    refreshAvailableCount();
    showScreen(screenHome);
  })();

})();
