Desarrollo web en entorno cliente
Autenticación y
despliegue de
aplicaciones en
entorno cliente
UF7
02
ÍNDICE
Mapa conceptual ..................................................................................... 03
1. Autenticación de aplicaciones web ..................................................... 04
1.1. Fundamentos de autenticación ������������������������������������������������������������ 04
1.2. Autenticación básica ����������������������������������������������������������������������������� 04
1.3. Autenticación basada en sesiones ������������������������������������������������������ 07
1.4. Autenticación basada en tokens: OpenId y OAuth ���������������������������� 09
2. Integración continua .............................................................................13
2.1. Fundamentos y definiciones ���������������������������������������������������������������� 13
2.2. GitHub Actions �������������������������������������������������������������������������������������� 14
2.3. Gestión de secretos ����������������������������������������������������������������������������� 16
3. Fundamentos de despliegues .............................................................19
3.1. Fundamentos del despliegue de aplicaciones ����������������������������������� 19
4. Despliegue en servidores cloud ...........................................................21
4.1. Despliegue en GitHub Pages ��������������������������������������������������������������� 21
4.2. Despliegue en servicios cloud: AWS S3 y Azure Blob Storage �������� 23
4.3. Despliegue de aplicaciones mediante integración continua ������������ 24
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
03
Mapa conceptual
Autenticación y despliegue de
aplicaciones en entorno cliente
Autenticación de
aplicaciones web
Integración
continua
Despliegue en
servidores cloud
Fundamentos y
definiciones
Fundamentos del
despliegue de
aplicaciones
Fundamentos de
autenticación
GitHub
Actions
Gestión de
secretos
Despliegue en
GitHub Pages
Autenticación basada
en sesiones
Autenticación
básica
Despliegue en
servicios cloud:
AWS S3 y Azure
Blob Storage
Despliegue de
aplicaciones
mediante integración
continua
Autenticación basada
en tokens: Openid y
OAuth
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
04
01 Autenticación de aplicaciones
web
1.1. Fundamentos de autenticación
En muchas ocasiones, las aplicaciones web requieren autenticación para acceder a sus
recursos. Existen multitud de mecanismos de autenticación que se pueden utilizar para
ello, y cada uno de ellos tiene sus ventajas e inconvenientes. Además, algunos son más
apropiados que otros en función del tipo de aplicación web de que se trate: aplicación
web convencional o SPA.
La gran mayoría de aplicaciones web utilizan el protocolo HTTP para enviar y recibir datos
al servidor. Dado que HTTP es un protocolo sin estado, para cada petición se tienen que
proporcionar las credenciales de acceso. Para evitar tener que pedir al usuario dichas
credenciales con cada petición, existen diferentes métodos que permiten almacenar las
credenciales en la aplicación.
Dependiendo del tipo de aplicación web que se vaya a desarrollar, podremos elegir el tipo
de autenticación que utilizar o estaremos obligados a adoptar uno en concreto:
>> En el caso de aplicaciones web convencionales basadas en páginas dinámicas
creadas por el servidor, será la lógica de servidor la que defina el tipo de
autenticación que habrá que utilizar.
>> En el caso de aplicaciones web formadas por un cliente de tipo SPA que necesite
acceder a recursos de una API, tanto si dicha API forma parte de la aplicación como
si es una API de terceros (como Google o Facebook), será necesario utilizar un
mecanismo de autenticación compatible con el de dicha API.
>> En el caso de aplicaciones web formadas por un cliente SPA que no utilice lógica
de servidor, será posible elegir los mecanismos de autenticación para poder tener
acceso a dicho cliente.
Después, introduciremos los mecanismos de autenticación más utilizados hoy.
1.2. Autenticación básica
Es un tipo de autenticación que consiste en enviar las credenciales de usuario (en forma
de usuario y la contraseña) con cada petición. Es el mecanismo más sencillo de utilizar.
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
05
Navegador
Navegador
Servidor
Servidor
Comprobación de
credenciales: no hay
Comprobación de
credenciales
Comprobación de
credenciales
Acceso a recurso protegido #1
Acceso a recurso protegido #1 + usuario/contraseña
Acceso a recurso protegido #2 + usuario/contraseña
Acceso prohibido (401)
Página de recurso protegido #1
Página de recurso protegido #2
Aplicación convencional – Autenticación básica
Esquema 1. Proceso de autenticación de aplicaciones web.
El servidor puede indicar al navegador que el recurso utiliza autenticación básica mediante
la cabecera HTTP de respuesta www-authenticate: Basic. De esta manera, el primer
acceso a una URL del dominio de la aplicación pide automáticamente las credenciales
al usuario a través de un cuadro de diálogo estándar del navegador. A continuación,
el navegador almacena las credenciales en caché y las reenvía automáticamente en
sucesivas peticiones a URL del mismo dominio. Lo mismo sucede con peticiones AJAX
a través de fetch: se incluirán los datos de autenticación que haya pedido previamente el
navegador en el dominio actual.
En el caso de querer obtener el usuario y contraseña por otros medios (como, por
ejemplo, a través de un formulario), bien porque el servidor no utiliza la cabecera
www-authenticate: Basic, bien porque se desea utilizar un formulario de login accesible
a través de una página pública, es posible realizar peticiones AJAX con fetch y autenticación
básica de la siguiente manera:
// Usuario y contraseña obtenidos por otros métodos,
// como, por ejemplo, un formulario
let usuario = ‘usuario’;
let password = ‘password’;
// Cabeceras de petición
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
06
let headers = new Headers();
// Cabecera de autorización
// ¡Ojo con el espacio en blanco después de ‘Basic’!
// La función ‘btoa’ convierte a código Base64
headers.set(‘Authorization’, ‘Basic ‘ + btoa(username + “:” + password));
// Petición ‘fetch’ con cabecera de autenticación
fetch(url, {
method:’GET’,
headers: headers
});
También es posible acceder a un recurso protegido con autenticación básica a través de la
URL del navegador de la siguiente manera:
https://usuario:password@midominio.com/recurso_protegido
La ventaja principal de este mecanismo de autenticación es su sencillez. Muchas API
(como la API de GitHub) proporcionan acceso a sus recursos a través de este mecanismo.
Normalmente, dichas API permiten la creación de tokens de acceso que sustituyen a las
contraseñas de usuario. Las ventajas que proporciona el uso de tokens de acceso son las
siguientes:
>> No es necesario utilizar la contraseña principal de la cuenta.
>> Pueden anularse.
>> Es posible definir permisos de acceso a los diferentes servicios de la API. Por ejemplo, la
API de GitHub permite crear un token de solo lectura de acceso a los repositorios: si se
utiliza dicho token no se podrán realizar modificaciones sobre los repositorios ni acceder a
otro tipo de servicios, como la publicación de comentarios.
Ventajas
Entre los inconvenientes de este tipo de autenticación, podemos citar los siguientes:
>> Cierre de sesión. No hay un mecanismo estándar para el cierre de sesión: suele ocurrir por
inactividad o por cierre del navegador.
>> Seguridad. El envío de las credenciales se realiza en claro, por lo que este mecanismo solo
debe utilizarse con HTTPS. Además, las credenciales se envían con cada petición, lo que
aumenta la vulnerabilidad frente a posibles ataques.
>> Integración. No incorpora funcionalidades para acceder a servicios de terceros (como
Google o Facebook).
>> Envío de credenciales. El usuario debe compartir su contraseña con la aplicación.
Inconvenientes
Esquema 2. Ventajas e inconvenientes de la autenticación de aplicaciones web.
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
07
1.3. Autenticación basada en sesiones
En aplicaciones web convencionales basadas en páginas dinámicas creadas por el
servidor, la lógica de cliente y la lógica de servidor están fuertemente interconectadas.
En este tipo de aplicaciones suele ser muy habitual utilizar mecanismos de autenticación
basados en sesiones:
Navegador
Navegador
Servidor
Servidor
Comprobación de
identificación de sesión
Comprobación de
credenciales
Comprobación de
identificación de sesión
Eliminación del
identificador de sesión
Creación de identificación
de sesión y almacenamiento
Página de recurso protegido #1
Envío de credenciales
Acceso a recurso protegido #2 + cookie de sesión
Acción de cierre de sesión
Sesión inexistente: redirige a página de login
Página de recurso protegido #1 + cookie de sesión
Página de recurso protegido #2 + cookie de sesión
Aplicación convencional – Sesiones
Esquema 3. Proceso de autenticación basado en sesiones.
Mediante este mecanismo, se evita tener que enviar las credenciales de acceso (normalmente
usuario y contraseña) con cada petición. En su lugar, se crea un identificador de sesión
que se asocia con el usuario autenticado: siempre que las futuras peticiones incluyan una
cookie con dicho identificador de sesión, se considerarán peticiones autenticadas.
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
08
En este tipo de aplicaciones, la lógica de cliente no necesita realizar ninguna acción en
especial: el servidor envía una cookie con un identificador de sesión, que es almacenada
en el navegador; el navegador reenvía automáticamente dicha cookie con las siguientes
peticiones a páginas de la aplicación que se encuentren alojadas en el mismo dominio. El
envío de cookies también se realiza automáticamente en peticiones AJAX con fetch.
La autenticación puede realizarse de cualquier manera: mediante usuario y contraseña,
que se almacenen en una base de datos propia, o mediante un servidor de autorización
de un proveedor externo, como Google o Microsoft. En cualquier caso, el proceso termina
con el envío de una cookie con el identificador de sesión. Las ventajas de este tipo de
autenticación son las siguientes:
VENTAJAS Es un sistema ampliamente utilizado y comprobado durante muchos
años.
Está implementado de manera nativa o a través de librerías en la
práctica totalidad de lenguajes y frameworks de lógica de servidor.
Es sencillo de implementar.
Salvo casos especiales, no necesita de ninguna configuración en la
lógica de cliente.
Por otro lado, presenta una serie de inconvenientes:
INCONVENIENTES Creación y mantenimiento de sesiones. El servidor debe almacenar la
variable de sesión y el usuario asociado a esta. Este proceso consume
recursos en el servidor y además puede ser lento si dicha información se
almacena en un fichero o una base de datos convencional. Este problema
se minimiza si la información se almacena en memoria o en una base de
datos de tipo caché, como Redis o Memcached.
Escalabilidad. Si la aplicación soporta un gran número de peticiones,
puede ser necesario aumentar el número de servidores para
atenderlas. En este caso, es posible que distintas peticiones del mismo
cliente no sean atendidas por la misma instancia de servidor: si las
variables de sesión se almacenan en memoria, se producirán fallos de
autenticación. Este problema se puede solucionar utilizando sticky
sessions (mecanismo que garantiza que todas las peticiones con el
mismo identificador de sesión sean atendidas por la misma instancia de
servidor) o sistemas de almacenamiento rápido centralizado, como Redis
o Memcached.
Peticiones CORS. Si las peticiones se realizan desde aplicaciones
nativas o desde aplicaciones SPA alojadas en un dominio diferente, será
necesario realizar una configuración adicional para permitir el envío de
cookies entre dominios distintos.
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
09
Ataques XSS. Un ataque de tipo cross-site scripting puede provocar la
inyección de código JavaScript malicioso que acceda a los datos de la
cookie de sesión. Para evitarlo, se debe definir la cookie de sesión como
cookie de tipo HttpOnly.
Ataques CSRF. Un ataque de tipo cross-site request forgery, o falsificación
de petición en sitios cruzados, puede provocar el robo de la cookie
que almacena la variable de sesión de un sitio web. Una vez obtenida,
un atacante puede utilizarla para autenticarse en nombre del atacado.
Para evitar este tipo de ataques, se suelen utilizar campos ocultos de
formulario con información generada por el servidor, de manera que se
garantice que el envío de datos proviene de un formulario fiable.
1.4. Autenticación basada en tokens: OpenId y
OAuth
Este tipo de autenticación suele utilizarse con aplicaciones SPA. Su funcionamiento y su
configuración presentan cierta complejidad, por lo que solo los estudiaremos de manera
superficial. Las tecnologías que más se utilizan en la actualidad son OAuth y OpenId.
Al trabajar con estas tecnologías se suelen mezclar dos conceptos: autenticación, que
es el proceso de acreditación de identidad (es decir, afirmar que una persona es quien
dice ser), y autorización, que es el proceso encargado de verificar qué acciones puede
realizar una persona (permisos). OpenId es un estándar para procesos de autenticación,
mientras que OAuth es un estándar para procesos de autorización (aunque también se
utiliza para autenticación).
Normalmente utilizaremos estas tecnologías en las siguientes situaciones:
>> En aplicaciones SPA que necesiten hacer uso de API propias o de terceros.
Por ejemplo, una aplicación que necesite acceder a los tuits o a los mensajes de
Facebook de una persona: en este caso, la aplicación necesitará los servicios de
autenticación, para identificarse con un nombre de usuario, y autorización, para
que la aplicación pueda acceder a la API correspondiente (Twitter, Facebook) y
realizar las acciones deseadas (lectura de tuits o de mensajes).
>> En aplicaciones SPA que no necesiten acceder a API de terceros, pero que deseen
proporcionar acceso a través de un servicio de autenticación externo, como
los proporcionados por Google o Meta (Facebook). El proceso de autenticación
a través de estas tecnologías culmina con la obtención de un token en formato
JWT. Un token JWT no es una simple cadena de texto, sino que contiene un objeto
JSON que almacena la información de una persona (nombre de usuario, URL de
avatar, dirección de correo electrónico). El token JWT además está firmado por el
proveedor de identidad (el emisor del token). La mayoría de las grandes empresas
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
10
de Internet ofrecen sus servicios como proveedores de identidad: Google, Microsoft
o Meta (Facebook), por poner algunos ejemplos. Una vez obtenido un token, es
posible utilizarlo como mecanismo de autenticación.
Las principales ventajas del uso de tokens JWT son:
>> No es necesario utilizar la contraseña principal de la cuenta.
>> No es necesario almacenar credenciales en el servidor. Los tokens incluyen la información
para identificar al usuario, por lo que el servidor solo necesita leer los datos del token para
obtener los datos del usuario. Adicionalmente, a través de su firma es posible comprobar
que el token es válido y que no está falsificado. Ambas operaciones son mucho más rápidas
que realizar una consulta a la base de datos para comprobar las credenciales de usuario.
>> Pueden ser utilizados sin sesiones. Esto es especialmente útil en aplicaciones SPA que no
trabajen con lógica de servidor: de esta manera, pueden identificar a la persona a través del
token JWT sin necesidad de almacenar el listado de usuarios en ningún sitio.
>> Es una tecnología sin estado. Por ello, funcionan muy bien con el protocolo HTTP.
>> Pueden incluir información adicional. Por ejemplo, pueden incluir un listado de servicios a
los que la persona puede acceder.
>> Son estándar.
>> Favorecen la escalabilidad. Dado que la lógica de servidor puede autenticar al usuario
directamente a través del token y este se incluye en cada petición, diferentes instancias de
servidor pueden procesar peticiones del mismo usuario sin provocar fallos de sesión.
Ventajas
Y entre sus inconvenientes podemos citar:
>> Cierre de sesión. Dado que el servidor solo comprueba el token enviado por el cliente, no
tiene manera de cerrar la sesión: si se utiliza un token no caducado, se podrá acceder a la
aplicación.
>> Invalidar tokens. Aunque es posible marcar un token como no válido, ello supondría
almacenar el listado de tokens invalidados en algún sistema de almacenamiento y comprobar
cada token enviado por cada petición, lo que tendría, por tanto, los mismos inconvenientes
que los sistemas tradicionales basados en el almacenamiento de credenciales.
>> Complejidad. Los estándares definen varias maneras de implementar estos flujos de
autenticación, por lo que en ocasiones puede ser complicado elegir el más idóneo.
>> Seguridad. Si alguna persona logra apoderarse de un token JWT, tendrá acceso a los
servicios a los que proporcione acceso. Este problema se puede minimizar generando
tokens con tiempos de vida cortos.
>> Madurez. Aunque existen muchas librerías para trabajar con estas tecnologías, en ocasiones
las implementaciones que se realizan no son lo suficientemente seguras, debido a que son de
más reciente aparición y no han sido probadas en un número significativo de aplicaciones.
Inconvenientes
Esquema 4. Ventajas e inconvenientes de la autenticación basada en tokens.
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
11
La autenticación basada en los estándares OAuth/Openid puede implementarse de varias
maneras, denominadas flujos (flows en inglés). Existen varios flujos diferentes, cada uno
de los cuales está pensado para un tipo de aplicación. En concreto, para aplicaciones de
tipo SPA se recomiendan en la actualidad los siguientes:
>> Aplicación web formada únicamente por una aplicación SPA, sin lógica de servidor.
En este caso, la aplicación SPA es la encargada de realizar las tareas de obtención
y gestión del token y de utilizarlo en caso de necesitarlo para realizar peticiones a
servicios que requieran autenticación. Este flujo se considera más inseguro, ya que
el token es accesible a través del código JavaScript del cliente SPA.
>> Aplicación web formada por una aplicación SPA y un servicio de lógica de servidor.
El modo de trabajo recomendado es muy parecido a la autenticación basada en
sesiones. La lógica de servidor se encargaría de todas las tareas de obtención
y gestión del token, incluyendo la redirección al servidor de autenticación
correspondiente, mientras que crearía una sesión independiente con la aplicación
SPA a través de una cookie tradicional. Si la aplicación necesita acceder a un servicio
externo, el cliente SPA realiza la petición a la lógica de servidor, que actúa como
intermediaria y se encarga de utilizar el token para realizar la acción y devolver
el resultado al cliente SPA. Pese a que este flujo en apariencia no aporta ninguna
ventaja con respecto al uso de sesiones tradicionales, es el flujo recomendado
desde el punto de vista de la seguridad y la sencillez. De hecho, existe una
estrategia denominada backend for frontend, o BFF, que consiste en desarrollar
un servicio de lógica de servidor exclusivamente para las tareas de autenticación
segura de un cliente SPA.
Desde el punto de vista del desarrollo en entorno cliente, si la aplicación incluye lógica de
servidor, no habrá que realizar ninguna configuración especial, ya que el cliente SPA se
limitará a comunicarse con el servidor a través de una cookie de sesión, tal como hemos
estudiado en la sección anterior.
En el caso de querer diseñar una aplicación SPA sin lógica de servidor, normalmente alojada
en un servidor web de tipo estático, el procedimiento sería el siguiente:
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
12
Navegador
Navegador
Servidor web
estático
Servidor web
estático
Comprobación
de
token
Lectura y comprobación del token
Acceso a cliente SPA
Petición de login
Petición AJAX a recurso externo + token JWT
Envío de recurso externo
Envío de token JWT
Carga de aplicación SPA
Descarga de cliente SPA
Servicio externo . Openid +JWT
Servidor de
autenticación
Servidor de
autenticación
Servicio
externo
Servicio
externo
Aplicación SPA
Aplicación
SPA
Esquema 5. Proceso de autenticación basado en tokens.
El almacenamiento del token JWT suele realizarse en la memoria de la aplicación en forma
de variable de estado, aunque también es posible almacenarlo en una cookie de tipo
HttpOnly. No es recomendable utilizar el almacenamiento local o el almacenamiento de
sesión del navegador, porque sería vulnerable a código JavaScript malicioso que pudiera
ser inyectado en la aplicación.
Para realizar peticiones AJAX autenticadas con JWT mediante fetch se puede utilizar la
cabecera Authorization: Bearer TOKEN_JWT. A continuación se muestra un ejemplo:
// Token JWT obtenido del servidor de autenticación
let tokenJWT = “TOKENJWT”;
// Cabeceras de petición
let headers = new Headers();
// Cabecera de autorización
// ¡Ojo con el espacio en blanco después de ‘Bearer’!
headers.set(‘Authorization’, ‘Bearer ‘ + tokenJWT);
// Petición ‘fetch’ con cabecera de autenticación
fetch(url, {
method:’GET’,
headers: headers
});
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
13
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
El procedimiento de conexión a un servidor de autenticación y obtención del token está
formado por varios pasos que implican redirecciones, envío de peticiones POST y en
ocasiones el uso de iframes. Por ello, es recomendable el uso de librerías específicas
para incorporar esta funcionalidad. Existen multitud de ellas para utilizar con diferentes
frameworks (Vue, Angular, React) y proveedores de identidad (Google, Microsoft, etcétera).
VÍDEOLAB
Para consultar el siguiente vídeo sobre Autenticación de aplicaciones, escanea el
código QR o pulsa aquí.
02 Integración continua
2.1. Fundamentos y definiciones
La integración continua, o continuous integration en inglés, es una metodología de
trabajo que consiste en incorporar los cambios de código producidos por las personas
desarrolladoras de un proyecto en una rama de código común de manera frecuente. El
procedimiento más habitual consiste utilizar un sistema de control de versiones, que suele
ser git, con un repositorio común. Dicho repositorio está formado por una rama principal,
que almacena el código listo para ser llevado a producción, y un conjunto de ramas de
desarrollo utilizadas por los participantes del proyecto para realizar sus cambios. El flujo
de trabajo que se suele utilizar es el siguiente:
>> Cada persona realiza cambios en su rama personal de trabajo.
>> Una vez terminada la funcionalidad en la que se está trabajando, se hace una
solicitud de integración para incorporar los cambios a la rama principal. En función
del proyecto, este paso puede necesitar la aprobación de alguna otra persona del
equipo.
>> Una vez aprobada la integración, se lanza una tarea de integración continua, que
consiste en la ejecución de pruebas automáticas sobre el código de la aplicación
con los cambios introducidos.
>> Si se superan las pruebas, se ejecutan una serie de acciones adicionales, como
el envío de notificaciones o el despliegue de la aplicación con los nuevos cambios.
>> En caso contrario, se genera una alerta y se cancelan las acciones posteriores.
14
Esta metodología suele combinarse con la metodología de desarrollo guiado por pruebas
(o test-driven development, TDD, en inglés). En ella, cada persona desarrolladora define
nuevos test para comprobar la funcionalidad que está desarrollando. La tarea de integración
continua se encarga de ejecutar todos los test, antiguos y nuevos, para garantizar que los
nuevos cambios no afectan a las funcionalidades anteriormente desarrolladas.
Algunas de las ventajas de la integración continua son:
>> Permite generar actualizaciones de manera más rápida.
>> Permite detectar fallos lo antes posible.
>> Las pruebas se ejecutan de manera automática tras cada envío de código a la rama
principal de desarrollo.
En ocasiones es interesante realizar la publicación o el paso a producción de los nuevos
cambios de manera automática una vez que se haya comprobado que superan las
pruebas. En este caso, el concepto de integración continua se amplía y recibe el nombre de
despliegue continuo o entrega continua. Esta metodología añade los siguientes pasos,
que se ejecutarán únicamente si se supera la fase de ejecución de pruebas:
>> Compilación o generación de la aplicación. Por ejemplo, es posible lanzar el proceso
de compilación de una aplicación Angular o Vue.
>> Despliegue. Una vez compilada la aplicación, es posible automatizar su despliegue
o publicación en un servidor. Si el proceso de despliegue es manual, se habla de
continuous delivery, o entrega continua; si el proceso de despliegue es automático,
se habla de continuous deployment, o despliegue continuo.
2.2. GitHub Actions
Existen muchos servicios de integración continua. La mayoría de ellos utiliza máquinas
virtuales para realizar el procesamiento (ejecución de test, compilación, conexión con
servidores de despliegue) del código de la aplicación. Dichos servicios suelen ser servicios
de pago que tarifican por tiempo de procesamiento, normalmente medido en minutos. La
mayoría suele incluir una capa gratuita, que permite trabajar con proyectos pequeños.
Uno de los servicios de integración continua más fáciles de utilizar es el servicio
proporcionado por GitHub. Este servicio, denominado GiHub Actions, permite crear
una serie de flujos de trabajo para realizar tareas automatizadas conectadas con los
repositorios de GitHub. Entre sus funcionalidades podemos destacar:
>> Integración continua. Es posible configurar acciones para ejecutar test cada vez
que se publiquen cambios en determinadas ramas del repositorio.
>> Compilación de aplicaciones.
>> Despliegue en servicios web.
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
15
>> Envío de mensajes automatizados (mediante servicios como Slack) al subir código
o superar test.
>> Acceso a un marketplace de acciones creadas por la comunidad.
El flujo de trabajo con GitHub Actions consta de los siguientes pasos:
Creación del fichero
de configuración
En primer lugar, es necesario definir uno o varios ficheros de
configuración en formato YAML para cada uno de los flujos de
integración continua que queramos crear. Dichos archivos se guardan
en la carpeta ./github/workflows/ del repositorio. Es posible
definir dichos ficheros a mano o utilizar alguno de los asistentes
proporcionados por GitHub para utilizar algunos de los flujos
predefinidos o disponibles en su marketplace. En estos ficheros se
indicarán también las ramas cuyos cambios activarán el proceso de
integración continua.
Creación o
modificación de test
Durante la fase de desarrollo, se irán definiendo nuevos test, que serán
incorporados al repositorio.
Publicación de
cambios
Todos los cambios que lleguen a las ramas seleccionadas en
los ficheros de configuración vía push o vía pull request
(dependiendo de la configuración elegida) activan la ejecución de un
trabajo de integración continua.
Ejecución de la
tarea de integración
continua
El servicio GitHub Actions detecta los nuevos cambios y lanza el trabajo
de integración continua. Este trabajo comprende las siguientes etapas:
1. Se crea una máquina virtual con el sistema operativo elegido
(normalmente, GNU/Linux).
2. Se clona el repositorio en dicha máquina virtual.
3. Se instalan las dependencias del proyecto: lenguajes de
programación, librerías, etc. Para ello, se suele utilizar el gestor de
paquetes de la tecnología elegida: composer, npm, nuGet,
maven…
4. Se ejecutan los test que se hayan indicado en el proyecto.
5. Si se pasan los test, se ejecutan las acciones adicionales
definidas: envío de notificaciones, despliegue en servidores,
creación de archivos ejecutables, etcétera.
Notificación de
resultados
Se notifica el resultado de la ejecución de la tarea en la página de
GitHub del repositorio correspondiente.
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
16
Fig. 1. Ejemplo GitHub Actions.
IMPORTANTE
En la documentación complementaria de la unidad, dispones de un enlace a un repositorio
de ejemplo de integración continua con GitHub Actions.
2.3. Gestión de secretos
Es habitual que las tareas de integración continua necesiten acceder a servicios externos
para realizar alguna acción. El caso más habitual es el despliegue de la aplicación en un
servicio externo que necesite credenciales de acceso. En estos casos, nos encontramos
con que el proceso de integración continua debe tener acceso a información sensible,
como pueden ser dichas credenciales.
Lógicamente, por cuestiones de seguridad, no se deben almacenar las credenciales en
ningún fichero del repositorio. En su lugar, es necesario utilizar el mecanismo de gestión
de secretos del proveedor de integración continua. En el caso de GitHub Actions, es
posible definir dichos secretos en forma de variables en la configuración de ajustes del
repositorio. Dichas variables estarán disponibles en la máquina virtual creada para el trabajo
de integración continua y podrán ser accesibles tanto por el fichero de configuración de
la acción como por los archivos de la aplicación. Por ejemplo, si una tarea de despliegue
necesita un identificador y un token para publicar la aplicación en un servicio de AWS, es
posible definir dos variables de secretos de repositorio; por ejemplo, AWS_TOKEN y AWS_
ID, y utilizarlas en el archivo de configuración de GitHub Actions de la siguiente manera:
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
17
steps:
- name: Despliegue de aplicación
uses: actions/aws-despliegue@v0
with:
AWS_TOKEN: ${{ secrets.AWS_TOKEN }}
AWS_id: ${{ secrets.AWS_ID }}
Mediante la referencia a ${{ secrets.VARIABLE_SECRETA }}, es posible acceder al
secreto correspondiente y pasar su contenido a la acción que se desee utilizar. En el caso
de que se necesite proporcionar los datos al código de la aplicación, es posible utilizar un
tipo variables de entorno, que serán visibles dentro del sistema operativo de la máquina
virtual que ejecute la acción.
Fig. 2. Ejemplo GitHub Actions.
Fig. 3. Ejemplo GitHub Actions.
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
18
1 CASO PRÁCTICO
INTEGRACIÓN CONTINUA CON GITHUB ACTIONS
Crea un repositorio en GitHub y añade un flujo de trabajo de GitHub Actions para que
se ejecuten test automáticamente con cada cambio que se suba. Puedes utilizar como
base el repositorio proporcionado. Una vez subido, añade alguna función o test nuevos y
comprueba que se ejecutan las acciones.
En la siguiente pantalla, dispones del archivo DWEC_U07_A02_CP_E.zip, que contiene un
repositorio de ejemplo.
SOLUCIÓN
Debes crear un repositorio nuevo y añadir los archivos proporcionados en el repositorio de
ejemplo. Si todo ha ido bien, verás que al subir los cambios se ejecuta el flujo de GitHub
Actions. Si no lo hace, accede a la pestaña GitHub Actions y activa la función.
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
19
03 Fundamentos de despliegues
3.1. Fundamentos del despliegue de aplicaciones
Una vez finalizada la fase de desarrollo, es necesario publicar la aplicación web en un
servidor para que pueda ser accesible a través de Internet.
Las aplicaciones tradicionales generadas a través de páginas dinámicas de servidor
necesitan ser alojadas en un servicio compatible con la lógica de servidor utilizada: PHP,
NodeJS, Java, etcétera. Este tipo de despliegues se aborda en el módulo de Desarrollo
Web en Entorno Servidor, por lo que no lo estudiaremos en este apartado.
Sí trataremos el despliegue de aplicaciones de tipo SPA. Este tipo de aplicaciones únicamente
utiliza archivos HTML, CSS y JavaScript, por lo que pueden alojarse en servidores web
estáticos: es decir, servidores que se limitan exclusivamente a servir archivos a través de
HTTP.
IMPORTANTE
El hecho de que el cliente SPA de una aplicación web esté alojado en un servidor distinto
del backend no significa que tengan que tener nombres de dominio distintos: es posible
configurar el servidor DNS del dominio de la aplicación para que ambos sean accesibles a
través de diferentes rutas bajo el mismo nombre de dominio.
El despliegue de aplicaciones SPA implica los siguientes pasos:
>> Compilación de la aplicación. Este paso solo será necesario si la aplicación se ha
desarrollado con algún framework que lo exija, como Vue, Angular o React.
>> Conexión al servicio de alojamiento web y envío de los archivos de la aplicación.
Tradicionalmente, el despliegue de este tipo de aplicaciones se ha realizado de manera
manual, mediante algún servicio de transferencia de ficheros, como FTP. En la actualidad,
esta tarea se puede realizar de manera automática mediante servicios de despliegue
continuo, como GitHub Actions.
Existe un gran número de servicios que permiten alojar sitios web estáticos. A continuación,
estudiaremos algunas de las opciones más interesantes.
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
20
2 CASO PRÁCTICO
USO DE GITHUB PAGES
Crea un sitio GitHub Pages en tu cuenta de usuario de GitHub. Incluye un fichero index.html
con tu nombre y tus apellidos. Comprueba que puedes acceder vía web al sitio publicado.
SOLUCIÓN
Debes crear un repositorio con el nombre TUNOMBREDEUSUARIO.github.io dentro de
tu cuenta de GitHub. Una vez creado, accede a la pestaña de ajustes, sección Pages, y
comprueba que el servicio de GitHub Pages está activo.
Cuando hayas creado el repositorio y activado el servicio, sube un archivo index.html con
tu nombre y apellidos. Espera unos pocos segundos y accede al sitio publicado a través de
https://TUNOMBREDEUSUARIO.github.io. En ocasiones se produce algún fallo de caché,
así que, si no puedes acceder, espera unos minutos para intentarlo de nuevo.
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
21
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
04 Despliegue en servidores
cloud
4.1. Despliegue en GitHub Pages
GitHub proporciona un servicio de alojamiento web estático denominado GitHub Pages.
Este servicio ofrece hasta 1 GB de alojamiento gratuito para aplicaciones web que utilicen
exclusivamente tecnologías HTML, CSS y JavaScript. Es un servicio muy apropiado para
proyectos pequeños que no incluyan archivos grandes. Pueden alojarse también imágenes
y otro tipo de archivos estáticos cuyo tamaño no sea excesivamente grande. Este servicio
suele utilizarse para crear blogs personales, páginas de documentación o proyectos
personales como portfolios.
La gran ventaja de utilizar GitHub Pages es que está integrado en el servicio de control de
versiones basado en repositorios: con una mínima configuración, los archivos alojados en
un repositorio serán accesibles a través de una URL pública accesible a través de Internet.
GitHub Pages permite crear dos tipos de sitios web:
>> Un único sitio web asociado a la cuenta de usuario.
>> Un sitio web para cada repositorio.
Solo se puede crear un sitio de usuario por cada cuenta de usuario u organización.
Normalmente se utiliza como sitio principal relacionado con la cuenta correspondiente.
Algunos de sus usos más comunes son:
>> Página personal.
>> Curriculum vitae.
>> Página de porfolio.
Para crear un sitio web de usuario es necesario crear un repositorio con el nombre
MINOMBREDEUSUARIO. github.io dentro de la cuenta de usuario u organización
correspondiente.
En cuanto a los sitios web de repositorio, se puede crear un sitio asociado a cualquier
repositorio. Algunos de sus usos más comunes son:
>> Documentación relacionada con el código del repositorio.
>> Página informativa de un proyecto concreto.
Para crear un sitio web de repositorio, es necesario realizar el siguiente procedimiento:
1. Crear un repositorio (nombrerepositorio) dentro de la cuenta de usuario u
organización correspondiente (MINOMBREDEUSUARIO).
22
2. Habilitar el servicio de GitHub Pages en el repositorio:
• En los ajustes del repositorio (Settings), dentro de la sección Pages, seleccionar la
rama que se utilizará como fuente de los archivos.
• Opcionalmente, seleccionar el directorio raíz o la opción de utilizar el directorio
docs.
3. Los archivos que se creen estarán disponibles en la dirección: https://
minombredeusuario.github.io/nombrerepositorio
Fig. 4. Ejemplo GitHub Pages.
El servicio de GitHub Pages permite también la utilización del gestor estático de contenidos
Jekyll, que ofrece funcionalidades similares a WordPress sin necesidad de utilizar lógica
de servidor ni base de datos.
IMPORTANTE
En la documentación complementaria de la unidad, dispones de un enlace a la
documentación sobre cómo utilizar el gestor de contenidos Jekyll con el servicio GitHub
Pages.
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
23
4.2. Despliegue en servicios cloud: AWS S3 y
Azure Blob Storage
Los servicios cloud más populares, como AWS y Azure, ofrecen sus propios servicios de
alojamiento masivo de ficheros, denominados AWS S3 y Azure Blob Storage. Ambos
ofrecen la posibilidad de ofrecer un servicio de almacenamiento web estático sobre
dichos archivos, y pueden, por tanto, ser utilizados como servidores web estáticos
convencionales.
Su funcionamiento es muy sencillo. Únicamente hay que realizar los siguientes pasos:
1 Crear un bucket en AWS S3 o una cuenta de
almacenamiento en Azure.
2
Configurar el bucket o la cuenta de
almacenamiento con la opción Activar servidor
web (en ambas plataformas la opción se llama
de manera casi idéntica).
3 Configurar los permisos para permitir acceso
público a los archivos.
4 Subir los archivos de la aplicación.
Esquema 6. Pasos para el despliegue de servicios en cloud
Fig. 5. Proceso de Despliegue en servicios Cloud.
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
24
Tanto AWS como Azure son servicios de pago, que exigen tarjeta de crédito, aunque ofrecen
cuentas de estudiante, que no tienen ese requisito. En cualquier caso, el coste de este tipo
de servicios de almacenamiento es muy bajo, por lo que constituyen una excelente opción
para el alojamiento web de este tipo de aplicaciones.
Para terminar, este tipo de servicios se complementan con servicios de entrega de
contenido, denominados content delivery network o CDN, que se utilizan para replicar
los archivos en diferentes zonas geográficas, con lo que se incrementa la velocidad de
descarga y se reduce la latencia. AWS ofrece el servicio AWS CloudFront, y Azure, el
servicio Azure CDN.
4.3. Despliegue de aplicaciones mediante
integración continua
Los servicios de alojamiento estático estudiados (GitHub Pages, AWS S3 y Azure Blob
Storage) solo permiten la descarga de los archivos alojados en ellos. En el caso de utilizar
aplicaciones basadas en tecnologías estándar, como un sitio web construido con HTML,
CSS y JavaScript, basta con distribuir los ficheros alojados en el repositorio de código de
la aplicación. Para este caso tan sencillo, el uso de un servicio como GitHub Pages resulta
ideal, ya que un nuevo cambio en el sistema de control de versiones (un nuevo commit) se
reflejaría automáticamente en la aplicación web publicada.
Sin embargo, la mayoría de los proyectos de aplicaciones de tipo SPA requieren de algún
tipo de procesamiento o compilación antes de su publicación, como, por ejemplo:
>> Minificación del código CSS o JavaScript para disminuir el tamaño de los archivos
y mejorar el tiempo de carga de la aplicación.
>> Compilación de la aplicación en el caso de utilizar algún framework como Vue,
Angular o React, o alguna herramienta de empaquetado como Webpack.
En estos casos es muy interesante contar con algún tipo de servicio de integración continua
que se encargue de realizar dichas tareas de procesado para a continuación publicar el
resultado en el servidor de archivos estáticos deseado.
Una opción consiste en utilizar un servicio como GitHub Actions para crear un flujo de
trabajo que implemente estas acciones. En el marketplace de GitHub Actions existen
multitud de acciones ya creadas para la mayoría de los flujos de trabajo más habituales.
Este tipo de acciones son muy fáciles de configurar: únicamente hay que crear los secretos
correspondientes para indicar las credenciales y los datos de acceso al servicio de
alojamiento utilizado. Previamente, es necesario haber creado dicho servicio de alojamiento
(bucket de AWS S3 o cuenta de almacenamiento de Azure).
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
25
Fig. 6. Proceso de Despliegue mediante integración continua.
IMPORTANTE
En la documentación complementaria de la unidad, dispones de un enlace a una acción del
marketplace de GitHub Actions que se utiliza para compilar y publicar una aplicación Vue
en un bucket de AWS S3.
Para terminar, existen también servicios de los proveedores cloud que realizan estas tareas
de forma automá- tica. Son los servicios AWS Amplify y Azure Web Apps. Estos servicios
funcionan de la siguiente manera:
1 Permiten crear un repositorio de código o utilizar un repositorio existente
alojado en otro servicio, como GitHub.
2 Permiten elegir la rama del repositorio que se utilizará como rama de
despliegue.
3 Detectan el tipo de aplicación existente en el repositorio (aplicación con o sin
backend, proyecto de Vue, React o Angular, etcétera) y configuran la acción
necesaria para realizar la compilación.
4 Ofrecen al usuario la posibilidad de crear variables de secretos para
almacenar credenciales y otra información sensible.
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
26
5 Ofrecen al usuario la posibilidad de activar servicios asociados, como el
servicio de CDN.
6 Por último, el servicio se encarga de realizar las tareas de compilación y
publicación cada vez que se realice un nuevo commit en el repositorio de la
aplicación.
Esquema 7. Pasos para el despliegue de aplicaciones en sesión continua.
Fig. 7. Proceso de Despliegue mediante integración continua.
Este tipo de servicios facilita enormemente los procesos de desarrollo y despliegue de
aplicaciones. La persona desarrolladora tendrá que realizar únicamente una tarea: enviar
sus cambios a la rama de despliegue del repositorio a través del control de versiones,
sin preocuparse de nada más. En un breve lapso de tiempo, dichos cambios se verán
implementados «mágicamente» en la aplicación desplegada en producción.
UF7 AUTENTICACIÓN Y DESPLIEGUE DE APLICACIONES EN ENTORNO CLIENTE
