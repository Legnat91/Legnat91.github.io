/* ===========================
   Temario & Tests - Vanilla JS
   =========================== */

const STATE = {
  manifest: null,
  temasCache: new Map(),   // id -> tema JSON (in-memory current)
  temasSource: new Map(),  // id -> { from: 'fetch'|'localStorage'|'import', file? }
  currentTemaId: null,
  view: 'home',            // home | summary | test
  testSession: null,       // runtime session
  examMode: false,
};

const DOM = {};

document.addEventListener('DOMContentLoaded', init);

function init() {
  bindDom();
  initTheme();
  bindEvents();
  loadManifest();
  restoreLastTemaIfAny(); // best-effort (will open after manifest if possible)
}

/* ---------------------------
   DOM & Events
--------------------------- */

function bindDom() {
  DOM.manifestStatus = document.getElementById('manifestStatus');
  DOM.topicList = document.getElementById('topicList');
  DOM.topicSearch = document.getElementById('topicSearch');

  DOM.currentTitle = document.getElementById('currentTitle');
  DOM.currentMeta = document.getElementById('currentMeta');
  DOM.alerts = document.getElementById('alerts');

  DOM.btnTheme = document.getElementById('btnTheme');
  DOM.btnHelp = document.getElementById('btnHelp');

  DOM.btnViewSummary = document.getElementById('btnViewSummary');
  DOM.btnTopicTest = document.getElementById('btnTopicTest');
  DOM.btnExam = document.getElementById('btnExam');
  DOM.btnImport = document.getElementById('btnImport');
  DOM.btnExport = document.getElementById('btnExport');

  DOM.homeView = document.getElementById('homeView');
  DOM.summaryView = document.getElementById('summaryView');
  DOM.testView = document.getElementById('testView');

  DOM.summaryTextPreview = document.getElementById('summaryTextPreview');
  DOM.summaryKeyPointsPreview = document.getElementById('summaryKeyPointsPreview');
  DOM.summaryTextInput = document.getElementById('summaryTextInput');
  DOM.summaryPointsInput = document.getElementById('summaryPointsInput');
  DOM.btnApplySummary = document.getElementById('btnApplySummary');
  DOM.btnSaveLocal = document.getElementById('btnSaveLocal');

  DOM.testTitle = document.getElementById('testTitle');
  DOM.testSubtitle = document.getElementById('testSubtitle');
  DOM.testConfig = document.getElementById('testConfig');
  DOM.testRuntime = document.getElementById('testRuntime');

  DOM.numQuestions = document.getElementById('numQuestions');
  DOM.numQuestionsHint = document.getElementById('numQuestionsHint');
  DOM.shuffleQuestions = document.getElementById('shuffleQuestions');
  DOM.btnStartTest = document.getElementById('btnStartTest');
  DOM.btnResetTest = document.getElementById('btnResetTest');

  DOM.examTopicSelector = document.getElementById('examTopicSelector');
  DOM.examTopicsList = document.getElementById('examTopicsList');
  DOM.btnSelectAllExam = document.getElementById('btnSelectAllExam');
  DOM.btnSelectNoneExam = document.getElementById('btnSelectNoneExam');

  DOM.progressPill = document.getElementById('progressPill');
  DOM.scorePill = document.getElementById('scorePill');
  DOM.btnPrevQ = document.getElementById('btnPrevQ');
  DOM.btnNextQ = document.getElementById('btnNextQ');

  DOM.questionMeta = document.getElementById('questionMeta');
  DOM.questionText = document.getElementById('questionText');
  DOM.optionsForm = document.getElementById('optionsForm');
  DOM.btnCheck = document.getElementById('btnCheck');
  DOM.btnReveal = document.getElementById('btnReveal');
  DOM.btnFinish = document.getElementById('btnFinish');
  DOM.feedback = document.getElementById('feedback');

  DOM.helpDialog = document.getElementById('helpDialog');
  DOM.btnCloseHelp = document.getElementById('btnCloseHelp');

  DOM.fileInput = document.getElementById('fileInput');
}

function bindEvents() {
  DOM.btnTheme.addEventListener('click', toggleTheme);
  DOM.btnHelp.addEventListener('click', () => DOM.helpDialog.showModal());
  DOM.btnCloseHelp.addEventListener('click', () => DOM.helpDialog.close());

  DOM.topicSearch.addEventListener('input', () => renderTopicList());

  DOM.btnViewSummary.addEventListener('click', () => showSummaryView());
  DOM.btnTopicTest.addEventListener('click', () => showTopicTestSetup());
  DOM.btnExam.addEventListener('click', () => showExamSetup());

  DOM.btnImport.addEventListener('click', () => DOM.fileInput.click());
  DOM.fileInput.addEventListener('change', onImportFileSelected);

  DOM.btnExport.addEventListener('click', () => exportCurrentTema());

  DOM.btnApplySummary.addEventListener('click', applySummaryEditsInMemory);
  DOM.btnSaveLocal.addEventListener('click', saveCurrentTemaToLocalStorage);

  DOM.btnStartTest.addEventListener('click', startTestFromSetup);
  DOM.btnResetTest.addEventListener('click', resetTestView);

  DOM.btnPrevQ.addEventListener('click', () => navQuestion(-1));
  DOM.btnNextQ.addEventListener('click', () => navQuestion(+1));

  DOM.btnCheck.addEventListener('click', checkAnswer);
  DOM.btnReveal.addEventListener('click', revealExplanation);
  DOM.btnFinish.addEventListener('click', finishTest);

  DOM.btnSelectAllExam.addEventListener('click', () => setAllExamTopics(true));
  DOM.btnSelectNoneExam.addEventListener('click', () => setAllExamTopics(false));
}

