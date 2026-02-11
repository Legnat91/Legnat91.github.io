TITULO: UF2 - JavaScript (Desarrollo web en entorno cliente)

SECCIONES:
- Fundamentos del lenguaje JavaScript
- Funciones
- Objetos y prototipos
- Módulos
- Programación funcional
- JavaScript moderno

PUNTOS_CLAVE:
- JavaScript puede ejecutarse en navegador y en NodeJS.
- let define variables con ámbito de bloque; const no permite reasignación.
- El operador + concatena si uno de los operandos es string.
- JavaScript es de tipado dinámico y realiza conversiones implícitas.
- === compara valor y tipo; == realiza conversión automática.
- Las funciones son objetos y pueden pasarse como parámetros.
- Las funciones flecha no tienen su propio this.
- Los objetos en JavaScript usan herencia basada en prototipos.
- JSON.stringify convierte objeto a string JSON.
- import y export permiten modularizar el código.
- filter, map, find y reduce permiten trabajar arrays funcionalmente.
- El modo estricto evita errores silenciosos como variables globales accidentales.

ERRORES_COMUNES:
- Usar var en lugar de let en bucles.
- Olvidar declarar variables (crea variable global en modo no estricto).
- Usar == en lugar de ===.
- Pensar que las funciones flecha tienen this propio.
- Copiar objetos por asignación simple (solo copia la referencia).
- Usar módulos abriendo el HTML con file:// en lugar de servidor HTTP.

GLOSARIO:
- Ámbito léxico: zona donde una variable es accesible según su contexto.
- Closure: función que mantiene acceso a variables externas tras ejecutarse.
- Prototipo: objeto del que otro objeto delega propiedades.
- Callback: función pasada como argumento a otra función.
- Módulo: fichero JS que exporta funcionalidad.
- JSON: formato de texto para representar objetos.
- Modo estricto: modo que convierte errores silenciosos en errores explícitos.
- Spread: operador ... que expande arrays.
- Rest: operador ... que agrupa parámetros en un array.
- Enlace implícito: when this depende del objeto que invoca el método.

TEST:

TIPO_TEST:

1)
PREGUNTA: ¿Dónde puede ejecutarse JavaScript?
OPCIONES:
a) Solo en el navegador
b) Solo en el servidor
c) En navegador y en NodeJS
d) Solo en bases de datos
CORRECTA: c
EXPLICACION: JavaScript puede ejecutarse en navegador (cliente) y en NodeJS (servidor).
DIFICULTAD: facil
sourceHint: Fundamentos / Entorno de ejecución

2)
PREGUNTA: ¿Qué declaración crea una variable con ámbito de bloque?
OPCIONES:
a) var
b) let
c) global
d) static
CORRECTA: b
EXPLICACION: let define variables con ámbito de bloque delimitado por {}.
DIFICULTAD: facil
sourceHint: Fundamentos / Variables

3)
PREGUNTA: ¿Qué ocurre en la expresión '1' + 2?
OPCIONES:
a) Da error
b) 3
c) "12"
d) 21
CORRECTA: c
EXPLICACION: El operador + concatena si uno de los operandos es string.
DIFICULTAD: facil
sourceHint: Operadores / concatenación

4)
PREGUNTA: ¿Qué operador compara valor y tipo?
OPCIONES:
a) ==
b) =
c) ===
d) !=
CORRECTA: c
EXPLICACION: === realiza comparación estricta sin conversión de tipo.
DIFICULTAD: facil
sourceHint: Tipos de datos / igualdad

5)
PREGUNTA: ¿Qué devuelve JSON.parse?
OPCIONES:
a) Un string
b) Un objeto JavaScript
c) Un boolean
d) Un number
CORRECTA: b
EXPLICACION: JSON.parse convierte un string JSON en objeto JS.
DIFICULTAD: media
sourceHint: JSON

