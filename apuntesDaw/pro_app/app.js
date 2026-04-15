const app = document.getElementById('app');
const themeToggle = document.getElementById('theme-toggle');
const backButton = document.getElementById('back-button');
const emptyStateTemplate = document.getElementById('empty-state-template');

const STORAGE_KEYS = {
  theme: 'daw_theme_v3',
  scoresLegacy: 'daw_notas',
  scores: 'daw_study_scores_v3',
  appState: 'daw_study_state_v3'
};

const QUIZ_TYPES = {
  ia: 'Test IA',
  profesor: 'Test profesor',
  total: 'Test mixto'
};

const state = {
  db: { asignaturas: [] },
  view: 'home',
  subjectId: null,
  topicId: null,
  contentTab: 'resumen',
  topicSearch: '',
  test: null,
  results: null,
  scores: loadScores()
};

function safeParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function loadScores() {
  const modern = safeParse(localStorage.getItem(STORAGE_KEYS.scores) || '{}', {});
  const legacy = safeParse(localStorage.getItem(STORAGE_KEYS.scoresLegacy) || '{}', {});
  const merged = { ...legacy, ...modern };
  persistScores(merged);
  return merged;
}

function persistScores(scores) {
  localStorage.setItem(STORAGE_KEYS.scores, JSON.stringify(scores));
  localStorage.setItem(STORAGE_KEYS.scoresLegacy, JSON.stringify(scores));
}

function saveAppState() {
  const payload = {
    view: state.view,
    subjectId: state.subjectId,
    topicId: state.topicId,
    contentTab: state.contentTab,
    topicSearch: state.topicSearch
  };
  localStorage.setItem(STORAGE_KEYS.appState, JSON.stringify(payload));
}

function restoreAppState() {
  const saved = safeParse(localStorage.getItem(STORAGE_KEYS.appState) || 'null', null);
  if (!saved || typeof saved !== 'object') return;

  state.view = typeof saved.view === 'string' ? saved.view : 'home';
  state.subjectId = typeof saved.subjectId === 'string' ? saved.subjectId : null;
  state.topicId = typeof saved.topicId === 'string' ? saved.topicId : null;
  state.contentTab = saved.contentTab === 'claves' ? 'claves' : 'resumen';
  state.topicSearch = typeof saved.topicSearch === 'string' ? saved.topicSearch : '';
}

function setTheme(theme) {
  const isDark = theme === 'dark';
  document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  localStorage.setItem(STORAGE_KEYS.theme, isDark ? 'dark' : 'light');

  const icon = themeToggle.querySelector('.theme-icon');
  const label = themeToggle.querySelector('.theme-label');
  icon.textContent = isDark ? '☀' : '☾';
  label.textContent = isDark ? 'Tema claro' : 'Tema oscuro';
}

function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme) || 'light';
  setTheme(saved);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripHtml(html) {
  const container = document.createElement('div');
  container.innerHTML = String(html || '');
  return (container.textContent || container.innerText || '').trim();
}

function excerpt(html, maxLength = 150) {
  const text = stripHtml(html);
  if (!text) return 'Este tema aun no tiene resumen disponible.';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(value || 0)));
}

function pluralize(count, singular, plural) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function scoreKey(subjectId, topicId, type) {
  return `${subjectId}-${topicId}-${type}`;
}

function getBestScore(subjectId, topicId, type) {
  return state.scores[scoreKey(subjectId, topicId, type)] || null;
}

