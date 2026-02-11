tema04.app
Desarrollo web en entorno cliente
Programación asíncrona
UF4

ÍNDICE
Mapa conceptual ..................................................................................... 04
1. Callbacks .............................................................................................. 05
  1.1. Funcionamiento básico ..................................................................... 05
  1.2. Programación asíncrona ................................................................... 05
  1.3. Inconvenientes de los callbacks ...................................................... 07
2. Promesas .............................................................................................. 10
  2.1. Promesas: introducción .................................................................... 10
  2.2. Creación de promesas ...................................................................... 13
  2.3. Encadenamiento de promesas .......................................................... 14
  2.4. Tratamiento de errores con promesas ............................................. 16
  2.5. Un ejemplo: API Media Devices ...................................................... 17
3. Async/await .......................................................................................... 18
  3.1. Async y await ................................................................................... 18
  3.2. Tratamiento de errores con async/await ......................................... 20
  3.3. Promesas frente a async/await ........................................................ 20
4. Solicitudes de red y API de servidor .................................................. 23
  4.1. Solicitudes AJAX .............................................................................. 23
  4.2. La API fetch ..................................................................................... 24
  4.3. Peticiones con fetch ......................................................................... 25
  4.4. Datos recibidos por fetch ................................................................ 27
  4.5. Ejemplos de uso con fetch .............................................................. 28
     A. Peticiones GET ............................................................................... 28
     B. Peticiones DELETE ......................................................................... 30
     C. Peticiones PUT ............................................................................... 30
     D. Peticiones POST ............................................................................. 31
  4.6. Objeto formData .............................................................................. 33
  4.7. Abortar peticiones ........................................................................... 33
5. Solicitudes de red y API de servidor .................................................. 34
  5.1. Trabajo con API de servidor ............................................................ 34
  5.2. Alternativas a fetch .......................................................................... 35


UF4 PROGRAMACIÓN ASÍNCRONA
Mapa conceptual
Programación asíncrona
- Callbacks
  - Funcionamiento básico
  - Programación asíncrona
  - Inconvenientes de los callbacks
- Promesas
  - Promesas: introducción
  - Creación de promesas
  - Encadenamiento de promesas
  - Tratamiento de errores con promesas
  - Un ejemplo: API Media Devices
- Async/await
  - Async y await
  - Tratamiento de errores con async/await
  - Promesas vs async/await
- Solicitudes de red y API de servidor
  - Solicitudes AJAX
  - La API fetch
  - Peticiones con fetch
  - Datos recibidos por fetch
  - Ejemplos de uso con fetch (GET/DELETE/PUT/POST)
  - Objeto formData
  - Abortar peticiones
  - Trabajo con API de servidor (CORS/REST)
  - Alternativas a fetch (axios)


01. Callbacks

1.1. Funcionamiento básico
Una función de callback es una función que se pasa como parámetro a otra función, que la
ejecutará cuando crea conveniente (normalmente, después de realizar un procesamiento).

Hemos estudiado los callbacks en algunas funciones, como la función map. Esta función
recibe una función como parámetro. La función principal, map, recibe una función callback
como parámetro. La tarea de map es recorrer los elementos de un array y ejecutar la función
de callback sobre cada uno de dichos elementos.

En el caso de map, la ejecución de la función de callback es inmediata. Se dice que es una
función síncrona: hasta que map no termine, no se sigue ejecutando la siguiente línea de
programa. A continuación puedes ver un ejemplo:

[CODE]
let letras = ["a", "b", "c"];
let letrasMayusculas = letras.map(function(letra) {
  console.log(`Convirtiendo letra '${letra}'`);
  return letra.toUpperCase();
});
console.log("Esta línea se ejecuta después de que termine 'map'");
[/CODE]

También hemos trabajado con callbacks en la gestión de eventos. Por ejemplo, la función
addEventListener permite definir una función, un callback, que se ejecuta en respuesta
a un evento determinado.


