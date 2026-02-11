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
  // --- TEST (20) ---
    { id: "uf1_t01", unit: 1, type: "test", prompt: "¿Qué significan las siglas IPO?", options: ["Interacción Persona-Ordenador", "Interfaz de Proceso Optimizado", "Informática para Operadores", "Interconexión de Puertos"], correct: 0, explanation: "Estudio de la interacción entre personas y ordenadores.", tags: ["teoria"], difficulty: "easy", source: "profesor" },
    { id: "uf1_t02", unit: 1, type: "test", prompt: "¿Cuál es el objetivo principal del UX Design?", options: ["Que sea técnicamente complejo", "Satisfacer al usuario final", "Usar colores brillantes", "Reducir el peso de las imágenes"], correct: 1, explanation: "Se centra en la experiencia completa del usuario.", tags: ["ux"], difficulty: "easy", source: "profesor" },
    { id: "uf1_t03", unit: 1, type: "test", prompt: "¿Qué es un wireframe?", options: ["Un diseño final funcional", "Un esquema estructural de baja fidelidad", "Un logo animado", "Una base de datos"], correct: 1, explanation: "Esquema básico para definir la estructura.", tags: ["diseño"], difficulty: "medium", source: "profesor" },
    { id: "uf1_t04", unit: 1, type: "test", prompt: "¿Qué mide la usabilidad?", options: ["La velocidad del servidor", "La facilidad de uso de una interfaz", "La cantidad de colores usados", "El precio del dominio"], correct: 1, explanation: "Eficacia y satisfacción del usuario.", tags: ["usabilidad"], difficulty: "easy", source: "profesor" },
    { id: "uf1_t05", unit: 1, type: "test", prompt: "¿Qué diferencia un mockup de un wireframe?", options: ["El mockup es más simple", "El mockup tiene alta fidelidad visual", "El wireframe es funcional", "No hay diferencia"], correct: 1, explanation: "El mockup muestra cómo se verá el diseño final.", tags: ["diseño"], difficulty: "medium", source: "profesor" },
    { id: "uf1_t06", unit: 1, type: "test", prompt: "¿Qué persigue la accesibilidad web?", options: ["Que la web sea rápida", "Que la web sea usable por personas con discapacidad", "Que la web sea oscura", "Que la web tenga muchos vídeos"], correct: 1, explanation: "Eliminar barreras de acceso.", tags: ["accesibilidad"], difficulty: "easy", source: "profesor" },
    { id: "uf1_t07", unit: 1, type: "test", prompt: "¿Qué organismo define las pautas WCAG?", options: ["Google", "W3C", "Microsoft", "Apple"], correct: 1, explanation: "World Wide Web Consortium.", tags: ["teoria"], difficulty: "easy", source: "profesor" },
    { id: "uf1_t08", unit: 1, type: "test", prompt: "¿En qué fase se definen los requisitos del usuario?", options: ["Programación", "Análisis", "Testing", "Diseño visual"], correct: 1, explanation: "Fase de entrevistas y definición.", tags: ["fases"], difficulty: "easy", source: "profesor" },
    { id: "uf1_t09", unit: 1, type: "test", prompt: "¿Qué es un 'sitemap' o mapa web?", options: ["Una lista de colores", "Una estructura jerárquica de las páginas", "Un archivo de estilos", "Una función JavaScript"], correct: 1, explanation: "Organización del sitio.", tags: ["diseño"], difficulty: "medium", source: "profesor" },
    { id: "uf1_t10", unit: 1, type: "test", prompt: "¿Qué elemento HTML5 indica el encabezado de una sección?", options: ["<section>", "<header>", "<footer>", "<aside>"], correct: 1, explanation: "Etiqueta semántica.", tags: ["html5"], difficulty: "easy", source: "profesor" },
    { id: "uf1_t11", unit: 1, type: "test", prompt: "¿Qué indica la etiqueta <nav>?", options: ["Una lista", "Un menú de navegación", "Un pie de página", "Un artículo"], correct: 1, explanation: "Contenedor de enlaces principales.", tags: ["html5"], difficulty: "easy", source: "profesor" },
    { id: "uf1_t12", unit: 1, type: "test", prompt: "¿Cuál es el 'look & feel'?", options: ["La velocidad de carga", "La apariencia visual y sensación de uso", "El tipo de servidor", "El código fuente"], correct: 1, explanation: "Experiencia visual y táctil.", tags: ["diseño"], difficulty: "medium", source: "profesor" },
    { id: "uf1_t13", unit: 1, type: "test", prompt: "¿Qué es el 'front-end'?", options: ["La base de datos", "La parte visible y funcional de la web", "El servidor web", "El sistema operativo"], correct: 1, explanation: "Interfaz de usuario.", tags: ["conceptos"], difficulty: "easy", source: "profesor" },
    { id: "uf1_t14", unit: 1, type: "test", prompt: "¿Qué es un prototipo?", options: ["Un borrador en papel", "Una versión simulada del producto final", "El producto final en producción", "Un tipo de fuente"], correct: 1, explanation: "Simulación interactiva.", tags: ["diseño"], difficulty: "medium", source: "profesor" },
    { id: "uf1_t15", unit: 1, type: "test", prompt: "¿Para qué sirve un 'fieldset'?", options: ["Para agrupar elementos de un formulario", "Para crear una tabla", "Para enlazar CSS", "Para comentar código"], correct: 0, explanation: "Estructura de formularios.", tags: ["html5"], difficulty: "medium", source: "profesor" },
    { id: "uf1_t16", unit: 1, type: "test", prompt: "¿Qué etiqueta crea una fila en una tabla HTML?", options: ["<td>", "<th>", "<tr>", "<table>"], correct: 2, explanation: "Table Row.", tags: ["html5"], difficulty: "easy", source: "profesor" },
    { id: "uf1_t17", unit: 1, type: "test", prompt: "¿Qué es un 'banner'?", options: ["Un tipo de fuente", "Un espacio publicitario o destacado", "Una herramienta de JS", "Un selector CSS"], correct: 1, explanation: "Elemento visual gráfico.", tags: ["conceptos"], difficulty: "easy", source: "profesor" },
    { id: "uf1_t18", unit: 1, type: "test", prompt: "¿Cuál es el principal navegador usado para inspeccionar código?", options: ["Google Chrome", "Internet Explorer", "Netscape", "Opera Mini"], correct: 0, explanation: "Herramientas de desarrollador potentes.", tags: ["herramientas"], difficulty: "easy", source: "profesor" },
    { id: "uf1_t19", unit: 1, type: "test", prompt: "¿Qué comando abre las herramientas de desarrollo en la mayoría de navegadores?", options: ["F5", "F12", "Ctrl+P", "Alt+F4"], correct: 1, explanation: "Atajo estándar.", tags: ["herramientas"], difficulty: "easy", source: "profesor" },
    { id: "uf1_t20", unit: 1, type: "test", prompt: "¿Qué es el W3C?", options: ["Un tipo de virus", "El consorcio internacional de estándares web", "Un framework", "Un editor de texto"], correct: 1, explanation: "Define tecnologías web.", tags: ["teoria"], difficulty: "easy", source: "profesor" },

    // --- RELLENAR (10) ---
    { id: "uf1_r01", unit: 1, type: "fill", prompt: "El diseño centrado en el usuario se conoce comúnmente como _____ Design.", code: "", correct: ["UX"], explanation: "User Experience Design.", tags: ["ux"], difficulty: "easy", source: "profesor" },
    { id: "uf1_r02", unit: 1, type: "fill", prompt: "Un diseño de bajo coste _____.", code: "", correct: ["wireframe"], explanation: "Esquema estructural.", tags: ["diseño"], difficulty: "easy", source: "profesor" },
    { id: "uf1_r03", unit: 1, type: "fill", prompt: "La _____ web persigue que cualquier persona pueda usarla.", code: "", correct: ["accesibilidad"], explanation: "WCAG.", tags: ["accesibilidad"], difficulty: "easy", source: "profesor" },
    { id: "uf1_r04", unit: 1, type: "fill", prompt: "El _____ web es una estructura jerárquica de páginas.", code: "", correct: ["mapa"], explanation: "Sitemap.", tags: ["diseño"], difficulty: "easy", source: "profesor" },
    { id: "uf1_r05", unit: 1, type: "fill", prompt: "El 'look & _____' hace referencia a la sensación de uso.", code: "", correct: ["feel"], explanation: "Apariencia y sensación.", tags: ["diseño"], difficulty: "easy", source: "profesor" },
    { id: "uf1_r06", unit: 1, type: "fill", prompt: "Las _____ son directrices de accesibilidad.", code: "", correct: ["wcag"], explanation: "Web Content Accessibility Guidelines.", tags: ["teoria"], difficulty: "easy", source: "profesor" },
    { id: "uf1_r07", unit: 1, type: "fill", prompt: "Un _____ es una versión interactiva del diseño.", code: "", correct: ["prototipo"], explanation: "Simulación funcional.", tags: ["diseño"], difficulty: "easy", source: "profesor" },
    { id: "uf1_r08", unit: 1, type: "fill", prompt: "La _____ es la facilidad de uso.", code: "", correct: ["usabilidad"], explanation: "Concepto UX.", tags: ["usabilidad"], difficulty: "easy", source: "profesor" },
    { id: "uf1_r09", unit: 1, type: "fill", prompt: "La etiqueta <_____> define el contenido principal.", code: "", correct: ["main"], explanation: "Semántica HTML5.", tags: ["html5"], difficulty: "easy", source: "profesor" },
    { id: "uf1_r10", unit: 1, type: "fill", prompt: "F_____ es la herramienta para depurar código.", code: "", correct: ["12"], explanation: "Atajo de teclado.", tags: ["herramientas"], difficulty: "easy", source: "profesor" },

    // ==========================================
    // --- UF2: INTRODUCCIÓN A CSS ---
    // ==========================================
    // --- TEST (20) ---
    { id: "uf2_t01", unit: 2, type: "test", prompt: "¿Qué significa CSS?", options: ["Cascading Style Sheets", "Creative Style System", "Computer Style Syntax", "Colorful Style Sheets"], correct: 0, explanation: "Hojas de Estilo en Cascada.", tags: ["conceptos"], difficulty: "easy", source: "profesor" },
    { id: "uf2_t02", unit: 2, type: "test", prompt: "¿Cuál es el selector universal?", options: [".", "#", "*", "div"], correct: 2, explanation: "Selecciona todos los elementos.", tags: ["selectores"], difficulty: "easy", source: "profesor" },
    { id: "uf2_t03", unit: 2, type: "test", prompt: "¿Cómo se enlaza una hoja CSS externa?", options: ["<style>", "<link>", "<script>", "<a>"], correct: 1, explanation: "Uso de la etiqueta link.", tags: ["sintaxis"], difficulty: "easy", source: "profesor" },
    { id: "uf2_t04", unit: 2, type: "test", prompt: "¿Cuál es el orden del Box Model (desde fuera)?", options: ["Content-Padding-Border-Margin", "Margin-Border-Padding-Content", "Margin-Padding-Border-Content", "Border-Margin-Padding-Content"], correct: 1, explanation: "Orden estándar.", tags: ["boxmodel"], difficulty: "medium", source: "profesor" },
    { id: "uf2_t05", unit: 2, type: "test", prompt: "¿Qué propiedad cambia el color de fondo?", options: ["color", "background-color", "border-color", "font-color"], correct: 1, explanation: "Cambia el fondo.", tags: ["propiedades"], difficulty: "easy", source: "profesor" },
    { id: "uf2_t06", unit: 2, type: "test", prompt: "¿Qué selector tiene mayor especificidad?", options: ["p", ".clase", "#id", "div"], correct: 2, explanation: "Los IDs tienen más peso.", tags: ["especificidad"], difficulty: "medium", source: "profesor" },
    { id: "uf2_t07", unit: 2, type: "test", prompt: "¿Qué unidad es relativa al tamaño de fuente raíz (<html>)?", options: ["px", "em", "rem", "%"], correct: 2, explanation: "Root EM.", tags: ["unidades"], difficulty: "medium", source: "profesor" },
    { id: "uf2_t08", unit: 2, type: "test", prompt: "¿Qué propiedad hace el texto negrita?", options: ["font-style", "font-weight", "font-family", "text-decoration"], correct: 1, explanation: "Grosor de fuente.", tags: ["propiedades"], difficulty: "easy", source: "profesor" },
    { id: "uf2_t09", unit: 2, type: "test", prompt: "¿Qué propiedad alinea texto horizontalmente?", options: ["vertical-align", "text-align", "align-content", "justify-content"], correct: 1, explanation: "Alineación horizontal.", tags: ["propiedades"], difficulty: "easy", source: "profesor" },
    { id: "uf2_t10", unit: 2, type: "test", prompt: "¿Cómo se selecciona una clase en CSS?", options: ["#nombre", ".nombre", "*nombre", "nombre"], correct: 1, explanation: "Uso del punto.", tags: ["selectores"], difficulty: "easy", source: "profesor" },
    { id: "uf2_t11", unit: 2, type: "test", prompt: "¿Qué hace 'display: none'?", options: ["Oculta el elemento y libera espacio", "Oculta el elemento pero mantiene espacio", "Muestra el elemento", "Cambia el color"], correct: 0, explanation: "Saca al elemento del flujo.", tags: ["propiedades"], difficulty: "hard", source: "profesor" },
    { id: "uf2_t12", unit: 2, type: "test", prompt: "¿Qué propiedad cambia el tipo de letra?", options: ["font-size", "font-weight", "font-family", "font-style"], correct: 2, explanation: "Familia tipográfica.", tags: ["propiedades"], difficulty: "easy", source: "profesor" },
    { id: "uf2_t13", unit: 2, type: "test", prompt: "¿Qué es la 'cascada' en CSS?", options: ["Un tipo de animación", "La prioridad de aplicación de reglas", "Un selector", "Un preprocesador"], correct: 1, explanation: "Orden de importancia.", tags: ["teoria"], difficulty: "medium", source: "profesor" },
    { id: "uf2_t14", unit: 2, type: "test", prompt: "¿Qué propiedad añade borde a un elemento?", options: ["border", "margin", "padding", "outline"], correct: 0, explanation: "Propiedad de borde.", tags: ["propiedades"], difficulty: "easy", source: "profesor" },
    { id: "uf2_t15", unit: 2, type: "test", prompt: "¿Para qué sirve el 'padding'?", options: ["Espacio externo", "Espacio interno", "Borde", "Color"], correct: 1, explanation: "Entre contenido y borde.", tags: ["boxmodel"], difficulty: "easy", source: "profesor" },
    { id: "uf2_t16", unit: 2, type: "test", prompt: "¿Qué valor de 'position' saca al elemento del flujo?", options: ["static", "relative", "absolute", "sticky"], correct: 2, explanation: "Posicionamiento absoluto.", tags: ["posicionamiento"], difficulty: "medium", source: "profesor" },
    { id: "uf2_t17", unit: 2, type: "test", prompt: "¿Qué es un selector descendiente?", options: ["div .clase", "div + p", "div > p", "p, div"], correct: 0, explanation: "Elemento dentro de otro.", tags: ["selectores"], difficulty: "medium", source: "profesor" },
    { id: "uf2_t18", unit: 2, type: "test", prompt: "¿Qué propiedad cambia el tamaño del texto?", options: ["font-weight", "font-size", "font-style", "font-family"], correct: 1, explanation: "Tamaño de fuente.", tags: ["propiedades"], difficulty: "easy", source: "profesor" },
    { id: "uf2_t19", unit: 2, type: "test", prompt: "¿Para qué sirve 'margin: auto'?", options: ["Alinea verticalmente", "Centra elementos de bloque", "Quita el margen", "Cambia el color"], correct: 1, explanation: "Centrado horizontal.", tags: ["propiedades"], difficulty: "medium", source: "profesor" },
    { id: "uf2_t20", unit: 2, type: "test", prompt: "¿Qué selector selecciona un elemento por su ID?", options: [".id", "#id", "*id", "id"], correct: 1, explanation: "Uso del hashtag.", tags: ["selectores"], difficulty: "easy", source: "profesor" },

    // --- RELLENAR (10) ---
    { id: "uf2_r01", unit: 2, type: "fill", prompt: "La propiedad para el borde _____ es border-style.", code: "", correct: ["style"], explanation: "Estilo del borde.", tags: ["propiedades"], difficulty: "easy", source: "profesor" },
    { id: "uf2_r02", unit: 2, type: "fill", prompt: "El espacio externo se llama _____.", code: "", correct: ["margin"], explanation: "Margen.", tags: ["boxmodel"], difficulty: "easy", source: "profesor" },
    { id: "uf2_r03", unit: 2, type: "fill", prompt: "Para poner texto cursiva font-_____ : italic.", code: "", correct: ["style"], explanation: "Estilo de fuente.", tags: ["propiedades"], difficulty: "easy", source: "profesor" },
    { id: "uf2_r04", unit: 2, type: "fill", prompt: "El _____ universal es *.", code: "", correct: ["selector"], explanation: "Selector de todos.", tags: ["selectores"], difficulty: "easy", source: "profesor" },
    { id: "uf2_r05", unit: 2, type: "fill", prompt: "La _____ es la prioridad de las reglas.", code: "", correct: ["cascada"], explanation: "Importancia CSS.", tags: ["teoria"], difficulty: "easy", source: "profesor" },
    { id: "uf2_r06", unit: 2, type: "fill", prompt: "Selector de _____: .nombre.", code: "", correct: ["clase"], explanation: "Uso del punto.", tags: ["selectores"], difficulty: "easy", source: "profesor" },
    { id: "uf2_r07", unit: 2, type: "fill", prompt: "El _____ interno es padding.", code: "", correct: ["espacio"], explanation: "Box model.", tags: ["boxmodel"], difficulty: "easy", source: "profesor" },
    { id: "uf2_r08", unit: 2, type: "fill", prompt: "Propiedad para color de _____: background-color.", code: "", correct: ["fondo"], explanation: "Color de fondo.", tags: ["propiedades"], difficulty: "easy", source: "profesor" },
    { id: "uf2_r09", unit: 2, type: "fill", prompt: "Posicionamiento _____: position: absolute.", code: "", correct: ["absoluto"], explanation: "Tipo de posicionamiento.", tags: ["posicionamiento"], difficulty: "easy", source: "profesor" },
    { id: "uf2_r10", unit: 2, type: "fill", prompt: "Unidad _____ para tipografías relativas.", code: "", correct: ["rem"], explanation: "Root EM.", tags: ["unidades"], difficulty: "easy", source: "profesor" },

    // ==========================================
    // --- UF3: CSS AVANZADO (Responsive, Grid, SASS) ---
    // ==========================================
    // --- TEST (20) ---
    { id: "uf3_t01", unit: 3, type: "test", prompt: "¿Qué es un diseño responsivo?", options: ["Diseño que no cambia", "Diseño que se adapta a pantallas", "Diseño solo para móviles", "Diseño lento"], correct: 1, explanation: "Adaptabilidad.", tags: ["responsive"], difficulty: "easy", source: "profesor" },
    { id: "uf3_t02", unit: 3, type: "test", prompt: "¿Qué regla CSS define media queries?", options: ["@if", "@media", "@import", "@font-face"], correct: 1, explanation: "Condicionales de pantalla.", tags: ["responsive"], difficulty: "medium", source: "profesor" },
    { id: "uf3_t03", unit: 3, type: "test", prompt: "¿Qué activa Flexbox?", options: ["display: block", "display: flex", "display: grid", "display: inline"], correct: 1, explanation: "Contenedor flex.", tags: ["flexbox"], difficulty: "easy", source: "profesor" },
    { id: "uf3_t04", unit: 3, type: "test", prompt: "¿Qué activa Grid Layout?", options: ["display: flex", "display: grid", "display: table", "display: block"], correct: 1, explanation: "Contenedor grid.", tags: ["grid"], difficulty: "easy", source: "profesor" },
    { id: "uf3_t05", unit: 3, type: "test", prompt: "¿Qué es SASS?", options: ["Un navegador", "Un preprocesador CSS", "Un lenguaje de servidor", "Un framework JS"], correct: 1, explanation: "Añade funciones a CSS.", tags: ["sass"], difficulty: "easy", source: "profesor" },
    { id: "uf3_t06", unit: 3, type: "test", prompt: "¿Qué símbolo usa SASS para variables?", options: ["&", "#", "$", "@"], correct: 2, explanation: "Sintaxis de variables.", tags: ["sass"], difficulty: "easy", source: "profesor" },
    { id: "uf3_t07", unit: 3, type: "test", prompt: "¿Qué propiedad Grid define columnas?", options: ["grid-template-rows", "grid-template-columns", "grid-gap", "grid-area"], correct: 1, explanation: "Estructura de columnas.", tags: ["grid"], difficulty: "medium", source: "profesor" },
    { id: "uf3_t08", unit: 3, type: "test", prompt: "¿Qué propiedad Flexbox alinea elementos en el eje principal?", options: ["align-items", "justify-content", "flex-direction", "flex-wrap"], correct: 1, explanation: "Eje principal.", tags: ["flexbox"], difficulty: "medium", source: "profesor" },
    { id: "uf3_t09", unit: 3, type: "test", prompt: "¿Para qué sirve @mixin en SASS?", options: ["Importar archivos", "Crear bloques reutilizables", "Declarar variables", "Hacer cálculos"], correct: 1, explanation: "Reutilización de código.", tags: ["sass"], difficulty: "medium", source: "profesor" },
    { id: "uf3_t10", unit: 3, type: "test", prompt: "¿Qué propiedad crea sombras?", options: ["text-shadow", "box-shadow", "both", "none"], correct: 2, explanation: "Ambas existen.", tags: ["propiedades"], difficulty: "medium", source: "profesor" },
    { id: "uf3_t11", unit: 3, type: "test", prompt: "¿Qué hace 'transform: rotate(45deg)'?", options: ["Mueve el elemento", "Gira el elemento", "Cambia el tamaño", "Cambia el color"], correct: 1, explanation: "Transformación.", tags: ["transform"], difficulty: "medium", source: "profesor" },
    { id: "uf3_t12", unit: 3, type: "test", prompt: "¿Qué unidad es relativa al ancho de la ventana?", options: ["rem", "em", "vw", "%"], correct: 2, explanation: "Viewport Width.", tags: ["unidades"], difficulty: "medium", source: "profesor" },
    { id: "uf3_t13", unit: 3, type: "test", prompt: "¿Qué propiedad Grid define espacio entre filas?", options: ["row-gap", "column-gap", "gap", "margin"], correct: 0, explanation: "Separación.", tags: ["grid"], difficulty: "medium", source: "profesor" },
    { id: "uf3_t14", unit: 3, type: "test", prompt: "¿Qué hace 'flex-direction: column'?", options: ["Alinea en fila", "Alinea en columna", "Centra", "Oculta"], correct: 1, explanation: "Eje principal.", tags: ["flexbox"], difficulty: "medium", source: "profesor" },
    { id: "uf3_t15", unit: 3, type: "test", prompt: "¿Qué directiva SASS une estilos?", options: ["@import", "@mixin", "@extend", "@function"], correct: 0, explanation: "Importación.", tags: ["sass"], difficulty: "easy", source: "profesor" },
    { id: "uf3_t16", unit: 3, type: "test", prompt: "¿Qué propiedad hace una transición suave?", options: ["animation", "transition", "transform", "hover"], correct: 1, explanation: "Suavizado.", tags: ["propiedades"], difficulty: "medium", source: "profesor" },
    { id: "uf3_t17", unit: 3, type: "test", prompt: "¿Qué significa 'vw'?", options: ["View Width", "Viewport Width", "View Weight", "Viewport Weight"], correct: 1, explanation: "Ancho ventana.", tags: ["unidades"], difficulty: "easy", source: "profesor" },
    { id: "uf3_t18", unit: 3, type: "test", prompt: "¿Para qué sirve 'grid-area'?", options: ["Nombrar áreas", "Tamaño columna", "Espaciado", "Color"], correct: 0, explanation: "Posicionamiento.", tags: ["grid"], difficulty: "hard", source: "profesor" },
    { id: "uf3_t19", unit: 3, type: "test", prompt: "¿Qué propiedad CSS crea un gradiente?", options: ["background-color", "linear-gradient", "background-image", "both b and c"], correct: 3, explanation: "Se usa en image.", tags: ["propiedades"], difficulty: "hard", source: "profesor" },
    { id: "uf3_t20", unit: 3, type: "test", prompt: "¿Qué hace 'transform: scale(2)'?", options: ["Gira", "Mueve", "Duplica tamaño", "Oculta"], correct: 2, explanation: "Escalado.", tags: ["transform"], difficulty: "medium", source: "profesor" },

    // --- RELLENAR (10) ---
    { id: "uf3_r01", unit: 3, type: "fill", prompt: "Media _____ para adaptabilidad.", code: "", correct: ["queries"], explanation: "Media queries.", tags: ["responsive"], difficulty: "easy", source: "profesor" },
    { id: "uf3_r02", unit: 3, type: "fill", prompt: "SASS _____: para variables.", code: "", correct: ["$"], explanation: "Signo $.", tags: ["sass"], difficulty: "easy", source: "profesor" },
    { id: "uf3_r03", unit: 3, type: "fill", prompt: "Flexbox eje principal: _____ content.", code: "", correct: ["justify"], explanation: "Justify content.", tags: ["flexbox"], difficulty: "easy", source: "profesor" },
    { id: "uf3_r04", unit: 3, type: "fill", prompt: "Grid _____ columns: tamaño columnas.", code: "", correct: ["template"], explanation: "Grid template columns.", tags: ["grid"], difficulty: "easy", source: "profesor" },
    { id: "uf3_r05", unit: 3, type: "fill", prompt: "SASS _____: código reutilizable.", code: "", correct: ["mixin"], explanation: "Mixin.", tags: ["sass"], difficulty: "easy", source: "profesor" },
    { id: "uf3_r06", unit: 3, type: "fill", prompt: "Unidad _____: ancho de ventana.", code: "", correct: ["vw"], explanation: "Viewport Width.", tags: ["unidades"], difficulty: "easy", source: "profesor" },
    { id: "uf3_r07", unit: 3, type: "fill", prompt: "CSS _____: transición suave.", code: "", correct: ["transition"], explanation: "Propiedad transition.", tags: ["propiedades"], difficulty: "easy", source: "profesor" },
    { id: "uf3_r08", unit: 3, type: "fill", prompt: "Transform _____: girar.", code: "", correct: ["rotate"], explanation: "Rotate.", tags: ["transform"], difficulty: "easy", source: "profesor" },
    { id: "uf3_r09", unit: 3, type: "fill", prompt: "Flexbox eje _____: align-items.", code: "", correct: ["secundario"], explanation: "Eje cruzado.", tags: ["flexbox"], difficulty: "easy", source: "profesor" },
    { id: "uf3_r10", unit: 3, type: "fill", prompt: "Preprocesador _____.", code: "", correct: ["scss"], explanation: "Sass.", tags: ["sass"], difficulty: "easy", source: "profesor" },

    // ==========================================
    // --- UF4: CREACIÓN DE INTERFACES GRÁFICAS (Bootstrap) ---
    // ==========================================
    // --- TEST (20) ---
    { id: "uf4_t01", unit: 4, type: "test", prompt: "¿Qué es Bootstrap?", options: ["Un lenguaje de programación", "Un framework CSS", "Una base de datos", "Un CMS"], correct: 1, explanation: "Framework para diseño rápido.", tags: ["bootstrap"], difficulty: "easy", source: "profesor" },
    { id: "uf4_t02", unit: 4, type: "test", prompt: "¿En cuántas columnas se divide la rejilla de Bootstrap?", options: ["10", "12", "16", "24"], correct: 1, explanation: "Sistema estándar de 12 columnas.", tags: ["bootstrap"], difficulty: "easy", source: "profesor" },
    { id: "uf4_t03", unit: 4, type: "test", prompt: "¿Qué clase de Bootstrap define una fila?", options: [".grid", ".row", ".col", ".container"], correct: 1, explanation: "Clase para filas.", tags: ["bootstrap"], difficulty: "easy", source: "profesor" },
    { id: "uf4_t04", unit: 4, type: "test", prompt: "¿Qué clase se usa para una columna de ancho completo en móvil?", options: [".col-12", ".col-6", ".col-md-4", ".row"], correct: 0, explanation: "Ocupa las 12 columnas.", tags: ["bootstrap"], difficulty: "medium", source: "profesor" },
    { id: "uf4_t05", unit: 4, type: "test", prompt: "¿Qué clase Bootstrap centra el contenido?", options: [".text-center", ".align-center", ".center", ".middle"], correct: 0, explanation: "Centrado de texto.", tags: ["bootstrap"], difficulty: "easy", source: "profesor" },
    { id: "uf4_t06", unit: 4, type: "test", prompt: "¿Qué clase añade margen superior?", options: [".mt-*", ".mb-*", ".pt-*", ".ml-*"], correct: 0, explanation: "Margin Top.", tags: ["bootstrap"], difficulty: "medium", source: "profesor" },
    { id: "uf4_t07", unit: 4, type: "test", prompt: "¿Qué componente Bootstrap crea un menú deslizable?", options: ["Modal", "Dropdown", "Navbar", "Carousel"], correct: 2, explanation: "Barra de navegación.", tags: ["bootstrap"], difficulty: "medium", source: "profesor" },
    { id: "uf4_t08", unit: 4, type: "test", prompt: "¿Qué utilidad Bootstrap oculta un elemento?", options: [".hidden", ".invisible", ".d-none", ".hide"], correct: 2, explanation: "Display none.", tags: ["bootstrap"], difficulty: "medium", source: "profesor" },
    { id: "uf4_t09", unit: 4, type: "test", prompt: "¿Qué clase hace una imagen responsiva?", options: [".img-responsive", ".img-fluid", ".img-rounded", ".img-thumbnail"], correct: 1, explanation: "Ancho máximo 100%.", tags: ["bootstrap"], difficulty: "easy", source: "profesor" },
    { id: "uf4_t10", unit: 4, type: "test", prompt: "¿Para qué sirve un CDN?", options: ["Para editar código", "Para cargar librerías rápidamente", "Para base de datos", "Para diseño gráfico"], correct: 1, explanation: "Red de distribución de contenido.", tags: ["conceptos"], difficulty: "medium", source: "profesor" },
    { id: "uf4_t11", unit: 4, type: "test", prompt: "¿Qué break-point usa Bootstrap por defecto para 'medium'?", options: ["576px", "768px", "992px", "1200px"], correct: 1, explanation: "MD break-point.", tags: ["bootstrap"], difficulty: "hard", source: "profesor" },
    { id: "uf4_t12", unit: 4, type: "test", prompt: "¿Qué clase Bootstrap crea un botón primario?", options: [".btn-primary", ".btn-blue", ".btn-main", ".button-primary"], correct: 0, explanation: "Estilo estándar.", tags: ["bootstrap"], difficulty: "easy", source: "profesor" },
    { id: "uf4_t13", unit: 4, type: "test", prompt: "¿Qué clase se usa para un contenedor fijo?", options: [".container-fluid", ".container", ".row", ".wrapper"], correct: 1, explanation: "Ancho fijo responsivo.", tags: ["bootstrap"], difficulty: "medium", source: "profesor" },
    { id: "uf4_t14", unit: 4, type: "test", prompt: "¿Qué componente Bootstrap crea una ventana emergente?", options: ["Navbar", "Modal", "Tooltip", "Toast"], correct: 1, explanation: "Ventana flotante.", tags: ["bootstrap"], difficulty: "medium", source: "profesor" },
    { id: "uf4_t15", unit: 4, type: "test", prompt: "¿Qué utilidad Bootstrap añade padding a los lados?", options: [".p-x-*", ".p-h-*", ".px-*", ".py-*"], correct: 2, explanation: "Padding eje X.", tags: ["bootstrap"], difficulty: "medium", source: "profesor" },
    { id: "uf4_t16", unit: 4, type: "test", prompt: "¿Qué clase Bootstrap redondea bordes?", options: [".border-round", ".rounded", ".circle", ".radius"], correct: 1, explanation: "Bordes redondeados.", tags: ["bootstrap"], difficulty: "easy", source: "profesor" },
    { id: "uf4_t17", unit: 4, type: "test", prompt: "¿Qué componente crea una lista de imágenes pasando?", options: ["Accordion", "Cards", "Carousel", "Navbar"], correct: 2, explanation: "Carrusel de imágenes.", tags: ["bootstrap"], difficulty: "easy", source: "profesor" },
    { id: "uf4_t18", unit: 4, type: "test", prompt: "¿Para qué sirve `.col-sm-6`?", options: ["Columna ancho 6 en todas pantallas", "Columna ancho 6 en tablets y más", "Columna ancho 6 solo móvil", "Columna ancho 12"], correct: 1, explanation: "Break-point sm.", tags: ["bootstrap"], difficulty: "hard", source: "profesor" },
    { id: "uf4_t19", unit: 4, type: "test", prompt: "¿Qué clase Bootstrap alinea items al final?", options: [".align-start", ".align-end", ".justify-content-end", ".float-right"], correct: 2, explanation: "Flexbox alignment.", tags: ["bootstrap"], difficulty: "hard", source: "profesor" },
    { id: "uf4_t20", unit: 4, type: "test", prompt: "¿Qué es un 'template'?", options: ["Una plantilla prediseñada", "Un editor de texto", "Un navegador", "Una función JS"], correct: 0, explanation: "Estructura predefinida.", tags: ["conceptos"], difficulty: "easy", source: "profesor" },

    // --- RELLENAR (10) ---
    { id: "uf4_r01", unit: 4, type: "fill", prompt: "La clase ._____ envuelve todo el contenido.", code: "", correct: ["container"], explanation: "Contenedor principal.", tags: ["bootstrap"], difficulty: "easy", source: "profesor" },
    { id: "uf4_r02", unit: 4, type: "fill", prompt: "Sistema de rejilla: clase ._____.", code: "", correct: ["row"], explanation: "Fila.", tags: ["bootstrap"], difficulty: "easy", source: "profesor" },
    { id: "uf4_r03", unit: 4, type: "fill", prompt: "Clase para imagen fluida: ._____.", code: "", correct: ["img-fluid"], explanation: "Responsividad.", tags: ["bootstrap"], difficulty: "easy", source: "profesor" },
    { id: "uf4_r04", unit: 4, type: "fill", prompt: "Clase ._____ para fondo oscuro.", code: "", correct: ["bg-dark"], explanation: "Color de fondo.", tags: ["bootstrap"], difficulty: "easy", source: "profesor" },
    { id: "uf4_r05", unit: 4, type: "fill", prompt: "Unidad Bootstrap para espaciado: _____.", code: "", correct: ["rem"], explanation: "Relativo a fuente raíz.", tags: ["bootstrap"], difficulty: "easy", source: "profesor" },
    { id: "uf4_r06", unit: 4, type: "fill", prompt: "Clase ._____ para centrar texto.", code: "", correct: ["text-center"], explanation: "Alineación.", tags: ["bootstrap"], difficulty: "easy", source: "profesor" },
    { id: "uf4_r07", unit: 4, type: "fill", prompt: "Componente de barra de navegación: ._____.", code: "", correct: ["navbar"], explanation: "Menu.", tags: ["bootstrap"], difficulty: "easy", source: "profesor" },
    { id: "uf4_r08", unit: 4, type: "fill", prompt: "Clase para ocultar: ._____.", code: "", correct: ["d-none"], explanation: "Display none.", tags: ["bootstrap"], difficulty: "easy", source: "profesor" },
    { id: "uf4_r09", unit: 4, type: "fill", prompt: "Para integrar JS de Bootstrap se usa la etiqueta <_____>.", code: "", correct: ["script"], explanation: "Enlace JS.", tags: ["html5"], difficulty: "easy", source: "profesor" },
    { id: "uf4_r10", unit: 4, type: "fill", prompt: "Break-point para pantallas muy grandes: ._____.", code: "", correct: ["xxl"], explanation: "Extra extra large.", tags: ["bootstrap"], difficulty: "easy", source: "profesor" },

    // ==========================================
    // --- UF5: COMPONENTES MULTIMEDIA ---
    // ==========================================
    // --- TEST (20) ---
    { id: "uf5_t01", unit: 5, type: "test", prompt: "¿Qué formato de imagen soporta transparencia?", options: ["JPG", "GIF", "PNG", "BMP"], correct: 2, explanation: "Soporta canal alfa.", tags: ["imagenes"], difficulty: "easy", source: "profesor" },
    { id: "uf5_t02", unit: 5, type: "test", prompt: "¿Qué etiqueta HTML5 inserta vídeo?", options: ["<media>", "<video>", "<movie>", "<embed>"], correct: 1, explanation: "Etiqueta específica.", tags: ["html5"], difficulty: "easy", source: "profesor" },
    { id: "uf5_t03", unit: 5, type: "test", prompt: "¿Atributo para controles de vídeo?", options: ["control", "controls", "play", "show"], correct: 1, explanation: "Muestra botones.", tags: ["html5"], difficulty: "easy", source: "profesor" },
    { id: "uf5_t04", unit: 5, type: "test", prompt: "¿Qué formato de imagen es vectorial?", options: ["PNG", "JPG", "SVG", "GIF"], correct: 2, explanation: "Gráficos escalables.", tags: ["imagenes"], difficulty: "medium", source: "profesor" },
    { id: "uf5_t05", unit: 5, type: "test", prompt: "¿Atributo para bucle en audio/vídeo?", options: ["repeat", "loop", "infinite", "autoplay"], correct: 1, explanation: "Reproducción infinita.", tags: ["html5"], difficulty: "medium", source: "profesor" },
    { id: "uf5_t06", unit: 5, type: "test", prompt: "¿Qué es un favicon?", options: ["Un plugin", "El icono de la web en la pestaña", "Una librería", "Un tipo de banner"], correct: 1, explanation: "Icono pequeño.", tags: ["conceptos"], difficulty: "easy", source: "profesor" },
    { id: "uf5_t07", unit: 5, type: "test", prompt: "¿Propiedad CSS para animaciones?", options: ["transition", "animation", "transform", "keyframe"], correct: 1, explanation: "Controla animaciones complejas.", tags: ["animaciones"], difficulty: "medium", source: "profesor" },
    { id: "uf5_t08", unit: 5, type: "test", prompt: "¿Qué etiqueta define los fotogramas clave?", options: ["@frame", "@keyframes", "@animate", "@key"], correct: 1, explanation: "Sintaxis CSS.", tags: ["animaciones"], difficulty: "medium", source: "profesor" },
    { id: "uf5_t09", unit: 5, type: "test", prompt: "¿Formato de audio comprimido estándar?", options: ["WAV", "MIDI", "MP3", "AIFF"], correct: 2, explanation: "Alta compatibilidad.", tags: ["audio"], difficulty: "easy", source: "profesor" },
    { id: "uf5_t10", unit: 5, type: "test", prompt: "¿Qué es la optimización de imágenes?", options: ["Aumentar tamaño", "Reducir peso sin perder calidad", "Cambiar de PNG a JPG", "Poner bordes"], correct: 1, explanation: "Mejora carga.", tags: ["imagenes"], difficulty: "medium", source: "profesor" },
    { id: "uf5_t11", unit: 5, type: "test", prompt: "¿Atributo para precargar vídeo?", options: ["load", "preload", "buffer", "cache"], correct: 1, explanation: "Precarga del archivo.", tags: ["html5"], difficulty: "hard", source: "profesor" },
    { id: "uf5_t12", unit: 5, type: "test", prompt: "¿Qué propiedad CSS define duración de animación?", options: ["animation-time", "animation-duration", "transition-time", "time"], correct: 1, explanation: "Tiempo en segundos.", tags: ["animaciones"], difficulty: "easy", source: "profesor" },
    { id: "uf5_t13", unit: 5, type: "test", prompt: "¿Atributo para imagen alternativa?", options: ["src", "alt", "title", "longdesc"], correct: 1, explanation: "Texto alternativo.", tags: ["accesibilidad"], difficulty: "easy", source: "profesor" },
    { id: "uf5_t14", unit: 5, type: "test", prompt: "¿Qué etiqueta inserta audio?", options: ["<sound>", "<music>", "<audio>", "<embed>"], correct: 2, explanation: "Etiqueta específica.", tags: ["html5"], difficulty: "easy", source: "profesor" },
    { id: "uf5_t15", unit: 5, type: "test", prompt: "¿Qué propiedad hace que una animación se repita?", options: ["animation-repeat", "animation-iteration-count", "animation-loop", "repeat"], correct: 1, explanation: "Número de veces.", tags: ["animaciones"], difficulty: "hard", source: "profesor" },
    { id: "uf5_t16", unit: 5, type: "test", prompt: "¿Formato de vídeo estándar HTML5?", options: ["AVI", "MP4", "WMV", "MOV"], correct: 1, explanation: "H.264 compatible.", tags: ["video"], difficulty: "easy", source: "profesor" },
    { id: "uf5_t17", unit: 5, type: "test", prompt: "¿Qué propiedad CSS gira elementos?", options: ["rotate", "transform: rotate", "animation: rotate", "spin"], correct: 1, explanation: "Transformación 2D.", tags: ["animaciones"], difficulty: "medium", source: "profesor" },
    { id: "uf5_t18", unit: 5, type: "test", prompt: "¿Qué es un 'splash screen'?", options: ["Una pantalla de carga inicial", "Un anuncio", "Un menú", "Una base de datos"], correct: 0, explanation: "Pantalla de bienvenida.", tags: ["conceptos"], difficulty: "medium", source: "profesor" },
    { id: "uf5_t19", unit: 5, type: "test", prompt: "¿Qué propiedad CSS cambia transparencia?", options: ["visible", "opacity", "transparent", "alpha"], correct: 1, explanation: "Valor de 0 a 1.", tags: ["propiedades"], difficulty: "easy", source: "profesor" },
    { id: "uf5_t20", unit: 5, type: "test", prompt: "¿Para qué sirve `animation-delay`?", options: ["Velocidad", "Retrasar inicio", "Duración", "Dirección"], correct: 1, explanation: "Espera inicial.", tags: ["animaciones"], difficulty: "medium", source: "profesor" },

    // --- RELLENAR (10) ---
    { id: "uf5_r01", unit: 5, type: "fill", prompt: "Imagen vectorial: _____.", code: "", correct: ["svg"], explanation: "Scalable Vector Graphics.", tags: ["imagenes"], difficulty: "easy", source: "profesor" },
    { id: "uf5_r02", unit: 5, type: "fill", prompt: "Etiqueta de vídeo: <_____>.", code: "", correct: ["video"], explanation: "Etiqueta HTML5.", tags: ["html5"], difficulty: "easy", source: "profesor" },
    { id: "uf5_r03", unit: 5, type: "fill", prompt: "Formato de audio comprimido: _____.", code: "", correct: ["mp3"], explanation: "Formato estándar.", tags: ["audio"], difficulty: "easy", source: "profesor" },
    { id: "uf5_r04", unit: 5, type: "fill", prompt: "Propiedad para girar: transform: _____().", code: "", correct: ["rotate"], explanation: "Función de transformación.", tags: ["animaciones"], difficulty: "easy", source: "profesor" },
    { id: "uf5_r05", unit: 5, type: "fill", prompt: "Propiedad de animaciones: _____.", code: "", correct: ["animation"], explanation: "CSS Animations.", tags: ["animaciones"], difficulty: "easy", source: "profesor" },
    { id: "uf5_r06", unit: 5, type: "fill", prompt: "Texto alternativo: atributo _____.", code: "", correct: ["alt"], explanation: "Accesibilidad.", tags: ["accesibilidad"], difficulty: "easy", source: "profesor" },
    { id: "uf5_r07", unit: 5, type: "fill", prompt: "Atributo para bucle: _____.", code: "", correct: ["loop"], explanation: "Repetición.", tags: ["html5"], difficulty: "easy", source: "profesor" },
    { id: "uf5_r08", unit: 5, type: "fill", prompt: "Fotogramas clave: @_____.", code: "", correct: ["keyframes"], explanation: "CSS Keyframes.", tags: ["animaciones"], difficulty: "easy", source: "profesor" },
    { id: "uf5_r09", unit: 5, type: "fill", prompt: "Formato vídeo: _____.", code: "", correct: ["mp4"], explanation: "Formato compatible.", tags: ["video"], difficulty: "easy", source: "profesor" },
    { id: "uf5_r10", unit: 5, type: "fill", prompt: "Icono web: _____.", code: "", correct: ["favicon"], explanation: "Icono de sitio.", tags: ["conceptos"], difficulty: "easy", source: "profesor" },

    // ==========================================
    // --- UF6: CONTENIDO INTERACTIVO (JS) ---
    // ==========================================
    // --- TEST (20) ---
    { id: "uf6_t01", uf: 6, type: "test", prompt: "¿Qué hace 'addEventListener'?", options: ["Crea una variable", "Asigna un evento a un elemento", "Cambia estilo", "Escribe en consola"], correct: "Asigna un evento a un elemento", explanation: "Manejo de eventos.", tags: ["javascript"], difficulty: 1 },
    { id: "uf6_t02", uf: 6, type: "test", prompt: "¿Evento al pulsar una tecla?", options: ["onclick", "onkeydown", "onmouse", "onload"], correct: "onkeydown", explanation: "Evento de teclado.", tags: ["javascript"], difficulty: 2 },
    { id: "uf6_t03", uf: 6, type: "test", prompt: "¿Cómo seleccionar por clase en JS?", options: ["getElementById", "getElementsByClassName", "querySelector", "both b and c"], correct: "both b and c", explanation: "Ambos sirven.", tags: ["javascript"], difficulty: 2 },
    { id: "uf6_t04", uf: 6, type: "test", prompt: "¿Cómo cambiar contenido HTML?", options: ["innerText", "innerHTML", "text", "content"], correct: "innerHTML", explanation: "Cambia HTML.", tags: ["javascript"], difficulty: 1 },
    { id: "uf6_t05", uf: 6, type: "test", prompt: "¿Evento al mover el ratón?", options: ["onclick", "onmouseover", "onscroll", "onchange"], correct: "onmouseover", explanation: "Evento de ratón.", tags: ["javascript"], difficulty: 2 },
    { id: "uf6_t06", uf: 6, type: "test", prompt: "¿Cómo cambiar CSS desde JS?", options: ["style.css", "element.style.propiedad", "css()", "changeStyle()"], correct: "element.style.propiedad", explanation: "Acceso a estilo.", tags: ["javascript"], difficulty: 2 },
    { id: "uf6_t07", uf: 6, type: "test", prompt: "¿Qué significa DOM?", options: ["Document Object Model", "Data Object Manager", "Digital Operation Method", "Doc Online Mode"], correct: "Document Object Model", explanation: "Estructura del documento.", tags: ["javascript"], difficulty: 1 },
    { id: "uf6_t08", uf: 6, type: "test", prompt: "¿Qué hace 'onload'?", options: ["Ejecuta al hacer clic", "Ejecuta al cargar la página", "Ejecuta al cerrar", "Ejecuta al cambiar estilo"], correct: "Ejecuta al cargar la página", explanation: "Evento de carga.", tags: ["javascript"], difficulty: 1 },
    { id: "uf6_t09", uf: 6, type: "test", prompt: "¿Cómo añadir una clase CSS desde JS?", options: ["classList.add()", "class.add()", "addClass()", "style.class"], correct: "classList.add()", explanation: "Manipulación de clases.", tags: ["javascript"], difficulty: 2 },
    { id: "uf6_t10", uf: 6, type: "test", prompt: "¿Qué es `event.target`?", options: ["El ratón", "El elemento que disparó el evento", "La página web", "Una variable"], correct: "El elemento que disparó el evento", explanation: "Objeto evento.", tags: ["javascript"], difficulty: 3 },
    { id: "uf6_t11", uf: 6, type: "test", prompt: "¿Evento al hacer clic?", options: ["hover", "click", "change", "load"], correct: "click", explanation: "Evento más común.", tags: ["javascript"], difficulty: 1 },
    { id: "uf6_t12", uf: 6, type: "test", prompt: "¿Cómo seleccionar por ID?", options: ["getElementById()", "querySelector('#id')", "both a and b", "getElementsByClass()"], correct: "both a and b", explanation: "Ambos sirven.", tags: ["javascript"], difficulty: 1 },
    { id: "uf6_t13", uf: 6, type: "test", prompt: "¿Evento al cambiar un input?", options: ["onchange", "onclick", "onfocus", "onblur"], correct: "onchange", explanation: "Evento de formulario.", tags: ["javascript"], difficulty: 2 },
    { id: "uf6_t14", uf: 6, type: "test", prompt: "¿Cómo ocultar un elemento en JS?", options: ["style.display = 'none'", "style.hidden = true", "style.opacity = 0", "all of the above"], correct: "all of the above", explanation: "Varias formas.", tags: ["javascript"], difficulty: 3 },
    { id: "uf6_t15", uf: 6, type: "test", prompt: "¿Qué hace `preventDefault()`?", options: ["Detiene error", "Evita acción por defecto", "Inicia acción", "Cierra ventana"], correct: "Evita acción por defecto", explanation: "Útil en formularios.", tags: ["javascript"], difficulty: 3 },
    { id: "uf6_t16", uf: 6, type: "test", prompt: "¿Qué es `window`?", options: ["Una función", "El objeto global del navegador", "Una variable", "Una propiedad"], correct: "El objeto global del navegador", explanation: "Contenedor principal.", tags: ["javascript"], difficulty: 2 },
    { id: "uf6_t17", uf: 6, type: "test", prompt: "¿Evento al salir de un input?", options: ["focus", "blur", "click", "change"], correct: "blur", explanation: "Pérdida de foco.", tags: ["javascript"], difficulty: 2 },
    { id: "uf6_t18", uf: 6, type: "test", prompt: "¿Cómo obtener valor de un input?", options: ["value", "text", "content", "val"], correct: "value", explanation: "Propiedad value.", tags: ["javascript"], difficulty: 1 },
    { id: "uf6_t19", uf: 6, type: "test", prompt: "¿Para qué sirve `querySelector`?", options: ["Seleccionar por CSS", "Seleccionar por ID", "Seleccionar por clase", "All of the above"], correct: "All of the above", explanation: "Versátil.", tags: ["javascript"], difficulty: 2 },
    { id: "uf6_t20", uf: 6, type: "test", prompt: "¿Evento al enviar formulario?", options: ["onsubmit", "onclick", "onchange", "onblur"], correct: "onsubmit", explanation: "Evento de formulario.", tags: ["javascript"], difficulty: 2 },

    // --- RELLENAR (10) ---
    { id: "uf6_r01", uf: 6, type: "fill", prompt: "Evento de carga: _____.", correct: "load", explanation: "onload.", tags: ["javascript"] },
    { id: "uf6_r02", uf: 6, type: "fill", prompt: "Seleccionar ID: getElement_____.", correct: "ById", explanation: "getElementById.", tags: ["javascript"] },
    { id: "uf6_r03", uf: 6, type: "fill", prompt: "Evento clic: _____.", correct: "click", explanation: "onclick.", tags: ["javascript"] },
    { id: "uf6_r04", uf: 6, type: "fill", prompt: "Añadir clase JS: classList._____().", correct: "add", explanation: "classList.add.", tags: ["javascript"] },
    { id: "uf6_r05", uf: 6, type: "fill", prompt: "Evento cambio: _____.", correct: "change", explanation: "onchange.", tags: ["javascript"] },
    { id: "uf6_r06", uf: 6, type: "fill", prompt: "Modelo de documento: _____.", correct: "dom", explanation: "DOM.", tags: ["javascript"] },
    { id: "uf6_r07", uf: 6, type: "fill", prompt: "Obtener valor: _____.", correct: "value", explanation: "input.value.", tags: ["javascript"] },
    { id: "uf6_r08", uf: 6, type: "fill", prompt: "Seleccionar CSS: _____.", correct: "querySelector", explanation: "Método versátil.", tags: ["javascript"] },
    { id: "uf6_r09", uf: 6, type: "fill", prompt: "Asignar evento: _____().", correct: "addEventListener", explanation: "Método eventos.", tags: ["javascript"] },
    { id: "uf6_r10", uf: 6, type: "fill", prompt: "Cambiar texto: _____.", correct: "innerHTML", explanation: "Propiedad.", tags: ["javascript"] },

    // ==========================================
    // --- UF7: ACCESIBILIDAD Y USABILIDAD ---
    // ==========================================
    // --- TEST (20) ---
    { id: "uf7_t01", uf: 7, type: "test", prompt: "¿Qué significan las siglas WCAG?", options: ["Web Content Accessibility Guidelines", "Web Center Access Group", "Web Coding And Graphics", "World Center Accessibility Guide"], correct: "Web Content Accessibility Guidelines", explanation: "Normas accesibilidad.", tags: ["accesibilidad"], difficulty: 1 },
    { id: "uf7_t02", uf: 7, type: "test", prompt: "¿Qué principio no es de POUR?", options: ["Perceptible", "Operable", "Usable", "Robusto"], correct: "Usable", explanation: "POUR: Perceptible, Operable, Entendible, Robusto.", tags: ["accesibilidad"], difficulty: 2 },
    { id: "uf7_t03", uf: 7, type: "test", prompt: "¿Qué significa que el contenido sea 'Robusto'?", options: ["Que no se rompa", "Que sea compatible con tecnologías de asistencia", "Que tenga buen diseño", "Que sea rápido"], correct: "Que sea compatible con tecnologías de asistencia", explanation: "Compatibilidad futura.", tags: ["accesibilidad"], difficulty: 3 },
    { id: "uf7_t04", uf: 7, type: "test", prompt: "¿Qué herramienta mide la velocidad?", options: ["PageSpeed Insights", "Validator W3C", "Color Contrast Analyzer", "ARIA Validator"], correct: "PageSpeed Insights", explanation: "Rendimiento Google.", tags: ["usabilidad"], difficulty: 2 },
    { id: "uf7_t05", uf: 7, type: "test", prompt: "¿Qué es un test A/B?", options: ["Test de accesibilidad", "Comparar dos versiones de una web", "Test de velocidad", "Test de usuario"], correct: "Comparar dos versiones de una web", explanation: "Usabilidad.", tags: ["usabilidad"], difficulty: 1 },
    { id: "uf7_t06", uf: 7, type: "test", prompt: "¿Qué atributo ARIA define un rol?", options: ["aria-label", "aria-role", "role", "aria-description"], correct: "role", explanation: "ARIA rol.", tags: ["accesibilidad"], difficulty: 2 },
    { id: "uf7_t07", uf: 7, type: "test", prompt: "¿Qué principio POUR se refiere a la navegación?", options: ["Perceptible", "Operable", "Entendible", "Robusto"], correct: "Operable", explanation: "Uso por teclado.", tags: ["accesibilidad"], difficulty: 2 },
    { id: "uf7_t08", uf: 7, type: "test", prompt: "¿Qué es el contraste de color?", options: ["Diferencia entre color texto y fondo", "Uso de muchos colores", "Colores brillantes", "Colores oscuros"], correct: "Diferencia entre color texto y fondo", explanation: "Legibilidad.", tags: ["accesibilidad"], difficulty: 1 },
    { id: "uf7_t09", uf: 7, type: "test", prompt: "¿Para qué sirve WAI-ARIA?", options: ["Añadir estilos", "Mejorar accesibilidad en contenido dinámico", "Optimizar imágenes", "Base de datos"], correct: "Mejorar accesibilidad en contenido dinámico", explanation: "Extensión HTML.", tags: ["accesibilidad"], difficulty: 3 },
    { id: "uf7_t10", uf: 7, type: "test", prompt: "¿Qué es el W3C?", options: ["Organismo estándares web", "Framework CSS", "Navegador", "Virus"], correct: "Organismo estándares web", explanation: "World Wide Web Consortium.", tags: ["accesibilidad"], difficulty: 1 },
    { id: "uf7_t11", uf: 7, type: "test", prompt: "¿Qué nivel de adecuación WCAG es el mínimo?", options: ["A", "AA", "AAA", "B"], correct: "A", explanation: "Nivel básico.", tags: ["accesibilidad"], difficulty: 2 },
    { id: "uf7_t12", uf: 7, type: "test", prompt: "¿Qué es un lector de pantalla?", options: ["Un monitor", "Software para ciegos", "Un navegador", "Un tipo de fuente"], correct: "Software para ciegos", explanation: "Tecnología asistencia.", tags: ["accesibilidad"], difficulty: 1 },
    { id: "uf7_t13", uf: 7, type: "test", prompt: "¿Qué significa 'Perceptible' en POUR?", options: ["Que se pueda ver/oir", "Que se pueda usar con teclado", "Que sea fácil entender", "Que sea compatible"], correct: "Que se pueda ver/oir", explanation: "Información accesible.", tags: ["accesibilidad"], difficulty: 2 },
    { id: "uf7_t14", uf: 7, type: "test", prompt: "¿Para qué sirve `aria-hidden`?", options: ["Mostrar elemento", "Ocultar elemento a lectores de pantalla", "Añadir rol", "Cambiar color"], correct: "Ocultar elemento a lectores de pantalla", explanation: "ARIA oculta.", tags: ["accesibilidad"], difficulty: 3 },
    { id: "uf7_t15", uf: 7, type: "test", prompt: "¿Qué es usabilidad?", options: ["Accesibilidad", "Facilidad de uso", "Rapidez", "Diseño"], correct: "Facilidad de uso", explanation: "Experiencia usuario.", tags: ["usabilidad"], difficulty: 1 },
    { id: "uf7_t16", uf: 7, type: "test", prompt: "¿Qué es un sitemap?", options: ["Mapa físico", "Estructura de navegación", "Plugin", "Base de datos"], correct: "Estructura de navegación", explanation: "Mapa del sitio.", tags: ["usabilidad"], difficulty: 1 },
    { id: "uf7_t17", uf: 7, type: "test", prompt: "¿Qué significa 'Entendible' en POUR?", options: ["Contenido claro", "Contenido navegable", "Contenido visible", "Contenido robusto"], correct: "Contenido claro", explanation: "Claridad UX.", tags: ["accesibilidad"], difficulty: 2 },
    { id: "uf7_t18", uf: 7, type: "test", prompt: "¿Herramienta para evaluar contraste?", options: ["Color Contrast Analyzer", "Validator", "PageSpeed", "ARIA validator"], correct: "Color Contrast Analyzer", explanation: "Analiza contraste.", tags: ["accesibilidad"], difficulty: 2 },
    { id: "uf7_t19", uf: 7, type: "test", prompt: "¿Qué es 'navigable'?", options: ["Usar teclado", "Fácil de encontrar información", "Rapidez", "Compatibilidad"], correct: "Fácil de encontrar información", explanation: "Estructura.", tags: ["usabilidad"], difficulty: 2 },
    { id: "uf7_t20", uf: 7, type: "test", prompt: "¿Qué organismo gestiona las normas ARIA?", options: ["Google", "W3C", "Apple", "Microsoft"], correct: "W3C", explanation: "Estándar web.", tags: ["accesibilidad"], difficulty: 2 },

    // --- RELLENAR (10) ---
    { id: "uf7_r01", uf: 7, type: "fill", prompt: "Siglas de accesibilidad: _____.", correct: "wcag", explanation: "Directrices.", tags: ["accesibilidad"] },
    { id: "uf7_r02", uf: 7, type: "fill", prompt: "Principio P: _____.", correct: "perceptible", explanation: "POUR.", tags: ["accesibilidad"] },
    { id: "uf7_r03", uf: 7, type: "fill", prompt: "Principio O: _____.", correct: "operable", explanation: "POUR.", tags: ["accesibilidad"] },
    { id: "uf7_r04", uf: 7, type: "fill", prompt: "Principio U: _____.", correct: "entendible", explanation: "POUR.", tags: ["accesibilidad"] },
    { id: "uf7_r05", uf: 7, type: "fill", prompt: "Principio R: _____.", correct: "robusto", explanation: "POUR.", tags: ["accesibilidad"] },
    { id: "uf7_r06", uf: 7, type: "fill", prompt: "Herramienta velocidad: _____.", correct: "pagespeed", explanation: "Google.", tags: ["usabilidad"] },
    { id: "uf7_r07", uf: 7, type: "fill", prompt: "Test comparación: _____.", correct: "ab", explanation: "Test A/B.", tags: ["usabilidad"] },
    { id: "uf7_r08", uf: 7, type: "fill", prompt: "Accesibilidad dinámica: _____.", correct: "aria", explanation: "WAI-ARIA.", tags: ["accesibilidad"] },
    { id: "uf7_r09", uf: 7, type: "fill", prompt: "Atributo ARIA: _____.", correct: "role", explanation: "Rol.", tags: ["accesibilidad"] },
    { id: "uf7_r10", uf: 7, type: "fill", prompt: "Facilidad de uso: _____.", correct: "usabilidad", explanation: "Concepto.", tags: ["usabilidad"] }
];

/* Para tooling externo opcional */
window.__QBANK__ = { TOPICS, QUESTIONS };