function saveScore(subjectId, topicId, type, score, total) {
  const key = scoreKey(subjectId, topicId, type);
  const previous = state.scores[key] || null;
  const next = {
    puntuacion: previous ? Math.max(previous.puntuacion, score) : score,
    total,
    intentos: (previous?.intentos || 0) + 1,
    ultimoResultado: score,
    updatedAt: new Date().toISOString()
  };

  state.scores[key] = next;
  persistScores(state.scores);
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function normalizeQuestion(question, source) {
  const prompt = typeof question?.pregunta === 'string' ? question.pregunta.trim() : '';
  const options = Array.isArray(question?.opciones)
    ? question.opciones.filter((item) => typeof item === 'string' && item.trim())
    : [];
  const rawIndex = Number(question?.respuesta_correcta);

  if (!prompt || options.length < 2 || !Number.isInteger(rawIndex) || rawIndex < 0 || rawIndex >= options.length) {
    return null;
  }

  const shuffled = shuffle(options);
  const correctText = options[rawIndex];

  return {
    pregunta: prompt,
    opciones: shuffled,
    respuesta_correcta: shuffled.indexOf(correctText),
    explicacion: typeof question?.explicacion === 'string' && question.explicacion.trim()
      ? question.explicacion.trim()
      : 'Sin explicacion adicional.',
    source
  };
}

function normalizeCodeExercise(exercise) {
  const title = typeof exercise?.titulo === 'string' ? exercise.titulo.trim() : '';
  const statement = typeof exercise?.enunciado === 'string' ? exercise.enunciado.trim() : '';
  const solution = typeof exercise?.solucion === 'string' ? exercise.solucion.trim() : '';

  if (!title || !statement || !solution) {
    return null;
  }

  return {
    titulo: title,
    dificultad: typeof exercise?.dificultad === 'string' && exercise.dificultad.trim()
      ? exercise.dificultad.trim()
      : 'Media',
    enunciado: statement,
    codigo_base: typeof exercise?.codigo_base === 'string' ? exercise.codigo_base : '',
    placeholder: typeof exercise?.placeholder === 'string' && exercise.placeholder.trim()
      ? exercise.placeholder.trim()
      : 'Escribe aqui tu respuesta...',
    pista: typeof exercise?.pista === 'string' && exercise.pista.trim()
      ? exercise.pista.trim()
      : 'Piensa en el metodo y el operador que mejor encajan con el enunciado.',
    solucion: solution,
    explicacion: typeof exercise?.explicacion === 'string' && exercise.explicacion.trim()
      ? exercise.explicacion.trim()
      : 'Repasa la sintaxis y compara tu respuesta con la solucion propuesta.'
  };
}

function normalizeTopic(topic, index) {
  const resumen = typeof topic?.resumen === 'string' && topic.resumen.trim()
    ? topic.resumen
    : '<p>Este tema aun no tiene resumen disponible.</p>';
  const claves = Array.isArray(topic?.claves)
    ? topic.claves.filter((item) => typeof item === 'string' && item.trim())
    : [];
  const preguntas = Array.isArray(topic?.preguntas)
    ? topic.preguntas.map((question) => normalizeQuestion(question, null)).filter(Boolean)
    : [];
  const preguntasProfesor = Array.isArray(topic?.preguntas_profesor)
    ? topic.preguntas_profesor.map((question) => normalizeQuestion(question, null)).filter(Boolean)
    : [];
  const ejerciciosCodigo = Array.isArray(topic?.ejercicios_codigo)
    ? topic.ejercicios_codigo.map((exercise) => normalizeCodeExercise(exercise)).filter(Boolean)
    : [];

  return {
    id: typeof topic?.id === 'string' && topic.id.trim() ? topic.id : `tema_${index + 1}`,
    titulo: typeof topic?.titulo === 'string' && topic.titulo.trim() ? topic.titulo.trim() : `Tema ${index + 1}`,
    resumen,
    claves,
    preguntas,
    preguntas_profesor: preguntasProfesor,
    ejercicios_codigo: ejerciciosCodigo
  };
}

function normalizeSubject(subject, index) {
  const temas = Array.isArray(subject?.temas)
    ? subject.temas.map((topic, topicIndex) => normalizeTopic(topic, topicIndex))
    : [];

  return {
    id: typeof subject?.id === 'string' && subject.id.trim() ? subject.id : `asignatura_${index + 1}`,
    nombre: typeof subject?.nombre === 'string' && subject.nombre.trim() ? subject.nombre.trim() : `Asignatura ${index + 1}`,
    temas
  };
}

function normalizeDatabase(data) {
  const subjects = Array.isArray(data?.asignaturas)
    ? data.asignaturas.map((subject, index) => normalizeSubject(subject, index))
    : [];

  subjects.forEach((subject) => {
    subject.temas.forEach((topic) => {
      topic.preguntas = topic.preguntas.map((question) => ({
        ...question,
        source: { subjectId: subject.id, topicId: topic.id, title: topic.titulo, type: 'ia' }
      }));
      topic.preguntas_profesor = topic.preguntas_profesor.map((question) => ({
        ...question,
        source: { subjectId: subject.id, topicId: topic.id, title: topic.titulo, type: 'profesor' }
      }));
    });
  });

  return { asignaturas: subjects };
}

function getSubject(subjectId) {
  return state.db.asignaturas.find((subject) => subject.id === subjectId) || null;
}

function getTopic(subjectId, topicId) {
  return getSubject(subjectId)?.temas.find((topic) => topic.id === topicId) || null;
}

function subjectStats(subject) {
  return subject.temas.reduce((acc, topic) => {
    acc.temas += 1;
    acc.ia += topic.preguntas.length;
    acc.profesor += topic.preguntas_profesor.length;
    acc.claves += topic.claves.length;
    acc.codigo += Array.isArray(topic.ejercicios_codigo) ? topic.ejercicios_codigo.length : 0;
    return acc;
  }, { temas: 0, ia: 0, profesor: 0, claves: 0, codigo: 0 });
}

function getCoverage(subject) {
  const total = subject.temas.reduce((acc, topic) => {
    let next = acc;
    if (topic.preguntas.length) next += 1;
    if (topic.preguntas_profesor.length) next += 1;
    return next;
  }, 0);

  const completed = subject.temas.reduce((acc, topic) => {
    let next = acc;
    if (topic.preguntas.length && getBestScore(subject.id, topic.id, 'ia')) next += 1;
    if (topic.preguntas_profesor.length && getBestScore(subject.id, topic.id, 'profesor')) next += 1;
    return next;
  }, 0);

  return {
    total,
    completed,
    percentage: total ? clampPercent((completed / total) * 100) : 0
  };
}

function globalStats() {
  return state.db.asignaturas.reduce((acc, subject) => {
    const stats = subjectStats(subject);
    acc.asignaturas += 1;
    acc.temas += stats.temas;
    acc.ia += stats.ia;
    acc.profesor += stats.profesor;
    acc.claves += stats.claves;
    acc.codigo += stats.codigo;
    return acc;
  }, { asignaturas: 0, temas: 0, ia: 0, profesor: 0, claves: 0, codigo: 0 });
}

function findContinueTopic() {
  const savedTopic = state.subjectId && state.topicId ? getTopic(state.subjectId, state.topicId) : null;
  if (savedTopic) {
    return { subject: getSubject(state.subjectId), topic: savedTopic };
  }

  let latest = null;

  state.db.asignaturas.forEach((subject) => {
    subject.temas.forEach((topic) => {
      ['ia', 'profesor'].forEach((type) => {
        const score = getBestScore(subject.id, topic.id, type);
        if (!score?.updatedAt) return;

        const stamp = new Date(score.updatedAt).getTime();
        if (!latest || stamp > latest.stamp) {
          latest = { subject, topic, stamp, type, score };
        }
      });
    });
  });

  if (latest) return { subject: latest.subject, topic: latest.topic, score: latest.score, type: latest.type };

  const firstSubject = state.db.asignaturas[0] || null;
  const firstTopic = firstSubject?.temas[0] || null;
  if (!firstSubject || !firstTopic) return null;
  return { subject: firstSubject, topic: firstTopic };
}

function buildQuestionSet(subjectId, topicId, type) {
  const subject = getSubject(subjectId);
  if (!subject) return [];

  if (topicId === 'global') {
    const pool = [];

    subject.temas.forEach((topic) => {
      if (type === 'total') {
        pool.push(...topic.preguntas.map((question) => ({ ...question })));
      }
      if (type === 'total' || type === 'profesor') {
        pool.push(...topic.preguntas_profesor.map((question) => ({ ...question })));
      }
    });

    return shuffle(pool).slice(0, 30);
  }

  const topic = getTopic(subjectId, topicId);
  if (!topic) return [];

  return type === 'profesor'
    ? shuffle(topic.preguntas_profesor.map((question) => ({ ...question })))
    : shuffle(topic.preguntas.map((question) => ({ ...question })));
}

function getAdjacentTopic(subjectId, topicId, direction = 1) {
  const subject = getSubject(subjectId);
  if (!subject) return null;
  const index = subject.temas.findIndex((topic) => topic.id === topicId);
  if (index === -1) return null;
  return subject.temas[index + direction] || null;
}

function setView(view, extra = {}, options = {}) {
  state.view = view;
  Object.assign(state, extra);
  saveAppState();
  render();

  if (!options.skipScroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function renderBadge(text) {
  return `<span class="badge">${escapeHtml(text)}</span>`;
}

function renderEmpty(messageTitle, messageBody) {
  return `
    <section class="surface empty-state">
      <p class="empty-icon" aria-hidden="true">::</p>
      <h2>${escapeHtml(messageTitle)}</h2>
      <p>${escapeHtml(messageBody)}</p>
    </section>
  `;
}

function renderProgress(percentage) {
  return `
    <div class="progress-track" aria-hidden="true">
      <span style="width:${clampPercent(percentage)}%;"></span>
    </div>
  `;
}
function renderHome() {
  const stats = globalStats();
  const continueCard = findContinueTopic();
  const subjectCards = state.db.asignaturas.map(renderSubjectCard).join('');

  app.innerHTML = `
    <div class="view-stack">
      <section class="surface hero-panel stack-lg">
        <div class="stack-md">
          <p class="section-kicker">Version mobile-first</p>
          <h1 class="hero-title">Estudiar rapido, leer mejor y volver al punto justo.</h1>
          <p class="lead">La app ahora prioriza lo que importa en movil: retomar tema, entender el progreso, abrir lectura sin ruido y lanzar tests desde un flujo mucho mas claro.</p>
        </div>
        <div class="hero-actions">
          <button class="primary-button" type="button" data-action="continue-study">Seguir estudiando</button>
          <button class="secondary-button" type="button" data-action="focus-subjects">Ver asignaturas</button>
        </div>
      </section>

      <section class="info-grid">
        <article class="surface summary-panel stack-md">
          <div class="stack-sm">
            <p class="section-kicker">Resumen general</p>
            <h2 class="subject-title">Todo el temario en una sola vista</h2>
            <p class="section-copy">Consulta volumen de estudio, cobertura y acceso rapido a la siguiente pantalla util sin perderte en una home saturada.</p>
          </div>
          <div class="stat-grid">
            <article class="stat-card"><span class="stat-label">Asignaturas</span><strong class="stat-value">${stats.asignaturas}</strong></article>
            <article class="stat-card"><span class="stat-label">Temas</span><strong class="stat-value">${stats.temas}</strong></article>
            <article class="stat-card"><span class="stat-label">Preguntas IA</span><strong class="stat-value">${stats.ia}</strong></article>
            <article class="stat-card"><span class="stat-label">Preguntas profesor</span><strong class="stat-value">${stats.profesor}</strong></article>
            <article class="stat-card"><span class="stat-label">Practica codigo</span><strong class="stat-value">${stats.codigo}</strong></article>
          </div>
        </article>

        <aside class="surface info-panel stack-md">
          <div class="stack-sm">
            <p class="section-kicker">Seguir estudiando</p>
            <h3>${continueCard ? escapeHtml(continueCard.topic.titulo) : 'Todavia no hay temas'}</h3>
            <p>${continueCard ? escapeHtml(continueCard.subject.nombre) : 'Carga asignaturas en datos.json para activar este bloque.'}</p>
          </div>
          ${continueCard ? `
            <div class="meta-row">
              <span class="status-pill">${escapeHtml(pluralize(continueCard.topic.claves.length, 'clave', 'claves'))}</span>
              <span class="meta-pill">${escapeHtml(pluralize(continueCard.topic.preguntas.length + continueCard.topic.preguntas_profesor.length, 'pregunta', 'preguntas'))}</span>
            </div>
            <p class="helper-text">${escapeHtml(excerpt(continueCard.topic.resumen, 120))}</p>
            <div class="inline-actions">
              <button class="primary-button" type="button" data-action="open-content" data-subject="${escapeHtml(continueCard.subject.id)}" data-topic="${escapeHtml(continueCard.topic.id)}" data-tab="resumen">Abrir tema</button>
              <button class="secondary-button" type="button" data-action="open-subject" data-subject="${escapeHtml(continueCard.subject.id)}">Ir a asignatura</button>
            </div>
          ` : ''}
        </aside>
      </section>

      <section class="surface summary-panel stack-md">
        <div class="header-row">
          <div class="stack-sm">
            <p class="section-kicker">Accesos rapidos</p>
            <h3>Entradas utiles para estudiar desde movil</h3>
          </div>
        </div>
        <div class="quick-grid">
          <a class="quick-link" href="#subjects-section">
            <span class="small-label">Explorar</span>
            <strong>Ir al listado de asignaturas</strong>
            <p class="muted-text">Acceso directo al catalogo principal sin hacer scroll a ojo.</p>
          </a>
          <div class="quick-link">
            <span class="small-label">Cobertura</span>
            <strong>${stats.claves} conceptos clave disponibles</strong>
            <p class="muted-text">La lectura y el repaso rapido quedan mejor separados en la nueva estructura.</p>
          </div>
          <div class="quick-link">
            <span class="small-label">Ritmo</span>
            <strong>Flujo corto para estudiar desde el telefono</strong>
            <p class="muted-text">Primero contexto, despues lectura, luego repaso y finalmente test con feedback inmediato.</p>
          </div>
        </div>
      </section>

      <section id="subjects-section" class="stack-md">
        <div class="header-row">
          <div class="stack-sm">
            <p class="section-kicker">Asignaturas</p>
            <h2 class="subject-title">Elige donde seguir</h2>
          </div>
        </div>
        ${state.db.asignaturas.length ? `<div class="subject-grid">${subjectCards}</div>` : emptyStateTemplate.innerHTML}
      </section>
    </div>
  `;
}

function renderSubjectCard(subject) {
  const stats = subjectStats(subject);
  const coverage = getCoverage(subject);
  const nextTopic = subject.temas[0] || null;

  return `
    <article class="subject-card" tabindex="0">
      <div class="stack-md">
        <div class="meta-row">
          ${renderBadge(subject.nombre)}
          <span class="status-pill">${coverage.percentage}% completado</span>
        </div>
        <div class="stack-sm">
          <h3>${escapeHtml(subject.nombre)}</h3>
          <p class="section-copy">${nextTopic ? escapeHtml(excerpt(nextTopic.resumen, 110)) : 'Esta asignatura todavia no tiene temas cargados.'}</p>
        </div>
        ${renderProgress(coverage.percentage)}
        <div class="metrics-grid">
          <article class="metric-card"><span class="metric-label">Temas</span><strong class="metric-value">${stats.temas}</strong></article>
          <article class="metric-card"><span class="metric-label">Tests</span><strong class="metric-value">${stats.ia + stats.profesor}</strong></article>
        </div>
        <div class="meta-row">
          <span class="meta-pill">${escapeHtml(pluralize(stats.claves, 'clave', 'claves'))}</span>
          <span class="meta-pill">${escapeHtml(pluralize(coverage.completed, 'avance', 'avances'))}</span>
        </div>
        <div class="inline-actions">
          <button class="primary-button" type="button" data-action="open-subject" data-subject="${escapeHtml(subject.id)}">Abrir asignatura</button>
        </div>
      </div>
    </article>
  `;
}

function renderSubject() {
  const subject = getSubject(state.subjectId);
  if (!subject) {
    setView('home', { subjectId: null, topicId: null, topicSearch: '' }, { skipScroll: true });
    return;
  }

  const stats = subjectStats(subject);
  const coverage = getCoverage(subject);
  const query = state.topicSearch.trim().toLowerCase();
  const topics = subject.temas.filter((topic) => {
    const haystack = `${topic.titulo} ${stripHtml(topic.resumen)} ${topic.claves.join(' ')}`.toLowerCase();
    return haystack.includes(query);
  });

  app.innerHTML = `
    <div class="view-stack">
      <section class="surface subject-hero stack-lg">
        <div class="breadcrumbs">
          <button type="button" data-action="go-home">Inicio</button>
          <span>/</span>
          <span>${escapeHtml(subject.nombre)}</span>
        </div>

        <div class="stack-md">
          <div class="meta-row">
            ${renderBadge('Panel de asignatura')}
            <span class="status-pill">${coverage.percentage}% cubierto</span>
          </div>
          <h1 class="subject-title">${escapeHtml(subject.nombre)}</h1>
          <p class="lead">Busca un tema, entra a la lectura y lanza cada test desde un flujo mas corto y mas claro.</p>
        </div>

        <div class="stat-grid">
          <article class="stat-card"><span class="stat-label">Temas</span><strong class="stat-value">${stats.temas}</strong></article>
          <article class="stat-card"><span class="stat-label">Claves</span><strong class="stat-value">${stats.claves}</strong></article>
          <article class="stat-card"><span class="stat-label">Preguntas IA</span><strong class="stat-value">${stats.ia}</strong></article>
          <article class="stat-card"><span class="stat-label">Preguntas profesor</span><strong class="stat-value">${stats.profesor}</strong></article>
          <article class="stat-card"><span class="stat-label">Practica codigo</span><strong class="stat-value">${stats.codigo}</strong></article>
        </div>

        <div class="hero-actions">
          <button class="primary-button" type="button" data-action="start-global" data-type="total">Test global mixto</button>
          <button class="warning-button" type="button" data-action="start-global" data-type="profesor">Test global profesor</button>
        </div>
      </section>

      <section class="surface filters-panel stack-md">
        <div class="stack-sm">
          <p class="section-kicker">Buscar tema</p>
          <h3>Filtra por titulo, resumen o claves</h3>
          <p class="section-copy">Menos scroll, mas acceso directo al bloque que necesitas repasar.</p>
        </div>
        <input id="topic-search" class="search-input" type="search" placeholder="Ejemplo: servidor, sesiones, seguridad" value="${escapeHtml(state.topicSearch)}">
      </section>

      ${topics.length ? `<section class="topic-grid">${topics.map((topic) => renderTopicCard(subject, topic)).join('')}</section>` : renderEmpty('No hay coincidencias', 'Prueba con otro termino para volver a ver temas disponibles.')}
    </div>
  `;

  const searchInput = document.getElementById('topic-search');
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      state.topicSearch = event.target.value;
      saveAppState();
      renderSubject();
    });
  }
}