/* ---------------------------
   Theme
--------------------------- */

function initTheme() {
  const saved = localStorage.getItem('tt_theme');
  if (saved === 'light' || saved === 'dark') {
    applyTheme(saved);
  } else {
    // Default: dark (matches CSS vars), but respect prefers-color-scheme if wanted:
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(prefersLight ? 'light' : 'dark');
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('tt_theme', theme);
}

/* ---------------------------
   Manifest & Topics
--------------------------- */

async function loadManifest() {
  clearAlerts();
  setManifestStatus('Cargando manifest…');

  try {
    const res = await fetch('./temario/manifest.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status} al cargar manifest.json`);
    const manifest = await res.json();

    const valid = validateManifest(manifest);
    if (!valid.ok) {
      setManifestStatus('Manifest inválido');
      showAlert('bad', 'manifest.json inválido', valid.message);
      return;
    }

    STATE.manifest = manifest;
    setManifestStatus(`Manifest OK (${manifest.temas.length} temas)`);
    renderTopicList();
    buildExamTopicSelector();

    // If we had a pending restore request, attempt now
    const pending = localStorage.getItem('tt_lastTemaId');
    if (pending && isTemaInManifest(pending)) {
      // open silently best effort (won't break UI)
      openTemaById(pending, { silentAlerts: true }).catch(() => {});
    }
  } catch (err) {
    setManifestStatus('Error al cargar manifest');
    showAlert('bad', 'No se pudo cargar /temario/manifest.json', String(err.message || err));
  }
}

function validateManifest(m) {
  if (!m || typeof m !== 'object') return { ok: false, message: 'El manifest no es un objeto.' };
  if (!Array.isArray(m.temas)) return { ok: false, message: 'Falta "temas" o no es un array.' };
  for (const t of m.temas) {
    if (!t || typeof t !== 'object') return { ok: false, message: 'Un tema del manifest no es objeto.' };
    if (!t.id || !t.titulo || !t.file) return { ok: false, message: 'Cada tema debe incluir id, titulo y file.' };
    if (typeof t.id !== 'string' || typeof t.titulo !== 'string' || typeof t.file !== 'string') {
      return { ok: false, message: 'id/titulo/file deben ser strings.' };
    }
  }
  return { ok: true };
}

function setManifestStatus(text) {
  DOM.manifestStatus.textContent = text;
}

function renderTopicList() {
  if (!STATE.manifest) return;

  const q = (DOM.topicSearch.value || '').trim().toLowerCase();
  const temas = STATE.manifest.temas.filter(t => !q || t.titulo.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));

  DOM.topicList.innerHTML = '';
  if (temas.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'alert warn';
    empty.textContent = 'No hay temas que coincidan con la búsqueda.';
    DOM.topicList.appendChild(empty);
    return;
  }

  for (const t of temas) {
    const item = document.createElement('div');
    item.className = 'topic-item' + (STATE.currentTemaId === t.id ? ' active' : '');
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Abrir ${t.titulo}`);

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = t.titulo;

    const meta = document.createElement('div');
    meta.className = 'meta';

    const source = STATE.temasSource.get(t.id)?.from;
    const pill1 = document.createElement('span');
    pill1.className = 'pill';
    pill1.textContent = source ? `En memoria: ${source}` : 'No cargado';

    const pill2 = document.createElement('span');
    pill2.className = 'pill';
    pill2.textContent = `Archivo: ${t.file}`;

    meta.appendChild(pill1);
    meta.appendChild(pill2);

    item.appendChild(title);
    item.appendChild(meta);

    item.addEventListener('click', () => openTemaById(t.id));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openTemaById(t.id);
      }
    });

    DOM.topicList.appendChild(item);
  }
}

function isTemaInManifest(id) {
  return !!STATE.manifest?.temas?.some(t => t.id === id);
}

function getManifestEntry(id) {
  return STATE.manifest?.temas?.find(t => t.id === id) || null;
}

async function openTemaById(id, opts = {}) {
  clearAlerts();

  if (!STATE.manifest) {
    showAlert('warn', 'Manifest aún no cargado', 'Espera a que se cargue /temario/manifest.json.');
    return;
  }
  const entry = getManifestEntry(id);
  if (!entry) {
    showAlert('bad', 'Tema no encontrado en manifest', `No existe el id "${id}" en manifest.json.`);
    return;
  }

  // First: try localStorage override (optional persistence)
  const localKey = localStorageKeyForTema(id);
  const localRaw = localStorage.getItem(localKey);
  if (localRaw) {
    try {
      const localObj = JSON.parse(localRaw);
      const v = validateTema(localObj);
      if (v.ok) {
        STATE.temasCache.set(id, localObj);
        STATE.temasSource.set(id, { from: 'localStorage' });
      } else {
        // local copy invalid -> ignore but warn
        if (!opts.silentAlerts) showAlert('warn', 'Copia local inválida (se ignora)', v.message);
      }
    } catch {
      // ignore
    }
  }

  // If not in cache, fetch file
  if (!STATE.temasCache.has(id)) {
    try {
      const res = await fetch(`./temario/${entry.file}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status} al cargar ${entry.file}`);
      const tema = await res.json();

      const v = validateTema(tema);
      if (!v.ok) {
        showAlert('bad', 'Tema JSON inválido', v.message);
        // still store raw to allow user to export/fix?
        STATE.temasCache.set(id, tema);
        STATE.temasSource.set(id, { from: 'fetch', file: entry.file });
      } else {
        STATE.temasCache.set(id, tema);
        STATE.temasSource.set(id, { from: 'fetch', file: entry.file });
        if (v.warnings.length) {
          showAlert('warn', 'Avisos de validación', v.warnings.join(' · '));
        }
      }
    } catch (err) {
      showAlert('bad', 'No se pudo cargar el tema', String(err.message || err));
      return;
    }
  }

  STATE.currentTemaId = id;
  localStorage.setItem('tt_lastTemaId', id);
  updateHeaderForCurrentTema();
  enableTemaActions(true);
  renderTopicList();

  // Default view: summary
  showSummaryView();
}

function updateHeaderForCurrentTema() {
  const tema = getCurrentTema();
  if (!tema) {
    DOM.currentTitle.textContent = 'Selecciona un tema';
    DOM.currentMeta.textContent = 'Carga un tema desde la lista para ver resumen y tests.';
    return;
  }

  const src = STATE.temasSource.get(tema.id)?.from || 'memoria';
  const questionsCount = Array.isArray(tema?.test?.preguntas) ? tema.test.preguntas.length : 0;

  DOM.currentTitle.textContent = tema.titulo || tema.id;
  DOM.currentMeta.textContent = `ID: ${tema.id} · Preguntas: ${questionsCount} · Fuente en memoria: ${src}`;
}

function enableTemaActions(enabled) {
  DOM.btnViewSummary.disabled = !enabled;
  DOM.btnTopicTest.disabled = !enabled;
  DOM.btnExport.disabled = !enabled;
  DOM.btnApplySummary.disabled = !enabled;
  DOM.btnSaveLocal.disabled = !enabled;
}

/* ---------------------------
   Views
--------------------------- */

function setView(viewName) {
  STATE.view = viewName;
  DOM.homeView.classList.toggle('hidden', viewName !== 'home');
  DOM.summaryView.classList.toggle('hidden', viewName !== 'summary');
  DOM.testView.classList.toggle('hidden', viewName !== 'test');
}

function showSummaryView() {
  const tema = getCurrentTema();
  if (!tema) {
    setView('home');
    enableTemaActions(false);
    return;
  }
  setView('summary');
  STATE.examMode = false;
  STATE.testSession = null;

  renderSummary(tema);
}

function showTopicTestSetup() {
  const tema = getCurrentTema();
  if (!tema) return;

  setView('test');
  STATE.examMode = false;
  STATE.testSession = null;

  DOM.testTitle.textContent = 'Test del tema';
  DOM.testSubtitle.textContent = `Tema: ${tema.titulo || tema.id}`;

  DOM.examTopicSelector.classList.add('hidden');
  prepareTestSetupForQuestions(getTemaQuestions(tema), { defaultN: 10 });
}

function showExamSetup() {
  setView('test');
  STATE.examMode = true;
  STATE.testSession = null;

  DOM.testTitle.textContent = 'Examen (varios temas)';
  DOM.testSubtitle.textContent = 'Selecciona temas y configura el nº total de preguntas.';

  DOM.examTopicSelector.classList.remove('hidden');
  buildExamTopicSelector();

  // Default: 20
  prepareTestSetupForQuestions([], { defaultN: 20, hint: 'Selecciona temas para estimar el máximo.' });
}

function resetTestView() {
  STATE.testSession = null;
  DOM.testRuntime.classList.add('hidden');
  DOM.testConfig.classList.remove('hidden');
  DOM.feedback.classList.add('hidden');

  if (STATE.examMode) showExamSetup();
  else showTopicTestSetup();
}

/* ---------------------------
   Summary
--------------------------- */

function renderSummary(tema) {
  const resumen = tema.resumen || { version: 1, texto: '', puntos_clave: [] };
  const texto = (resumen.texto ?? '').toString();
  const puntos = Array.isArray(resumen.puntos_clave) ? resumen.puntos_clave : [];

  DOM.summaryTextPreview.textContent = texto || '— (sin resumen.texto)';
  DOM.summaryKeyPointsPreview.innerHTML = '';
  if (puntos.length) {
    for (const p of puntos) {
      const li = document.createElement('li');
      li.textContent = String(p);
      DOM.summaryKeyPointsPreview.appendChild(li);
    }
  } else {
    const li = document.createElement('li');
    li.textContent = '— (sin puntos_clave)';
    DOM.summaryKeyPointsPreview.appendChild(li);
  }

  DOM.summaryTextInput.value = texto;
  DOM.summaryPointsInput.value = puntos.map(x => String(x)).join('\n');

  DOM.btnApplySummary.disabled = false;
  DOM.btnSaveLocal.disabled = false;
}

function applySummaryEditsInMemory() {
  const tema = getCurrentTema();
  if (!tema) return;

  const newText = DOM.summaryTextInput.value ?? '';
  const newPointsRaw = DOM.summaryPointsInput.value ?? '';
  const newPoints = newPointsRaw
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);

  tema.resumen = tema.resumen && typeof tema.resumen === 'object' ? tema.resumen : { version: 1 };
  tema.resumen.version = Number.isFinite(tema.resumen.version) ? tema.resumen.version : 1;
  tema.resumen.texto = newText;
  tema.resumen.puntos_clave = newPoints;

  STATE.temasCache.set(tema.id, tema);
  STATE.temasSource.set(tema.id, { from: STATE.temasSource.get(tema.id)?.from || 'memory' });

  showAlert('ok', 'Resumen actualizado (en memoria)', 'Recuerda exportar el JSON para persistir el cambio.');
  renderSummary(tema);
  updateHeaderForCurrentTema();
  renderTopicList();
}

/* ---------------------------
   Import / Export
--------------------------- */

async function onImportFileSelected(e) {
  const file = e.target.files?.[0];
  DOM.fileInput.value = ''; // allow re-import same file
  if (!file) return;

  clearAlerts();

  try {
    const text = await file.text();
    const obj = JSON.parse(text);

    const v = validateTema(obj);
    if (!v.ok) {
      showAlert('bad', 'JSON importado inválido', v.message);
      return;
    }
    if (v.warnings.length) showAlert('warn', 'Avisos de validación', v.warnings.join(' · '));

    // If manifest doesn't include it, warn but allow load in memory
    const inManifest = isTemaInManifest(obj.id);
    if (!inManifest) {
      showAlert('warn', 'Tema no está en manifest', `Se cargará en memoria como "${obj.id}", pero no aparecerá en lista salvo que lo añadas a manifest.json.`);
    }

    STATE.temasCache.set(obj.id, obj);
    STATE.temasSource.set(obj.id, { from: 'import' });

    // if current equals this id OR no current, set current
    STATE.currentTemaId = obj.id;
    localStorage.setItem('tt_lastTemaId', obj.id);

    updateHeaderForCurrentTema();
    enableTemaActions(true);
    renderTopicList();
    buildExamTopicSelector();

    showAlert('ok', 'Importación OK', `Tema "${obj.id}" cargado en memoria. Puedes exportarlo cuando quieras.`);
    showSummaryView();
  } catch (err) {
    showAlert('bad', 'Error al importar', String(err.message || err));
  }
}

function exportCurrentTema() {
  const tema = getCurrentTema();
  if (!tema) return;

  // Pretty JSON
  const jsonStr = JSON.stringify(tema, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });

  // suggested filename: from manifest file if available, else `${id}.json`
  const entry = getManifestEntry(tema.id);
  const filename = entry?.file || `${tema.id}.json`;

  downloadBlob(blob, filename);
  showAlert('ok', 'Exportación preparada', `Descargado como ${filename}.`);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ---------------------------
   localStorage (optional)
--------------------------- */

function localStorageKeyForTema(id) {
  return `tt_tema_${id}`;
}

function saveCurrentTemaToLocalStorage() {
  const tema = getCurrentTema();
  if (!tema) return;

  try {
    localStorage.setItem(localStorageKeyForTema(tema.id), JSON.stringify(tema));
    showAlert('ok', 'Guardado en localStorage', `Se guardó una copia local para "${tema.id}".`);
    // Mark source as localStorage only if current was local? we keep from import/fetch, but indicate it can restore
  } catch (err) {
    showAlert('bad', 'No se pudo guardar en localStorage', String(err.message || err));
  }
}

function restoreLastTemaIfAny() {
  // We set a marker; actual open happens after manifest loads (best-effort)
  // If the last tema isn't in manifest, we can't fetch it, but could restore from localStorage if present.
  const lastId = localStorage.getItem('tt_lastTemaId');
  if (!lastId) return;

  // If localStorage copy exists, we can load even without manifest; but we still wait for manifest to render list.
  const raw = localStorage.getItem(localStorageKeyForTema(lastId));
  if (!raw) return;

  try {
    const obj = JSON.parse(raw);
    const v = validateTema(obj);
    if (!v.ok) return;

    STATE.temasCache.set(obj.id, obj);
    STATE.temasSource.set(obj.id, { from: 'localStorage' });
    STATE.currentTemaId = obj.id;
    updateHeaderForCurrentTema();
    enableTemaActions(true);
    // do not set view yet; after manifest load it will highlight
    setView('summary');
    renderSummary(obj);
  } catch {
    // ignore
  }
}

/* ---------------------------
   Validation
--------------------------- */

function validateTema(tema) {
  if (!tema || typeof tema !== 'object') return { ok: false, message: 'El tema no es un objeto JSON.', warnings: [] };
  if (!tema.id || typeof tema.id !== 'string') return { ok: false, message: 'Falta "id" (string).', warnings: [] };
  if (!tema.titulo || typeof tema.titulo !== 'string') return { ok: false, message: 'Falta "titulo" (string).', warnings: [] };

  const warnings = [];

  // resumen optional but if present should be object-ish
  if (tema.resumen != null) {
    if (typeof tema.resumen !== 'object') warnings.push('"resumen" no es un objeto (se ignorará en UI).');
    else {
      if (tema.resumen.texto != null && typeof tema.resumen.texto !== 'string') warnings.push('"resumen.texto" debería ser string.');
      if (tema.resumen.puntos_clave != null && !Array.isArray(tema.resumen.puntos_clave)) warnings.push('"resumen.puntos_clave" debería ser array.');
    }
  }

  // test optional but if present should validate preguntas
  if (tema.test != null) {
    if (typeof tema.test !== 'object') warnings.push('"test" no es un objeto.');
    else if (tema.test.preguntas != null) {
      if (!Array.isArray(tema.test.preguntas)) warnings.push('"test.preguntas" debería ser array.');
      else {
        for (const [i, p] of tema.test.preguntas.entries()) {
          const where = `pregunta[${i}]`;
          if (!p || typeof p !== 'object') { warnings.push(`${where}: no es objeto.`); continue; }
          if (!p.id || typeof p.id !== 'string') warnings.push(`${where}: falta "id" (string).`);
          if (!p.enunciado || typeof p.enunciado !== 'string') warnings.push(`${where}: falta "enunciado" (string).`);
          if (!Array.isArray(p.opciones) || p.opciones.length !== 4) warnings.push(`${where}: "opciones" debe tener longitud 4.`);
          if (!Number.isInteger(p.correcta) || p.correcta < 0 || p.correcta > 3) warnings.push(`${where}: "correcta" debe ser entero entre 0 y 3.`);
          if (p.explicacion != null && typeof p.explicacion !== 'string') warnings.push(`${where}: "explicacion" debería ser string.`);
          if (p.tags != null && !Array.isArray(p.tags)) warnings.push(`${where}: "tags" debería ser array de strings.`);
        }
      }
    }
  } else {
    warnings.push('No hay bloque "test" (no podrás hacer tests de este tema).');
  }

  // ok even with warnings
  return { ok: true, message: 'OK', warnings };
}

/* ---------------------------
   Test / Exam Engine
--------------------------- */

function getCurrentTema() {
  if (!STATE.currentTemaId) return null;
  return STATE.temasCache.get(STATE.currentTemaId) || null;
}

function getTemaQuestions(tema) {
  const arr = tema?.test?.preguntas;
  return Array.isArray(arr) ? arr : [];
}

function prepareTestSetupForQuestions(questions, { defaultN = 10, hint = '' } = {}) {
  DOM.testConfig.classList.remove('hidden');
  DOM.testRuntime.classList.add('hidden');
  DOM.feedback.classList.add('hidden');

  const max = Math.max(0, questions.length);
  const n = Math.min(defaultN, max || defaultN);

  DOM.numQuestions.min = '1';
  DOM.numQuestions.max = String(Math.max(1, max));
  DOM.numQuestions.value = String(Math.max(1, n));

  if (hint) {
    DOM.numQuestionsHint.textContent = hint;
  } else {
    DOM.numQuestionsHint.textContent = max ? `Máximo disponible: ${max}` : `Máximo disponible: 0`;
  }
}

function buildExamTopicSelector() {
  if (!STATE.manifest) return;
  DOM.examTopicsList.innerHTML = '';

  for (const t of STATE.manifest.temas) {
    const wrap = document.createElement('div');
    wrap.className = 'exam-topic';

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = `exam_${t.id}`;
    cb.dataset.temaId = t.id;

    // Default selection: all
    cb.checked = true;

    const label = document.createElement('label');
    label.setAttribute('for', cb.id);

    const title = document.createElement('div');
    title.className = 't';
    title.textContent = t.titulo;

    const meta = document.createElement('div');
    meta.className = 'm';

    const loaded = STATE.temasCache.has(t.id);
    const qCount = loaded ? getTemaQuestions(STATE.temasCache.get(t.id)).length : '—';
    meta.textContent = `ID: ${t.id} · Preguntas: ${qCount} ${loaded ? '' : '(no cargado aún)'}`;

    label.appendChild(title);
    label.appendChild(meta);

    wrap.appendChild(cb);
    wrap.appendChild(label);

    cb.addEventListener('change', updateExamHint);

    DOM.examTopicsList.appendChild(wrap);
  }

  updateExamHint();
}

function setAllExamTopics(checked) {
  const boxes = DOM.examTopicsList.querySelectorAll('input[type="checkbox"][data-tema-id]');
  boxes.forEach(b => (b.checked = checked));
  updateExamHint();
}

function getSelectedExamTemaIds() {
  const boxes = DOM.examTopicsList.querySelectorAll('input[type="checkbox"][data-tema-id]');
  return Array.from(boxes).filter(b => b.checked).map(b => b.dataset.temaId);
}

function updateExamHint() {
  const ids = getSelectedExamTemaIds();
  if (!ids.length) {
    DOM.numQuestionsHint.textContent = 'Selecciona al menos un tema.';
    return;
  }

  // Estimate max available with loaded temas; if not loaded, unknown.
  let knownMax = 0;
  let unknown = 0;

  for (const id of ids) {
    const tema = STATE.temasCache.get(id);
    if (tema) knownMax += getTemaQuestions(tema).length;
    else unknown += 1;
  }

  DOM.numQuestionsHint.textContent =
    unknown
      ? `Preguntas conocidas (temas cargados): ${knownMax}. (Hay ${unknown} tema(s) no cargado(s); se estimará al iniciar.)`
      : `Máximo disponible: ${knownMax}`;
}

async function startTestFromSetup() {
  clearAlerts();

  if (!STATE.examMode) {
    const tema = getCurrentTema();
    if (!tema) return;

    const questions = getTemaQuestions(tema);
    if (!questions.length) {
      showAlert('warn', 'No hay preguntas', 'Este tema no tiene preguntas en test.preguntas.');
      return;
    }

    const total = clampInt(DOM.numQuestions.value, 1, questions.length);
    const shuffle = DOM.shuffleQuestions.value === 'yes';

    const selected = shuffle ? shuffleArray([...questions]) : [...questions];
    const chosen = selected.slice(0, total);

    const session = newTestSession(chosen, { mode: 'tema', title: tema.titulo, temaIds: [tema.id] });
    runSession(session);
    return;
  }

  // Exam mode: ensure selected temas, load missing, build question pool
  const selectedIds = getSelectedExamTemaIds();
  if (!selectedIds.length) {
    showAlert('warn', 'Selecciona temas', 'Debes marcar al menos un tema para el examen.');
    return;
  }

  // Load any missing themes
  for (const id of selectedIds) {
    if (!STATE.temasCache.has(id) && isTemaInManifest(id)) {
      const entry = getManifestEntry(id);
      try {
        const res = await fetch(`./temario/${entry.file}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const tema = await res.json();
        const v = validateTema(tema);
        STATE.temasCache.set(id, tema);
        STATE.temasSource.set(id, { from: 'fetch', file: entry.file });
        if (!v.ok) showAlert('warn', `Tema ${id} con estructura problemática`, v.message);
      } catch (err) {
        showAlert('bad', `No se pudo cargar tema "${id}"`, String(err.message || err));
        return;
      }
    }
  }

  // Build pools
  const pools = selectedIds.map(id => ({ id, tema: STATE.temasCache.get(id), questions: getTemaQuestions(STATE.temasCache.get(id)) }));
  const totalAvailable = pools.reduce((acc, p) => acc + p.questions.length, 0);

  if (totalAvailable === 0) {
    showAlert('warn', 'Sin preguntas', 'Los temas seleccionados no tienen preguntas disponibles.');
    return;
  }

  const requested = clampInt(DOM.numQuestions.value, 1, totalAvailable);
  const shuffle = DOM.shuffleQuestions.value === 'yes';

  // Allocate counts proportional to availability, then adjust
  const allocation = allocateQuestionsProportional(pools.map(p => ({ id: p.id, available: p.questions.length })), requested);

  // Pick questions
  let chosen = [];
  for (const { id, count } of allocation) {
    if (count <= 0) continue;
    const pool = pools.find(p => p.id === id);
    if (!pool) continue;
    const arr = shuffle ? shuffleArray([...pool.questions]) : [...pool.questions];
    chosen = chosen.concat(arr.slice(0, Math.min(count, arr.length)));
  }

  // In case rounding/availability caused fewer, top up from remaining
  if (chosen.length < requested) {
    const usedIds = new Set(chosen.map(q => q.id));
    let remaining = [];
    for (const p of pools) {
      remaining.push(...p.questions.filter(q => !usedIds.has(q.id)));
    }
    if (shuffle) remaining = shuffleArray(remaining);
    chosen = chosen.concat(remaining.slice(0, requested - chosen.length));
  }

  if (shuffle) chosen = shuffleArray(chosen);

  const session = newTestSession(chosen.slice(0, requested), {
    mode: 'examen',
    title: 'Examen',
    temaIds: selectedIds
  });
  runSession(session);

  // update list meta
  renderTopicList();
  buildExamTopicSelector();
}

