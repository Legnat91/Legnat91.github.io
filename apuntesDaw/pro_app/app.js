const app = document.getElementById('app');
const themeToggle = document.getElementById('theme-toggle');
const homeButton = document.getElementById('home-button');

const STORAGE_KEYS = {
  theme: 'daw_theme',
  scoresLegacy: 'daw_notas',
  scores: 'daw_notes_scores_v2',
  appState: 'daw_notes_app_state_v2'
};

const state = {
  db: null,
  view: 'home',
  subjectId: null,
  topicId: null,
  contentTab: 'resumen',
  topicSearch: '',
  test: null,
  results: null,
  scores: migrateScores()
};

function migrateScores() {
  const modern = JSON.parse(localStorage.getItem(STORAGE_KEYS.scores) || '{}');
  const legacy = JSON.parse(localStorage.getItem(STORAGE_KEYS.scoresLegacy) || '{}');
  const merged = { ...legacy, ...modern };
  localStorage.setItem(STORAGE_KEYS.scores, JSON.stringify(merged));
  return merged;
}

function saveScores() {
  localStorage.setItem(STORAGE_KEYS.scores, JSON.stringify(state.scores));
  localStorage.setItem(STORAGE_KEYS.scoresLegacy, JSON.stringify(state.scores));
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
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.appState) || 'null');
  if (!saved) return;
  state.view = saved.view || 'home';
  state.subjectId = saved.subjectId || null;
  state.topicId = saved.topicId || null;
  state.contentTab = saved.contentTab || 'resumen';
  state.topicSearch = saved.topicSearch || '';
}

