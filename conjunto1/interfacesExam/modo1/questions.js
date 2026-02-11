/* =========================================================
   questions.js (ACTUALIZADO)
   ---------------------------------------------------------
   ✅ Incluye TODAS las preguntas que has pegado (TEMA 1..7)
   ✅ Formato unificado para la app (HTML/CSS/JS local)
   ✅ Puedes añadir/editar sin tocar app.js

   NOTA IMPORTANTE (honestidad / control de calidad):
   - He rellenado respuestas cuando son conocimiento estándar y verificable.
   - Si alguna respuesta te chirría (según tu temario/profesor), edítala aquí.
   - Si quieres que marque explícitamente cuáles revisar, busca el tag "revisar".
   ========================================================= */

const TOPICS = [
  { id: "UF1", name: "UF1 · TEMA 1 (Interfaz, IPO, UX, accesibilidad base)" },
  { id: "UF2", name: "UF2 · TEMA 2 (CSS fundamentos)" },
  { id: "UF3", name: "UF3 · TEMA 3 (CSS avanzado / responsive / preprocesadores)" },
  { id: "UF4", name: "UF4 · TEMA 4 (Plantillas, CMS, frameworks CSS)" },
  { id: "UF5", name: "UF5 · TEMA 5 (Multimedia HTML5)" },
  { id: "UF6", name: "UF6 · TEMA 6 (Eventos y DOM en JavaScript)" },
  { id: "UF7", name: "UF7 · TEMA 7 (Accesibilidad y usabilidad, WCAG/POUR/ARIA)" }
];

/*
  Convenciones:
  - difficulty: 1..5
  - source: "profesor" | "temario"   (en tu lista son "profesor")
  - type:
      - "test": opción única (2..6 opciones)
      - "tf": Verdadero/Falso (equivalente a test con 2)
      - "fill": completar (answers = sinónimos)
*/

