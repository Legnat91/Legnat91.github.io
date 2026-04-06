const app = document.getElementById('app');
const themeToggle = document.getElementById('theme-toggle');
const homeButton = document.getElementById('home-button');

const STORAGE_KEYS = {
  theme: 'daw_theme',
  scoresLegacy: 'daw_notas',
  scores: 'daw_notes_scores_v3',
  appState: 'daw_notes_app_state_v3',
  favorites: 'daw_notes_favorites_v1'
};

const state = {
  db: null,
  view: 'home',
  subjectId: null,
  topicId: null,
  contentTab: 'resumen',
  keyMode: 'all',
  test: null,
  results: null,
  scores: migrateScores(),
  favorites: loadFavorites(),
  filters: {
    search: '',
    testType: 'all',
    progress: 'all',
    sort: 'default'
  }
};

function migrateScores() {
  const legacy = JSON.parse(localStorage.getItem(STORAGE_KEYS.scoresLegacy) || '{}');
  const modern = JSON.parse(localStorage.getItem(STORAGE_KEYS.scores) || '{}');
  const merged = { ...legacy, ...modern };
  localStorage.setItem(STORAGE_KEYS.scores, JSON.stringify(merged));
  localStorage.setItem(STORAGE_KEYS.scoresLegacy, JSON.stringify(merged));
  return merged;
}

function loadFavorites() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || '[]');
}

function saveScores() {
  localStorage.setItem(STORAGE_KEYS.scores, JSON.stringify(state.scores));
  localStorage.setItem(STORAGE_KEYS.scoresLegacy, JSON.stringify(state.scores));
}

function saveFavorites() {
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(state.favorites));
}

function saveAppState() {
  localStorage.setItem(STORAGE_KEYS.appState, JSON.stringify({
    view: state.view,
    subjectId: state.subjectId,
    topicId: state.topicId,
    contentTab: state.contentTab,
    keyMode: state.keyMode,
    filters: state.filters
  }));
}

function restoreAppState() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.appState) || 'null');
  if (!saved) return;
  state.view = saved.view || 'home';
  state.subjectId = saved.subjectId || null;
  state.topicId = saved.topicId || null;
  state.contentTab = saved.contentTab || 'resumen';
  state.keyMode = saved.keyMode || 'all';
  state.filters = { ...state.filters, ...(saved.filters || {}) };
}

function setTheme(theme) {
  const isDark = theme === 'dark';
  document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  localStorage.setItem(STORAGE_KEYS.theme, isDark ? 'dark' : 'light');
  themeToggle.querySelector('.theme-icon').textContent = isDark ? '☀️' : '🌙';
  themeToggle.querySelector('.theme-label').textContent = isDark ? 'Modo claro' : 'Modo oscuro';
}

function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme) || 'light';
  setTheme(saved);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