function allocateQuestionsProportional(items, total) {
  // items: [{id, available}]
  // Approach: initial proportional floor, then distribute remainder by largest fractional part, with caps by available.
  const sumAvail = items.reduce((a, x) => a + x.available, 0);
  if (sumAvail === 0) return items.map(x => ({ id: x.id, count: 0 }));

  const raw = items.map(x => {
    const ideal = (x.available / sumAvail) * total;
    const base = Math.floor(ideal);
    return { id: x.id, available: x.available, ideal, base, frac: ideal - base };
  });

  // cap base at available
  for (const r of raw) r.base = Math.min(r.base, r.available);

  let allocated = raw.reduce((a, r) => a + r.base, 0);
  let remaining = total - allocated;

  // if we over-allocated due to caps/rounding (rare), trim
  if (remaining < 0) {
    // remove from smallest frac first
    raw.sort((a, b) => a.frac - b.frac);
    let i = 0;
    while (remaining < 0 && i < raw.length) {
      if (raw[i].base > 0) { raw[i].base -= 1; remaining += 1; }
      else i += 1;
    }
  }

  // distribute remainder to largest frac, respecting availability
  raw.sort((a, b) => b.frac - a.frac);
  let idx = 0;
  while (remaining > 0) {
    const r = raw[idx % raw.length];
    if (r.base < r.available) {
      r.base += 1;
      remaining -= 1;
    }
    idx += 1;
    // safety break
    if (idx > 100000) break;
    // if no one can receive more, break
    if (raw.every(x => x.base >= x.available)) break;
  }

  return raw.map(r => ({ id: r.id, count: r.base }));
}

