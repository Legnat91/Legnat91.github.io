const app = document.getElementById("app");
const nav = document.getElementById("main-nav");

let DATA_INDEX = null;

/* ======================
   UTILIDADES
====================== */

async function fetchJSON(path) {
    const res = await fetch(path);
    return await res.json();
}

function saveProgress(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getProgress(key) {
    return JSON.parse(localStorage.getItem(key));
}

function clearApp() {
    app.innerHTML = "";
}

/* ======================
   INICIALIZACIÓN
====================== */

async function init() {
    DATA_INDEX = await fetchJSON("data/index.json");
    buildMenu();
    renderHome();
}

function buildMenu() {
    nav.innerHTML = "";

    const sections = [
        { name: "Inicio", action: renderHome },
        { name: "Temario", action: renderTemario },
        { name: "Test", action: renderTestList },
        { name: "Examen", action: renderExamenList }
    ];

    sections.forEach(sec => {
        const btn = document.createElement("button");
        btn.textContent = sec.name;
        btn.onclick = sec.action;
        nav.appendChild(btn);
    });
}

/* ======================
   HOME
====================== */

function renderHome() {
    clearApp();
    app.innerHTML = `
        <div class="card">
            <h2>Bienvenido</h2>
            <p>Selecciona una sección para comenzar.</p>
        </div>
    `;
}

/* ======================
   TEMARIO
====================== */

function renderTemario() {
    clearApp();

    DATA_INDEX.contenidos.forEach(tema => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${tema.titulo}</h3>
            <button class="primary">Ver</button>
        `;
        card.querySelector("button").onclick = () => loadTema(tema.file);
        app.appendChild(card);
    });
}

async function loadTema(file) {
    const data = await fetchJSON(`data/temario/${file}`);
    clearApp();

    app.innerHTML = `
        <div class="card">
            <h2>${data.titulo}</h2>
            <p>${data.descripcion ?? ""}</p>
        </div>
    `;
}

/* ======================
   TEST
====================== */

function renderTestList() {
    clearApp();

    DATA_INDEX.tests.forEach(test => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${test.titulo}</h3>
            <button class="primary">Realizar Test</button>
        `;
        card.querySelector("button").onclick = () => loadTest(test.file);
        app.appendChild(card);
    });
}

async function loadTest(file) {
    const data = await fetchJSON(`data/test/${file}`);
    clearApp();

    let correct = 0;

    data.preguntas.forEach((preg, index) => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `<h4>${index + 1}. ${preg.enunciado}</h4>`;

        preg.opciones.forEach((op, i) => {
            const btn = document.createElement("button");
            btn.textContent = op;
            btn.onclick = () => {
                if (i === preg.correcta) {
                    btn.className = "success";
                    correct++;
                } else {
                    btn.className = "danger";
                }
            };
            card.appendChild(btn);
        });

        app.appendChild(card);
    });

    const finishBtn = document.createElement("button");
    finishBtn.textContent = "Finalizar";
    finishBtn.className = "primary";
    finishBtn.onclick = () => {
        const score = (correct / data.preguntas.length) * 100;
        saveProgress(file, score);
        alert(`Resultado: ${score.toFixed(2)}%`);
    };

    app.appendChild(finishBtn);
}

/* ======================
   EXAMEN
====================== */

function renderExamenList() {
    clearApp();

    DATA_INDEX.examenes.forEach(ex => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${ex.titulo}</h3>
            <button class="primary">Iniciar</button>
        `;
        card.querySelector("button").onclick = () => loadExamen(ex.file);
        app.appendChild(card);
    });
}

async function loadExamen(file) {
    const data = await fetchJSON(`data/examen/${file}`);
    clearApp();

    let time = data.tiempo;
    let correct = 0;

    const timer = document.createElement("h3");
    app.appendChild(timer);

    const interval = setInterval(() => {
        timer.textContent = `Tiempo restante: ${time}s`;
        time--;
        if (time < 0) {
            clearInterval(interval);
            finishExam();
        }
    }, 1000);

    function finishExam() {
        const score = (correct / data.preguntas.length) * 100;
        saveProgress(file, score);
        alert(`Nota final: ${score.toFixed(2)}% ${score >= 70 ? "APROBADO" : "SUSPENSO"}`);
    }

    data.preguntas
        .sort(() => 0.5 - Math.random())
        .forEach((preg, index) => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `<h4>${index + 1}. ${preg.enunciado}</h4>`;

            preg.opciones.forEach((op, i) => {
                const btn = document.createElement("button");
                btn.textContent = op;
                btn.onclick = () => {
                    if (i === preg.correcta) correct++;
                };
                card.appendChild(btn);
            });

            app.appendChild(card);
        });
}

init();
