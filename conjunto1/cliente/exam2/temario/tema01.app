Introducción al desarrollo web en entorno cliente (UF1)

1. Introducción al desarrollo en entorno cliente
1.1. Tipos de aplicaciones web: terminología
Una aplicación web puede incluir diferentes conceptos que a veces se confunden: página web, sitio web y aplicación web.

>> Página web: archivo .html con código HTML y opcionalmente CSS y JavaScript.
>> Página web estática: no generada por lógica de servidor; el servidor envía el archivo tal cual (puede tener interactividad con JavaScript).
>> Página web dinámica: generada por lógica de servidor a partir de plantillas; el servidor ejecuta código y genera HTML como respuesta.
>> Sitio web: conjunto de páginas web; suele ser informativo (texto, imágenes, vídeos) y permite navegación/enlaces o formularios; puede tener autenticación solo para contenido restringido.
>> Aplicación web: ofrece funcionalidades propias de software (tareas específicas) más allá de lo informativo.
>> Aplicación multipágina: cada sección requiere carga completa de página (HTML+CSS+JS+contenido).
>> SPA (single-page application): el cliente (HTML/CSS/JS) se descarga una vez; los cambios de sección descargan datos nuevos sin recarga completa.

Ejemplos (según el temario):
>> GMail: aplicación web con cliente SPA.
>> GitHub: aplicación web multipágina.
>> Wikipedia: sitio web dinámico (contenido desde base de datos procesada por lógica de servidor).

1.2. Características de la programación en entorno cliente
El “sistema” donde se ejecuta el programa es el navegador, y eso implica:

>> Independencia (relativa) del sistema operativo: misma versión de navegador debería comportarse igual, aunque puede depender de APIs del dispositivo (cámara, acelerómetro, etc.).
>> Compatibilidad entre navegadores: alta compatibilidad con estándares, pero funcionalidades nuevas pueden no funcionar igual en todos.
>> Universalidad: no requieren instalación; la mayoría de dispositivos tienen navegador.
>> Actualizaciones transparentes: al recargar, el usuario obtiene la versión nueva.

IMPORTANTE
Ojo con “independencia”: no siempre es total si la app usa capacidades específicas del dispositivo o APIs disponibles solo en ciertos entornos.

2. Estructura de las aplicaciones web
Una aplicación web compleja se compone de:
>> Lógica de servidor (back-end): lógica de negocio + almacenamiento persistente (BD u otras tecnologías).
   - Recibe datos del cliente.
   - Procesa datos (cálculos, procesos, relaciones, notificaciones…).
   - Guarda datos en almacenamiento permanente.
   - Recupera información y la envía al cliente.
>> Lógica de cliente (front-end): interacción con el usuario.
   - Se comunica con el servidor (envío/recepción de datos).
   - Muestra datos en una interfaz web.
   - Obtiene datos del usuario mediante controles de la interfaz.

3. Tecnologías para la programación en entorno cliente
3.1. Tecnologías web básicas
>> HTML: lenguaje de marcado para estructurar contenido.
>> CSS: estilos y diseño (apariencia visual).
>> JavaScript: añade funcionalidad; a veces se usa otro lenguaje que se compila a JavaScript.

Otras tecnologías relacionadas:
>> WWW: sistema que permite comunicación entre navegadores y servidores para intercambiar información (principalmente por HTTP).
>> HTTP: protocolo de comunicación navegador-servidor (half-duplex: el servidor responde a peticiones del cliente).
>> WebSocket: comunicación full-duplex (cliente y servidor envían/reciben sin esperar petición previa); útil en mensajería.
>> URL: identificador de recursos; una URL puede provocar descargas, devolver datos, crear recursos, activar dispositivos, etc.
>> AJAX: técnica para enviar/recibir datos sin descargar una página completa; la página descarga solo datos nuevos.
>> CSS dinámico (SASS, LESS): extienden CSS con variables, anidación, bucles.
>> Web API: servicio de servidor que define URLs; normalmente devuelve datos (JSON/XML) y no páginas completas.
IMPORTANTE
Una API web puede servir a SPA, escritorio, móvil y otros servicios web.

CMS
>> CMS: content management system; aplicación web para crear/administrar contenidos de un sitio web (ej. WordPress).
IMPORTANTE
WordPress es muy utilizado; hay demanda laboral y el desarrollo cliente suele centrarse en plantillas.

Lenguajes de intercambio y otros conceptos:
>> XML/JSON: formatos para intercambio de datos procesados por programas (típicos en APIs).
>> Markdown: marcado ligero usado como alternativa a HTML; la lógica de servidor lo convierte a HTML.
>> YAML: marcado ligero usado sobre todo en ficheros de configuración como alternativa a XML.
>> UI/UX: interfaz y experiencia de usuario (apariencia, usabilidad, accesibilidad; UX es más amplio).
>> REST: estilo de arquitectura para crear APIs siguiendo estándares de la WWW.
>> SOAP: protocolo/estilo de mensajería; suele presentarse como opuesto a REST.
>> GraphQL: lenguaje de consulta/manipulación de datos para APIs (y a veces nombre del tipo de API).

