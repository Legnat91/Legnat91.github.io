tema05.app
Desarrollo web en entorno cliente
Frameworks JavaScript
UF5

ÍNDICE
Mapa conceptual ................................................................................. 04
1. Librerías externas y frameworks ..................................................... 05
  1.1. Herramientas para trabajar con librerías ....................................... 05
    A. Gestión de paquetes ....................................................................... 06
    B. Empaquetado ................................................................................... 06
    C. Automatización ................................................................................ 06
  1.2. Webpack .......................................................................................... 07
  1.3. Frameworks JavaScript ................................................................... 10
2. Introducción a Angular ..................................................................... 12
  2.1. Descripción general ........................................................................ 12
  2.2. Instalación de Angular CLI ............................................................. 13
  2.3. Creación de un proyecto Angular ................................................... 13
  2.4. TypeScript: introducción ................................................................. 14
  2.5. Estructura de ficheros del proyecto ............................................... 15
  2.6. Componentes .................................................................................. 16
  2.7. Plantillas y directivas ...................................................................... 17
  2.8. Comunicación entre componentes ................................................. 19
  2.9. Data binding (enlace de datos) ....................................................... 20
  2.10. Enrutamiento y peticiones HTTP .................................................. 22
3. Introducción a React ........................................................................ 24
  3.1. Descripción general ........................................................................ 24
  3.2. Creación de un proyecto React ....................................................... 25
  3.3. JSX: introducción ............................................................................ 25
  3.4. Estructura de ficheros del proyecto ............................................... 26
  3.5. Componentes .................................................................................. 27
  3.6. Estado y eventos ............................................................................ 29
  3.7. Renderizado condicional y listas .................................................... 30
  3.8. Formularios ...................................................................................... 31
  3.9. Enrutamiento y peticiones HTTP .................................................... 32
  3.10. Buenas prácticas ........................................................................... 32


UF5 FRAMEWORKS JAVASCRIPT

Mapa conceptual
Frameworks JavaScript
- Librerías externas y herramientas
  - Gestión de paquetes
  - Empaquetado
  - Automatización
  - Webpack
- Introducción a Angular
  - TypeScript
  - Componentes
  - Plantillas y directivas
  - Data binding
  - Routing y HTTP
- Introducción a React
  - JSX
  - Componentes
  - Estado y eventos
  - Formularios
  - Routing y HTTP
  - Buenas prácticas


01. Librerías externas y frameworks

1.1. Herramientas para trabajar con librerías

Las aplicaciones JavaScript complejas utilizan numerosas librerías. En proyectos pequeños
pueden cargarse mediante etiquetas <script> o CDN, pero en proyectos profesionales
se requieren herramientas que permitan:

- Descarga automática desde repositorios.
- Gestión de dependencias.
- Uso de librerías NodeJS no compatibles directamente con ES6 del navegador.
- Compilación de TypeScript, SASS, JSX, etc.
- Servidores de desarrollo con hot reload.
- Automatización (minificación, test, build).

La mayoría están basadas en paquetes NPM y se ejecutan sobre NodeJS.
npx permite ejecutar paquetes sin instalación global previa.


A. Gestión de paquetes

NPM
Gestor de paquetes de NodeJS.

Yarn
Alternativa a NPM creada por Facebook.

Bower
Gestor específico front-end. Actualmente abandonado.


B. Empaquetado

Webpack
Herramienta más utilizada actualmente.
Base de Angular, React y Vue.

Browserify
Permite usar módulos NodeJS en navegador.

RequireJS
Más antigua, similar función.


C. Automatización

Grunt
Basado en archivos de configuración.

Gulp
Basado en código.


1.2. Webpack

Webpack detecta dependencias y genera una aplicación compatible con navegador
(HTML, CSS, JS estándar).

Permite trabajar con:
- CommonJS
- TypeScript
- SASS / LESS
- Componentes React / Angular / Vue

Creación básica:

[CODE]
mkdir proyecto-webpack
cd proyecto-webpack
npm init -y
npm install webpack webpack-cli --save-dev
[/CODE]

Estructura básica:

proyecto-webpack
|- package.json
|- node_modules/
|- index.html
|- /src
   |- index.js

Instalar una librería:

[CODE]
npm install --save chart.js
[/CODE]

Importación:

[CODE]
import Chart from 'chart.js/auto';
[/CODE]

Para generar el build:

[CODE]
npx webpack
[/CODE]

Por defecto:
- Detecta dependencias
- Genera dist/main.js
- Minimiza código

IMPORTANTE
La aplicación NO funciona directamente cargando index.html.
Es necesario ejecutar el proceso de compilación.

Recomendaciones:
- Colocar <script src="./dist/main.js"></script> al final del body.
- Usar servidor de desarrollo para evitar compilar manualmente cada vez.
- La carpeta dist suele ignorarse en Git.


1.3. Frameworks JavaScript

Los frameworks proporcionan soluciones comunes:

- Sistema de plantillas declarativas
- Componentes
- Herramientas de build
- Servidor con hot reload
- Data binding
- Routing
- Testing

Los más utilizados:
- Angular
- React
- Vue