function excerpt(html, length = 170) {
  const text = stripHtml(html).trim();
  return text.length > length ? `${text.slice(0, length).trim()}…` : text;
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function normalizeDb(raw) {
  const sourceSubjects = Array.isArray(raw?.asignaturas) ? raw.asignaturas : [];
  return {
    version: raw?.version || 1,
    meta: raw?.meta || {
      titulo: 'DAW Notes',
      descripcion: 'Plataforma de estudio con JSON local.'
    },
    asignaturas: sourceSubjects.map((subject, subjectIndex) => ({
      id: subject.id,
      orden: subject.orden || subjectIndex + 1,
      nombre: subject.nombre,
      descripcion: subject.descripcion || `Asignatura con ${subject.temas?.length || 0} temas disponibles.`,
      temas: (subject.temas || []).map((topic, topicIndex) => ({
        id: topic.id,
        orden: topic.orden || topicIndex + 1,
        titulo: topic.titulo,
        resumen: topic.resumen || '',
        claves: Array.isArray(topic.claves) ? topic.claves : [],
        preguntas: Array.isArray(topic.preguntas) ? topic.preguntas : [],
        preguntas_profesor: Array.isArray(topic.preguntas_profesor) ? topic.preguntas_profesor : []
      }))
    }))
  };
}

function getSubject(subjectId) {
  return state.db?.asignaturas.find(subject => subject.id === subjectId) || null;
}

function getTopic(subjectId, topicId) {
  return getSubject(subjectId)?.temas.find(topic => topic.id === topicId) || null;
}

function scoreKey(subjectId, topicId, type) {
  return `${subjectId}::${topicId}::${type}`;
}

function favoriteKey(subjectId, topicId, index) {
  return `${subjectId}::${topicId}::${index}`;
}

function isFavorite(subjectId, topicId, index) {
  return state.favorites.includes(favoriteKey(subjectId, topicId, index));
}

function toggleFavorite(subjectId, topicId, index) {
  const key = favoriteKey(subjectId, topicId, index);
  if (state.favorites.includes(key)) {
    state.favorites = state.favorites.filter(item => item !== key);
  } else {
    state.favorites = [...state.favorites, key];
  }
  saveFavorites();
  render();
}

function subjectStats(subject) {
  return subject.temas.reduce((acc, topic) => {
    acc.temas += 1;
    acc.ia += topic.preguntas.length;
    acc.profesor += topic.preguntas_profesor.length;
    acc.claves += topic.claves.length;
    return acc;
  }, { temas: 0, ia: 0, profesor: 0, claves: 0 });
}

function globalStats() {
  const totals = { asignaturas: 0, temas: 0, ia: 0, profesor: 0, claves: 0, intentos: 0, favoritos: state.favorites.length };
  const subjects = state.db?.asignaturas || [];
  totals.asignaturas = subjects.length;
  subjects.forEach(subject => {
    const stats = subjectStats(subject);
    totals.temas += stats.temas;
    totals.ia += stats.ia;
    totals.profesor += stats.profesor;
    totals.claves += stats.claves;
  });
  Object.values(state.scores).forEach(score => {
    totals.intentos += score?.intentos || 0;
  });
  return totals;
}

function getBestScore(subjectId, topicId, type) {
  return state.scores[scoreKey(subjectId, topicId, type)] || null;
}

function saveScore(subjectId, topicId, type, score, total) {
  const key = scoreKey(subjectId, topicId, type);
  const previous = state.scores[key] || null;
  state.scores[key] = {
    puntuacion: previous ? Math.max(previous.puntuacion, score) : score,
    total,
    intentos: (previous?.intentos || 0) + 1,
    ultimoResultado: score,
    updatedAt: new Date().toISOString()
  };
  saveScores();
}

function getTopicProgress(subjectId, topic) {
  const ia = getBestScore(subjectId, topic.id, 'ia');
  const profesor = getBestScore(subjectId, topic.id, 'profesor');
  const completed = Number(Boolean(ia)) + Number(Boolean(profesor));
  const percentage = Math.round((completed / 2) * 100);
  const avg = [ia, profesor].filter(Boolean).length
    ? Math.round(([ia, profesor].filter(Boolean).reduce((acc, item) => acc + Math.round((item.puntuacion / item.total) * 100), 0)) / [ia, profesor].filter(Boolean).length)
    : 0;
  return {
    completed,
    percentage,
    avg,
    ia,
    profesor,
    hasAny: Boolean(ia || profesor),
    done: Boolean(ia && profesor)
  };
}

function getSubjectCoverage(subject) {
  const topicProgress = subject.temas.map(topic => getTopicProgress(subject.id, topic));
  const completed = topicProgress.reduce((acc, item) => acc + item.completed, 0);
  const total = subject.temas.length * 2;
  return {
    completed,
    total,
    percentage: total ? Math.round((completed / total) * 100) : 0,
    average: topicProgress.filter(item => item.hasAny).length
      ? Math.round(topicProgress.filter(item => item.hasAny).reduce((acc, item) => acc + item.avg, 0) / topicProgress.filter(item => item.hasAny).length)
      : 0
  };
}

function getWeakTopics(limit = 3) {
  const list = [];
  (state.db?.asignaturas || []).forEach(subject => {
    subject.temas.forEach(topic => {
      const progress = getTopicProgress(subject.id, topic);
      const severity = progress.hasAny ? progress.avg : -1;
      list.push({ subject, topic, progress, severity });
    });
  });
  return list.sort((a, b) => a.severity - b.severity).slice(0, limit);
}

function getFavoriteEntries() {
  return state.favorites.map(key => {
    const [subjectId, topicId, rawIndex] = key.split('::');
    const topic = getTopic(subjectId, topicId);
    const subject = getSubject(subjectId);
    const index = Number(rawIndex);
    if (!subject || !topic || !topic.claves[index]) return null;
    return {
      subjectId,
      topicId,
      index,
      subjectName: subject.nombre,
      topicTitle: topic.titulo,
      text: topic.claves[index]
    };
  }).filter(Boolean);
}

function normalizeQuestion(question, source) {
  const correctText = question.opciones[question.respuesta_correcta];
  const options = shuffle(question.opciones);
  return {
    pregunta: question.pregunta,
    opciones: options,
    respuesta_correcta: options.indexOf(correctText),
    explicacion: question.explicacion || 'Sin explicación adicional.',
    source
  };
}

function buildQuestionSet(subjectId, topicId, type) {
  const subject = getSubject(subjectId);
  if (!subject) return [];

  if (topicId === 'global') {
    const pool = [];
    subject.temas.forEach(topic => {
      if (type === 'total') {
        pool.push(...topic.preguntas.map(item => normalizeQuestion(item, { title: topic.titulo, type: 'ia' })));
      }
      if (type === 'total' || type === 'profesor') {
        pool.push(...topic.preguntas_profesor.map(item => normalizeQuestion(item, { title: topic.titulo, type: 'profesor' })));
      }
    });
    return shuffle(pool).slice(0, 30);
  }

  const topic = getTopic(subjectId, topicId);
  if (!topic) return [];
  const collection = type === 'profesor' ? topic.preguntas_profesor : topic.preguntas;
  return shuffle(collection.map(item => normalizeQuestion(item, { title: topic.titulo, type })));
}

function setView(view, extra = {}) {
  state.view = view;
  Object.assign(state, extra);
  saveAppState();
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function render() {
  homeButton.classList.toggle('hidden', state.view === 'home');
  if (!state.db) return;
  switch (state.view) {
    case 'home':
      renderHome();
      break;
    case 'subject':
      renderSubject();
      break;
    case 'content':
      renderContent();
      break;
    case 'test':
      renderTest();
      break;
    case 'results':
      renderResults();
      break;
    default:
      renderHome();
  }
}

function renderHome() {
  const stats = globalStats();
  const subjects = state.db.asignaturas;
  const weakTopics = getWeakTopics();
  const favorites = getFavoriteEntries().slice(0, 3);

  app.innerHTML = `
    <div class="stack-xl">
      <section class="grid-main">
        <article class="card hero">
          <div class="stack-md">
            <span class="badge">Iteración 2 · progreso, filtros y favoritos</span>
            <h2>La base visual ya está bien. Ahora la app también estudia contigo.</h2>
            <p>Sobre esta versión se añaden métricas por tema y asignatura, filtros de trabajo, favoritos en conceptos clave y compatibilidad con un JSON más preparado para crecer sin perder preguntas ni contenido.</p>
          </div>
          <div class="hero-actions">
            <button class="btn btn-primary" data-action="open-first-subject">Seguir estudiando</button>
            <button class="btn btn-secondary" data-action="focus-subjects">Ver asignaturas</button>
          </div>
        </article>

        <aside class="card side-panel">
          <section class="side-block">
            <div class="section-head">
              <div>
                <h3>Resumen general</h3>
                <p>Datos calculados a partir del JSON actual y del historial guardado.</p>
              </div>
            </div>
            <div class="stats-grid">
              <div class="metric"><span>Asignaturas</span><strong>${stats.asignaturas}</strong><small>Disponibles</small></div>
              <div class="metric"><span>Temas</span><strong>${stats.temas}</strong><small>Cargados</small></div>
              <div class="metric"><span>Tests hechos</span><strong>${stats.intentos}</strong><small>Intentos</small></div>
              <div class="metric"><span>Favoritos</span><strong>${stats.favoritos}</strong><small>Claves guardadas</small></div>
            </div>
          </section>
        </aside>
      </section>

      <section class="grid-two">
        <article class="card progress-card">
          <div class="section-head">
            <div>
              <h3>Temas a reforzar</h3>
              <p>Se ordenan por peor media o por falta de intentos.</p>
            </div>
          </div>
          ${weakTopics.length ? weakTopics.map(item => `
            <button class="progress-row" data-action="open-content" data-subject="${item.subject.id}" data-topic="${item.topic.id}" data-tab="resumen" type="button">
              <div class="progress-row-head">
                <div>
                  <p class="progress-title"><strong>${escapeHtml(item.topic.titulo)}</strong></p>
                  <p class="progress-copy">${escapeHtml(item.subject.nombre)}</p>
                </div>
                <span class="chip ${item.progress.done ? 'success' : item.progress.hasAny ? 'warning' : 'danger'}">${item.progress.hasAny ? `${item.progress.avg}% media` : 'Sin intentos'}</span>
              </div>
              <div class="progress-bar"><span style="width:${Math.max(item.progress.percentage, 10)}%"></span></div>
              <div class="progress-meta">
                <span class="chip ${item.progress.ia ? 'success' : ''}">IA: ${item.progress.ia ? `${item.progress.ia.puntuacion}/${item.progress.ia.total}` : 'pendiente'}</span>
                <span class="chip ${item.progress.profesor ? 'warning' : ''}">Profesor: ${item.progress.profesor ? `${item.progress.profesor.puntuacion}/${item.progress.profesor.total}` : 'pendiente'}</span>
              </div>
            </button>
          `).join('') : renderEmptyMini('No hay temas cargados todavía.', '📚')}
        </article>

        <article class="card progress-card">
          <div class="section-head">
            <div>
              <h3>Conceptos favoritos</h3>
              <p>Accesos rápidos a las claves que has marcado para repasar.</p>
            </div>
          </div>
          ${favorites.length ? favorites.map(item => `
            <button class="progress-row" data-action="open-content" data-subject="${item.subjectId}" data-topic="${item.topicId}" data-tab="claves" type="button">
              <div class="progress-row-head">
                <div>
                  <p class="progress-title"><strong>${escapeHtml(item.topicTitle)}</strong></p>
                  <p class="progress-copy">${escapeHtml(item.subjectName)}</p>
                </div>
                <span class="chip warning">⭐ Favorito</span>
              </div>
              <p class="progress-copy">${escapeHtml(excerpt(item.text, 140))}</p>
            </button>
          `).join('') : renderEmptyMini('Todavía no has marcado conceptos clave como favoritos.', '⭐')}
        </article>
      </section>

      <section id="subjects-section" class="stack-md">
        <div class="section-head">
          <div>
            <h3>Asignaturas disponibles</h3>
            <p>La app ya soporta un JSON versionado para crecer con nuevas asignaturas sin romper la interfaz.</p>
          </div>
        </div>
        <div class="grid-three">
          ${subjects.map(renderSubjectCard).join('')}
        </div>
      </section>
    </div>
  `;
}

function renderSubjectCard(subject) {
  const stats = subjectStats(subject);
  const coverage = getSubjectCoverage(subject);
  return `
    <article class="card subject-card">
      <div class="subject-card-head">
        <div class="stack-sm">
          <span class="badge">Asignatura</span>
          <h3>${escapeHtml(subject.nombre)}</h3>
        </div>
        <span class="chip primary">${coverage.percentage}% cobertura</span>
      </div>
      <p>${escapeHtml(subject.descripcion)}</p>
      <div class="recap-grid">
        <div class="metric"><span>Temas</span><strong>${stats.temas}</strong><small>Disponibles</small></div>
        <div class="metric"><span>Preguntas IA</span><strong>${stats.ia}</strong><small>Activas</small></div>
        <div class="metric"><span>Profesor</span><strong>${stats.profesor}</strong><small>Activas</small></div>
      </div>
      <div class="card-actions">
        <button class="btn btn-primary" data-action="open-subject" data-subject="${subject.id}">Abrir asignatura</button>
      </div>
    </article>
  `;
}

function getFilteredTopics(subject) {
  const query = state.filters.search.trim().toLowerCase();
  const testType = state.filters.testType;
  const progress = state.filters.progress;
  const sort = state.filters.sort;

  let topics = [...subject.temas];

  if (query) {
    topics = topics.filter(topic => {
      const haystack = [topic.titulo, stripHtml(topic.resumen), ...topic.claves].join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }

  if (testType !== 'all') {
    topics = topics.filter(topic => {
      if (testType === 'ia') return topic.preguntas.length > 0;
      if (testType === 'profesor') return topic.preguntas_profesor.length > 0;
      if (testType === 'both') return topic.preguntas.length > 0 && topic.preguntas_profesor.length > 0;
      return true;
    });
  }

  if (progress !== 'all') {
    topics = topics.filter(topic => {
      const topicProgress = getTopicProgress(subject.id, topic);
      if (progress === 'pending') return !topicProgress.hasAny;
      if (progress === 'started') return topicProgress.hasAny && !topicProgress.done;
      if (progress === 'done') return topicProgress.done;
      return true;
    });
  }

  topics.sort((a, b) => {
    if (sort === 'name') return a.titulo.localeCompare(b.titulo, 'es');
    if (sort === 'progress') return getTopicProgress(subject.id, b).percentage - getTopicProgress(subject.id, a).percentage;
    return (a.orden || 0) - (b.orden || 0);
  });

  return topics;
}

function renderSubject() {
  const subject = getSubject(state.subjectId);
  if (!subject) {
    setView('home', { subjectId: null, topicId: null });
    return;
  }

  const stats = subjectStats(subject);
  const coverage = getSubjectCoverage(subject);
  const topics = getFilteredTopics(subject);

  app.innerHTML = `
    <div class="stack-xl">
      <section class="card subject-header">
        <div class="section-head">
          <div class="stack-sm">
            <span class="badge">${escapeHtml(subject.nombre)}</span>
            <h2 class="subject-title">Panel de estudio</h2>
            <p class="subject-copy">Resumen, claves, tests IA y tests del profesor, ahora con seguimiento por tema y filtros para trabajar con más orden.</p>
          </div>
          <span class="chip primary">${coverage.percentage}% cobertura</span>
        </div>
        <div class="recap-grid">
          <div class="metric"><span>Temas</span><strong>${stats.temas}</strong><small>${stats.claves} claves</small></div>
          <div class="metric"><span>IA</span><strong>${stats.ia}</strong><small>Preguntas</small></div>
          <div class="metric"><span>Profesor</span><strong>${stats.profesor}</strong><small>Preguntas</small></div>
          <div class="metric"><span>Media</span><strong>${coverage.average || '—'}${coverage.average ? '%' : ''}</strong><small>Mejores intentos</small></div>
        </div>
        <div class="toolbar">
          <button class="btn btn-primary" data-action="start-global" data-type="total">Test global mixto</button>
          <button class="btn btn-warning" data-action="start-global" data-type="profesor">Test global profesor</button>
        </div>
      </section>

      <section class="grid-main">
        <article class="card panel-pad stack-md">
          <div class="section-head">
            <div>
              <h3>Filtrar temas</h3>
              <p>Encuentra rápidamente qué estudiar o qué repasar.</p>
            </div>
          </div>
          <div class="filters-grid">
            <label class="filter-block">
              <span class="field-label">Buscar</span>
              <input id="filter-search" class="search-input" type="search" value="${escapeHtml(state.filters.search)}" placeholder="Título, resumen o clave">
            </label>
            <label class="filter-block">
              <span class="field-label">Tipo de test</span>
              <select id="filter-test-type" class="select">
                <option value="all" ${state.filters.testType === 'all' ? 'selected' : ''}>Todos</option>
                <option value="ia" ${state.filters.testType === 'ia' ? 'selected' : ''}>Con test IA</option>
                <option value="profesor" ${state.filters.testType === 'profesor' ? 'selected' : ''}>Con test profesor</option>
                <option value="both" ${state.filters.testType === 'both' ? 'selected' : ''}>Con ambos</option>
              </select>
            </label>
            <label class="filter-block">
              <span class="field-label">Estado</span>
              <select id="filter-progress" class="select">
                <option value="all" ${state.filters.progress === 'all' ? 'selected' : ''}>Todos</option>
                <option value="pending" ${state.filters.progress === 'pending' ? 'selected' : ''}>Sin empezar</option>
                <option value="started" ${state.filters.progress === 'started' ? 'selected' : ''}>En progreso</option>
                <option value="done" ${state.filters.progress === 'done' ? 'selected' : ''}>Completados</option>
              </select>
            </label>
            <label class="filter-block">
              <span class="field-label">Ordenar</span>
              <select id="filter-sort" class="select">
                <option value="default" ${state.filters.sort === 'default' ? 'selected' : ''}>Orden del temario</option>
                <option value="name" ${state.filters.sort === 'name' ? 'selected' : ''}>Nombre</option>
                <option value="progress" ${state.filters.sort === 'progress' ? 'selected' : ''}>Mayor progreso</option>
              </select>
            </label>
          </div>
        </article>

        <aside class="card progress-card">
          <div class="section-head">
            <div>
              <h3>Progreso por tema</h3>
              <p>Vista rápida de cobertura y notas guardadas.</p>
            </div>
          </div>
          ${subject.temas.map(topic => renderProgressRow(subject, topic)).join('')}
        </aside>
      </section>

      <section class="stack-md">
        <div class="section-head">
          <div>
            <h3>Temas disponibles</h3>
            <p>${topics.length} ${topics.length === 1 ? 'resultado' : 'resultados'} con los filtros actuales.</p>
          </div>
        </div>
        <div class="topic-grid">
          ${topics.length ? topics.map(topic => renderTopicCard(subject, topic)).join('') : renderEmptyCard('No hay temas que coincidan con los filtros.', '🔎')}
        </div>
      </section>
    </div>
  `;

  bindFilterControls();
}

function renderProgressRow(subject, topic) {
  const progress = getTopicProgress(subject.id, topic);
  return `
    <button class="progress-row" data-action="open-content" data-subject="${subject.id}" data-topic="${topic.id}" data-tab="resumen" type="button">
      <div class="progress-row-head">
        <div>
          <p class="progress-title"><strong>${escapeHtml(topic.titulo)}</strong></p>
          <p class="progress-copy">${topic.claves.length} claves · ${topic.preguntas.length + topic.preguntas_profesor.length} preguntas</p>
        </div>
        <span class="chip ${progress.done ? 'success' : progress.hasAny ? 'warning' : ''}">${progress.percentage}%</span>
      </div>
      <div class="progress-bar"><span style="width:${Math.max(progress.percentage, 6)}%"></span></div>
      <div class="progress-meta">
        <span class="chip ${progress.ia ? 'success' : ''}">IA: ${progress.ia ? `${progress.ia.puntuacion}/${progress.ia.total}` : 'sin intento'}</span>
        <span class="chip ${progress.profesor ? 'warning' : ''}">Profesor: ${progress.profesor ? `${progress.profesor.puntuacion}/${progress.profesor.total}` : 'sin intento'}</span>
      </div>
    </button>
  `;
}

function renderTopicCard(subject, topic) {
  const progress = getTopicProgress(subject.id, topic);
  return `
    <article class="card topic-card" tabindex="0">
      <div class="topic-card-head">
        <div class="stack-sm">
          <span class="badge">Tema ${topic.orden}</span>
          <h3>${escapeHtml(topic.titulo)}</h3>
        </div>
        <span class="chip ${progress.done ? 'success' : progress.hasAny ? 'warning' : ''}">${progress.percentage}%</span>
      </div>
      <p class="excerpt">${escapeHtml(excerpt(topic.resumen, 180))}</p>
      <div class="chips-grid">
        <span class="pill">🧠 ${topic.claves.length} claves</span>
        <span class="pill">✅ ${topic.preguntas.length} IA</span>
        <span class="pill">🎓 ${topic.preguntas_profesor.length} profesor</span>
      </div>
      <div class="chips-grid">
        <span class="chip ${progress.ia ? 'success' : ''}">IA: ${progress.ia ? `${progress.ia.puntuacion}/${progress.ia.total}` : 'sin intento'}</span>
        <span class="chip ${progress.profesor ? 'warning' : ''}">Profesor: ${progress.profesor ? `${progress.profesor.puntuacion}/${progress.profesor.total}` : 'sin intento'}</span>
      </div>
      <div class="topic-footer">
        <div class="card-actions">
          <button class="btn btn-secondary" data-action="open-content" data-subject="${subject.id}" data-topic="${topic.id}" data-tab="resumen">Resumen</button>
          <button class="btn btn-secondary" data-action="open-content" data-subject="${subject.id}" data-topic="${topic.id}" data-tab="claves">Claves</button>
        </div>
        <div class="card-actions">
          <button class="btn btn-primary" data-action="start-topic-test" data-topic="${topic.id}" data-type="ia" ${topic.preguntas.length ? '' : 'disabled'}>Test IA</button>
          <button class="btn btn-warning" data-action="start-topic-test" data-topic="${topic.id}" data-type="profesor" ${topic.preguntas_profesor.length ? '' : 'disabled'}>Test profesor</button>
        </div>
      </div>
    </article>
  `;
}

function bindFilterControls() {
  const entries = [
    ['filter-search', 'search'],
    ['filter-test-type', 'testType'],
    ['filter-progress', 'progress'],
    ['filter-sort', 'sort']
  ];
  entries.forEach(([id, key]) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.addEventListener('input', event => {
      state.filters[key] = event.target.value;
      saveAppState();
      renderSubject();
    });
    element.addEventListener('change', event => {
      state.filters[key] = event.target.value;
      saveAppState();
      renderSubject();
    });
  });
}

function renderContent() {
  const subject = getSubject(state.subjectId);
  const topic = getTopic(state.subjectId, state.topicId);
  if (!subject || !topic) {
    setView('subject', { subjectId: state.subjectId, topicId: null });
    return;
  }

  const bestIA = getBestScore(subject.id, topic.id, 'ia');
  const bestProfesor = getBestScore(subject.id, topic.id, 'profesor');
  const favoriteCount = topic.claves.filter((_, index) => isFavorite(subject.id, topic.id, index)).length;
  const keys = state.keyMode === 'favorites'
    ? topic.claves.map((text, index) => ({ text, index })).filter(item => isFavorite(subject.id, topic.id, item.index))
    : topic.claves.map((text, index) => ({ text, index }));

  const contentBody = state.contentTab === 'resumen'
    ? `<div class="content-copy">${topic.resumen}</div>`
    : `
      <div class="stack-md">
        <div class="inline-actions">
          <button class="tab ${state.keyMode === 'all' ? 'active' : ''}" data-action="set-key-mode" data-mode="all">Todas las claves</button>
          <button class="tab ${state.keyMode === 'favorites' ? 'active' : ''}" data-action="set-key-mode" data-mode="favorites">Solo favoritas</button>
        </div>
        <div class="key-grid">
          ${keys.length ? keys.map(item => renderKeyItem(subject.id, topic.id, item.index, item.text)).join('') : renderEmptyCard('No hay conceptos favoritos en este tema todavía.', '⭐')}
        </div>
      </div>
    `;

  app.innerHTML = `
    <div class="stack-xl">
      <section class="content-layout">
        <article class="card content-card">
          <div class="content-header">
            <div class="stack-sm">
              <span class="badge">${escapeHtml(subject.nombre)}</span>
              <h2 class="content-title">${escapeHtml(topic.titulo)}</h2>
              <p class="helper-text">Tema ${topic.orden} · ${topic.claves.length} claves · ${topic.preguntas.length + topic.preguntas_profesor.length} preguntas disponibles.</p>
            </div>
            <div class="inline-actions">
              <button class="tab ${state.contentTab === 'resumen' ? 'active' : ''}" data-action="switch-tab" data-tab="resumen">Resumen</button>
              <button class="tab ${state.contentTab === 'claves' ? 'active' : ''}" data-action="switch-tab" data-tab="claves">Claves</button>
            </div>
          </div>
          ${contentBody}
        </article>

        <aside class="card side-panel">
          <section class="side-block">
            <h3>Acciones</h3>
            <p class="helper-text">Puedes lanzar el tipo de test que necesites sin salir del tema.</p>
            <div class="stack-sm">
              <button class="btn btn-primary btn-block" data-action="start-topic-test" data-topic="${topic.id}" data-type="ia" ${topic.preguntas.length ? '' : 'disabled'}>Iniciar test IA</button>
              <button class="btn btn-warning btn-block" data-action="start-topic-test" data-topic="${topic.id}" data-type="profesor" ${topic.preguntas_profesor.length ? '' : 'disabled'}>Iniciar test profesor</button>
            </div>
          </section>
          <section class="side-block">
            <h3>Seguimiento</h3>
            <div class="stack-sm">
              <span class="chip ${bestIA ? 'success' : ''}">Mejor IA: ${bestIA ? `${bestIA.puntuacion}/${bestIA.total}` : 'sin intento'}</span>
              <span class="chip ${bestProfesor ? 'warning' : ''}">Mejor profesor: ${bestProfesor ? `${bestProfesor.puntuacion}/${bestProfesor.total}` : 'sin intento'}</span>
              <span class="chip warning">Favoritas: ${favoriteCount}/${topic.claves.length}</span>
            </div>
          </section>
        </aside>
      </section>
    </div>
  `;
}

function renderKeyItem(subjectId, topicId, index, text) {
  const active = isFavorite(subjectId, topicId, index);
  return `
    <article class="key-item">
      <div class="key-item-head">
        <div class="key-index">${index + 1}</div>
        <button class="favorite-btn ${active ? 'active' : ''}" data-action="toggle-favorite" data-subject="${subjectId}" data-topic="${topicId}" data-index="${index}" aria-label="${active ? 'Quitar de favoritos' : 'Añadir a favoritos'}">${active ? '⭐' : '☆'}</button>
      </div>
      <p class="key-text">${escapeHtml(text)}</p>
    </article>
  `;
}

function startTest(subjectId, topicId, type) {
  const questions = buildQuestionSet(subjectId, topicId, type);
  if (!questions.length) {
    alert('No hay preguntas disponibles para este test.');
    return;
  }

  const subject = getSubject(subjectId);
  const topic = topicId === 'global'
    ? { id: 'global', titulo: type === 'total' ? `Test global mixto · ${subject.nombre}` : `Test global profesor · ${subject.nombre}` }
    : getTopic(subjectId, topicId);

  state.test = {
    subjectId,
    topicId,
    type,
    topicTitle: topic.titulo,
    questions,
    currentIndex: 0,
    selectedIndex: null,
    locked: false,
    score: 0,
    answers: []
  };
  state.results = null;
  setView('test');
}

function renderTest() {
  const test = state.test;
  if (!test) {
    setView('subject', { subjectId: state.subjectId });
    return;
  }

  const question = test.questions[test.currentIndex];
  const progress = Math.round((test.currentIndex / test.questions.length) * 100);
  const modeLabel = test.type === 'profesor' ? 'Test del profesor' : test.type === 'total' ? 'Test global mixto' : 'Test IA';

  app.innerHTML = `
    <div class="stack-xl">
      <section class="card test-card">
        <div class="section-head">
          <div class="stack-sm">
            <span class="question-kicker">Pregunta ${test.currentIndex + 1} de ${test.questions.length}</span>
            <h2 class="question-title">${escapeHtml(test.topicTitle)}</h2>
            <p class="helper-text">${modeLabel}</p>
          </div>
          <button class="btn btn-ghost" data-action="exit-test">Salir</button>
        </div>

        <div class="progress-bar"><span style="width:${Math.max(progress, 4)}%"></span></div>

        <div class="stack-md">
          <h3 class="question-title">${escapeHtml(question.pregunta)}</h3>
          <div class="option-list">
            ${question.opciones.map((option, index) => renderOption(option, index, test)).join('')}
          </div>
          ${test.locked ? renderFeedback(question, test.selectedIndex) : ''}
        </div>

        <div class="test-actions">
          ${test.locked ? `<button class="btn btn-primary" data-action="next-question">${test.currentIndex + 1 === test.questions.length ? 'Ver resultado' : 'Siguiente pregunta'}</button>` : ''}
        </div>
      </section>
    </div>
  `;
}

function renderOption(option, index, test) {
  let classes = 'option';
  if (test.locked) {
    if (index === test.questions[test.currentIndex].respuesta_correcta) classes += ' correct';
    else if (index === test.selectedIndex) classes += ' wrong';
  }
  return `<button class="${classes}" data-action="answer" data-index="${index}" ${test.locked ? 'disabled' : ''}>${escapeHtml(option)}</button>`;
}

function renderFeedback(question, selectedIndex) {
  const ok = selectedIndex === question.respuesta_correcta;
  return `
    <div class="feedback ${ok ? 'success' : 'error'}">
      <h4>${ok ? 'Respuesta correcta' : 'Respuesta incorrecta'}</h4>
      <p>${escapeHtml(question.explicacion)}</p>
      ${ok ? '' : `<p><strong>Correcta:</strong> ${escapeHtml(question.opciones[question.respuesta_correcta])}</p>`}
    </div>
  `;
}

function answerQuestion(index) {
  const test = state.test;
  if (!test || test.locked) return;
  const question = test.questions[test.currentIndex];
  const correct = index === question.respuesta_correcta;
  if (correct) test.score += 1;
  test.selectedIndex = index;
  test.locked = true;
  test.answers.push({
    pregunta: question.pregunta,
    marcada: question.opciones[index],
    correcta: question.opciones[question.respuesta_correcta],
    esCorrecta: correct,
    explicacion: question.explicacion,
    source: question.source
  });
  renderTest();
}

function nextQuestion() {
  const test = state.test;
  if (!test || !test.locked) return;
  test.currentIndex += 1;
  test.selectedIndex = null;
  test.locked = false;

  if (test.currentIndex >= test.questions.length) {
    saveScore(test.subjectId, test.topicId, test.type, test.score, test.questions.length);
    state.results = { ...test, best: getBestScore(test.subjectId, test.topicId, test.type) };
    state.test = null;
    setView('results');
    return;
  }

  renderTest();
}

function renderResults() {
  const result = state.results;
  if (!result) {
    setView('subject', { subjectId: state.subjectId });
    return;
  }

  const percent = Math.round((result.score / result.questions.length) * 100);
  const summary = percent >= 80 ? 'Excelente resultado' : percent >= 60 ? 'Buen avance' : 'Conviene reforzar el tema';

  app.innerHTML = `
    <div class="stack-xl">
      <section class="card results-card">
        <div class="results-head">
          <div class="stack-sm">
            <span class="badge">Resultado final</span>
            <h2 class="results-title">${escapeHtml(result.topicTitle)}</h2>
            <p class="helper-text">${summary}</p>
          </div>
          <div class="score-ring">${percent}%<span>${result.score}/${result.questions.length}</span></div>
        </div>

        <div class="recap-grid">
          <div class="metric"><span>Aciertos</span><strong>${result.score}</strong><small>Correctas</small></div>
          <div class="metric"><span>Fallos</span><strong>${result.questions.length - result.score}</strong><small>Incorrectas</small></div>
          <div class="metric"><span>Mejor nota</span><strong>${result.best?.puntuacion || result.score}/${result.best?.total || result.questions.length}</strong><small>Guardada</small></div>
        </div>

        <div class="result-actions">
          <button class="btn btn-primary" data-action="repeat-test">Repetir test</button>
          <button class="btn btn-secondary" data-action="back-after-results">Volver</button>
        </div>
      </section>

      <section class="stack-md">
        <div class="section-head">
          <div>
            <h3>Revisión detallada</h3>
            <p>Repaso de respuestas y explicación asociada.</p>
          </div>
        </div>
        <div class="review-grid">
          ${result.answers.map((answer, index) => `
            <article class="card review-item ${answer.esCorrecta ? 'ok' : 'fail'}">
              <div class="stack-sm review-copy">
                <h4>${index + 1}. ${escapeHtml(answer.pregunta)}</h4>
                <p><strong>Tu respuesta:</strong> ${escapeHtml(answer.marcada)} ${answer.esCorrecta ? '✅' : '❌'}</p>
                ${answer.esCorrecta ? '' : `<p><strong>Respuesta correcta:</strong> ${escapeHtml(answer.correcta)}</p>`}
                <p><strong>Explicación:</strong> ${escapeHtml(answer.explicacion)}</p>
                <p class="small-note"><strong>Origen:</strong> ${escapeHtml(answer.source.title)} · ${answer.source.type === 'profesor' ? 'test del profesor' : 'test IA'}</p>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    </div>
  `;
}

function openAfterResults() {
  const result = state.results;
  if (!result) {
    setView('home');
    return;
  }
  if (result.topicId === 'global') {
    setView('subject', { subjectId: result.subjectId, topicId: null });
  } else {
    setView('content', { subjectId: result.subjectId, topicId: result.topicId, contentTab: 'resumen' });
  }
}

function renderEmptyCard(text, icon) {
  return `
    <section class="card empty-card">
      <div class="empty-icon">${icon}</div>
      <p>${escapeHtml(text)}</p>
    </section>
  `;
}

function renderEmptyMini(text, icon) {
  return `<section class="empty-card"><div class="empty-icon">${icon}</div><p>${escapeHtml(text)}</p></section>`;
}

function bindGlobalEvents() {
  document.addEventListener('click', event => {
    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;

    const { action, subject, topic, tab, type, index, mode } = actionEl.dataset;

    switch (action) {
      case 'go-home':
        setView('home', { subjectId: null, topicId: null, contentTab: 'resumen' });
        break;
      case 'open-first-subject': {
        const first = state.db?.asignaturas?.[0];
        if (first) setView('subject', { subjectId: first.id, topicId: null });
        break;
      }
      case 'focus-subjects':
        document.getElementById('subjects-section')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'open-subject':
        setView('subject', { subjectId: subject, topicId: null });
        break;
      case 'open-content':
        setView('content', { subjectId: subject || state.subjectId, topicId: topic, contentTab: tab || 'resumen' });
        break;
      case 'switch-tab':
        state.contentTab = tab;
        saveAppState();
        renderContent();
        break;
      case 'set-key-mode':
        state.keyMode = mode;
        saveAppState();
        renderContent();
        break;
      case 'toggle-favorite':
        toggleFavorite(subject, topic, Number(index));
        break;
      case 'start-topic-test':
        startTest(state.subjectId, topic, type);
        break;
      case 'start-global':
        startTest(state.subjectId, 'global', type);
        break;
      case 'answer':
        answerQuestion(Number(index));
        break;
      case 'next-question':
        nextQuestion();
        break;
      case 'exit-test':
        if (confirm('¿Quieres salir del test actual? Se perderá el progreso de este intento.')) {
          const subjectId = state.test?.subjectId || state.subjectId;
          state.test = null;
          setView('subject', { subjectId });
        }
        break;
      case 'repeat-test':
        startTest(state.results.subjectId, state.results.topicId, state.results.type);
        break;
      case 'back-after-results':
        openAfterResults();
        break;
    }
  });

  themeToggle.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  homeButton.addEventListener('click', () => {
    setView('home', { subjectId: null, topicId: null });
  });
}

async function init() {
  initTheme();
  restoreAppState();
  bindGlobalEvents();

  try {
    const response = await fetch('datos.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const raw = await response.json();
    const db = normalizeDb(raw);
    if (!Array.isArray(db.asignaturas)) throw new Error('Estructura JSON no válida.');
    state.db = db;

    if (state.subjectId && !getSubject(state.subjectId)) {
      state.view = 'home';
      state.subjectId = null;
      state.topicId = null;
    }
    if (state.topicId && state.subjectId && !getTopic(state.subjectId, state.topicId)) {
      state.view = 'subject';
      state.topicId = null;
    }

    render();
  } catch (error) {
    console.error(error);
    app.innerHTML = `
      <section class="card state-card">
        <div class="empty-icon">⚠️</div>
        <div>
          <h2>No se ha podido cargar la aplicación</h2>
          <p>Comprueba que estás ejecutando la app en un servidor local y que <strong>datos.json</strong> tiene una estructura válida.</p>
        </div>
      </section>
    `;
  }
}

init();