function renderTopicCard(subject, topic) {
  const bestIA = getBestScore(subject.id, topic.id, 'ia');
  const bestProfesor = getBestScore(subject.id, topic.id, 'profesor');

  return `
    <article class="topic-card" tabindex="0">
      <div class="stack-md">
        <div class="meta-row">
          <span class="status-pill">${escapeHtml(topic.id)}</span>
          <span class="meta-pill">${escapeHtml(pluralize(topic.claves.length, 'clave', 'claves'))}</span>
          ${topic.ejercicios_codigo.length ? `<span class="meta-pill">${escapeHtml(pluralize(topic.ejercicios_codigo.length, 'ejercicio', 'ejercicios'))}</span>` : ''}
        </div>
        <div class="stack-sm">
          <h3>${escapeHtml(topic.titulo)}</h3>
          <p class="section-copy">${escapeHtml(excerpt(topic.resumen, 150))}</p>
        </div>
        <div class="meta-row">
          <span class="status-pill ${bestIA ? 'success' : ''}">IA ${bestIA ? `${bestIA.puntuacion}/${bestIA.total}` : 'sin intento'}</span>
          <span class="status-pill ${bestProfesor ? 'warning' : ''}">Profesor ${bestProfesor ? `${bestProfesor.puntuacion}/${bestProfesor.total}` : 'sin intento'}</span>
        </div>
        <div class="topic-actions">
          <button class="secondary-button" type="button" data-action="open-content" data-subject="${escapeHtml(subject.id)}" data-topic="${escapeHtml(topic.id)}" data-tab="resumen">Resumen</button>
          <button class="secondary-button" type="button" data-action="open-content" data-subject="${escapeHtml(subject.id)}" data-topic="${escapeHtml(topic.id)}" data-tab="claves">Claves</button>
        </div>
        <div class="topic-actions">
          <button class="primary-button" type="button" data-action="start-topic-test" data-topic="${escapeHtml(topic.id)}" data-type="ia" ${topic.preguntas.length ? '' : 'disabled'}>Test IA</button>
          <button class="warning-button" type="button" data-action="start-topic-test" data-topic="${escapeHtml(topic.id)}" data-type="profesor" ${topic.preguntas_profesor.length ? '' : 'disabled'}>Test profesor</button>
        </div>
        <div class="topic-actions">
          <button class="secondary-button" type="button" data-action="open-practice" data-topic="${escapeHtml(topic.id)}" ${topic.ejercicios_codigo.length ? '' : 'disabled'}>Examen practico</button>
        </div>
      </div>
    </article>
  `;
}