function newTestSession(questions, { mode, title, temaIds }) {
  // session tracks: selected option per question, checked state, correctness, etc.
  return {
    mode,
    title,
    temaIds,
    questions: questions.map(q => normalizeQuestion(q)),
    idx: 0,
    score: 0,
    checked: new Map(),     // qid -> { selected, isCorrect, revealed }
    finished: false,
    startedAt: Date.now()
  };
}

function normalizeQuestion(q) {
  // make a safe clone with defaults
  return {
    id: String(q?.id ?? cryptoRandomId()),
    enunciado: String(q?.enunciado ?? '(sin enunciado)'),
    opciones: Array.isArray(q?.opciones) ? q.opciones.map(x => String(x)) : ['A','B','C','D'],
    correcta: Number.isInteger(q?.correcta) ? q.correcta : 0,
    explicacion: String(q?.explicacion ?? ''),
    tags: Array.isArray(q?.tags) ? q.tags.map(String) : [],
    // optional: attach origin if present in data
    _tema: q?._tema || q?.tema || null,
  };
}

function runSession(session) {
  STATE.testSession = session;

  DOM.testConfig.classList.add('hidden');
  DOM.testRuntime.classList.remove('hidden');

  DOM.feedback.classList.add('hidden');
  renderQuestion();
  updateProgressControls();
}

