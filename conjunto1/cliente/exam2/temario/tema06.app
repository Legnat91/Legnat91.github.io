tema06.app
Desarrollo web en entorno cliente
Desarrollo con VueJS
UF6

ÍNDICE
Mapa conceptual ................................................................................. 04
1. Funcionamiento básico de Vue ........................................................ 05
  1.1. Descripción y características generales ..................................... 05
  1.2. Uso de Vue .................................................................................. 05
  1.3. La aplicación Vue ....................................................................... 06
  1.4. Sintaxis de plantillas ................................................................. 06
2. Vue ................................................................................................... 08
  2.1. Variables de estado y métodos .................................................. 08
  2.2. Propiedades computadas ............................................................ 09
  2.3. Estilos y clases .......................................................................... 10
  2.4. Renderizado condicional y listas ................................................ 11
  2.5. Manejo de eventos ..................................................................... 13
  2.6. Data binding y formularios ......................................................... 14
3. Componentes en Vue ...................................................................... 16
  3.1. Fundamentos de componentes .................................................. 16
  3.2. Herramientas y SFC (.vue) ........................................................ 17
  3.3. Eventos del ciclo de vida ............................................................ 20
  3.4. Props .......................................................................................... 22
  3.5. Eventos personalizados .............................................................. 25
  3.6. Slots ........................................................................................... 27
  3.7. Transiciones ............................................................................... 29
4. Aplicaciones SPA con Vue .............................................................. 33
  4.1. Gestión de estado ....................................................................... 33
  4.2. Gestión de rutas: vue-router ....................................................... 36
  4.3. Peticiones HTTP y APIs ............................................................. 41
5. Características avanzadas: SSR y PWA .......................................... 43
  5.1. Renderización del lado del servidor (SSR) ................................ 43
  5.2. Aplicaciones web progresivas (PWA) ......................................... 47
  5.3. Nuxt: introducción ...................................................................... 47


UF6 DESARROLLO CON VUEJS

Mapa conceptual
Desarrollo con Vue
- Funcionamiento básico
- Reactividad
- Componentes
- SPA con router
- Estado compartido
- SSR y PWA
- Nuxt


-----------------------------------------------------
01. Funcionamiento básico de Vue
-----------------------------------------------------

1.1. Descripción general

Vue es un framework JavaScript para crear aplicaciones SPA.
Características:

- Sistema de plantillas
- Reactividad
- Data binding
- Componentes
- Curva de aprendizaje suave
- No impone TypeScript


1.2. Uso de Vue

Uso simple vía CDN:

[CODE]
<script src="https://unpkg.com/vue@3"></script>
<div id="app">{{ mensaje }}</div>
<script>
const { createApp } = Vue;

const app = createApp({
  data() {
    return { mensaje: '¡Hola Vue!' }
  }
});

app.mount('#app');
</script>
[/CODE]

En proyectos complejos:
- Componentes de un solo archivo (.vue)
- Compilación necesaria
- Vue CLI


1.3. La aplicación Vue

Pasos básicos:
1. Importar Vue
2. Crear aplicación con createApp()
3. Definir data()
4. Montar con mount()


1.4. Sintaxis de plantillas

Interpolación:
{{ variable }}

Directivas:
v-html
v-bind
v-if
v-for
v-on
v-model

Ejemplo:

[CODE]
<p>{{ mensaje }}</p>
<span v-html="codigoHTML"></span>
<div :id="miId"></div>
[/CODE]

IMPORTANTE
Sin ":" o v-bind, el atributo se interpreta como texto literal.


-----------------------------------------------------
02. Vue
-----------------------------------------------------

2.1. Variables de estado y métodos

Vue es reactivo:
Cambios en data() → actualización automática de vista.

[CODE]
const app = createApp({
  data() {
    return {
      contador: 0
    }
  },
  methods: {
    incrementar() {
      this.contador++;
    }
  }
});
[/CODE]


2.2. Propiedades computadas

Definidas en computed.
Se usan como variables.

[CODE]
computed: {
  nombreCompleto() {
    return this.nombre + " " + this.apellido;
  }
}
[/CODE]


2.3. Estilos y clases

Binding de clases:

[CODE]
<div :class="{ activa: activada, error: conError }"></div>
[/CODE]


2.4. Renderizado condicional

v-if
v-else-if
v-else
v-show

Ejemplo:

[CODE]
<div v-if="valor == 0">0</div>
<div v-else-if="valor < 0">Menor</div>
<div v-else>Mayor</div>
[/CODE]

Listas:

[CODE]
<li v-for="usuario in usuarios" :key="usuario.id">
  {{ usuario.nombre }}
</li>
[/CODE]


2.5. Manejo de eventos

Sintaxis:

v-on:evento
@evento

[CODE]
<form @submit.prevent="enviar">
</form>
[/CODE]

$event permite acceder al evento DOM.


2.6. Data binding

v-model → doble enlace de datos.

[CODE]
<input v-model="mensaje">
[/CODE]

Funciona con:
- input
- textarea
- checkbox
- radio
- select


-----------------------------------------------------
03. Componentes en Vue
-----------------------------------------------------

3.1. Fundamentos

Archivo .vue:

[CODE]
<template>
  <div>{{ mensaje }}</div>
</template>

<script>
export default {
  name: "MiComponente",
  data() {
    return { mensaje: "Hola" }
  }
}
</script>

<style scoped>
div { color: red; }
</style>
[/CODE]


3.2. Vue CLI

Instalación:

[CODE]
npm install -g @vue/cli
vue create mi-proyecto
[/CODE]

Comandos:

npm run serve
npm run build
npm run lint


3.3. Ciclo de vida

Hooks principales:
- beforeCreate
- created
- mounted
- updated
- unmounted

Ejemplo:

[CODE]
mounted() {
  console.log("Componente montado");
}
[/CODE]


3.4. Props

Padre → hijo

Padre:

[CODE]
<MiPersona :datos="persona" />
[/CODE]

Hijo:

[CODE]
props: ["datos"]
[/CODE]


3.5. Eventos personalizados

Hijo:

[CODE]
this.$emit("eliminar");
[/CODE]

Padre:

[CODE]
<MiPersona @eliminar="eliminarPersona" />
[/CODE]


3.6. Slots

Padre:

[CODE]
<MiAlerta>
  ¡Atención!
</MiAlerta>
[/CODE]

Hijo:

[CODE]
<slot></slot>
[/CODE]

Slots nombrados:

v-slot:nombre
#nombre


3.7. Transiciones

[CODE]
<Transition name="fade">
  <p v-if="mostrar">Texto</p>
</Transition>
[/CODE]

Clases CSS:
- fade-enter-from
- fade-enter-active
- fade-enter-to
- fade-leave-from
- fade-leave-active
- fade-leave-to


-----------------------------------------------------
04. Aplicaciones SPA con Vue
-----------------------------------------------------

4.1. Gestión de estado

Estado compartido:

[CODE]
// estado.js
import { reactive } from 'vue';

export const datos = reactive({
  activo: false,
  cambiar() {
    this.activo = !this.activo;
  }
});
[/CODE]

Importar en componente.


4.2. vue-router

Instalación:

[CODE]
npm install --save vue-router@4
[/CODE]

Definición de rutas:

[CODE]
const rutas = [
  { path: '/', component: Home },
  { path: '/personas/:id', component: MiPersona, props: true }
];
[/CODE]

Plantilla:

[CODE]
<router-link to="/personas/1">Persona 1</router-link>
<router-view></router-view>
[/CODE]


4.3. Peticiones HTTP

Vue no incluye librería propia.

Opciones:
- fetch
- axios

Se suelen ejecutar en:
- created()
- beforeRouteEnter
- eventos de usuario

IMPORTANTE
Cuidado con rutas dinámicas reutilizando componente.


-----------------------------------------------------
05. SSR y PWA
-----------------------------------------------------

5.1. SSR

Renderización en servidor.
Ventajas:
- SEO
- Carga inicial más rápida
- No depende exclusivamente de JS

Proceso:
Servidor genera HTML
Cliente rehidrata aplicación


5.2. PWA

Requisitos:
- HTTPS
- Service Workers
- manifest.json

Permite instalación como app.


5.3. Nuxt

Framework sobre Vue.
Soporta:
- SSR
- PWA
- Routing automático

Creación:

[CODE]
npx create-nuxt-app mi-proyecto
[/CODE]

Estructura:
pages/
components/
assets/
static/

Rutas dinámicas:

pages/personas/_id/index.vue
→ /personas/:id

Enlaces:

[CODE]
<NuxtLink to="/personas">Listado</NuxtLink>
[/CODE]