1.2. Programación asíncrona
La programación asíncrona consiste en utilizar funciones cuyo resultado no se devuelve
de manera inmediata, sino pasado un tiempo. Normalmente, ese tiempo es debido a que
hay que realizar algún tipo de procesamiento, como una operación de acceso a disco o
una operación de acceso a la red.

En esos casos, no es aceptable bloquear la ejecución del programa para esperar a que
termine dicho proceso, sino que es más conveniente permitir que el programa continúe
realizando tareas que no necesitan el resultado del proceso: cuando se complete el proceso,
se generará una especie de alarma que el entorno de ejecución detectará y pasará a ejecutar
la función de callback para procesar el resultado.

Una de las funciones más sencillas de utilizar para ilustrar el funcionamiento de la
programación asíncrona es la función setTimeout. Esta función tiene la siguiente sintaxis:
setTimeout(FUNCION_CALLBACK, TIEMPO_ESPERA);

El primer parámetro de la función es una función de callback. Dicha función se ejecutará
cuando pase el intervalo de tiempo definido en el segundo parámetro. Así, un ejemplo de
uso sería:

[CODE]
function saludar() {
  console.log("hola");
}
// Mostrará "hola" transcurridos dos segundos
setTimeout(saludar, 2000);
[/CODE]

El código declarado después de la llamada a la función setTimeout se ejecutará antes que
la función de callback:

[CODE]
function saludar() {
  console.log("hola");
}
setTimeout(saludar, 2000);
console.log("Esta línea se ejecuta ANTES de que se muestre por pantalla 'hola'");
[/CODE]

Normalmente, con callbacks se utilizan funciones anónimas:

[CODE]
setTimeout(function() {
  console.log("hola");
}, 2000);
console.log("Esta línea se ejecuta ANTES de que se muestre por pantalla 'hola'");
[/CODE]

Si ejecutamos dos funciones setTimeout de manera independiente, su procesamiento se
realiza en paralelo:

[CODE]
setTimeout(function() {
  console.log("hola");
}, 2000);

setTimeout(function() {
  console.log("adiós");
}, 3000);
[/CODE]

El programa pone en marcha los dos temporizadores casi instantáneamente. A los 2 segundos
muestra "hola" y a los 3 segundos muestra "adiós".

Si se desea lanzar un temporizador después de que termine el primero, es necesario
ejecutarlos en serie. Para ello, hay que arrancar el segundo temporizador dentro del
callback del primero. A esta técnica se la denomina anidación.


1.3. Inconvenientes de los callbacks
El uso de callbacks tiene un inconveniente relacionado con su anidación. Consideremos
un ejemplo en el que queremos encadenar varios temporizadores para que se ejecuten en
serie (uno a continuación de otro):

[CODE]
setTimeout(function() {
  console.log("Primer mensaje después de 2 segundos.");

  setTimeout(function() {
    console.log("Segundo mensaje, 3 segundos después del primero.");

    setTimeout(function() {
      console.log("Tercer mensaje, 1 segundo después del segundo.");
    }, 1000);

  }, 3000);

}, 2000);
[/CODE]

El código anterior es complicado de interpretar. Conforme profundizamos en la anidación,
el código se va desplazando a la derecha. A esto se le conoce como:
- infierno de callbacks (callback hell)
- pirámide de la perdición (pyramid of doom)

En segundo lugar, el uso de callbacks no sigue el paradigma funcional: las funciones no
devuelven resultados, sino que simplemente ejecutan código en su interior. Esto puede
crear problemas de legibilidad y uso de variables:

[CODE]
var resultado = "";
setTimeout(function() {
  resultado = "hola";
}, 2000);

console.log(resultado); // Cadena vacía: 'resultado' se actualiza cuando se ejecute el callback
[/CODE]

Por último, los callbacks pueden crear problemas si se utilizan dentro de métodos de
objetos, por el manejo de this. Ejemplo:

[CODE]
let usuario = {
  nombre: "Laura",
  saludarConRetardo: function() {
    setTimeout(() => {
      console.log(`Hola, soy ${this.nombre}`);
    }, 2000);
  }
};

usuario.saludarConRetardo();
[/CODE]