function renderQuestion() {
  const s = STATE.testSession;
  if (!s) return;

  const q = s.questions[s.idx];
  const total = s.questions.length;

  // Meta
  const tags = q.tags?.length ? ` · tags: ${q.tags.join(', ')}` : '';
  DOM.questionMeta.textContent = `Pregunta ${s.idx + 1}/${total}${tags}`;
  DOM.questionText.textContent = q.enunciado;

  // Options
  DOM.optionsForm.innerHTML = '';
  const prev = s.checked.get(q.id);
  const selected = prev?.selected ?? null;
  const isChecked = !!prev?.checked;

  q.opciones.forEach((opt, i) => {
    const label = document.createElement('label');
    label.className = 'option';
    label.htmlFor = `opt_${q.id}_${i}`;

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = `opt_${q.id}`;
    radio.id = `opt_${q.id}_${i}`;
    radio.value = String(i);
    radio.checked = selected === i;
    radio.disabled = s.finished;

    const text = document.createElement('div');
    text.textContent = opt;

    label.appendChild(radio);
    label.appendChild(text);

    label.addEventListener('click', () => {
      if (s.finished) return;
      // allow clicking anywhere in the label
      radio.checked = true;
      onSelectOption(q.id, i);
    });

    DOM.optionsForm.appendChild(label);
  });

  // Feedback reset per question unless already checked
  if (isChecked) {
    renderFeedbackForQuestion(q);
    markOptionsForChecked(q);
  } else {
    DOM.feedback.classList.add('hidden');
    clearOptionMarks();
  }

  // Buttons state
  DOM.btnPrevQ.disabled = s.idx === 0;
  DOM.btnNextQ.disabled = s.idx === total - 1;
}