function setTheme(theme) {
  const dark = theme === 'dark';
  document.body.toggleAttribute('data-theme', dark);
  document.body.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem(STORAGE_KEYS.theme, dark ? 'dark' : 'light');
  themeToggle.querySelector('.theme-icon').textContent = dark ? '☀️' : '🌙';
  themeToggle.querySelector('.theme-label').textContent = dark ? 'Modo claro' : 'Modo oscuro';
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

function getSubject(subjectId) {
  return state.db?.asignaturas.find(a => a.id === subjectId) || null;
}

function getTopic(subjectId, topicId) {
  return getSubject(subjectId)?.temas.find(t => t.id === topicId) || null;
}

function scoreKey(subjectId, topicId, type) {
  return `${subjectId}-${topicId}-${type}`;
}

function subjectStats(subject) {
  return subject.temas.reduce((acc, topic) => {
    acc.temas += 1;
    acc.ia += (topic.preguntas || []).length;
    acc.profesor += (topic.preguntas_profesor || []).length;
    return acc;
  }, { temas: 0, ia: 0, profesor: 0 });
}

function globalStats() {
  const stats = { asignaturas: state.db.asignaturas.length, temas: 0, ia: 0, profesor: 0, realizados: 0 };
  state.db.asignaturas.forEach(subject => {
    const s = subjectStats(subject);
    stats.temas += s.temas;
    stats.ia += s.ia;
    stats.profesor += s.profesor;
  });
  Object.values(state.scores).forEach(score => {
    if (score?.intentos) stats.realizados += score.intentos;
  });
  return stats;
}

function getBestScore(subjectId, topicId, type) {
  return state.scores[scoreKey(subjectId, topicId, type)] || null;
}

function saveScore(subjectId, topicId, type, score, total) {
  const key = scoreKey(subjectId, topicId, type);
  const previous = state.scores[key];
  const next = {
    puntuacion: previous ? Math.max(previous.puntuacion, score) : score,
    total,
    intentos: (previous?.intentos || 0) + 1,
    ultimoResultado: score,
    updatedAt: new Date().toISOString()
  };
  state.scores[key] = next;
  saveScores();
}

function getCoverage(subject) {
  const types = ['ia', 'profesor', 'global-total', 'global-profesor'];
  let completed = 0;
  let total = types.length;
  subject.temas.forEach(() => total += 2);
  subject.temas.forEach(topic => {
    if (getBestScore(subject.id, topic.id, 'ia')) completed += 1;
    if (getBestScore(subject.id, topic.id, 'profesor')) completed += 1;
  });
  if (getBestScore(subject.id, 'global', 'total')) completed += 1;
  if (getBestScore(subject.id, 'global', 'profesor')) completed += 1;
  return { completed, total, percentage: Math.round((completed / total) * 100) || 0 };
}

function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

function excerpt(html, length = 180) {
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
    let pool = [];
    subject.temas.forEach(topic => {
      if (type === 'total') {
        pool.push(...(topic.preguntas || []).map(q => normalizeQuestion(q, { subjectId, topicId: topic.id, title: topic.titulo, type: 'ia' })));
      }
      if (type === 'total' || type === 'profesor') {
        pool.push(...(topic.preguntas_profesor || []).map(q => normalizeQuestion(q, { subjectId, topicId: topic.id, title: topic.titulo, type: 'profesor' })));
      }
    });
    return shuffle(pool).slice(0, 30);
  }

  const topic = getTopic(subjectId, topicId);
  if (!topic) return [];
  const questions = type === 'profesor' ? (topic.preguntas_profesor || []) : (topic.preguntas || []);
  return shuffle(questions.map(q => normalizeQuestion(q, { subjectId, topicId, title: topic.titulo, type })));
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

  app.innerHTML = `
    <div class="stack-xl">
      <section class="grid-2">
        <article class="card hero">
          <span class="badge">Diseño renovado · móvil y escritorio</span>
          <h2>Una app de estudio más seria, más legible y mejor preparada para crecer.</h2>
          <p>Se mantiene el concepto original: asignaturas, resumen, conceptos clave, test IA y test de profesor.</p>
          <div class="hero-actions" style="margin-top: 22px;">
            <button class="btn btn-primary" data-action="open-first-subject">Entrar a la asignatura actual</button>
            <button class="btn btn-secondary" data-action="focus-subjects">Ver asignaturas</button>
          </div>
        </article>

        <aside class="card stats-panel">
          <h3>Resumen general</h3>
          <div class="stat-grid">
            <div class="stat-item"><span class="label">Asignaturas</span><strong>${stats.asignaturas}</strong></div>
            <div class="stat-item"><span class="label">Temas</span><strong>${stats.temas}</strong></div>
            <div class="stat-item"><span class="label">Preguntas IA</span><strong>${stats.ia}</strong></div>
            <div class="stat-item"><span class="label">Preguntas profesor</span><strong>${stats.profesor}</strong></div>
            <div class="stat-item"><span class="label">Intentos guardados</span><strong>${stats.realizados}</strong></div>
            <div class="stat-item"><span class="label">Lectura</span><strong>JSON</strong></div>
          </div>
        </aside>
      </section>

      <section id="subjects-section" class="stack-md">
        <div class="section-head">
          <div>
            <h3>Asignaturas disponibles</h3>
            <p>La estructura ya queda lista para añadir las dos asignaturas restantes sin tocar el diseño.</p>
          </div>
        </div>
        ${subjects.length ? `<div class="grid-3">${subjects.map(renderSubjectCard).join('')}</div>` : document.getElementById('empty-state-template').innerHTML}
      </section>
    </div>
  `;
}