function renderContent() {
  const subject = getSubject(state.subjectId);
  const topic = getTopic(state.subjectId, state.topicId);

  if (!subject || !topic) {
    setView('subject', { subjectId: state.subjectId, topicId: null }, { skipScroll: true });
    return;
  }

  const body = state.contentTab === 'claves'
    ? renderKeyList(topic.claves)
    : `<div class="body-copy">${topic.resumen}</div>`;
  const bestIA = getBestScore(subject.id, topic.id, 'ia');
  const bestProfesor = getBestScore(subject.id, topic.id, 'profesor');
  const previousTopic = getAdjacentTopic(subject.id, topic.id, -1);
  const nextTopic = getAdjacentTopic(subject.id, topic.id, 1);

  app.innerHTML = `
    <div class="view-stack">
      <section class="content-grid">
        <article class="surface reading-panel stack-lg">
          <div class="breadcrumbs">
            <button type="button" data-action="go-home">Inicio</button>
            <span>/</span>
            <button type="button" data-action="open-subject" data-subject="${escapeHtml(subject.id)}">${escapeHtml(subject.nombre)}</button>
            <span>/</span>
            <span>${escapeHtml(topic.titulo)}</span>
          </div>

          <div class="stack-md">
            <div class="meta-row">
              ${renderBadge(subject.nombre)}
              <span class="meta-pill">${escapeHtml(pluralize(topic.claves.length, 'concepto', 'conceptos'))}</span>
            </div>
            <h1 class="topic-title">${escapeHtml(topic.titulo)}</h1>
            <p class="lead">Lectura limpia arriba, acciones utiles a un toque y bloques separados para no mezclar resumen con repaso rapido.</p>
          </div>

          <div class="tab-row">
            <button class="tab-button ${state.contentTab === 'resumen' ? 'active' : ''}" type="button" data-action="switch-tab" data-tab="resumen">Resumen</button>
            <button class="tab-button ${state.contentTab === 'claves' ? 'active' : ''}" type="button" data-action="switch-tab" data-tab="claves">Claves</button>
          </div>

          <div class="context-strip">
            <div class="stack-sm">
              <strong>${state.contentTab === 'resumen' ? 'Modo lectura' : 'Modo repaso rapido'}</strong>
              <p class="helper-text">${state.contentTab === 'resumen'
                ? 'Lee el bloque principal sin ruido y usa el lateral para evaluarte cuando termines.'
                : 'Revisa las ideas esenciales una a una antes de pasar al test o al siguiente tema.'}</p>
            </div>
            <div class="context-actions">
              ${previousTopic ? `<button class="secondary-button" type="button" data-action="jump-topic" data-topic="${escapeHtml(previousTopic.id)}">Tema anterior</button>` : ''}
              ${nextTopic ? `<button class="secondary-button" type="button" data-action="jump-topic" data-topic="${escapeHtml(nextTopic.id)}">Tema siguiente</button>` : ''}
            </div>
          </div>

          ${body}
        </article>

        <aside class="surface summary-panel stack-md">
          <div class="stack-sm">
            <p class="section-kicker">Acciones del tema</p>
            <h3>Repasar o evaluarte sin salir de aqui</h3>
          </div>

          <div class="stack-sm">
            <button class="primary-button" type="button" data-action="start-topic-test" data-topic="${escapeHtml(topic.id)}" data-type="ia" ${topic.preguntas.length ? '' : 'disabled'}>Iniciar test IA</button>
            <button class="warning-button" type="button" data-action="start-topic-test" data-topic="${escapeHtml(topic.id)}" data-type="profesor" ${topic.preguntas_profesor.length ? '' : 'disabled'}>Iniciar test profesor</button>
            <button class="secondary-button" type="button" data-action="open-practice" data-topic="${escapeHtml(topic.id)}" ${topic.ejercicios_codigo.length ? '' : 'disabled'}>Abrir examen practico</button>
          </div>

          <div class="overview-card stack-sm">
            <h3>Seguimiento</h3>
            <span class="status-pill ${bestIA ? 'success' : ''}">Mejor IA: ${bestIA ? `${bestIA.puntuacion}/${bestIA.total}` : 'sin intento'}</span>
            <span class="status-pill ${bestProfesor ? 'warning' : ''}">Mejor profesor: ${bestProfesor ? `${bestProfesor.puntuacion}/${bestProfesor.total}` : 'sin intento'}</span>
          </div>

          <div class="overview-card stack-sm">
            <h3>Lectura rapida</h3>
            <p class="review-copy">${escapeHtml(excerpt(topic.resumen, 110))}</p>
          </div>

          ${topic.ejercicios_codigo.length ? `
            <div class="overview-card stack-sm">
              <h3>Practica de codigo</h3>
              <p class="review-copy">${escapeHtml(pluralize(topic.ejercicios_codigo.length, 'ejercicio', 'ejercicios'))} con input libre, pista, solucion y una explicacion corta.</p>
            </div>
          ` : ''}

          <p class="summary-note">Consejo: si estas en movil, usa primero claves para barrer conceptos, despues haz el test y termina con el examen practico.</p>
        </aside>
      </section>
    </div>
  `;
}