4. Lenguajes de programación en el entorno cliente
4.1. Lenguajes para la web
HTML es declarativo: describe contenido, pero no cubre toda la interactividad. Se han usado:
>> JavaScript: original (Netscape), estandarizado como ECMAScript.
>> Jscript: variante para Internet Explorer (años 2000).
>> ActionScript: derivado usado en Adobe Flash (abandonado).
>> Java: usado en applets (abandonado).
>> TypeScript: expansión de JavaScript con tipos estáticos; debe transpilarse a JavaScript.
>> CoffeeScript: versión más concisa; compila a JavaScript.
>> WebAssembly (2017): formato binario para ejecutar programas en navegador desde lenguajes de alto nivel (C/C++/Rust); recomendado para alta capacidad de procesamiento.

IMPORTANTE
JavaScript se compila justo antes de ejecutarse (just-in-time compilation).

5. Entornos de desarrollo
5.1. Editor (Visual Studio Code)
VS Code: editor de código abierto compatible con HTML/CSS/JS y muchos plugins.
>> Abrir carpeta como espacio de trabajo.
Plugins citados:
>> Spanish Language Pack: traduce la interfaz.
>> Emmet: genera HTML a partir de sintaxis tipo CSS (ej.: “div.clase1” + Tab -> <div class="clase1"></div>).
>> Live Server: inicia servidor local (ej. http://localhost:5500/) para evitar problemas de usar file://.

5.2. NodeJS
NodeJS: entorno de ejecución de JavaScript sin navegador.
IMPORTANTE
NodeJS no incluye APIs del navegador (Window/DOM, AJAX, gráficos, dispositivos, almacenamiento local).
>> NPM (Node Package Manager): gestor de paquetes instalado con Node.
Instalación de paquetes NPM:
>> Sistema / Usuario / Local (proyecto).
IMPORTANTE
Paquetes globales suelen ser ejecutables; paquetes locales suelen ser librerías del proyecto.

5.3. Herramientas de desarrollo del navegador
Acceso: F12 (o Alt+Cmd+I en macOS).
Pestañas principales:
>> Fuentes/Sources: ver archivos; breakpoints; examinar variables; comando debugger.
>> Consola: ver console.log y ejecutar JS.
>> Red/Network: inspeccionar peticiones (útil en SPA con AJAX).
>> Inspector/Elementos: inspección DOM.

5.4. REPL
REPL: read-evaluate-print loop (consola para ejecutar JS y ver resultados).
>> En navegador: consola de devtools.
>> En NodeJS: ejecutar “node” en terminal; salir con Ctrl+D o Ctrl+C dos veces; “.help”.
IMPORTANTE
Ejemplo: alert() falla en NodeJS porque no existe API de navegador; console.log() sí funciona.

5.5. Servicios de validación
>> JSLint (JavaScript)
>> W3C Markup Validation Service (HTML)
>> W3C CSS Validation Service (CSS)

5.6. Otras herramientas
>> Control de versiones: git (con GitHub/GitLab/BitBucket).
>> Pruebas y test: herramientas NPM; importancia en TDD (tests antes del código -> código -> refactor).
>> Integración continua: automatiza tests e integración (GitHub Actions / Travis CI).
>> Despliegue / entrega continua: despliega/publica si supera tests.

Glosario
Página web: Archivo .html con HTML y opcionalmente CSS/JavaScript.
Página estática: No generada por lógica de servidor; el servidor entrega el archivo tal cual.
Página dinámica: Generada por lógica de servidor desde plantillas; el servidor ejecuta código y produce HTML.
Sitio web: Conjunto de páginas web, normalmente informativo.
Aplicación web: Web con funcionalidades propias de software (tareas específicas).
SPA: Aplicación de una sola página; el cliente se descarga una vez y luego solo se descargan datos.
Back-end: Lógica de servidor (negocio + almacenamiento + procesamiento).
Front-end: Lógica de cliente (UI + interacción + comunicación con servidor).
HTML: Lenguaje de marcado para estructurar contenido.
CSS: Lenguaje de estilos para apariencia/diseño.
JavaScript: Lenguaje para añadir funcionalidad en el cliente.
HTTP: Protocolo navegador-servidor (half-duplex).
WebSocket: Protocolo full-duplex para comunicación bidireccional.
URL: Identificador uniforme de recursos web.
AJAX: Técnica para enviar/recibir datos sin recargar página completa.
Web API: Servicio de servidor que expone URLs y devuelve datos (JSON/XML).
CMS: Sistema de gestión de contenidos (ej. WordPress).
JSON: Formato de intercambio de datos usado en APIs.
XML: Formato de intercambio de datos usado en APIs.
Markdown: Marcado ligero que se convierte a HTML por la lógica de servidor.
YAML: Marcado ligero muy usado en configuración.
UI: Interfaz de usuario.
UX: Experiencia de usuario.
REST: Estilo de arquitectura para diseñar APIs siguiendo estándares WWW.
SOAP: Protocolo/estilo de mensajería (a menudo contrapuesto a REST).
GraphQL: Lenguaje de consulta/manipulación de datos para APIs.
NodeJS: Entorno de ejecución de JavaScript sin navegador.
NPM: Gestor de paquetes instalado con NodeJS.
REPL: Consola interactiva read-evaluate-print loop.

Ojo con…
Ojo con confundir “sitio web” (informativo) y “aplicación web” (funcionalidades de software).
Ojo con ejecutar código con APIs del navegador en NodeJS: Window/DOM/alert no existen ahí.
Ojo con abrir HTML con file://: algunas funciones no van bien; usa servidor local (Live Server).