function renderSubjectCard(subject) {
  const stats = subjectStats(subject);
  const coverage = getCoverage(subject);
  const lastTopic = subject.temas[0];

  return `
    <article class="card subject-card">
      <div class="subject-card-head">
        <div>
          <span class="badge">Asignatura</span>
          <h3>${escapeHtml(subject.nombre)}</h3>
        </div>
        <span class="chip primary">${coverage.percentage}% completado</span>
      </div>
      <p>${lastTopic ? `Incluye ${stats.temas} temas con resumen, claves, test IA y test del profesor.` : 'Sin temas por ahora.'}</p>
      <div class="mini-stats">
        <div class="mini-stat"><span>Temas</span><strong>${stats.temas}</strong></div>
        <div class="mini-stat"><span>Preguntas IA</span><strong>${stats.ia}</strong></div>
        <div class="mini-stat"><span>Preguntas profesor</span><strong>${stats.profesor}</strong></div>
      </div>
      <div class="subject-meta">
        <span class="chip">Cobertura ${coverage.completed}/${coverage.total}</span>
        <span class="chip">Fuente datos.json</span>
      </div>
      <div class="action-row">
        <button class="btn btn-primary" data-action="open-subject" data-subject="${subject.id}">Abrir asignatura</button>
      </div>
    </article>
  `;
}

function renderSubject() {
  const subject = getSubject(state.subjectId);
  if (!subject) {
    setView('home');
    return;
  }

  const stats = subjectStats(subject);
  const coverage = getCoverage(subject);
  const query = state.topicSearch.trim().toLowerCase();
  const topics = subject.temas.filter(topic => topic.titulo.toLowerCase().includes(query) || stripHtml(topic.resumen).toLowerCase().includes(query));

  app.innerHTML = `
    <div class="stack-xl">
      <section class="card subject-summary">
        <div class="section-head">
          <div>
            <span class="badge">${escapeHtml(subject.nombre)}</span>
            <h2 style="margin: 10px 0 8px; font-size: clamp(2rem, 3.5vw, 2.8rem); letter-spacing: -0.05em;">Panel de estudio</h2>
            <p>Acceso directo a resúmenes, conceptos clave, test de IA y test del profesor, con métricas guardadas en localStorage.</p>
          </div>
          <span class="chip primary">${coverage.percentage}% de cobertura</span>
        </div>

        <div class="mini-stats">
          <div class="mini-stat"><span>Temas</span><strong>${stats.temas}</strong></div>
          <div class="mini-stat"><span>Preguntas IA</span><strong>${stats.ia}</strong></div>
          <div class="mini-stat"><span>Preguntas profesor</span><strong>${stats.profesor}</strong></div>
        </div>

        <div class="action-row" style="margin-top: 18px;">
          <button class="btn btn-primary" data-action="start-global" data-type="total">Test global mixto</button>
          <button class="btn btn-warning" data-action="start-global" data-type="profesor">Test global profesor</button>
        </div>
      </section>

      <section class="card filters-bar panel-pad stack-md">
        <div class="section-head" style="margin-bottom: 0;">
          <div>
            <h3>Temas de la asignatura</h3>
            <p>Busca un tema y entra al resumen, a las claves o a cualquiera de los tests.</p>
          </div>
        </div>
        <input class="search-input" id="topic-search" type="search" placeholder="Buscar por título o contenido del resumen" value="${escapeHtml(state.topicSearch)}">
      </section>

      <section class="topics-grid">
        ${topics.length ? topics.map(topic => renderTopicCard(subject, topic)).join('') : renderEmptyTopics()}
      </section>
    </div>
  `;

  const searchInput = document.getElementById('topic-search');
  searchInput?.addEventListener('input', (event) => {
    state.topicSearch = event.target.value;
    saveAppState();
    renderSubject();
  });
}

function renderEmptyTopics() {
  return `
    <section class="card empty-state" style="grid-column: 1 / -1;">
      <div class="empty-icon">🔎</div>
      <h2>Sin coincidencias</h2>
      <p>Ajusta el texto de búsqueda para volver a ver los temas disponibles.</p>
    </section>
  `;
}