function onSelectOption(qid, idx) {
  const s = STATE.testSession;
  if (!s) return;
  const prev = s.checked.get(qid) || {};
  s.checked.set(qid, { ...prev, selected: idx });
}

function checkAnswer() {
  const s = STATE.testSession;
  if (!s || s.finished) return;

  const q = s.questions[s.idx];
  const cur = s.checked.get(q.id) || {};
  if (cur.selected == null) {
    showAlert('warn', 'Selecciona una opción', 'Debes seleccionar una respuesta antes de comprobar.');
    return;
  }

  const isCorrect = cur.selected === q.correcta;

  // Update score only first time checking this question
  if (!cur.checked) {
    if (isCorrect) s.score += 1;
  }

  s.checked.set(q.id, { ...cur, checked: true, isCorrect, revealed: true });

  renderFeedbackForQuestion(q);
  markOptionsForChecked(q);
  updateProgressControls();
}

function revealExplanation() {
  const s = STATE.testSession;
  if (!s) return;
  const q = s.questions[s.idx];
  const cur = s.checked.get(q.id) || {};

  // If not checked, still allow reveal but do not score
  s.checked.set(q.id, { ...cur, revealed: true });

  renderFeedbackForQuestion(q);
}

function renderFeedbackForQuestion(q) {
  const s = STATE.testSession;
  const cur = s.checked.get(q.id) || {};
  const revealed = !!cur.revealed;
  if (!revealed) {
    DOM.feedback.classList.add('hidden');
    return;
  }

  const checked = !!cur.checked;
  const isCorrect = !!cur.isCorrect;

  DOM.feedback.classList.remove('hidden');
  DOM.feedback.classList.toggle('good', checked && isCorrect);
  DOM.feedback.classList.toggle('bad', checked && !isCorrect);

  const title = checked
    ? (isCorrect ? '✅ Correcto' : '❌ Incorrecto')
    : 'ℹ️ Explicación';

  const correctText = `Respuesta correcta: ${letterForIndex(q.correcta)}.`;
  const exp = q.explicacion ? q.explicacion : '(Sin explicación en el JSON.)';

  DOM.feedback.innerHTML = `
    <div class="title">${escapeHtml(title)}</div>
    <div class="muted small">${escapeHtml(correctText)}</div>
    <div class="exp" style="margin-top:8px;">${escapeHtml(exp)}</div>
  `;
}