const QUESTIONS = [
  // =========================================================
  // TEMA 1  (UF1)
  // =========================================================
  {
    id: "UF1-PROF-001",
    topic: "UF1",
    type: "fill",
    prompt: "¿Qué se entiende por interfaz en el contexto del desarrollo web?",
    answers: [
      "la parte del sistema con la que interactúa el usuario",
      "el conjunto de elementos visuales y de interacción con los que el usuario se comunica con la aplicación",
      "la capa de presentación con la que el usuario interactúa"
    ],
    explanation: "Interfaz: zona/capa de presentación e interacción entre usuario y sistema.",
    tags: ["interfaz", "ux"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF1-PROF-002",
    topic: "UF1",
    type: "fill",
    prompt: "IPO corresponde a las siglas de ->",
    answers: [
      "interacción persona-ordenador",
      "interaccion persona-ordenador",
      "interaccion persona ordenador",
      "interacción persona ordenador"
    ],
    explanation: "IPO/HCI: Interacción Persona-Ordenador.",
    tags: ["ipo", "hci"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF1-PROF-003",
    topic: "UF1",
    type: "fill",
    prompt: "El objetivo principal de la IPO es ->",
    answers: [
      "mejorar la interacción entre personas y ordenadores",
      "favorecer la interacción haciendo sistemas más fáciles de usar",
      "hacer los sistemas más fáciles de usar y amigables",
      "mejorar la experiencia de usuario"
    ],
    explanation: "Busca optimizar la interacción para que el sistema sea usable y eficiente.",
    tags: ["ipo", "usabilidad", "ux"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF1-PROF-004",
    topic: "UF1",
    type: "fill",
    prompt: "Una interfaz usable permite que el usuario ->",
    answers: [
      "se centre en la tarea y no en la aplicación",
      "centrarse en la tarea y no en la aplicación",
      "se concentre en la tarea y no en la aplicación"
    ],
    explanation: "Usabilidad reduce fricción: el usuario se enfoca en el objetivo, no en “cómo usar”.",
    tags: ["usabilidad", "ux"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF1-PROF-005",
    topic: "UF1",
    type: "fill",
    prompt: "La usabilidad se relaciona principalmente con ->",
    answers: [
      "la facilidad de uso",
      "la facilidad con la que se puede usar un sistema",
      "la eficacia eficiencia y satisfacción en el uso",
      "eficacia eficiencia y satisfacción"
    ],
    explanation: "Usabilidad: facilidad/eficacia/eficiencia y satisfacción al realizar tareas.",
    tags: ["usabilidad"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF1-PROF-006",
    topic: "UF1",
    type: "fill",
    prompt: "La accesibilidad web persigue que ->",
    answers: [
      "todas las personas puedan acceder y usar la web",
      "las personas con discapacidad puedan percibir entender navegar e interactuar",
      "la web sea utilizable por el mayor número de personas posible"
    ],
    explanation: "Accesibilidad: que la web pueda ser usada por todas las personas, incluyendo discapacidades.",
    tags: ["accesibilidad"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF1-PROF-007",
    topic: "UF1",
    type: "fill",
    prompt: "¿Qué organismo define las WCAG?",
    answers: ["w3c", "w3c w a i", "wai", "w3c (wai)"],
    explanation: "Las WCAG las publica el W3C a través de la iniciativa WAI.",
    tags: ["wcag", "w3c", "wai"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF1-PROF-008",
    topic: "UF1",
    type: "fill",
    prompt: "Las WCAG son ->",
    answers: [
      "pautas de accesibilidad para el contenido web",
      "web content accessibility guidelines",
      "guías de accesibilidad web"
    ],
    explanation: "WCAG = Web Content Accessibility Guidelines.",
    tags: ["wcag", "accesibilidad"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF1-PROF-009",
    topic: "UF1",
    type: "fill",
    prompt: "Una web accesible beneficia ->",
    answers: [
      "a todas las personas",
      "a todos los usuarios",
      "a usuarios con y sin discapacidad"
    ],
    explanation: "Accesibilidad mejora la experiencia general (móvil, mayores, baja conectividad, etc.).",
    tags: ["accesibilidad"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF1-PROF-010",
    topic: "UF1",
    type: "fill",
    prompt: "¿Qué atributo HTML es clave para la accesibilidad en imágenes?",
    answers: ["alt", "atributo alt", "alt="],
    explanation: "El atributo alt aporta texto alternativo para lectores de pantalla.",
    tags: ["html", "accesibilidad"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF1-PROF-011",
    topic: "UF1",
    type: "fill",
    prompt: "El diseño centrado en el usuario se conoce como ->",
    answers: ["user centered design", "diseño centrado en el usuario", "dcu", "ucd"],
    explanation: "Se conoce como UCD/DCU (User-Centered Design / Diseño Centrado en el Usuario).",
    tags: ["ux", "diseño"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF1-PROF-012",
    topic: "UF1",
    type: "fill",
    prompt: "El enfoque UXD busca principalmente ->",
    answers: [
      "mejorar la experiencia de usuario",
      "diseñar una experiencia de usuario óptima",
      "optimizar la experiencia del usuario"
    ],
    explanation: "UXD = User Experience Design: diseñar la experiencia completa (no solo lo visual).",
    tags: ["uxd", "ux"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF1-PROF-013",
    topic: "UF1",
    type: "fill",
    prompt: "¿Qué fase pertenece al diseño UX?",
    answers: [
      "investigación",
      "research",
      "ideación",
      "prototipado",
      "evaluación",
      "test de usabilidad"
    ],
    explanation: "UX incluye fases como investigación, ideación, prototipado y evaluación/test.",
    tags: ["ux", "proceso"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF1-PROF-014",
    topic: "UF1",
    type: "fill",
    prompt: "La entrevista con el usuario sirve para ->",
    answers: [
      "recoger requisitos",
      "entender necesidades y objetivos del usuario",
      "conocer el contexto de uso",
      "obtener información cualitativa"
    ],
    explanation: "Entrevistas: información cualitativa para entender necesidades, motivaciones y contexto.",
    tags: ["ux", "investigacion"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF1-PROF-015",
    topic: "UF1",
    type: "fill",
    prompt: "Un documento de especificación debe ->",
    answers: [
      "definir requisitos y funcionalidades",
      "detallar requisitos",
      "recoger requisitos funcionales y no funcionales",
      "documentar qué se va a construir"
    ],
    explanation: "Especificación: requisitos, alcance, criterios y detalles necesarios para implementar.",
    tags: ["requisitos", "documentacion"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF1-PROF-016",
    topic: "UF1",
    type: "fill",
    prompt: "¿Qué es un mapa web?",
    answers: [
      "un sitemap",
      "un mapa del sitio",
      "la estructura de páginas y navegación de un sitio",
      "representación jerárquica de las páginas"
    ],
    explanation: "Mapa web (sitemap): estructura/relación de páginas y navegación.",
    tags: ["arquitectura-informacion", "sitemap"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF1-PROF-017",
    topic: "UF1",
    type: "fill",
    prompt: "Los wireframes son ->",
    answers: [
      "bocetos de baja fidelidad de una interfaz",
      "esquemas de estructura de una página",
      "prototipos de baja fidelidad"
    ],
    explanation: "Wireframe: estructura sin detalle visual (foco en layout y jerarquía).",
    tags: ["wireframe", "ux"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF1-PROF-018",
    topic: "UF1",
    type: "fill",
    prompt: "El objetivo principal de un wireframe es ->",
    answers: [
      "definir la estructura y distribución",
      "definir la jerarquía de contenidos",
      "organizar elementos y navegación"
    ],
    explanation: "Define estructura y jerarquía antes de entrar en lo visual.",
    tags: ["wireframe", "arquitectura-informacion"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF1-PROF-019",
    topic: "UF1",
    type: "fill",
    prompt: "Un mockup se diferencia de un wireframe porque ->",
    answers: [
      "tiene mayor fidelidad visual",
      "incluye estilo visual colores tipografías",
      "representa el aspecto final"
    ],
    explanation: "Mockup: alta fidelidad visual (look&feel), wireframe: estructura.",
    tags: ["mockup", "wireframe", "ui"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF1-PROF-020",
    topic: "UF1",
    type: "fill",
    prompt: "El “look & feel” hace referencia a ->",
    answers: [
      "la apariencia y sensación de uso",
      "la estética y la experiencia percibida",
      "aspecto visual y comportamiento percibido"
    ],
    explanation: "Look (apariencia) + Feel (sensación/experiencia percibida).",
    tags: ["ui", "look-feel", "ux"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF1-PROF-021",
    topic: "UF1",
    type: "fill",
    prompt: "¿Cuál es un diseño de mayor coste de realización?",
    answers: [
      "un diseño adaptativo",
      "diseño adaptativo",
      "adaptative design",
      "diseño adaptable"
    ],
    explanation: "Suele considerarse más costoso el adaptativo por múltiples maquetas específicas (según enfoque).",
    tags: ["responsive", "adaptativo", "revisar"],
    difficulty: 4,
    source: "profesor"
  },
  {
    id: "UF1-PROF-022",
    topic: "UF1",
    type: "fill",
    prompt: "Una buena interfaz debe ser ->",
    answers: [
      "intuitiva",
      "clara",
      "consistente",
      "usable",
      "accesible"
    ],
    explanation: "Buenas prácticas: claridad, consistencia, accesibilidad y usabilidad.",
    tags: ["interfaz", "buenas-practicas"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF1-PROF-023",
    topic: "UF1",
    type: "fill",
    prompt: "HTML5 ayuda a la accesibilidad gracias a ->",
    answers: [
      "sus etiquetas semánticas",
      "elementos semánticos",
      "semántica",
      "roles semánticos"
    ],
    explanation: "La semántica (<header>, <nav>, <main>, etc.) mejora estructura para tecnologías de asistencia.",
    tags: ["html5", "accesibilidad", "semantica"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF1-PROF-024",
    topic: "UF1",
    type: "test",
    prompt: "¿Cuál NO es un contenedor semántico HTML5?",
    options: ["<header>", "<section>", "<div>", "<nav>"],
    answer: 2,
    explanation: "<div> es contenedor genérico no semántico.",
    tags: ["html5", "semantica"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF1-PROF-025",
    topic: "UF1",
    type: "fill",
    prompt: "El uso de ARIA sirve para ->",
    answers: [
      "mejorar la accesibilidad cuando la semántica nativa no es suficiente",
      "añadir información de accesibilidad a elementos",
      "definir roles estados y propiedades para tecnologías de asistencia"
    ],
    explanation: "ARIA complementa la semántica nativa (no la sustituye si hay elemento nativo).",
    tags: ["aria", "accesibilidad"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF1-PROF-026",
    topic: "UF1",
    type: "fill",
    prompt: "Un diseño accesible debe tener en cuenta ->",
    answers: [
      "contraste de color",
      "navegación por teclado",
      "textos alternativos",
      "estructura semántica",
      "adaptación a distintas capacidades"
    ],
    explanation: "Accesibilidad: contraste, teclado, semántica, alt, foco, etc.",
    tags: ["accesibilidad", "ui"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF1-PROF-027",
    topic: "UF1",
    type: "fill",
    prompt: "En una buena interfaz web, el usuario debe ->",
    answers: [
      "saber en todo momento dónde está y qué puede hacer",
      "tener control y feedback",
      "entender la navegación y el estado del sistema"
    ],
    explanation: "Principios de UX: visibilidad del estado, control del usuario, consistencia.",
    tags: ["ux", "interfaz"],
    difficulty: 3,
    source: "profesor"
  },

  // =========================================================
  // TEMA 2  (UF2) CSS
  // =========================================================
  {
    id: "UF2-PROF-001",
    topic: "UF2",
    type: "fill",
    prompt: "¿Qué significan las siglas CSS?",
    answers: ["cascading style sheets", "hojas de estilo en cascada", "hojas de estilos en cascada"],
    explanation: "CSS = Cascading Style Sheets.",
    tags: ["css", "conceptos"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF2-PROF-002",
    topic: "UF2",
    type: "fill",
    prompt: "¿Para qué se utiliza CSS en el desarrollo web?",
    answers: [
      "para dar estilo y presentación a las páginas web",
      "para definir estilos de presentación",
      "para controlar el diseño visual"
    ],
    explanation: "CSS controla presentación: colores, tipografías, layout, responsive, etc.",
    tags: ["css", "conceptos"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF2-PROF-003",
    topic: "UF2",
    type: "test",
    prompt: "¿Qué selector CSS selecciona todos los elementos?",
    options: ["*", "#", ".", "html"],
    answer: 0,
    explanation: "El selector universal (*) aplica a todos los elementos.",
    tags: ["css", "selectores"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF2-PROF-004",
    topic: "UF2",
    type: "fill",
    prompt: "¿Cómo se enlaza una hoja CSS externa correctamente?",
    answers: [
      '<link rel="stylesheet" href="styles.css">',
      '<link href="styles.css" rel="stylesheet">',
      "link rel stylesheet href styles.css"
    ],
    explanation: "Se enlaza con <link rel=\"stylesheet\" href=\"...\"> dentro de <head>.",
    tags: ["css", "html"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF2-PROF-005",
    topic: "UF2",
    type: "fill",
    prompt: "¿Qué tipo de CSS tiene mayor prioridad?",
    answers: ["inline", "css en línea", "estilos en línea"],
    explanation: "En general: inline > interno (<style>) > externo, salvo !important/especificidad.",
    tags: ["css", "cascada", "especificidad"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF2-PROF-006",
    topic: "UF2",
    type: "test",
    prompt: "¿Qué símbolo identifica una clase?",
    options: ["#", ".", ":", "*"],
    answer: 1,
    explanation: "Se selecciona con '.' (p.ej. .clase).",
    tags: ["css", "selectores"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF2-PROF-007",
    topic: "UF2",
    type: "test",
    prompt: "¿Qué símbolo identifica un id?",
    options: [".", "#", "@", "&"],
    answer: 1,
    explanation: "Se selecciona con '#'(p.ej. #id).",
    tags: ["css", "selectores"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF2-PROF-008",
    topic: "UF2",
    type: "test",
    prompt: "¿Qué propiedad cambia el color del texto?",
    options: ["background-color", "color", "text-color", "font-color"],
    answer: 1,
    explanation: "La propiedad estándar es 'color'.",
    tags: ["css", "texto"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF2-PROF-009",
    topic: "UF2",
    type: "test",
    prompt: "¿Qué unidad es relativa al tamaño de la fuente?",
    options: ["em", "px", "cm", "pt"],
    answer: 0,
    explanation: "em depende del font-size del elemento (o del contexto).",
    tags: ["css", "unidades"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF2-PROF-010",
    topic: "UF2",
    type: "fill",
    prompt: "¿Qué propiedad define la tipografía?",
    answers: ["font-family", "font family"],
    explanation: "font-family define la familia tipográfica.",
    tags: ["css", "texto"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF2-PROF-011",
    topic: "UF2",
    type: "fill",
    prompt: "¿Qué propiedad controla el tamaño del texto?",
    answers: ["font-size", "font size"],
    explanation: "font-size controla el tamaño de fuente.",
    tags: ["css", "texto"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF2-PROF-012",
    topic: "UF2",
    type: "test",
    prompt: "¿Qué valor de position saca al elemento del flujo?",
    options: ["static", "relative", "absolute", "sticky"],
    answer: 2,
    explanation: "position:absolute lo saca del flujo normal (también fixed).",
    tags: ["css", "position"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF2-PROF-013",
    topic: "UF2",
    type: "test",
    prompt: "¿Qué propiedad controla el espacio interior?",
    options: ["margin", "padding", "border", "gap"],
    answer: 1,
    explanation: "padding: espacio interior entre contenido y borde.",
    tags: ["css", "box-model"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF2-PROF-014",
    topic: "UF2",
    type: "test",
    prompt: "¿Qué propiedad controla el espacio exterior?",
    options: ["margin", "padding", "outline", "inset"],
    answer: 0,
    explanation: "margin: espacio exterior.",
    tags: ["css", "box-model"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF2-PROF-015",
    topic: "UF2",
    type: "fill",
    prompt: "¿Qué selector selecciona descendientes?",
    answers: [
      "selector descendiente",
      "espacio",
      "un espacio entre selectores",
      "a b"
    ],
    explanation: "Descendientes: A B (separados por un espacio).",
    tags: ["css", "selectores"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF2-PROF-016",
    topic: "UF2",
    type: "fill",
    prompt: "¿Qué pseudoclase se activa al pasar el ratón?",
    answers: [":hover", "hover"],
    explanation: ":hover se activa al situar el puntero sobre el elemento.",
    tags: ["css", "pseudoclases"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF2-PROF-017",
    topic: "UF2",
    type: "fill",
    prompt: "¿Qué propiedad oculta un elemento manteniendo su espacio?",
    answers: ["visibility: hidden", "visibility hidden"],
    explanation: "visibility:hidden oculta pero mantiene el espacio; display:none lo elimina del flujo.",
    tags: ["css", "display", "visibility"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF2-PROF-018",
    topic: "UF2",
    type: "fill",
    prompt: "¿Qué valor de display coloca elementos en línea?",
    answers: ["inline", "display: inline", "display inline"],
    explanation: "inline coloca elementos en línea.",
    tags: ["css", "display"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF2-PROF-019",
    topic: "UF2",
    type: "fill",
    prompt: "¿Qué propiedad define el fondo de un elemento?",
    answers: ["background", "background-color", "background color"],
    explanation: "background / background-color definen el fondo (color/imagen, etc.).",
    tags: ["css", "background"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF2-PROF-020",
    topic: "UF2",
    type: "fill",
    prompt: "¿Qué es la herencia en CSS?",
    answers: [
      "la transmisión de ciertas propiedades del elemento padre al hijo",
      "que algunas propiedades se heredan del padre",
      "propiedades heredadas"
    ],
    explanation: "Algunas propiedades (p.ej. color, font-family) se heredan si no se redefinen.",
    tags: ["css", "herencia"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF2-PROF-021",
    topic: "UF2",
    type: "fill",
    prompt: "¿Cómo se escriben comentarios en CSS?",
    answers: ["/* comentario */", "/* */"],
    explanation: "Comentarios CSS: /* ... */",
    tags: ["css", "sintaxis"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF2-PROF-022",
    topic: "UF2",
    type: "fill",
    prompt: "¿Qué propiedad alinea texto horizontalmente?",
    answers: ["text-align", "text align"],
    explanation: "text-align controla alineación horizontal del texto.",
    tags: ["css", "texto"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF2-PROF-023",
    topic: "UF2",
    type: "fill",
    prompt: "¿Qué valor centra el texto?",
    answers: ["center", "text-align: center", "text align center"],
    explanation: "text-align: center centra el texto.",
    tags: ["css", "texto"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF2-PROF-024",
    topic: "UF2",
    type: "test",
    prompt: "¿Qué selector tiene mayor especificidad?",
    options: ["elemento (p)", ".clase", "#id", "*"],
    answer: 2,
    explanation: "Especificidad: id > clase > elemento > universal.",
    tags: ["css", "especificidad"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF2-PROF-025",
    topic: "UF2",
    type: "fill",
    prompt: "¿Qué propiedad controla el grosor del texto?",
    answers: ["font-weight", "font weight"],
    explanation: "font-weight controla el grosor (normal, bold, 400, 700...).",
    tags: ["css", "texto"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF2-PROF-026",
    topic: "UF2",
    type: "fill",
    prompt: "¿Qué valor de display elimina el elemento del flujo?",
    answers: ["none", "display: none", "display none"],
    explanation: "display:none oculta y elimina el espacio del layout.",
    tags: ["css", "display"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF2-PROF-027",
    topic: "UF2",
    type: "fill",
    prompt: "¿Qué propiedad define estilos de lista?",
    answers: ["list-style", "list-style-type", "list style"],
    explanation: "list-style / list-style-type controlan viñetas/estilo de listas.",
    tags: ["css", "listas"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF2-PROF-028",
    topic: "UF2",
    type: "fill",
    prompt: "¿Qué significa cascada en CSS?",
    answers: [
      "que las reglas se aplican según prioridad y orden",
      "mecanismo de prioridad entre estilos",
      "orden de aplicación de estilos"
    ],
    explanation: "Cascada = algoritmo de prioridad (origen, especificidad, orden) para resolver conflictos.",
    tags: ["css", "cascada", "especificidad"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF2-PROF-029",
    topic: "UF2",
    type: "fill",
    prompt: "¿Qué atributo HTML se usa para aplicar clases?",
    answers: ["class", "atributo class", "class="],
    explanation: "Se usa class=\"...\" para asignar clases CSS.",
    tags: ["html", "css"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF2-PROF-030",
    topic: "UF2",
    type: "fill",
    prompt: "¿Qué unidad depende del ancho del viewport?",
    answers: ["vw", "viewport width", "v w"],
    explanation: "vw = 1% del ancho del viewport (vh para altura).",
    tags: ["css", "unidades", "responsive"],
    difficulty: 2,
    source: "profesor"
  },

  // =========================================================
  // TEMA 3 (UF3) Responsive, sombras, gradientes, transiciones, transform, preprocesadores
  // =========================================================
  {
    id: "UF3-PROF-001",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué tipo de diseño utiliza medidas fijas?",
    answers: ["diseño fijo", "fixed layout", "fixed design"],
    explanation: "Diseño fijo usa medidas fijas (p.ej. px).",
    tags: ["responsive", "diseño"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF3-PROF-002",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué problema presenta el diseño fijo en pantallas pequeñas?",
    answers: [
      "no se adapta",
      "requiere scroll horizontal",
      "se desborda o no cabe",
      "mala experiencia en móviles"
    ],
    explanation: "En móviles suele desbordar y obliga a hacer zoom/scroll horizontal.",
    tags: ["responsive", "diseño-fijo"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF3-PROF-003",
    topic: "UF3",
    type: "fill",
    prompt: "¿En qué se basa el diseño elástico?",
    answers: [
      "en unidades relativas",
      "en em y porcentajes",
      "en medidas relativas al texto"
    ],
    explanation: "Elástico (elastic): se apoya en unidades relativas (p.ej. em).",
    tags: ["responsive", "unidades"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF3-PROF-004",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué característica define al diseño líquido?",
    answers: [
      "usa porcentajes",
      "se adapta al ancho disponible",
      "layout fluido"
    ],
    explanation: "Diseño líquido/fluid: se ajusta al ancho, normalmente con porcentajes.",
    tags: ["responsive", "fluido"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF3-PROF-005",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué inconveniente puede tener el diseño líquido?",
    answers: [
      "en pantallas muy grandes las líneas de texto pueden ser demasiado largas",
      "puede verse mal en extremos de tamaño",
      "puede perder legibilidad en resoluciones muy grandes"
    ],
    explanation: "En anchos enormes puede generar columnas demasiado anchas o tipografía poco legible.",
    tags: ["responsive", "fluido"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF3-PROF-006",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué tipo de diseño reorganiza elementos según dispositivo?",
    answers: ["diseño adaptativo", "adaptive design", "diseño adaptable"],
    explanation: "Adaptativo: variantes/layouts según rangos/dispositivos (según enfoque docente).",
    tags: ["responsive", "adaptativo", "revisar"],
    difficulty: 4,
    source: "profesor"
  },
  {
    id: "UF3-PROF-007",
    topic: "UF3",
    type: "fill",
    prompt: "¿En qué se basa el diseño responsivo?",
    answers: ["media queries", "uso de media queries", "@media", "consultas de medios"],
    explanation: "Responsive: adapta estilos con media queries y layouts flexibles.",
    tags: ["responsive", "media-queries"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF3-PROF-008",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué significa el enfoque mobile-first?",
    answers: [
      "diseñar primero para móviles y luego escalar a pantallas mayores",
      "primero móvil luego escritorio"
    ],
    explanation: "Mobile-first: base para pantallas pequeñas; mejoras progresivas para pantallas mayores.",
    tags: ["responsive", "mobile-first"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF3-PROF-009",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué unidad depende del viewport?",
    answers: ["vw", "vh", "vmin", "vmax"],
    explanation: "Unidades viewport: vw, vh, vmin, vmax.",
    tags: ["css", "unidades", "responsive"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF3-PROF-010",
    topic: "UF3",
    type: "test",
    prompt: "¿Qué regla CSS permite condiciones?",
    options: ["@media", "@import", "@font-face", "@keyframes"],
    answer: 0,
    explanation: "@media define estilos condicionales.",
    tags: ["css", "media-queries"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF3-PROF-011",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué medio se usa para pantallas?",
    answers: ["screen"],
    explanation: "Media type habitual para pantallas: screen.",
    tags: ["css", "media-queries"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF3-PROF-012",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué operador exige cumplir todas las condiciones?",
    answers: ["and"],
    explanation: "En media queries: 'and' combina condiciones.",
    tags: ["css", "media-queries"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF3-PROF-013",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué operador niega una condición?",
    answers: ["not"],
    explanation: "En media queries: 'not' niega la consulta.",
    tags: ["css", "media-queries"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF3-PROF-014",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué propiedad comprueba el ancho del viewport?",
    answers: ["width", "min-width", "max-width"],
    explanation: "Media feature: width (usado con min-width / max-width).",
    tags: ["css", "media-queries"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF3-PROF-015",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué valor indica orientación horizontal?",
    answers: ["landscape"],
    explanation: "orientation: landscape (horizontal) / portrait (vertical).",
    tags: ["css", "media-queries"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF3-PROF-016",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué propiedad se basa en la resolución?",
    answers: ["resolution", "min-resolution", "max-resolution"],
    explanation: "Media feature: resolution (p.ej. dpi/dppx).",
    tags: ["css", "media-queries"],
    difficulty: 4,
    source: "profesor"
  },
  {
    id: "UF3-PROF-017",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué propiedad crea sombras en texto?",
    answers: ["text-shadow", "text shadow"],
    explanation: "text-shadow aplica sombras al texto.",
    tags: ["css", "efectos"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF3-PROF-018",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué propiedad crea sombras en cajas?",
    answers: ["box-shadow", "box shadow"],
    explanation: "box-shadow aplica sombras a cajas/elementos.",
    tags: ["css", "efectos"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF3-PROF-019",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué valor aplica sombra interior?",
    answers: ["inset"],
    explanation: "En box-shadow: inset crea sombra interior.",
    tags: ["css", "efectos"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF3-PROF-020",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué tipos de gradientes existen en CSS?",
    answers: ["lineal y radial", "linear y radial", "linear-gradient y radial-gradient"],
    explanation: "Gradientes típicos: lineal (linear-gradient) y radial (radial-gradient).",
    tags: ["css", "gradientes"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF3-PROF-021",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué propiedad crea transiciones suaves?",
    answers: ["transition", "transition-property"],
    explanation: "transition define transiciones en cambios de propiedades.",
    tags: ["css", "animacion"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF3-PROF-022",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué propiedad indica duración de transición?",
    answers: ["transition-duration", "transition duration"],
    explanation: "transition-duration define el tiempo de la transición.",
    tags: ["css", "animacion"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF3-PROF-023",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué función rota un elemento?",
    answers: ["rotate()", "rotate"],
    explanation: "transform: rotate(...) rota el elemento.",
    tags: ["css", "transform"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF3-PROF-024",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué función escala un elemento?",
    answers: ["scale()", "scale"],
    explanation: "transform: scale(...) escala el elemento.",
    tags: ["css", "transform"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF3-PROF-025",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué función desplaza un elemento?",
    answers: ["translate()", "translate", "translatex()", "translatey()"],
    explanation: "transform: translate(...) desplaza el elemento.",
    tags: ["css", "transform"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF3-PROF-026",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué preprocesador usa sintaxis SCSS?",
    answers: ["sass", "sass (scss)"],
    explanation: "Sass usa sintaxis SCSS (y también la sintaxis indentada .sass).",
    tags: ["css", "preprocesadores", "sass"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF3-PROF-027",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué elemento no es propio de preprocesadores?",
    answers: [
      "el dom",
      "document object model",
      "dom"
    ],
    explanation: "Preprocesadores aportan variables, mixins, anidación, imports, etc. El DOM no es parte de ellos.",
    tags: ["preprocesadores", "revisar"],
    difficulty: 4,
    source: "profesor"
  },
  {
    id: "UF3-PROF-028",
    topic: "UF3",
    type: "fill",
    prompt: "¿Para qué sirve la anidación?",
    answers: [
      "para escribir selectores dentro de otros",
      "para organizar estilos jerárquicamente",
      "para evitar repetir selectores"
    ],
    explanation: "Anidación (nesting): escribir reglas dentro de otras (Sass/Less).",
    tags: ["preprocesadores", "sass"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF3-PROF-029",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué directiva importa archivos SCSS?",
    answers: ["@import", "@use", "@forward"],
    explanation: "En Sass moderno se recomienda @use/@forward; @import existía clásicamente.",
    tags: ["sass", "preprocesadores", "revisar"],
    difficulty: 4,
    source: "profesor"
  },
  {
    id: "UF3-PROF-030",
    topic: "UF3",
    type: "fill",
    prompt: "¿Qué ventaja aportan los preprocesadores CSS?",
    answers: [
      "variables mixins y anidación",
      "mejor organización y reutilización",
      "generar css desde una sintaxis más potente"
    ],
    explanation: "Aportan variables, mixins, funciones, modularidad y mejor mantenimiento.",
    tags: ["preprocesadores", "sass"],
    difficulty: 3,
    source: "profesor"
  },

  // =========================================================
  // TEMA 4 (UF4) Plantillas, CMS, frameworks
  // =========================================================
  {
    id: "UF4-PROF-001",
    topic: "UF4",
    type: "fill",
    prompt: "¿Qué es una plantilla web?",
    answers: [
      "un diseño reutilizable de estructura y estilos",
      "una base predefinida para páginas",
      "un conjunto de archivos para reutilizar layout"
    ],
    explanation: "Plantilla: base reutilizable (estructura + estilos) para páginas similares.",
    tags: ["plantillas", "ui"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF4-PROF-002",
    topic: "UF4",
    type: "fill",
    prompt: "¿Cuál es el objetivo principal de usar plantillas?",
    answers: [
      "reutilizar estructura y acelerar el desarrollo",
      "ahorrar tiempo",
      "mantener consistencia"
    ],
    explanation: "Reutilización, consistencia y velocidad de desarrollo.",
    tags: ["plantillas"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF4-PROF-003",
    topic: "UF4",
    type: "fill",
    prompt: "¿Qué ventaja aportan las plantillas en el mantenimiento?",
    answers: [
      "cambios globales más fáciles",
      "modificar una vez y aplicar a muchas páginas",
      "consistencia de cambios"
    ],
    explanation: "Centralizan estructura/estilos para mantener y actualizar con menos esfuerzo.",
    tags: ["plantillas", "mantenimiento"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF4-PROF-004",
    topic: "UF4",
    type: "fill",
    prompt: "¿Qué tipo de contenido se genera dinámicamente?",
    answers: ["contenido dinámico", "contenido generado en tiempo de ejecución"],
    explanation: "Contenido dinámico: se genera según datos/usuario/contexto en tiempo de ejecución.",
    tags: ["dinamico"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF4-PROF-005",
    topic: "UF4",
    type: "fill",
    prompt: "¿Qué lenguaje se usa para contenido dinámico en cliente?",
    answers: ["javascript", "js"],
    explanation: "En el navegador (cliente) se usa JavaScript.",
    tags: ["javascript", "cliente"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF4-PROF-006",
    topic: "UF4",
    type: "fill",
    prompt: "¿Qué caracteriza a un CMS?",
    answers: [
      "gestor de contenidos",
      "content management system",
      "permite crear y administrar contenido sin programar tanto",
      "administración de contenido desde un panel"
    ],
    explanation: "CMS: sistema para gestionar contenidos (páginas, entradas, usuarios, etc.).",
    tags: ["cms"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF4-PROF-007",
    topic: "UF4",
    type: "fill",
    prompt: "¿Cómo se denominan las plantillas en WordPress?",
    answers: ["themes", "tema", "temas", "themes de wordpress"],
    explanation: "En WordPress, el conjunto de plantillas/estilos se denomina tema (theme).",
    tags: ["wordpress", "cms"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF4-PROF-008",
    topic: "UF4",
    type: "fill",
    prompt: "¿Qué etiqueta HTML permite definir plantillas reutilizables?",
    answers: ["template", "<template>"],
    explanation: "<template> define contenido que no se renderiza hasta clonarlo/insertarlo.",
    tags: ["html", "template"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF4-PROF-009",
    topic: "UF4",
    type: "fill",
    prompt: "¿Cómo se muestra el contenido de <template>?",
    answers: [
      "no se muestra hasta insertarlo con javascript",
      "no se renderiza por defecto",
      "se clona e inserta mediante javascript"
    ],
    explanation: "Por defecto no se renderiza; se usa JS para clonarlo/insertarlo en el DOM.",
    tags: ["html", "template", "javascript"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF4-PROF-010",
    topic: "UF4",
    type: "fill",
    prompt: "¿Qué ventaja tiene separar la interfaz en varios archivos?",
    answers: [
      "mejor mantenimiento",
      "modularidad",
      "reutilización",
      "organización del código"
    ],
    explanation: "Separación/modularidad facilita mantenimiento y escalabilidad.",
    tags: ["arquitectura", "mantenimiento"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF4-PROF-011",
    topic: "UF4",
    type: "fill",
    prompt: "¿Qué es un framework CSS?",
    answers: [
      "un conjunto de herramientas y estilos reutilizables",
      "una biblioteca de estilos y componentes",
      "un conjunto de clases y componentes para maquetar"
    ],
    explanation: "Framework CSS: base reutilizable para acelerar diseño y maquetación.",
    tags: ["css", "frameworks"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF4-PROF-012",
    topic: "UF4",
    type: "fill",
    prompt: "¿Quién desarrolló Bootstrap originalmente?",
    answers: [
      "twitter",
      "mark otto y jacob thornton",
      "mark otto",
      "jacob thornton"
    ],
    explanation: "Bootstrap surgió en Twitter (Mark Otto y Jacob Thornton).",
    tags: ["bootstrap"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF4-PROF-013",
    topic: "UF4",
    type: "fill",
    prompt: "¿Qué enfoque sigue Bootstrap?",
    answers: ["mobile first", "mobile-first"],
    explanation: "Bootstrap es mobile-first.",
    tags: ["bootstrap", "responsive"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF4-PROF-014",
    topic: "UF4",
    type: "fill",
    prompt: "¿Qué sistema de maquetación utiliza Bootstrap?",
    answers: ["grid", "sistema de rejilla", "grid system"],
    explanation: "Bootstrap usa un sistema de rejilla (grid) para layout.",
    tags: ["bootstrap", "grid"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF4-PROF-015",
    topic: "UF4",
    type: "fill",
    prompt: "¿Qué archivo permite personalizar Bootstrap?",
    answers: [
      "scss/_variables.scss",
      "_variables.scss",
      "variables scss",
      "custom.scss"
    ],
    explanation: "En Bootstrap (Sass) se personaliza mediante variables SCSS y builds custom. (Puede variar por versión/configuración).",
    tags: ["bootstrap", "sass", "revisar"],
    difficulty: 4,
    source: "profesor"
  },
  {
    id: "UF4-PROF-016",
    topic: "UF4",
    type: "fill",
    prompt: "¿Qué framework se basa en clases de utilidad?",
    answers: ["tailwind css", "tailwind"],
    explanation: "Tailwind CSS es utility-first (clases de utilidad).",
    tags: ["tailwind", "frameworks"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF4-PROF-017",
    topic: "UF4",
    type: "fill",
    prompt: "¿Qué framework no incluye JavaScript por defecto?",
    answers: ["bulma"],
    explanation: "Bulma es un framework CSS sin JavaScript por defecto.",
    tags: ["bulma", "frameworks"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF4-PROF-018",
    topic: "UF4",
    type: "fill",
    prompt: "¿Qué ventaja principal tiene Foundation?",
    answers: [
      "flexibilidad",
      "enfoque profesional y personalizable",
      "framework avanzado para proyectos grandes"
    ],
    explanation: "Foundation suele destacarse por flexibilidad y enfoque profesional (puede variar según temario).",
    tags: ["foundation", "revisar"],
    difficulty: 4,
    source: "profesor"
  },
  {
    id: "UF4-PROF-019",
    topic: "UF4",
    type: "fill",
    prompt: "¿Qué criterio es importante al elegir un framework CSS?",
    answers: [
      "tamaño rendimiento comunidad documentación",
      "compatibilidad y mantenimiento",
      "curva de aprendizaje y necesidades del proyecto"
    ],
    explanation: "Criterios: comunidad, soporte, rendimiento, componentes, compatibilidad, necesidades del proyecto.",
    tags: ["frameworks", "arquitectura"],
    difficulty: 3,
    source: "profesor"
  },

  // =========================================================
  // TEMA 5 (UF5) Multimedia
  // =========================================================
  {
    id: "UF5-PROF-001",
    topic: "UF5",
    type: "fill",
    prompt: "¿Qué se considera contenido multimedia en una web?",
    answers: ["audio video imagenes animaciones", "audio vídeo imágenes animaciones", "audio y video", "audio y vídeo"],
    explanation: "Multimedia: audio, vídeo, imágenes, animaciones, etc.",
    tags: ["multimedia"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF5-PROF-002",
    topic: "UF5",
    type: "fill",
    prompt: "¿Cómo permite HTML5 incluir contenido multimedia?",
    answers: ["con las etiquetas audio y video", "con <audio> y <video>", "con etiquetas nativas multimedia"],
    explanation: "HTML5 incluye etiquetas nativas como <audio> y <video>.",
    tags: ["html5", "multimedia"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF5-PROF-003",
    topic: "UF5",
    type: "fill",
    prompt: "¿Qué etiqueta HTML se utiliza para audio?",
    answers: ["audio", "<audio>"],
    explanation: "<audio> inserta audio.",
    tags: ["html5", "audio"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF5-PROF-004",
    topic: "UF5",
    type: "fill",
    prompt: "¿Qué etiqueta HTML se utiliza para vídeo?",
    answers: ["video", "<video>"],
    explanation: "<video> inserta vídeo.",
    tags: ["html5", "video"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF5-PROF-005",
    topic: "UF5",
    type: "fill",
    prompt: "¿Qué atributo muestra controles de reproducción?",
    answers: ["controls"],
    explanation: "controls muestra controles nativos.",
    tags: ["html5", "audio", "video"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF5-PROF-006",
    topic: "UF5",
    type: "fill",
    prompt: "¿Qué atributo inicia la reproducción automáticamente?",
    answers: ["autoplay"],
    explanation: "autoplay inicia reproducción automáticamente (con restricciones en navegadores).",
    tags: ["html5", "multimedia"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF5-PROF-007",
    topic: "UF5",
    type: "fill",
    prompt: "¿Qué atributo repite el contenido multimedia?",
    answers: ["loop"],
    explanation: "loop repite en bucle.",
    tags: ["html5", "multimedia"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF5-PROF-008",
    topic: "UF5",
    type: "fill",
    prompt: "¿Qué atributo silencia el audio?",
    answers: ["muted"],
    explanation: "muted silencia audio (muy usado con autoplay).",
    tags: ["html5", "audio", "video"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF5-PROF-009",
    topic: "UF5",
    type: "fill",
    prompt: "¿Qué formato de audio es más compatible con HTML5?",
    answers: ["mp3", "audio/mpeg"],
    explanation: "MP3 suele ser el más ampliamente soportado.",
    tags: ["audio", "formatos"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF5-PROF-010",
    topic: "UF5",
    type: "fill",
    prompt: "¿Qué formato de vídeo es más compatible con navegadores actuales?",
    answers: ["mp4", "h.264", "video/mp4"],
    explanation: "MP4 (H.264/AAC) es el más compatible en general.",
    tags: ["video", "formatos"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF5-PROF-011",
    topic: "UF5",
    type: "fill",
    prompt: "¿Para qué sirve la etiqueta <source>?",
    answers: [
      "para indicar diferentes fuentes o formatos del medio",
      "para ofrecer varios formatos",
      "para definir varias fuentes de audio o vídeo"
    ],
    explanation: "<source> permite múltiples fuentes para que el navegador elija la compatible.",
    tags: ["html5", "multimedia"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF5-PROF-012",
    topic: "UF5",
    type: "fill",
    prompt: "¿Qué ventaja tiene ofrecer varios formatos multimedia?",
    answers: [
      "mejor compatibilidad entre navegadores",
      "asegurar reproducción en distintos navegadores",
      "fallback de formatos"
    ],
    explanation: "Aumenta compatibilidad y reduce fallos por codecs no soportados.",
    tags: ["multimedia", "formatos"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF5-PROF-013",
    topic: "UF5",
    type: "fill",
    prompt: "¿Qué atributo mejora la accesibilidad en vídeos?",
    answers: ["controls", "subtitulos", "captions", "track"],
    explanation: "Accesibilidad: controles y subtítulos (p.ej. con <track> captions).",
    tags: ["video", "accesibilidad"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF5-PROF-014",
    topic: "UF5",
    type: "fill",
    prompt: "¿Para qué sirve la etiqueta <track>?",
    answers: [
      "para añadir subtítulos o pistas de texto",
      "para añadir captions subtitles",
      "para incorporar pistas vtt"
    ],
    explanation: "<track> añade subtítulos, captions, descripciones, etc. (WebVTT).",
    tags: ["video", "accesibilidad"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF5-PROF-015",
    topic: "UF5",
    type: "fill",
    prompt: "¿Qué tipo de imagen es SVG?",
    answers: ["vectorial", "imagen vectorial", "gráfico vectorial"],
    explanation: "SVG es un formato vectorial.",
    tags: ["imagenes", "svg"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF5-PROF-016",
    topic: "UF5",
    type: "fill",
    prompt: "¿Qué formato de imagen es más adecuado para fotografías?",
    answers: ["jpeg", "jpg"],
    explanation: "JPG/JPEG es común para fotos por compresión con pérdida.",
    tags: ["imagenes", "formatos"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF5-PROF-017",
    topic: "UF5",
    type: "fill",
    prompt: "¿Qué formato de imagen soporta transparencias?",
    answers: ["png", "gif", "webp"],
    explanation: "PNG soporta transparencia (alpha); también GIF (limitado) y WebP.",
    tags: ["imagenes", "formatos"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF5-PROF-018",
    topic: "UF5",
    type: "fill",
    prompt: "¿Qué atributo HTML es clave para la accesibilidad de imágenes?",
    answers: ["alt", "atributo alt", "alt="],
    explanation: "alt aporta texto alternativo.",
    tags: ["imagenes", "accesibilidad", "html"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF5-PROF-019",
    topic: "UF5",
    type: "fill",
    prompt: "¿Qué problema puede causar un uso inadecuado de multimedia?",
    answers: [
      "bajo rendimiento",
      "carga lenta",
      "consumo excesivo de datos",
      "problemas de accesibilidad"
    ],
    explanation: "Multimedia pesada: rendimiento, consumo de datos y posibles barreras de accesibilidad.",
    tags: ["multimedia", "rendimiento", "accesibilidad"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF5-PROF-020",
    topic: "UF5",
    type: "fill",
    prompt: "¿Qué buena práctica se recomienda al usar multimedia en la web?",
    answers: [
      "optimizar archivos",
      "usar formatos adecuados y compresión",
      "ofrecer controles y subtítulos cuando proceda",
      "cargar de forma eficiente"
    ],
    explanation: "Optimizar, ofrecer formatos, accesibilidad (subtítulos), y evitar cargas innecesarias.",
    tags: ["multimedia", "buenas-practicas"],
    difficulty: 3,
    source: "profesor"
  },

  // =========================================================
  // TEMA 6 (UF6) Eventos y DOM
  // =========================================================
  {
    id: "UF6-PROF-001",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué es un evento en una página web?",
    answers: [
      "una acción o suceso detectado por el navegador",
      "un suceso como click teclado carga",
      "una interacción que dispara código"
    ],
    explanation: "Evento: suceso (usuario o navegador) que puede disparar un manejador.",
    tags: ["js", "eventos"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF6-PROF-002",
    topic: "UF6",
    type: "fill",
    prompt: "¿Para qué sirven los eventos en JavaScript?",
    answers: [
      "para reaccionar a acciones del usuario o del navegador",
      "para ejecutar código cuando ocurre algo",
      "para interactividad"
    ],
    explanation: "Permiten interactividad: ejecutar lógica ante clics, teclas, envíos, etc.",
    tags: ["js", "eventos"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF6-PROF-003",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué lenguaje se utiliza para manejar eventos en el navegador?",
    answers: ["javascript", "js"],
    explanation: "En el navegador, se usa JavaScript.",
    tags: ["js"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF6-PROF-004",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué evento se lanza al cargar completamente la página?",
    answers: ["load"],
    explanation: "load se dispara cuando el recurso/página ha terminado de cargar.",
    tags: ["js", "eventos"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF6-PROF-005",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué evento se produce al hacer clic con el ratón?",
    answers: ["click"],
    explanation: "click se dispara con un clic.",
    tags: ["js", "eventos"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF6-PROF-006",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué evento detecta la pulsación de una tecla?",
    answers: ["keydown", "keyup"],
    explanation: "keydown/keyup detectan pulsación/soltado de teclas.",
    tags: ["js", "eventos", "teclado"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF6-PROF-007",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué método permite asociar varios manejadores a un evento?",
    answers: ["addeventlistener", "addEventListener"],
    explanation: "addEventListener permite múltiples manejadores por evento.",
    tags: ["js", "eventos"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF6-PROF-008",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué ventaja tiene addEventListener frente a onclick?",
    answers: [
      "permite varios manejadores",
      "no sobrescribe manejadores anteriores",
      "permite opciones como capture o once"
    ],
    explanation: "addEventListener no pisa otros handlers y permite opciones (captura, once, passive...).",
    tags: ["js", "eventos"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF6-PROF-009",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué propiedad del evento indica la tecla pulsada?",
    answers: ["key", "event.key", "e.key"],
    explanation: "event.key indica la tecla (p.ej. 'Enter', 'a').",
    tags: ["js", "eventos", "teclado"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF6-PROF-010",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué evento se produce al perder el foco un elemento?",
    answers: ["blur"],
    explanation: "blur cuando el elemento pierde el foco.",
    tags: ["js", "eventos", "focus"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF6-PROF-011",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué evento se lanza al enviar un formulario?",
    answers: ["submit"],
    explanation: "submit se dispara al enviar un formulario.",
    tags: ["js", "eventos", "formularios"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF6-PROF-012",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué evento se produce al redimensionar la ventana?",
    answers: ["resize"],
    explanation: "resize al cambiar tamaño de ventana.",
    tags: ["js", "eventos"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF6-PROF-013",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué evento del ratón se lanza al pasar sobre un elemento?",
    answers: ["mouseover", "mouseenter"],
    explanation: "mouseover/mouseenter al entrar con el puntero (difieren en bubbling).",
    tags: ["js", "eventos", "raton"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF6-PROF-014",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué evento se lanza con el botón derecho del ratón?",
    answers: ["contextmenu"],
    explanation: "contextmenu al abrir el menú contextual (botón derecho).",
    tags: ["js", "eventos", "raton"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF6-PROF-015",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué método permite acceder a un elemento por su id?",
    answers: ["getelementbyid", "getElementById"],
    explanation: "document.getElementById('id').",
    tags: ["dom", "js"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF6-PROF-016",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué método devuelve solo el primer elemento coincidente?",
    answers: ["queryselector", "querySelector"],
    explanation: "document.querySelector() devuelve el primer match.",
    tags: ["dom", "js"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF6-PROF-017",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué método devuelve todos los elementos coincidentes?",
    answers: ["queryselectorall", "querySelectorAll"],
    explanation: "document.querySelectorAll() devuelve una NodeList con todos los matches.",
    tags: ["dom", "js"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF6-PROF-018",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué propiedad permite acceder a estilos en línea?",
    answers: ["style", "element.style"],
    explanation: "element.style accede a estilos inline del elemento.",
    tags: ["dom", "css", "js"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF6-PROF-019",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué método devuelve los estilos calculados por el navegador?",
    answers: ["getcomputedstyle", "getComputedStyle"],
    explanation: "getComputedStyle(element) devuelve estilos finales calculados.",
    tags: ["dom", "css", "js"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF6-PROF-020",
    topic: "UF6",
    type: "fill",
    prompt: "¿Cómo son los estilos obtenidos con getComputedStyle?",
    answers: [
      "los estilos finales calculados",
      "valores calculados en formato computado",
      "incluyen herencia y css aplicado"
    ],
    explanation: "Son valores computados (resultado de cascada, herencia y cálculo).",
    tags: ["dom", "css", "js"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF6-PROF-021",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué propiedad permite cambiar la clase de un elemento?",
    answers: ["classlist", "classList", "className"],
    explanation: "classList (add/remove/toggle) o className.",
    tags: ["dom", "js"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF6-PROF-022",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué evento se lanza al escribir en un input?",
    answers: ["input"],
    explanation: "input se dispara cuando cambia el valor mientras escribes.",
    tags: ["js", "eventos", "formularios"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF6-PROF-023",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué evento se produce al seleccionar texto?",
    answers: ["select"],
    explanation: "select se dispara al seleccionar texto en input/textarea.",
    tags: ["js", "eventos"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF6-PROF-024",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué propiedad indica el botón del ratón pulsado?",
    answers: ["button", "event.button", "e.button"],
    explanation: "event.button indica qué botón (0 izq, 1 medio, 2 dcho).",
    tags: ["js", "eventos", "raton"],
    difficulty: 4,
    source: "profesor"
  },
  {
    id: "UF6-PROF-025",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué coordenada tiene en cuenta el scroll de la página?",
    answers: ["pagex", "pagey", "pageX", "pageY"],
    explanation: "pageX/pageY incluyen el scroll (respecto al documento).",
    tags: ["js", "eventos", "coordenadas"],
    difficulty: 4,
    source: "profesor"
  },
  {
    id: "UF6-PROF-026",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué coordenada se refiere a la ventana visible?",
    answers: ["clientx", "clienty", "clientX", "clientY"],
    explanation: "clientX/clientY son relativas al viewport (ventana visible).",
    tags: ["js", "eventos", "coordenadas"],
    difficulty: 4,
    source: "profesor"
  },
  {
    id: "UF6-PROF-027",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué evento se lanza al reiniciar un formulario?",
    answers: ["reset"],
    explanation: "reset se dispara al resetear un formulario.",
    tags: ["js", "eventos", "formularios"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF6-PROF-028",
    topic: "UF6",
    type: "fill",
    prompt: "¿Cómo se puede cambiar una hoja de estilos completa?",
    answers: [
      "cambiando el href de un link",
      "modificando el href del link rel stylesheet",
      "sustituyendo la hoja css enlazada"
    ],
    explanation: "Se puede cambiar el href del <link rel=\"stylesheet\"> o alternar hojas con disabled.",
    tags: ["dom", "css", "js"],
    difficulty: 4,
    source: "profesor"
  },
  {
    id: "UF6-PROF-029",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué evento se produce al mover el ratón?",
    answers: ["mousemove"],
    explanation: "mousemove se dispara al mover el puntero.",
    tags: ["js", "eventos", "raton"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF6-PROF-030",
    topic: "UF6",
    type: "fill",
    prompt: "¿Qué buena práctica se recomienda al trabajar con eventos?",
    answers: [
      "usar addEventListener",
      "evitar demasiados listeners y usar delegación",
      "eliminar listeners cuando no se necesiten"
    ],
    explanation: "Buenas prácticas: addEventListener, delegación, limpiar listeners, evitar trabajo pesado en handlers.",
    tags: ["js", "eventos", "buenas-practicas"],
    difficulty: 4,
    source: "profesor"
  },

  // =========================================================
  // TEMA 7 (UF7) Accesibilidad (WCAG, POUR, ARIA)
  // =========================================================
  {
    id: "UF7-PROF-001",
    topic: "UF7",
    type: "fill",
    prompt: "¿Qué es la accesibilidad web?",
    answers: [
      "que la web pueda ser usada por todas las personas",
      "diseñar para que todos puedan acceder y usar",
      "eliminar barreras para usuarios con discapacidad"
    ],
    explanation: "Accesibilidad = posibilidad de uso por el mayor número de personas, incl. discapacidades.",
    tags: ["accesibilidad"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF7-PROF-002",
    topic: "UF7",
    type: "fill",
    prompt: "¿A quién beneficia la accesibilidad web?",
    answers: ["a todos", "a todas las personas", "a todos los usuarios"],
    explanation: "Beneficia a todos: discapacidades, mayores, móviles, entornos difíciles, etc.",
    tags: ["accesibilidad"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF7-PROF-003",
    topic: "UF7",
    type: "fill",
    prompt: "¿Qué organismo define las WCAG?",
    answers: ["w3c", "wai", "w3c (wai)"],
    explanation: "WCAG las publica W3C (WAI).",
    tags: ["wcag", "w3c"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF7-PROF-004",
    topic: "UF7",
    type: "fill",
    prompt: "¿Qué son las WCAG?",
    answers: ["pautas de accesibilidad web", "web content accessibility guidelines", "guías de accesibilidad web"],
    explanation: "WCAG = Web Content Accessibility Guidelines.",
    tags: ["wcag", "accesibilidad"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF7-PROF-005",
    topic: "UF7",
    type: "fill",
    prompt: "¿Qué significan las siglas POUR?",
    answers: [
      "perceptible operable understandable robust",
      "perceptible operable understandable robusto",
      "perceptible operable understandable robust"
    ],
    explanation: "POUR: Perceptible, Operable, Understandable, Robust.",
    tags: ["wcag", "pour"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF7-PROF-006",
    topic: "UF7",
    type: "fill",
    prompt: "¿Qué implica que un contenido sea perceptible?",
    answers: [
      "que pueda percibirse por los sentidos",
      "que sea presentable a los usuarios de forma que puedan percibirlo",
      "que tenga alternativas como texto para imágenes"
    ],
    explanation: "Perceptible: la info debe poder percibirse (texto alternativo, subtítulos, contraste...).",
    tags: ["pour", "accesibilidad"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF7-PROF-007",
    topic: "UF7",
    type: "fill",
    prompt: "¿Qué principio POUR se relaciona con el teclado?",
    answers: ["operable", "operable (operable)"],
    explanation: "Operable: componentes operables (incl. teclado).",
    tags: ["pour", "teclado"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF7-PROF-008",
    topic: "UF7",
    type: "fill",
    prompt: "¿Qué principio POUR exige que el contenido sea entendible?",
    answers: ["understandable"],
    explanation: "Understandable: contenido e interfaz comprensibles.",
    tags: ["pour"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF7-PROF-009",
    topic: "UF7",
    type: "fill",
    prompt: "¿Qué principio POUR se centra en la compatibilidad futura?",
    answers: ["robust"],
    explanation: "Robust: compatible con tecnologías de asistencia presentes y futuras.",
    tags: ["pour"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF7-PROF-010",
    topic: "UF7",
    type: "fill",
    prompt: "¿Qué atributo HTML es obligatorio para imágenes accesibles?",
    answers: ["alt", "atributo alt", "alt="],
    explanation: "alt debe estar presente (aunque pueda ser vacío si decorativa).",
    tags: ["html", "accesibilidad"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF7-PROF-011",
    topic: "UF7",
    type: "fill",
    prompt: "¿Para qué sirve el atributo alt en una imagen?",
    answers: [
      "para proporcionar texto alternativo",
      "para describir la imagen a lectores de pantalla",
      "para mostrar un texto si no carga la imagen"
    ],
    explanation: "alt ofrece alternativa textual para accesibilidad y fallback.",
    tags: ["html", "accesibilidad"],
    difficulty: 1,
    source: "profesor"
  },
  {
    id: "UF7-PROF-012",
    topic: "UF7",
    type: "fill",
    prompt: "¿Qué etiqueta HTML5 mejora la accesibilidad semántica?",
    answers: ["main", "<main>", "nav", "<nav>", "header", "<header>"],
    explanation: "Las etiquetas semánticas (p.ej. <main>, <nav>) mejoran estructura.",
    tags: ["html5", "semantica"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF7-PROF-013",
    topic: "UF7",
    type: "fill",
    prompt: "¿Qué herramienta permite validar accesibilidad automáticamente?",
    answers: ["lighthouse", "wave", "axe", "axe devtools"],
    explanation: "Herramientas habituales: Lighthouse, WAVE, axe (según enfoque del curso).",
    tags: ["accesibilidad", "herramientas", "revisar"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF7-PROF-014",
    topic: "UF7",
    type: "fill",
    prompt: "¿Qué es ARIA?",
    answers: [
      "accessible rich internet applications",
      "atributos para accesibilidad",
      "wAI-ARIA"
    ],
    explanation: "WAI-ARIA: especificación para roles/estados/propiedades de accesibilidad.",
    tags: ["aria", "accesibilidad"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF7-PROF-015",
    topic: "UF7",
    type: "fill",
    prompt: "¿Cuándo debe usarse ARIA?",
    answers: [
      "cuando la semántica html no es suficiente",
      "cuando no existe un elemento nativo adecuado",
      "para complementar accesibilidad en componentes personalizados"
    ],
    explanation: "Regla: primero HTML nativo; ARIA para complementar cuando hace falta.",
    tags: ["aria", "accesibilidad"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF7-PROF-016",
    topic: "UF7",
    type: "fill",
    prompt: "¿Qué atributo ARIA define el rol de un elemento?",
    answers: ["role", "role="],
    explanation: "role define el rol accesible del elemento.",
    tags: ["aria"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF7-PROF-017",
    topic: "UF7",
    type: "fill",
    prompt: "¿Qué atributo ARIA oculta contenido a lectores de pantalla?",
    answers: ["aria-hidden", "aria-hidden=\"true\"", "aria hidden"],
    explanation: "aria-hidden=\"true\" oculta a tecnologías de asistencia (ojo: no oculta visualmente).",
    tags: ["aria"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF7-PROF-018",
    topic: "UF7",
    type: "fill",
    prompt: "¿Por qué es importante el contraste de color?",
    answers: [
      "mejora la legibilidad",
      "permite leer a personas con baja visión",
      "evita barreras de lectura"
    ],
    explanation: "Contraste suficiente mejora legibilidad y accesibilidad (baja visión, pantallas con brillo...).",
    tags: ["accesibilidad", "contraste"],
    difficulty: 2,
    source: "profesor"
  },
  {
    id: "UF7-PROF-019",
    topic: "UF7",
    type: "fill",
    prompt: "¿Qué problema tiene usar solo color para transmitir información?",
    answers: [
      "personas con daltonismo pueden no distinguirlo",
      "no es accesible para daltónicos",
      "se pierde la información si no se percibe el color"
    ],
    explanation: "Debe haber redundancia (texto/íconos/patrones), no solo color.",
    tags: ["accesibilidad", "color"],
    difficulty: 3,
    source: "profesor"
  },
  {
    id: "UF7-PROF-020",
    topic: "UF7",
    type: "fill",
    prompt: "¿Qué buena práctica mejora la accesibilidad en formularios?",
    answers: [
      "usar label asociado al input",
      "usar <label> con for",
      "proporcionar mensajes de error claros"
    ],
    explanation: "Asociar <label> e inputs, ayudas, validación clara y foco.",
    tags: ["accesibilidad", "formularios"],
    difficulty: 3,
    source: "profesor"
  }
];

/* Para tooling externo opcional */
window.__QBANK__ = { TOPICS, QUESTIONS };