function renderTopicCard(subject, topic) {
  const bestIA = getBestScore(subject.id, topic.id, 'ia');
  const bestProfesor = getBestScore(subject.id, topic.id, 'profesor');
  const aiCount = (topic.preguntas || []).length;
  const teacherCount = (topic.preguntas_profesor || []).length;

  return `
    <article class="card topic-card" tabindex="0">
      <div class="topic-card-head">
        <div>
          <span class="badge">${escapeHtml(topic.id)}</span>
          <h3>${escapeHtml(topic.titulo)}</h3>
        </div>
      </div>
      <p class="excerpt">${escapeHtml(excerpt(topic.resumen, 210))}</p>
      <div class="pills">
        <span class="pill">🧠 <strong>${topic.claves.length}</strong> claves</span>
        <span class="pill">✅ <strong>${aiCount}</strong> IA</span>
        <span class="pill">🎓 <strong>${teacherCount}</strong> profesor</span>
      </div>
      <div class="topic-meta">
        <span class="chip ${bestIA ? 'success' : ''}">Test IA: ${bestIA ? `${bestIA.puntuacion}/${bestIA.total}` : 'sin intento'}</span>
        <span class="chip ${bestProfesor ? 'warning' : ''}">Test profesor: ${bestProfesor ? `${bestProfesor.puntuacion}/${bestProfesor.total}` : 'sin intento'}</span>
      </div>
      <div class="action-row">
        <button class="btn btn-secondary" data-action="open-content" data-tab="resumen" data-topic="${topic.id}">Resumen</button>
        <button class="btn btn-secondary" data-action="open-content" data-tab="claves" data-topic="${topic.id}">Claves</button>
      </div>
      <div class="action-row">
        <button class="btn btn-primary" data-action="start-topic-test" data-topic="${topic.id}" data-type="ia" ${aiCount ? '' : 'disabled'}>Test IA</button>
        <button class="btn btn-warning" data-action="start-topic-test" data-topic="${topic.id}" data-type="profesor" ${teacherCount ? '' : 'disabled'}>Test profesor</button>
      </div>
    </article>
  `;
}