function markOptionsForChecked(q) {
  const s = STATE.testSession;
  const cur = s.checked.get(q.id) || {};
  const checked = !!cur.checked;
  if (!checked) return;

  const labels = DOM.optionsForm.querySelectorAll('.option');
  labels.forEach((label, i) => {
    label.classList.remove('correct', 'incorrect');
    if (i === q.correcta) label.classList.add('correct');
    if (i === cur.selected && i !== q.correcta) label.classList.add('incorrect');
  });
}

function clearOptionMarks() {
  const labels = DOM.optionsForm.querySelectorAll('.option');
  labels.forEach(l => l.classList.remove('correct', 'incorrect'));
}

function updateProgressControls() {
  const s = STATE.testSession;
  if (!s) return;

  const total = s.questions.length;
  DOM.progressPill.textContent = `${s.idx + 1}/${total}`;
  DOM.scorePill.textContent = `Puntuación: ${s.score}`;

  // Enable next if not last
  DOM.btnPrevQ.disabled = s.idx === 0;
  DOM.btnNextQ.disabled = s.idx === total - 1;
}

function navQuestion(delta) {
  const s = STATE.testSession;
  if (!s) return;
  const next = s.idx + delta;
  if (next < 0 || next >= s.questions.length) return;
  s.idx = next;
  renderQuestion();
  updateProgressControls();
}