6)
PREGUNTA: ¿Qué método devuelve un nuevo array transformado?
OPCIONES:
a) forEach
b) map
c) find
d) reduce
CORRECTA: b
EXPLICACION: map transforma cada elemento y devuelve un nuevo array.
DIFICULTAD: media
sourceHint: Programación funcional / map

7)
PREGUNTA: ¿Qué método devuelve el primer elemento que cumple condición?
OPCIONES:
a) filter
b) reduce
c) find
d) forEach
CORRECTA: c
EXPLICACION: find devuelve el primer elemento que cumple el predicado.
DIFICULTAD: media
sourceHint: Programación funcional / find

8)
PREGUNTA: ¿Qué ocurre si asignas un objeto a otra variable?
OPCIONES:
a) Se crea una copia independiente
b) Se copia el valor primitivo
c) Se copia la referencia
d) Se convierte en JSON
CORRECTA: c
EXPLICACION: Las variables almacenan referencias a objetos.
DIFICULTAD: media
sourceHint: Referencia y copia

9)
PREGUNTA: ¿Qué característica tienen las funciones flecha?
OPCIONES:
a) Tienen su propio this
b) No pueden usarse como constructor
c) Permiten new
d) Soportan call y bind
CORRECTA: b
EXPLICACION: Las funciones flecha no pueden utilizarse con new.
DIFICULTAD: dificil
sourceHint: Funciones flecha

10)
PREGUNTA: ¿Qué evita el modo estricto?
OPCIONES:
a) Uso de funciones
b) Creación accidental de variables globales
c) Uso de JSON
d) Uso de arrays
CORRECTA: b
EXPLICACION: En modo estricto asignar a variable no declarada genera error.
DIFICULTAD: media
sourceHint: Modo estricto

11)
PREGUNTA: ¿Qué devuelve reduce?
OPCIONES:
a) Siempre un número
b) Siempre un array
c) Un único valor acumulado
d) Nada
CORRECTA: c
EXPLICACION: reduce devuelve un único valor que puede ser número, objeto o array.
DIFICULTAD: dificil
sourceHint: Programación funcional / reduce

12)
PREGUNTA: ¿Cómo se activan módulos en HTML?
OPCIONES:
a) <script>
b) <script module>
c) <script type="module">
d) <module>
CORRECTA: c
EXPLICACION: Para usar import/export en navegador se requiere type="module".
DIFICULTAD: media
sourceHint: Módulos en HTML


TIPO_VERDADERO_FALSO:

1)
PREGUNTA: Las funciones en JavaScript son objetos.
RESPUESTA: verdadero
EXPLICACION: Las funciones pueden asignarse a variables y pasarse como parámetros.
sourceHint: Funciones como valor

2)
PREGUNTA: Las funciones flecha tienen su propio this.
RESPUESTA: falso
EXPLICACION: Las funciones flecha no definen su propio this.
sourceHint: Funciones flecha

3)
PREGUNTA: filter modifica el array original.
RESPUESTA: falso
EXPLICACION: filter devuelve un nuevo array.
sourceHint: Programación funcional

4)
PREGUNTA: JSON.stringify convierte objeto a string.
RESPUESTA: verdadero
EXPLICACION: Devuelve representación textual en formato JSON.
sourceHint: JSON


TIPO_RESPUESTA_CORTA:

1)
PREGUNTA: Explica qué es una closure.
RESPUESTA_ESPERADA: Función que mantiene acceso a variables del ámbito externo incluso después de que la función externa haya terminado.
CRITERIOS:
- Debe mencionar ámbito externo
- Debe indicar persistencia tras ejecución
sourceHint: Ámbitos y closures

2)
PREGUNTA: Explica la diferencia entre == y ===.
RESPUESTA_ESPERADA: == compara con conversión de tipo; === compara valor y tipo sin conversión.
CRITERIOS:
- Debe mencionar conversión automática
- Debe mencionar comparación estricta
sourceHint: Igualdad estricta