function renderContent() {
  const subject = getSubject(state.subjectId);
  const topic = getTopic(state.subjectId, state.topicId);
  if (!subject || !topic) {
    setView('subject', { subjectId: state.subjectId || subject?.id || null });
    return;
  }

  const bestIA = getBestScore(subject.id, topic.id, 'ia');
  const bestProfesor = getBestScore(subject.id, topic.id, 'profesor');
  const tab = state.contentTab;
  const body = tab === 'resumen'
    ? `<div class="body-copy">${topic.resumen}</div>`
    : `<div class="key-list">${topic.claves.map((item, index) => `<article class="key-item"><div class="key-icon">${index + 1}</div><div><strong>${escapeHtml(item)}</strong></div></article>`).join('')}</div>`;

  app.innerHTML = `
    <div class="stack-xl">
      <section class="content-shell">
        <article class="card reading-layout">
          <div class="stack-md">
            <div>
              <div class="tab-group">
                <button class="tab ${tab === 'resumen' ? 'active' : ''}" data-action="switch-tab" data-tab="resumen">Resumen</button>
                <button class="tab ${tab === 'claves' ? 'active' : ''}" data-action="switch-tab" data-tab="claves">Claves</button>
              </div>
            </div>
            <div>
              <span class="badge">${escapeHtml(subject.nombre)}</span>
              <h2 style="margin: 14px 0 10px; font-size: clamp(2rem, 3vw, 2.75rem); letter-spacing: -0.05em;">${escapeHtml(topic.titulo)}</h2>
              <p class="helper-text">Contenido cargado desde JSON. Puedes reorganizar el fichero por asignatura o tema más adelante sin perder esta interfaz.</p>
            </div>
            <div class="divider"></div>
            ${body}
          </div>
        </article>

        <aside class="card aside-panel">
          <div class="aside-section">
            <h3>Acciones del tema</h3>
            <p>Desde aquí puedes lanzar cada tipo de test sin salir de la lectura.</p>
            <div class="content-actions">
              <button class="btn btn-primary block" data-action="start-topic-test" data-topic="${topic.id}" data-type="ia" ${(topic.preguntas || []).length ? '' : 'disabled'}>Iniciar test IA</button>
              <button class="btn btn-warning block" data-action="start-topic-test" data-topic="${topic.id}" data-type="profesor" ${(topic.preguntas_profesor || []).length ? '' : 'disabled'}>Iniciar test profesor</button>
            </div>
          </div>
          <div class="aside-section">
            <h3>Seguimiento</h3>
            <div class="stack-md">
              <span class="chip ${bestIA ? 'success' : ''}">Mejor IA: ${bestIA ? `${bestIA.puntuacion}/${bestIA.total}` : 'sin intento'}</span>
              <span class="chip ${bestProfesor ? 'warning' : ''}">Mejor profesor: ${bestProfesor ? `${bestProfesor.puntuacion}/${bestProfesor.total}` : 'sin intento'}</span>
              <span class="chip">${topic.claves.length} conceptos clave</span>
            </div>
          </div>
        </aside>
      </section>
    </div>
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

  const current = test.questions[test.currentIndex];
  const progress = Math.round((test.currentIndex / test.questions.length) * 100);
  const answered = test.locked;
  const feedback = answered ? renderFeedback(current, test.selectedIndex) : '';

  app.innerHTML = `
    <div class="stack-xl">
      <section class="card test-shell stack-lg">
        <div class="section-head" style="margin-bottom: 0; align-items: center;">
          <div>
            <span class="question-badge">Pregunta ${test.currentIndex + 1} de ${test.questions.length}</span>
            <h2 style="margin: 12px 0 6px; font-size: clamp(1.7rem, 3vw, 2.3rem); letter-spacing: -0.05em;">${escapeHtml(test.topicTitle)}</h2>
            <p class="helper-text">${test.type === 'profesor' ? 'Modo test del profesor' : test.type === 'total' ? 'Modo global mixto' : 'Modo test IA'}</p>
          </div>
          <button class="btn btn-ghost" data-action="exit-test">Salir del test</button>
        </div>

        <div class="progress-bar"><span style="width:${progress}%;"></span></div>

        <article class="stack-md">
          <h3 class="question-title">${escapeHtml(current.pregunta)}</h3>
          <div class="options-list">
            ${current.opciones.map((option, index) => renderOption(option, index, test)).join('')}
          </div>
          ${feedback}
        </article>

        <div class="test-actions">
          ${answered ? `<button class="btn btn-primary" data-action="next-question">${test.currentIndex + 1 === test.questions.length ? 'Ver resultado' : 'Siguiente pregunta'}</button>` : ''}
        </div>
      </section>
    </div>
  `;
}

function renderOption(option, index, test) {
  let cls = 'option';
  if (test.locked) {
    if (index === test.questions[test.currentIndex].respuesta_correcta) cls += ' correct';
    else if (index === test.selectedIndex) cls += ' wrong';
  }
  return `<button class="${cls}" data-action="answer" data-index="${index}" ${test.locked ? 'disabled' : ''}>${escapeHtml(option)}</button>`;
}

function renderFeedback(question, selectedIndex) {
  const correct = selectedIndex === question.respuesta_correcta;
  const klass = correct ? 'success' : 'error';
  const title = correct ? 'Respuesta correcta' : 'Respuesta incorrecta';
  const extra = correct ? '' : `<p style="margin-top:10px;"><strong>Correcta:</strong> ${escapeHtml(question.opciones[question.respuesta_correcta])}</p>`;
  return `
    <div class="feedback-box ${klass}">
      <h4>${title}</h4>
      <p>${escapeHtml(question.explicacion)}</p>
      ${extra}
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
    setView('subject', { subjectId: state.subjectId });
    return;
  }

  const percent = Math.round((result.score / result.questions.length) * 100);
  const wrong = result.questions.length - result.score;
  const goodLabel = percent >= 80 ? 'Excelente resultado' : percent >= 60 ? 'Buen avance' : 'Necesita repaso';

  app.innerHTML = `
    <div class="stack-xl">
      <section class="card results-shell stack-lg">
        <div>
          <span class="badge">Resultado final</span>
          <h2 style="margin: 14px 0 0; font-size: clamp(2rem, 4vw, 3rem); letter-spacing: -0.06em;">${escapeHtml(result.topicTitle)}</h2>
        </div>

        <div>
          <p class="score-big">${percent}%</p>
          <p class="score-caption">${goodLabel} · ${result.score} aciertos de ${result.questions.length}</p>
        </div>

        <div class="result-summary">
          <div class="result-box"><span>Aciertos</span><strong>${result.score}</strong></div>
          <div class="result-box"><span>Fallos</span><strong>${wrong}</strong></div>
          <div class="result-box"><span>Mejor nota</span><strong>${result.best?.puntuacion || result.score}/${result.best?.total || result.questions.length}</strong></div>
        </div>

        <div class="result-actions">
          <button class="btn btn-primary" data-action="repeat-test">Repetir test</button>
          <button class="btn btn-secondary" data-action="back-after-results">Volver al tema</button>
        </div>
      </section>

      <section class="stack-md">
        <div class="section-head">
          <div>
            <h3>Revisión detallada</h3>
            <p>Repasa qué marcaste, cuál era la correcta y la explicación asociada.</p>
          </div>
        </div>
        <div class="review-list">
          ${result.answers.map((answer, index) => `
            <article class="card review-item ${answer.esCorrecta ? 'ok' : 'fail'}">
              <h4>${index + 1}. ${escapeHtml(answer.pregunta)}</h4>
              <div class="review-meta">
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
    setView('content', {
      subjectId: result.subjectId,
      topicId: result.topicId,
      contentTab: 'resumen'
    });
  }
}