Se usan especialmente en aplicaciones SPA.


CASO PRÁCTICO 1
CREACIÓN DE UN PROYECTO CON WEBPACK

Enunciado:
Crear proyecto Webpack con chart.js y mostrar gráfica.

SOLUCIÓN:
1) Crear proyecto
2) Instalar chart.js
3) Crear index.html con:

[CODE]
<div style="height: 50vh; width: 50vw;">
  <canvas id="grafica"></canvas>
</div>
<script src="./dist/main.js"></script>
[/CODE]

4) Crear src/index.js:

[CODE]
import Chart from 'chart.js/auto';
// Código de la gráfica
[/CODE]

5) Ejecutar:

[CODE]
npx webpack
[/CODE]


-----------------------------------------------------
02. Introducción a Angular
-----------------------------------------------------

2.1. Descripción general

Angular:
- Framework SPA
- Mantenido por Google
- Basado en TypeScript
- Arquitectura basada en componentes
- Incluye herramientas CLI


2.2. Instalación Angular CLI

[CODE]
npm install -g @angular/cli
[/CODE]

Comprobar instalación:

[CODE]
ng version
[/CODE]

También:

[CODE]
npx ng version
[/CODE]


2.3. Crear proyecto Angular

[CODE]
ng new proyecto-angular
[/CODE]

Servidor desarrollo:

[CODE]
cd proyecto-angular
ng serve --open
[/CODE]

Compilación producción:

[CODE]
ng build
[/CODE]

Genera carpeta dist/


2.4. TypeScript

Superconjunto de JavaScript.
Añade:
- Tipos estáticos
- Decoradores

Ejemplos:

[CODE]
let texto1: string = "Texto 1";
let numero1: number = 15;

interface Usuario {
  nombre: string;
  id: number;
}

let usuario1: Usuario = {
  nombre: "Ana",
  id: 4100
};
[/CODE]


2.5. Estructura Angular

Carpeta src:
- index.html
- styles.css
- assets/
- app/


2.6. Componentes

Crear componente:

[CODE]
ng generate component nombre_componente
[/CODE]

Archivos:
- .component.ts
- .component.html
- .component.css
- .component.spec.ts

Ejemplo básico:

[CODE]
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-test';
}
[/CODE]


2.7. Plantillas y directivas

Interpolación:
{{variable}}

Directivas:
*ngFor
*ngIf
[atributo]
(evento)

Ejemplo:

[CODE]
<h1>{{title}}</h1>
<div *ngFor="let color of colores">{{color}}</div>
<button (click)="saludar()">Saludar</button>
[/CODE]


2.8. Comunicación componentes

Padre → hijo:
@Input()

Hijo → padre:
@Output() + eventos


2.9. Data Binding

Unidireccional:
Vista se actualiza al cambiar datos.

Bidireccional (ngModel):

[CODE]
<input [(ngModel)]="mensaje">
[/CODE]


2.10. Routing y HTTP

Angular Router:
Carga componente según URL.

HTTP Client:
Peticiones AJAX integradas.


CASO PRÁCTICO 2
Aplicación Angular editable con formulario.

Se usan:
- Componentes
- ngModel
- Data binding


-----------------------------------------------------
03. Introducción a React
-----------------------------------------------------

3.1. Descripción general

React:
- Mantenido por Meta
- Basado en componentes
- Minimalista
- JSX opcional
- Usa librerías externas para routing y HTTP


3.2. Crear proyecto React

[CODE]
npx create-react-app proyecto-react
[/CODE]

Servidor:

[CODE]
npm start
[/CODE]

Build:

[CODE]
npm run build
[/CODE]


3.3. JSX

Permite mezclar HTML y JS.

Ejemplo:

[CODE]
const nombre = "Laura";
const saludo = <h1>Hola, {nombre}</h1>;
[/CODE]

Reglas:
- Un único elemento padre
- Etiquetas autocierre con />


3.4. Estructura

public/
- index.html

src/
- index.js
- Componentes


3.5. Componentes

Clase:

[CODE]
class Componente1 extends React.Component {
  render() {
    return <h1>Hola {this.props.nombre}</h1>;
  }
}
[/CODE]

Uso:

[CODE]
<Componente1 nombre="Sara" />
[/CODE]


3.6. Estado y eventos

Estado:

[CODE]
this.state = { activado: false };
this.setState({ activado: true });
[/CODE]

Eventos:
- camelCase
- llaves
- usar función flecha


3.7. Renderizado condicional

[CODE]
if (props.sesionIniciada) {
  pagina = <PaginaUsuario />;
}
[/CODE]

Listas:

[CODE]
const elementos = colores.map(color => <li>{color}</li>);
[/CODE]


3.8. Formularios

Componentes controlados:

[CODE]
<input
  value={this.state.valor}
  onChange={(e) => this.setState({valor: e.target.value})}
/>
[/CODE]


3.9. Routing y HTTP

Routing:
React Router

HTTP:
fetch o axios


3.10. Buenas prácticas

- Crear componentes pequeños
- Arquitectura declarativa
- Pensar en React
- Evitar modificar props
- Usar estado correctamente