IMPORTANTE
Para evitar problemas con this, suele utilizarse función flecha en el callback, porque
hereda el this del contexto léxico.


CASO PRÁCTICO 1
UN CRONÓMETRO SENCILLO
La función setInterval funciona de manera parecida a setTimeout, pero con la diferencia
de que ejecuta la función callback de manera periódica cada intervalo de tiempo.

- let temp1 = setInterval(miFuncion, 1000) ejecutará miFuncion() cada segundo.
- Para detenerlo: clearInterval(temp1)

Enunciado:
Utilizando setInterval, crea un cronómetro que muestre el número de segundos transcurridos
en una página web. Debe incorporar un botón de inicio/parada y un botón de puesta a cero.

SOLUCIÓN
Dispones del archivo DWEC_U04_A01_CP_S.html, con el código de la solución.


02. Promesas

2.1. Promesas: introducción
La programación asíncrona tiene un objetivo fundamental: impedir que el programa principal
se quede bloqueado esperando a un proceso que va a llevar cierto tiempo.

Con callbacks se pueden gestionar resultados futuros, pero presentan inconvenientes:
- callback hell
- no devolución de resultados (no se ajusta al paradigma funcional)

Para resolver estos problemas se diseñaron las promesas.

Una promesa es un objeto que define una serie de métodos especiales y que puede devolver
un resultado en el futuro. Una promesa puede encontrarse en uno de estos tres estados:
- Pendiente (pending): el proceso está en ejecución.
- Resuelta (fulfilled): el proceso terminó con resultado.
- Rechazada (rejected): el proceso terminó con error.

Métodos:
- then: dos callbacks (resultado / error)
- catch: callback de error
- finally: callback que se ejecuta siempre

Ejemplo:

[CODE]
let a = funcionQueDevuelveUnaPromesa(parametros);

a.then(function(resultado) {
  // Procesa el resultado
}, function(error) {
  // Procesa el error
});

console.log("Me muestro antes de que se resuelva la promesa");
[/CODE]

También puede escribirse con catch:

[CODE]
let a = funcionQueDevuelveUnaPromesa(parametros);

a.then(function(resultado) {
  // Procesa el resultado
}).catch(function(error) {
  // Procesa el error
});
[/CODE]

Ejemplo con finally:

[CODE]
let a = funcionQueDevuelveUnaPromesa(parametros);

a.finally(function() {
  console.log("Primer finally");
})
.then(function(resultado) {
  // Resultado
})
.finally(function() {
  console.log("Segundo finally");
})
.catch(function(error) {
  // Error
})
.finally(function() {
  console.log("Tercer finally");
});
[/CODE]

IMPORTANTE
Se pueden encadenar varios finally. Al terminar, pasa la ejecución al siguiente método
definido de la promesa.


2.2. Creación de promesas
JavaScript permite crear promesas mediante el constructor Promise:

[CODE]
let promesa = new Promise(function(resolver, rechazar) {
  // Código que debe llamar a 'resolver' o 'rechazar'
});
[/CODE]

IMPORTANTE
En la mayoría de casos no crearás promesas manualmente. Normalmente usarás APIs que
ya devuelven promesas. Crear promesas es útil para convertir APIs con callbacks a promesas.

Ejemplo: convertir setTimeout a promesa:

[CODE]
function temporizador(tiempo) {
  return new Promise(function(resolver, rechazar) {
    setTimeout(function() {
      resolver(`Temporizador de ${tiempo} ms terminado`);
    }, tiempo);
  });
}

let t1 = temporizador(4000);
let t2 = temporizador(6000);

t1.then((resultado) => console.log(resultado));
t2.then((resultado) => console.log(resultado));

console.log("Este mensaje se muestra antes que los mensajes de los temporizadores");
[/CODE]


2.3. Encadenamiento de promesas
Las promesas pueden encadenarse porque then devuelve siempre una promesa.

[CODE]
let prom = miPromesa.then().then().then();
prom instanceof Promise; // true
[/CODE]

El valor devuelto por el callback de then puede ser:
- un valor normal (se convierte en promesa resuelta con ese valor)
- otra promesa (se espera a esa promesa)

