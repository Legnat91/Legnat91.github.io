TITULO: UF3 - JavaScript y HTML (Desarrollo web en entorno cliente)

SECCIONES:
- El DOM y las API de navegador
- Gestión de eventos
- Formularios y controles
- Plantillas HTML y componentes web
- Expresiones regulares
- Almacenamiento local

PUNTOS_CLAVE:
- Las API de navegador (Web APIs) permiten interactuar con la página desde JavaScript y se accede a ellas desde el objeto global window (globalThis como alternativa multiplataforma).
- El DOM representa el documento como un árbol jerárquico de nodos (elemento, texto, atributo, etc.).
- Para navegar el DOM existen propiedades para nodos (parentNode, childNodes, etc.) y para elementos (parentElement, children, etc.).
- Para buscar elementos se usan getElementById, querySelector, getElementsByTagName/ClassName y querySelectorAll.
- Para modificar el DOM pueden usarse propiedades textContent, innerHTML y outerHTML, o crear nodos con createElement/cloneNode y añadirlos con append/prepend/before/after.
- Los atributos se gestionan con hasAttribute/getAttribute/setAttribute/removeAttribute y las clases con className/classList.
- La API Geolocation está en navigator.geolocation y es asíncrona mediante callbacks.
- Los eventos se gestionan mejor con addEventListener (y removeEventListener para eliminar).
- Los eventos se propagan (bubbling), lo que permite delegación de eventos usando event.target.
- preventDefault() evita comportamientos por defecto (submit en formularios y navegación de enlaces).
- Formularios: document.forms y form.elements permiten acceder a campos; value/checked/selectedIndex son claves.
- El evento submit es preferible al click del botón para capturar también Enter; form.submit() NO dispara el evento submit.
- Validación HTML5 desde JS: form.checkValidity() y form.reportValidity().
- Web Components: Custom Elements + Shadow DOM + Templates (+ Slots) para encapsulación y reutilización.
- Regex (RegExp): /patrón/banderas o new RegExp; flags g,i,m,s,u,y; métodos search/match/replace/test.
- Persistencia en navegador: cookies (document.cookie, 4 kB) y Web Storage (localStorage/sessionStorage, 5 MB, clave-valor string).
- Para guardar objetos en Web Storage se usa JSON; si el objeto tenía métodos, hay que rehidratarlo (reconstruir funcionalidad) tras cargar.

ERRORES_COMUNES:
- Confundir API de navegador (cliente) con API de servidor.
- Intentar usar window en NodeJS (no existe; allí es global; globalThis unifica).
- Usar childNodes cuando se quieren solo elementos (incluye nodos de texto y otros).
- Tratar una colección del DOM como un array y usar map/filter/reduce directamente.
- Usar innerHTML += y provocar reprocesado/re-carga de contenido ya existente.
- Creer que modificar elem.value actualiza el atributo value (no lo hace; el texto lo indica explícitamente).
- Olvidar que el JS en <head> puede ejecutarse antes de que exista document.body (usar script al final o DOMContentLoaded).
- Usar onclick/asignación onclick y pensar que se pueden añadir múltiples handlers (solo addEventListener lo facilita).
- Confundir event.target (origen real) con event.currentTarget (elemento con handler).
- Olvidar preventDefault() cuando se quiere evitar navegación de enlaces o envío de formularios.
- No indicar type en botones dentro de formularios (si no, actúan como submit).
- Creer que form.submit() dispara el evento submit (no lo dispara).
- Intentar acceder al interior del Shadow DOM con document.querySelector (hay que usar shadowRoot si mode: 'open').
- Usar cookies para guardar mucha información (límite 4 kB).
- Guardar objetos con métodos en localStorage y esperar recuperar los métodos tras JSON.parse (no se exportan a JSON).