function finishTest() {
  const s = STATE.testSession;
  if (!s || s.finished) return;

  s.finished = true;

  // compute answered/checked
  const total = s.questions.length;
  let checkedCount = 0;
  for (const q of s.questions) {
    const cur = s.checked.get(q.id);
    if (cur?.checked) checkedCount += 1;
  }

  showAlert('ok', 'Test finalizado', `Puntuación: ${s.score}/${total}. Comprobadas: ${checkedCount}/${total}.`);
  renderQuestion(); // disables inputs
}

function letterForIndex(i) {
  return ['A', 'B', 'C', 'D'][i] ?? '?';
}

/* ---------------------------
   Alerts
--------------------------- */

function clearAlerts() {
  DOM.alerts.innerHTML = '';
}

function showAlert(type, title, message) {
  const div = document.createElement('div');
  div.className = `alert ${type}`;
  div.innerHTML = `
    <div style="font-weight:800; margin-bottom: 3px;">${escapeHtml(title)}</div>
    <div class="muted">${escapeHtml(message)}</div>
  `;
  DOM.alerts.appendChild(div);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

/* ---------------------------
   Utils
--------------------------- */

function clampInt(value, min, max) {
  let n = parseInt(value, 10);
  if (!Number.isFinite(n)) n = min;
  n = Math.max(min, n);
  n = Math.min(max, n);
  return n;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function cryptoRandomId() {
  // fallback id, not cryptographically important for this app
  return 'q_' + Math.random().toString(16).slice(2) + '_' + Date.now().toString(16);
}