function renderKeyList(keys) {
  if (!keys.length) {
    return renderEmpty('Sin conceptos clave', 'Este tema aun no tiene una lista de claves definida.');
  }

  return `
    <div class="key-list">
      ${keys.map((item, index) => `
        <article class="key-point">
          <div class="key-index">${index + 1}</div>
          <div class="stack-sm">
            <strong>Punto clave</strong>
            <p class="review-copy">${escapeHtml(item)}</p>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

function renderPractice() {
  const subject = getSubject(state.subjectId);
  const topic = getTopic(state.subjectId, state.topicId);

  if (!subject || !topic) {
    setView('subject', { subjectId: state.subjectId, topicId: null }, { skipScroll: true });
    return;
  }

  if (!topic.ejercicios_codigo.length) {
    window.alert('Este tema no tiene ejercicios practicos disponibles.');
    setView('content', { subjectId: subject.id, topicId: topic.id, contentTab: 'resumen' }, { skipScroll: true });
    return;
  }

  app.innerHTML = `
    <div class="view-stack">
      <section class="surface test-panel stack-lg">
        <div class="header-row">
          <div class="test-meta">
            <span class="status-pill">Examen practico · ${topic.ejercicios_codigo.length} ejercicios</span>
            <h1 class="topic-title">${escapeHtml(topic.titulo)}</h1>
            <p class="helper-text">Rellena o escribe codigo, consulta una pista cuando la necesites y compara despues con la solucion explicada.</p>
          </div>
          <button class="ghost-button" type="button" data-action="close-practice">Salir</button>
        </div>

        <div class="context-strip">
          <div class="stack-sm">
            <strong>Propuesta de repaso</strong>
            <p class="helper-text">Intenta resolver cada ejercicio sin abrir la solucion. Usa la pista solo si te bloqueas y revisa la explicacion al final.</p>
          </div>
        </div>
      </section>

      <section class="practice-list">
        ${topic.ejercicios_codigo.map((exercise, index) => `
          <article class="practice-card surface stack-md">
            <div class="header-row">
              <div class="stack-sm">
                <span class="status-pill">Ejercicio ${index + 1}</span>
                <h2>${escapeHtml(exercise.titulo)}</h2>
              </div>
              <span class="meta-pill">${escapeHtml(exercise.dificultad)}</span>
            </div>

            <p class="review-copy">${escapeHtml(exercise.enunciado)}</p>

            ${exercise.codigo_base ? `
              <div class="code-block">
                <pre><code>${escapeHtml(exercise.codigo_base)}</code></pre>
              </div>
            ` : ''}

            <label class="small-label" for="practice-${index}">Tu respuesta</label>
            <textarea id="practice-${index}" class="code-editor" rows="8" placeholder="${escapeHtml(exercise.placeholder)}">${escapeHtml(exercise.codigo_base)}</textarea>

            <details class="practice-toggle">
              <summary>Pista</summary>
              <p class="review-copy">${escapeHtml(exercise.pista)}</p>
            </details>

            <details class="practice-toggle">
              <summary>Solucion y explicacion</summary>
              <div class="stack-sm">
                <div class="code-block">
                  <pre><code>${escapeHtml(exercise.solucion)}</code></pre>
                </div>
                <p class="review-copy">${escapeHtml(exercise.explicacion)}</p>
              </div>
            </details>
          </article>
        `).join('')}
      </section>
    </div>
  `;
}

function startTest(subjectId, topicId, type) {
  const questions = buildQuestionSet(subjectId, topicId, type);

  if (!questions.length) {
    window.alert('No hay preguntas disponibles para este test.');
    return;
  }

  const subject = getSubject(subjectId);
  const topic = topicId === 'global'
    ? { id: 'global', titulo: `${QUIZ_TYPES[type] || 'Test global'} · ${subject?.nombre || 'Asignatura'}` }
    : getTopic(subjectId, topicId);

  state.test = {
    subjectId,
    topicId,
    type,
    topicTitle: topic?.titulo || 'Test',
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
    setView('subject', { subjectId: state.subjectId }, { skipScroll: true });
    return;
  }

  const current = test.questions[test.currentIndex];
  const progress = clampPercent((test.currentIndex / test.questions.length) * 100);
  const answeredCount = test.currentIndex + (test.locked ? 1 : 0);

  app.innerHTML = `
    <div class="view-stack">
      <section class="surface test-panel stack-lg">
        <div class="header-row">
          <div class="test-meta">
            <span class="status-pill">Pregunta ${test.currentIndex + 1} de ${test.questions.length}</span>
            <h1 class="topic-title">${escapeHtml(test.topicTitle)}</h1>
            <p class="helper-text">${escapeHtml(QUIZ_TYPES[test.type] || 'Modo test')} con feedback inmediato para repasar sin perder el hilo.</p>
          </div>
          <button class="ghost-button" type="button" data-action="exit-test">Salir</button>
        </div>

        ${renderProgress(progress)}

        <div class="context-strip">
          <div class="stack-sm">
            <strong>${answeredCount} de ${test.questions.length} respuestas gestionadas</strong>
            <p class="helper-text">Responde, lee la explicacion y continua. El flujo esta pensado para repasos cortos desde movil.</p>
          </div>
        </div>

        <article class="stack-md">
          <h2 class="question-title">${escapeHtml(current.pregunta)}</h2>
          <div class="options-list">
            ${current.opciones.map((option, index) => renderOption(option, index, test)).join('')}
          </div>
          ${test.locked ? renderFeedback(current, test.selectedIndex) : ''}
        </article>

        <div class="test-actions">
          ${test.locked ? `<button class="primary-button" type="button" data-action="next-question">${test.currentIndex + 1 >= test.questions.length ? 'Ver resultado' : 'Siguiente pregunta'}</button>` : ''}
        </div>
      </section>
    </div>
  `;
}

function renderOption(option, index, test) {
  let className = 'option-button';
  const current = test.questions[test.currentIndex];

  if (test.locked) {
    if (index === current.respuesta_correcta) className += ' correct';
    else if (index === test.selectedIndex) className += ' wrong';
  }

  return `<button class="${className}" type="button" data-action="answer" data-index="${index}" ${test.locked ? 'disabled' : ''}>${escapeHtml(option)}</button>`;
}

function renderFeedback(question, selectedIndex) {
  const isCorrect = selectedIndex === question.respuesta_correcta;
  return `
    <div class="feedback-box ${isCorrect ? 'success' : 'error'}">
      <h3>${isCorrect ? 'Respuesta correcta' : 'Respuesta incorrecta'}</h3>
      <p class="review-copy">${escapeHtml(question.explicacion)}</p>
      ${isCorrect ? '' : `<p class="review-copy"><strong>Correcta:</strong> ${escapeHtml(question.opciones[question.respuesta_correcta])}</p>`}
    </div>
  `;
}

function answerQuestion(index) {
  const test = state.test;
  if (!test || test.locked) return;

  const question = test.questions[test.currentIndex];
  const isCorrect = index === question.respuesta_correcta;

  if (isCorrect) {
    test.score += 1;
  }

  test.selectedIndex = index;
  test.locked = true;
  test.answers.push({
    pregunta: question.pregunta,
    marcada: question.opciones[index],
    correcta: question.opciones[question.respuesta_correcta],
    esCorrecta: isCorrect,
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
    state.results = {
      ...test,
      best: getBestScore(test.subjectId, test.topicId, test.type)
    };
    state.test = null;
    setView('results');
    return;
  }

  renderTest();
}

function renderResults() {
  const result = state.results;
  if (!result) {
    setView('home', {}, { skipScroll: true });
    return;
  }

  const percent = clampPercent((result.score / result.questions.length) * 100);
  const wrong = result.questions.length - result.score;
  const message = percent >= 85
    ? 'Dominas bastante bien este bloque.'
    : percent >= 60
      ? 'Vas bien, pero aun hay margen de repaso.'
      : 'Conviene releer el tema y repetir el test.';

  app.innerHTML = `
    <div class="view-stack">
      <section class="surface results-panel stack-lg">
        <div class="score-hero">
          ${renderBadge('Resultado final')}
          <h1 class="score-title">${escapeHtml(result.topicTitle)}</h1>
          <p class="lead">${message}</p>
        </div>

        <div class="metrics-grid">
          <article class="metric-card"><span class="metric-label">Puntuacion</span><strong class="metric-value">${percent}%</strong></article>
          <article class="metric-card"><span class="metric-label">Aciertos</span><strong class="metric-value">${result.score}</strong></article>
          <article class="metric-card"><span class="metric-label">Fallos</span><strong class="metric-value">${wrong}</strong></article>
          <article class="metric-card"><span class="metric-label">Mejor nota</span><strong class="metric-value">${result.best?.puntuacion || result.score}/${result.best?.total || result.questions.length}</strong></article>
        </div>

        <div class="results-actions">
          <button class="primary-button" type="button" data-action="repeat-test">Repetir test</button>
          <button class="secondary-button" type="button" data-action="back-after-results">Volver al tema</button>
        </div>

        <div class="context-strip">
          <div class="stack-sm">
            <strong>Siguiente paso recomendado</strong>
            <p class="helper-text">${percent >= 85 ? 'Pasa al siguiente tema o intenta el test global para consolidar.' : 'Vuelve al resumen o a claves y repite el test para fijar conceptos.'}</p>
          </div>
        </div>
      </section>

      <section class="stack-md">
        <div class="stack-sm">
          <p class="section-kicker">Revision detallada</p>
          <h2 class="subject-title">Que has marcado y que debias marcar</h2>
        </div>
        <div class="review-list">
          ${result.answers.map((answer, index) => `
            <article class="review-card ${answer.esCorrecta ? 'ok' : 'fail'} stack-sm">
              <h3>${index + 1}. ${escapeHtml(answer.pregunta)}</h3>
              <p class="review-copy"><strong>Tu respuesta:</strong> ${escapeHtml(answer.marcada)} ${answer.esCorrecta ? 'OK' : 'Fallo'}</p>
              ${answer.esCorrecta ? '' : `<p class="review-copy"><strong>Respuesta correcta:</strong> ${escapeHtml(answer.correcta)}</p>`}
              <p class="review-copy"><strong>Explicacion:</strong> ${escapeHtml(answer.explicacion)}</p>
              <p class="review-copy"><strong>Origen:</strong> ${escapeHtml(answer.source?.title || 'Tema')} · ${escapeHtml(answer.source?.type === 'profesor' ? 'test profesor' : 'test IA')}</p>
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
    return;
  }

  setView('content', {
    subjectId: result.subjectId,
    topicId: result.topicId,
    contentTab: 'resumen'
  });
}

function updateHeaderControls() {
  const showBack = state.view !== 'home';
  backButton.classList.toggle('hidden', !showBack);
}

function render() {
  updateHeaderControls();

  switch (state.view) {
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
    case 'practice':
      renderPractice();
      break;
    case 'home':
    default:
      renderHome();
      break;
  }
}

function onBack() {
  if (state.view === 'content' || state.view === 'test' || state.view === 'practice') {
    state.test = null;
    setView('subject', { subjectId: state.subjectId, topicId: null });
    return;
  }

  if (state.view === 'results') {
    openAfterResults();
    return;
  }

  setView('home', { subjectId: null, topicId: null, topicSearch: '' });
}

function bindEvents() {
  document.addEventListener('click', (event) => {
    const actionElement = event.target.closest('[data-action]');
    if (!actionElement) return;

    const { action, subject, topic, type, tab, index } = actionElement.dataset;

    switch (action) {
      case 'go-home':
        setView('home', { subjectId: null, topicId: null, topicSearch: '' });
        break;
      case 'focus-subjects':
        document.getElementById('subjects-section')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'continue-study': {
        const resume = findContinueTopic();
        if (resume) {
          setView('content', {
            subjectId: resume.subject.id,
            topicId: resume.topic.id,
            contentTab: 'resumen'
          });
        }
        break;
      }
      case 'open-subject':
        setView('subject', { subjectId: subject, topicId: null, topicSearch: '' });
        break;
      case 'open-content':
        setView('content', { subjectId: subject || state.subjectId, topicId: topic, contentTab: tab || 'resumen' });
        break;
      case 'jump-topic':
        setView('content', { subjectId: state.subjectId, topicId: topic, contentTab: 'resumen' });
        break;
      case 'switch-tab':
        state.contentTab = tab === 'claves' ? 'claves' : 'resumen';
        saveAppState();
        renderContent();
        break;
      case 'open-practice':
        setView('practice', { subjectId: state.subjectId || subject, topicId: topic });
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
        if (window.confirm('Si sales ahora perderas el progreso de este intento.')) {
          state.test = null;
          setView('subject', { subjectId: state.subjectId, topicId: null });
        }
        break;
      case 'close-practice':
        setView('content', { subjectId: state.subjectId, topicId: state.topicId, contentTab: 'resumen' });
        break;
      case 'repeat-test':
        startTest(state.results.subjectId, state.results.topicId, state.results.type);
        break;
      case 'back-after-results':
        openAfterResults();
        break;
      default:
        break;
    }
  });

  themeToggle.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  backButton.addEventListener('click', onBack);
}

function repairStateAfterLoad() {
  const validSubject = state.subjectId ? getSubject(state.subjectId) : null;

  if (state.view !== 'home' && !validSubject) {
    state.view = 'home';
    state.subjectId = null;
    state.topicId = null;
    state.topicSearch = '';
    return;
  }

  if (state.view === 'content' && state.subjectId && state.topicId && !getTopic(state.subjectId, state.topicId)) {
    state.view = 'subject';
    state.topicId = null;
  }
}

async function init() {
  initTheme();
  bindEvents();
  restoreAppState();

  try {
    const response = await fetch('datos.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    state.db = normalizeDatabase(data);
    repairStateAfterLoad();
    render();
  } catch (error) {
    console.error(error);
    app.innerHTML = renderEmpty(
      'No se pudo cargar la aplicacion',
      'Comprueba que estas ejecutando la app desde un servidor local y que datos.json tiene una estructura valida.'
    );
  }
}

init();