GLOSARIO:
- Web APIs / API de navegador: funcionalidades del navegador accesibles desde JavaScript (DOM, Web Storage, Geolocation, etc.).
- DOM: Document Object Model; árbol de nodos que representa el documento HTML.
- Nodo: unidad del DOM (elemento, texto, atributo, comentario, documento, DocumentFragment, etc.).
- Selector CSS: patrón para localizar elementos (usado en querySelector/querySelectorAll).
- Dataset: atributos data-* accesibles vía elemento.dataset.
- Manejador de eventos: función u objeto con handleEvent que se ejecuta cuando ocurre un evento.
- Propagación de eventos: subida del evento por la jerarquía de ancestros (bubbling).
- Delegación de eventos: un handler en contenedor que gestiona eventos de sus descendientes usando event.target.
- Comportamiento por defecto: acción automática del navegador (navegar en <a>, enviar formularios en submit).
- Custom Elements: API para definir elementos personalizados (nombre con guion).
- Shadow DOM: DOM encapsulado (open/closed) aislado del DOM principal.
- Template: <template> con content (DocumentFragment) clonable e insertable desde JS.
- Slot: marcador en plantilla para insertar contenido externo en un componente.
- RegExp / Regex: patrón de búsqueda en strings con banderas.
- Cookie: clave-valor asociada a dominio, integrada en HTTP, accesible vía document.cookie.
- Web Storage: almacenamiento local clave-valor string (localStorage/sessionStorage).
- Rehidratación: reconstrucción de un objeto (incluyendo métodos) tras cargar datos (p.ej. desde JSON).

TEST:

TIPO_TEST:

1)
PREGUNTA: ¿Cuál es el objeto global del navegador desde el que se accede a las Web APIs?
OPCIONES:
a) global
b) window
c) node
d) documentElement
CORRECTA: b
EXPLICACION: El texto indica que el acceso a las API del navegador se realiza a través del objeto global window.
DIFICULTAD: facil
sourceHint: 1.1 Las API de navegador

2)
PREGUNTA: ¿Qué objeto permite referirse al objeto global de forma independiente del entorno (navegador/NodeJS)?
OPCIONES:
a) globalDOM
b) thisGlobal
c) globalThis
d) rootWindow
CORRECTA: c
EXPLICACION: Se indica que globalThis permite referirse al objeto global independientemente del entorno.
DIFICULTAD: media
sourceHint: 1.1 Las API de navegador

3)
PREGUNTA: ¿Qué propiedad devuelve la etiqueta <html> del documento?
OPCIONES:
a) document.body
b) document.head
c) document.documentElement
d) document.root
CORRECTA: c
EXPLICACION: document.documentElement es el elemento raíz (<html>).
DIFICULTAD: facil
sourceHint: 1.2 DOM / acceso inicial

4)
PREGUNTA: ¿Cuál es la diferencia clave entre childNodes y children?
OPCIONES:
a) childNodes solo devuelve elementos HTML
b) children incluye nodos de texto y comentario
c) children devuelve solo nodos de tipo elemento; childNodes puede incluir otros tipos
d) Son sinónimos
CORRECTA: c
EXPLICACION: El texto distingue propiedades con “Element” (solo elementos) frente a las que incluyen cualquier tipo de nodo.
DIFICULTAD: media
sourceHint: 1.2 DOM / navegación

5)
PREGUNTA: ¿Qué función devuelve el primer elemento que coincide con un selector CSS?
OPCIONES:
a) querySelector
b) querySelectorAll
c) getElementsByClassName
d) getElementsByTagName
CORRECTA: a
EXPLICACION: querySelector devuelve el primer elemento que coincide con el selector CSS.
DIFICULTAD: facil
sourceHint: 1.2 DOM / búsqueda

6)
PREGUNTA: ¿Qué propiedad reemplaza también el propio elemento seleccionado además de su contenido?
OPCIONES:
a) textContent
b) innerHTML
c) outerHTML
d) append
CORRECTA: c
EXPLICACION: outerHTML reemplaza el elemento indicado y su contenido; innerHTML solo el contenido.
DIFICULTAD: media
sourceHint: 1.3 DOM / modificación

7)
PREGUNTA: ¿Qué método añade un nodo como último hijo del elemento?
OPCIONES:
a) prepend
b) append
c) before
d) replaceWith
CORRECTA: b
EXPLICACION: append añade un nodo al final.
DIFICULTAD: facil
sourceHint: 1.3 DOM / inserción