Ejemplo:

[CODE]
miPromesa
  .then((res1) => {
    return miSegundaPromesa;
  })
  .then((res2) => {
    return 50;
  })
  .then((res3) => {
    console.log(res3); // 50
  });
[/CODE]

IMPORTANTE
Encadenar promesas no es lo mismo que ejecutar muchos then sobre la misma promesa.

Métodos para conjuntos:
- Promise.all: espera a todas y devuelve array de resultados; si una falla, se rechaza.
- Promise.race: la primera que se resuelva o se rechace determina el resultado/error.

Ejemplo Promise.all:

[CODE]
function temporizador(tiempo) {
  return new Promise(function(resolver, rechazar) {
    setTimeout(function() {
      resolver(`Temporizador de ${tiempo} ms terminado`);
    }, tiempo);
  });
}

var t1 = temporizador(3000);
var t2 = temporizador(4000);
var t3 = temporizador(6000);

Promise.all([t1, t2, t3]).then(function(resultados) {
  for (let res of resultados) {
    console.log(res);
  }
  // A los 6 segundos se mostrarán los 3 mensajes a la vez
});
[/CODE]

Ejemplo Promise.race:

[CODE]
var t1 = temporizador(3000);
var t2 = temporizador(4000);
var t3 = temporizador(6000);

Promise.race([t1, t2, t3]).then(function(resultado) {
  console.log(resultado); // el de 3 segundos
});
[/CODE]


2.4. Tratamiento de errores con promesas
Con callbacks, try/catch no captura errores asíncronos:

[CODE]
try {
  setTimeout(function() {
    throw new Error("Error muy grave");
  }, 2000);
} catch (error) {
  console.log(error.message); // no se captura aquí
}
[/CODE]

Con promesas, si se produce un error en then, la promesa se rechaza y se captura con catch:

[CODE]
function temporizador(tiempo) {
  return new Promise(function(resolver, rechazar) {
    setTimeout(function() {
      resolver(`Temporizador de ${tiempo} ms terminado`);
    }, tiempo);
  });
}

let t1 = temporizador(4000);

t1.then((resultado) => {
  throw new Error("Error personalizado");
}).catch((error) => {
  console.log(`Se ha producido un error con mensaje ${error.message}`);
});
[/CODE]


2.5. Un ejemplo: API Media Devices
Esta API proporciona acceso a dispositivos multimedia conectados al equipo (cámaras,
micrófonos, etc.).

EJEMPLO
- Documentación detallada en enlaces de la unidad.
- Archivo de ejemplo: DWEC_U04_A02_01.html


03. Async/await

3.1. Async y await
async marca una función como asíncrona y por tanto devuelve una promesa.

[CODE]
async function multiplicar(a,b) {
  return a*b;
}

let a = multiplicar(3,5);
console.log(a); // Promesa
a.then(resultado => console.log(resultado)); // 15
[/CODE]

await espera a que una promesa se resuelva y obtiene el resultado.
Solo puede utilizarse dentro de funciones async (o en módulos).

[CODE]
async function programaPrincipal() {
  function temporizador(tiempo) {
    return new Promise(function(resolver, rechazar) {
      setTimeout(function() {
        resolver(`Temporizador de ${tiempo} ms terminado`);
      }, tiempo);
    });
  }

  let a = await temporizador(3000);
  console.log(a);
}

programaPrincipal();
[/CODE]

IMPORTANTE
await suspende la ejecución de la función async hasta que la promesa se resuelva o rechace,
pero la aplicación NO queda bloqueada (por ejemplo, sigue respondiendo a eventos).


3.2. Tratamiento de errores con async/await
Se usa try/catch. Si la promesa esperada con await se rechaza, se lanza un error capturable.

[CODE]
async function programaPrincipal() {
  try {
    let a = await miFuncionAsincrona();
  } catch (error) {
    // Procesamiento del error
  }
}
[/CODE]


3.3. Promesas frente a async/await
- await solo puede usarse en módulos o dentro de funciones async.
- then/catch puede usarse en cualquier función.
- Se pueden mezclar, pero se recomienda elegir un estilo para coherencia.