function bindGlobalEvents() {
  document.addEventListener('click', (event) => {
    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;

    const { action, subject, topic, type, tab, index } = actionEl.dataset;

    switch (action) {
      case 'go-home':
        setView('home', { subjectId: null, topicId: null, topicSearch: '' });
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
        setView('subject', { subjectId: subject, topicId: null, topicSearch: '' });
        break;
      case 'open-content':
        setView('content', { subjectId: state.subjectId, topicId: topic, contentTab: tab });
        break;
      case 'switch-tab':
        state.contentTab = tab;
        saveAppState();
        renderContent();
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
        if (confirm('¿Quieres salir del test actual? Perderás el progreso de este intento.')) {
          setView('subject', { subjectId: state.test.subjectId });
          state.test = null;
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
    setView('home', { subjectId: null, topicId: null, topicSearch: '' });
  });
}

async function init() {
  initTheme();
  bindGlobalEvents();
  restoreAppState();

  try {
    const response = await fetch('datos.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const db = await response.json();
    if (!db?.asignaturas || !Array.isArray(db.asignaturas)) throw new Error('Estructura JSON no válida');
    state.db = db;

    const validSubject = state.subjectId ? getSubject(state.subjectId) : null;
    if (state.view !== 'home' && !validSubject) {
      state.view = 'home';
      state.subjectId = null;
      state.topicId = null;
    }

    if (state.view === 'content' && state.subjectId && state.topicId && !getTopic(state.subjectId, state.topicId)) {
      state.view = 'subject';
      state.topicId = null;
    }

    render();
  } catch (error) {
    console.error(error);
    app.innerHTML = `
      <section class="card empty-state">
        <div class="empty-icon">⚠️</div>
        <h2>No se ha podido cargar la aplicación</h2>
        <p>Comprueba que estás ejecutando la app en un servidor local y que <strong>datos.json</strong> existe y tiene una estructura válida.</p>
      </section>
    `;
  }
}

init();