8)
PREGUNTA: ¿Qué propiedad da acceso a los atributos data-* de un elemento?
OPCIONES:
a) elem.data
b) elem.attributes
c) elem.dataset
d) elem.classList
CORRECTA: c
EXPLICACION: Los atributos data-* están accesibles mediante elemento.dataset.
DIFICULTAD: media
sourceHint: 1.4 Atributos y clases

9)
PREGUNTA: ¿Dónde está la API de geolocalización?
OPCIONES:
a) window.location
b) document.location
c) navigator.geolocation
d) globalThis.geo
CORRECTA: c
EXPLICACION: La unidad indica navigator.geolocation.
DIFICULTAD: facil
sourceHint: 1.5 API Geolocation

10)
PREGUNTA: ¿Qué opción es la más recomendable para asociar múltiples manejadores al mismo evento de un elemento?
OPCIONES:
a) atributo onclick en HTML
b) asignación elem.onclick = ...
c) addEventListener
d) document.onclick = ...
CORRECTA: c
EXPLICACION: addEventListener permite asociar múltiples handlers para el mismo evento.
DIFICULTAD: facil
sourceHint: 2.1 Eventos / addEventListener

11)
PREGUNTA: En propagación de eventos, ¿qué representa event.target?
OPCIONES:
a) El elemento que tiene el manejador asociado
b) El elemento sobre el que se produce realmente el evento
c) El elemento raíz del DOM
d) Siempre el body
CORRECTA: b
EXPLICACION: El texto explica target como el elemento sobre el que se produce el evento; currentTarget es quien tiene el handler.
DIFICULTAD: media
sourceHint: 2.2 Propagación de eventos

12)
PREGUNTA: ¿Qué función evita el comportamiento por defecto del navegador en un evento?
OPCIONES:
a) event.stop()
b) event.preventDefault()
c) event.cancel()
d) event.disableDefault()
CORRECTA: b
EXPLICACION: preventDefault() impide, por ejemplo, navegación en enlaces o envío automático de formularios.
DIFICULTAD: facil
sourceHint: 2.4 Comportamiento por defecto

13)
PREGUNTA: ¿Qué recomendación da el texto sobre el evento para controlar envíos de formularios?
OPCIONES:
a) Usar click en el botón submit siempre
b) Usar submit del formulario
c) Usar keydown en inputs
d) Usar blur del último campo
CORRECTA: b
EXPLICACION: El texto recomienda usar el evento submit para capturar tanto botón como Enter y beneficiarse de validación HTML.
DIFICULTAD: media
sourceHint: 3.3 Envío y validación

14)
PREGUNTA: ¿Qué afirmación es correcta sobre form.submit()?
OPCIONES:
a) Dispara el evento submit
b) No envía el formulario si hay novalidate
c) Envía el formulario pero NO dispara el evento submit
d) Solo funciona con method="POST"
CORRECTA: c
EXPLICACION: El texto indica explícitamente que submit() envía el formulario pero no provoca el evento submit.
DIFICULTAD: dificil
sourceHint: 3.3 Envío y validación

15)
PREGUNTA: ¿Qué requisito de nombre deben cumplir los Custom Elements?
OPCIONES:
a) Deben empezar por "x-"
b) Deben contener un guion
c) Deben estar en mayúsculas
d) Deben coincidir con una etiqueta HTML existente
CORRECTA: b
EXPLICACION: Se indica que los elementos personalizados deben contener un guion.
DIFICULTAD: media
sourceHint: 4.1 Custom Elements

16)
PREGUNTA: ¿Qué diferencia hay entre Shadow DOM open y closed?
OPCIONES:
a) open permite CSS global y closed no
b) closed hace shadowRoot siempre accesible
c) open permite acceder por element.shadowRoot; closed hace element.shadowRoot = null
d) No hay diferencias
CORRECTA: c
EXPLICACION: El texto lo describe: mode:'open' accesible por shadowRoot; mode:'closed' no accesible.
DIFICULTAD: dificil
sourceHint: 4.2 Shadow DOM