Ejemplo mezcla (menos recomendable):

[CODE]
async function programaPrincipal() {
  let respuesta = await fetch("https://api.github.com/users/vuejs");
  respuesta.json().then(datos => {
    console.log(datos.login);
  });
}
programaPrincipal();
[/CODE]

Solo await (recomendado):

[CODE]
async function programaPrincipal() {
  let respuesta = await fetch("https://api.github.com/users/vuejs");
  let datos = await respuesta.json();
  console.log(datos.login);
}
programaPrincipal();
[/CODE]

Solo promesas:

[CODE]
function programaPrincipal() {
  fetch("https://api.github.com/users/vuejs")
    .then(respuesta => respuesta.json())
    .then(datos => console.log(datos.login));
}
programaPrincipal();
[/CODE]


CASO PRÁCTICO 2
PROCESAMIENTO DE MÚLTIPLES PROMESAS EN PARALELO CON ASYNC/AWAIT

Enunciado:
Crea un programa basado en promesas que lance tres temporizadores con distintos tiempos
en paralelo. A continuación, el programa debe esperar utilizando await a que finalicen los tres.
Una vez que hayan finalizado, el programa deberá mostrar en consola los valores devueltos.

SOLUCIÓN (idea):
- Lanza primero las promesas y luego usa await.
- Para esperar al conjunto, usa Promise.all y un único await.

Archivo de solución: DWEC_U04_A03_CP_S.js


04. Solicitudes de red y API de servidor

4.1. Solicitudes AJAX
AJAX permite enviar y recibir datos del servidor sin abandonar la página, evitando recargas.

Tecnologías asociadas:
- XMLHttpRequest (histórico; hoy sustituido en la mayoría por fetch)
- JSON (sustituyó a XML)
- HTML/CSS/DOM/JS para actualizar la interfaz

Ejemplos típicos:
- sugerencias en buscadores
- combos dependientes (provincia -> ciudades)
- carritos sin recarga
- actualizaciones parciales de contenido

Si casi todo se hace por AJAX, hablamos de SPA (single-page application).


4.2. La API fetch
fetch permite realizar peticiones HTTP desde JavaScript (AJAX).
fetch es asíncrona y devuelve una promesa.

IMPORTANTE
XMLHttpRequest permite mostrar progreso de carga de archivos; fetch no lo cubre igual.


4.3. Peticiones con fetch
fetch(url, opciones?)

La URL puede ser:
- string
- objeto URL
También puede usarse Request.

El objeto URL ayuda a construir parámetros correctamente:

[CODE]
var url1 = new URL("https://www.misitio.com/paginas/pagina1.php?id=123&name=name1");
console.log(url1.protocol);   // "https:"
console.log(url1.host);       // "www.misitio.com"
console.log(url1.pathname);   // "/paginas/pagina1.php"
console.log(url1.search);     // "?id=123&name=name1"
console.log(url1.searchParams.get("id"));   // "123"
console.log(url1.searchParams.get("name")); // "name1"

url1.searchParams.append("nuevo", "canción navideña");
console.log(url1.searchParams.get("nuevo")); // "canción navideña"
[/CODE]

Opciones típicas:
- method: "GET" (por defecto), "POST", "PUT", "DELETE", ...
- headers: cabeceras (objeto o Headers)
- body: datos (JSON.stringify, FormData, binario...)
  * No se permite body en GET o HEAD
- credentials: incluir cookies/auth (por defecto no)
- signal: AbortController.signal para abortar


4.4. Datos recibidos por fetch
La promesa de fetch se resuelve con un objeto Response.

Propiedades:
- status (número)
- statusText (texto)
- ok (booleano; true si 200..299)
- type (texto)
- headers (Headers)
- body (ReadableStream)

Métodos (devuelven promesas):
- text()
- json()
- formData()
- blob()

Normalmente hay dos promesas:
1) fetch() -> Response
2) response.json() (o text(), etc.) -> datos


4.5. Ejemplos de uso con fetch