17)
PREGUNTA: ¿Qué tipo de nodo es template.content?
OPCIONES:
a) HTMLElement
b) TextNode
c) DocumentFragment
d) AttrNode
CORRECTA: c
EXPLICACION: El texto indica que content es un DocumentFragment.
DIFICULTAD: media
sourceHint: 4.3 Templates

18)
PREGUNTA: ¿Cuáles son las dos notaciones para crear expresiones regulares en JavaScript?
OPCIONES:
a) RegEx() y /.../
b) new RegExp(...) y /.../banderas
c) regexp.make() y pattern(...)
d) match() y test()
CORRECTA: b
EXPLICACION: Se indica notación constructora (new RegExp) y notación literal (/patrón/flags).
DIFICULTAD: media
sourceHint: 5.1 Definición y uso

19)
PREGUNTA: ¿Qué bandera hace que la búsqueda sea global (todas las coincidencias)?
OPCIONES:
a) i
b) g
c) m
d) s
CORRECTA: b
EXPLICACION: La bandera g es búsqueda global.
DIFICULTAD: facil
sourceHint: 5.3 Banderas

20)
PREGUNTA: ¿Qué capacidad de almacenamiento indica el texto para Web Storage?
OPCIONES:
a) 4 kB
b) 512 kB
c) 5 MB
d) 50 MB
CORRECTA: c
EXPLICACION: El texto indica 5 MB para Web Storage y 4 kB para cookies.
DIFICULTAD: media
sourceHint: 6.3 API de Almacenamiento Web


TIPO_VERDADERO_FALSO:

1)
PREGUNTA: document.getElementById puede ejecutarse sobre cualquier elemento, no solo sobre document.
RESPUESTA: falso
EXPLICACION: El texto indica que document.getElementById solo puede ejecutarse sobre document.
sourceHint: 1.2 DOM / búsqueda

2)
PREGUNTA: En una colección devuelta por querySelectorAll se puede iterar con for...of.
RESPUESTA: verdadero
EXPLICACION: El texto indica que las colecciones son iterables y se pueden recorrer con for...of.
sourceHint: 1.2 DOM / colecciones

3)
PREGUNTA: event.currentTarget es el elemento donde realmente se produjo el evento.
RESPUESTA: falso
EXPLICACION: event.target es el elemento donde se produce; currentTarget es el elemento con el manejador.
sourceHint: 2.2 Propagación de eventos

4)
PREGUNTA: localStorage almacena datos hasta que se borren explícitamente.
RESPUESTA: verdadero
EXPLICACION: Se indica que localStorage persiste hasta borrado explícito.
sourceHint: 6.3 Web Storage


TIPO_RESPUESTA_CORTA:

1)
PREGUNTA: Explica dos formas recomendadas por el texto para evitar que un script acceda al DOM antes de que se cargue document.body.
RESPUESTA_ESPERADA: Poner el <script> al final de <body> o ejecutar el programa principal dentro del manejador DOMContentLoaded.
CRITERIOS:
- Debe mencionar script al final de body
- Debe mencionar DOMContentLoaded
sourceHint: 2.1 Eventos / DOMContentLoaded

2)
PREGUNTA: Explica la diferencia entre el atributo value y la propiedad DOM value en un campo de formulario.
RESPUESTA_ESPERADA: Cambiar el atributo value cambia también la propiedad value, pero cambiar la propiedad value no actualiza el atributo; así se puede conservar el valor original del atributo.
CRITERIOS:
- Debe indicar que atributo -> propiedad sí cambia
- Debe indicar que propiedad -> atributo no cambia
sourceHint: 1.4 Atributos y clases / value

3)
PREGUNTA: ¿Por qué no se puede acceder al interior del Shadow DOM con document.querySelector?
RESPUESTA_ESPERADA: Porque el contenido del Shadow DOM está aislado del DOM exterior; solo es accesible desde el propio componente a través de shadowRoot (si mode es 'open').
CRITERIOS:
- Debe mencionar aislamiento
- Debe mencionar shadowRoot como vía de acceso
sourceHint: 4.2 Shadow DOM