A) Peticiones GET
Async/await:

[CODE]
async function programaPrincipal() {
  try {
    let respuesta = await fetch("https://www.miservidor.com/usuarios");

    if (respuesta.ok) {
      let datos = await respuesta.json();
      console.log(datos);
    } else {
      console.log("Error de red");
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

programaPrincipal();
[/CODE]

Con promesas:

[CODE]
fetch("https://www.miservidor.com/usuarios")
  .then(function(respuesta) {
    if (respuesta.ok) {
      return respuesta.json();
    } else {
      throw new Error("Ha habido un error");
    }
  })
  .then(function(datos) {
    // Tratamiento de los datos
  })
  .catch(function(error) {
    console.log(`Error: ${error.message}`);
  });
[/CODE]

GET con parámetros usando URL:

[CODE]
let url1 = new URL("https://www.miservidor.com/usuarios");
url1.searchParams.append("nombre", "Laura");

fetch(url1);
// ...then/catch o await...
[/CODE]


B) Peticiones DELETE
[CODE]
fetch("https://www.miservidor.com/usuarios/usuario2", {
  method: "DELETE"
})
.then(function(respuesta) {
  if (respuesta.ok) {
    console.log("Borrado con éxito");
  } else {
    throw new Error("Ha habido un error");
  }
})
.catch(function(error) {
  console.log(`Error: ${error.message}`);
});
[/CODE]


C) Peticiones PUT
[CODE]
async function programaPrincipal() {
  let usuario1 = { nombre: "Laura", apellidos: "Pérez" };

  try {
    let respuesta = await fetch("https://www.miservidor.com/usuarios/usuario1", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify(usuario1)
    });

    if (respuesta.ok) {
      console.log("Petición PUT realizada con éxito.");
      let datos = await respuesta.json();
      // Tratamiento de datos...
    } else {
      console.log("Error de red");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

programaPrincipal();
[/CODE]


D) Peticiones POST
[CODE]
async function programaPrincipal() {
  let usuario1 = { nombre: "Inés", apellidos: "Martínez" };

  try {
    let respuesta = await fetch("https://www.miservidor.com/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify(usuario1)
    });

    if (respuesta.ok) {
      console.log("Petición POST realizada con éxito.");
      let datos = await respuesta.json();
      // Tratamiento de datos...
    } else {
      console.log("Error de red");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

programaPrincipal();
[/CODE]


4.6. Objeto formData
Para multipart/form-data (formularios y subida de ficheros) se utiliza FormData.
Si body es FormData, no es necesario indicar Content-Type manualmente.

EJEMPLO
Archivo: DWEC_U04_A04_01.html


4.7. Abortar peticiones
Para abortar fetch: AbortController.

[CODE]
const controlador = new AbortController();

fetch("http://misitio.com/usuarios", {
  signal: controlador.signal
})
.then(response => {
  // Tratar respuesta
})
.catch(error => {
  if (error.name === "AbortError") {
    console.log("Petición cancelada");
  } else {
    console.error("Error:", error);
  }
});

// Abortar la petición
controlador.abort();
[/CODE]

IMPORTANTE
AbortController puede usarse con otras funciones asíncronas si aceptan señal (signal).


05. Solicitudes de red y API de servidor

5.1. Trabajo con API de servidor
Arquitectura habitual: cliente (SPA) + servidor (API) separados.
La API se consume con HTTP (GET/POST/PUT/DELETE). A esto se le suele llamar REST.

Restricción del navegador:
- Una página no puede pedir libremente recursos a otro dominio (same-origin policy).
- Para permitirlo existe CORS (configurado en el servidor).

Resumen:
- Mismo dominio: fetch funciona sin CORS extra.
- Distinto dominio: el servidor debe habilitar CORS.


5.2. Alternativas a fetch
fetch está definida en navegadores.
En NodeJS, se usa habitualmente una librería como axios (promesas), que simplifica
ciertas tareas y no requiere dos promesas para parsear JSON como patrón típico.

EJEMPLO
Documentación de axios en enlaces de la unidad.
