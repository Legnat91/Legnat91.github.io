# Mercado de Barrio “La Alhóndiga”

## 1. Resumen del proyecto

El proyecto consiste en una **página web para el Mercado de Barrio “La Alhóndiga”**, cuyo objetivo es dar visibilidad a los distintos puestos del mercado y facilitar la interacción con clientes.

Permite:

* Conocer la historia y valores del mercado.
* Consultar los productos y servicios de cada puesto.
* Contactar con los comerciantes directamente.

**Valor añadido:** promoción de productos locales y frescos, experiencia intuitiva para usuarios, acceso remoto a información del mercado.

---

## 2. Mapa de sitio y navegación

| Sección / Página    | Elemento HTML                                                                                           | Descripcion

| Global              | `<!DOCTYPE html>`, `<html lang="es">`, `<head>`                                                         | Define documento como HTML5, metadatos, CSS e iconos.                       |
| Header / Navegación | `<header>`, `<nav>`, `<ul>`, `<li>`, `<a>`                                                              | Menú principal: Inicio, Conócenos, Puestos, Contacto.                       |
| Inicio              | `<main>`, `<div class="inicio-pag">`, `<img>`, `<h1>`                                                   | Imagen de portada y título principal del sitio.                             |
| Conócenos           | `<section id="conocenos">`, `<article>`, `<div>`, `<img>`, `<p>`, `<aside>`                             | Historia, propósito del mercado, tarjetas de productos y compromiso social. |
| Puestos             | `<section id="puestos">`, `<div class="contenedor-tarjetas">`, `<div class="tarjetas">`, `<img>`, `<p>` | Información detallada de cada puesto con imagen y descripción.              |
| Contacto            | `<section id="contacto">`, `<form>`, `<textarea>`, `<input>`, `<select>`, `<button>`                    | Formulario para enviar mensajes a los puestos.                              |
| Footer              | `<footer>`, `<ul>`, `<li>`, `<a>`, `<small>`                                                            | Información legal y derechos de autor.                                      

**Cómo navegar:**

* La navegación principal está en el **header**, con enlaces que llevan a cada sección usando anclas (`#inicio`, `#conocenos`, `#puestos`, `#contacto`).
* Todas las secciones están diseñadas para ser **accesibles en menos de 3 clics** desde la página de inicio.

---

## 3. Instrucciones de uso

### Requisitos

* Navegador moderno: Chrome, Firefox, Edge, Safari.
* Conexión a internet (para cargar imágenes y Google Maps).

### Instalación

Abrir `index.html` en un navegador.

### Configuración

* Mantener rutas relativas para imágenes y CSS (`../img/`, `../css/style.css`).

### Uso

* Navegar por las secciones mediante el menú o scroll.
* Consultar los puestos en la sección **Puestos**.
* Enviar un mensaje a un puesto desde la sección **Contacto**.

---

## 4. Decisiones de diseño

### Tipografía

* **Arial, Helvetica, sans-serif**: clara, legible y rápida de cargar.

### Colores

* **Rojo oscuro:** `rgb(145, 23, 23)` para identidad del mercado.
* **Naranja:** `rgb(218, 103, 36)` para botones y navegación.
* **Blanco:** `#ffffff` para contraste con el fondo.
* **Asides y tarjetas:** tonos marrones (`rgb(184, 142, 93)`) para resaltar contenido adicional.

### Layout

* **Grid para tarjetas** (`display: grid`) adaptado a móvil y tablet.
* **Responsive:** el sitio se adapta a diferentes tamaños de pantalla mediante media queries.
* **Accesibilidad:** imágenes con `alt`, inputs con `<label>`, navegación coherente y semántica.

---

## 5. Carta de presentación

Bienvenido al **Mercado de Barrio “La Alhóndiga”**, un proyecto pensado para **acercar el mercado a la comunidad digital**.

Esta web permite:

* Descubrir productos frescos y locales.
* Conocer la historia y los valores del mercado.
* Contactar directamente con los comerciantes.

Nuestro objetivo es **promover la visibilidad del mercado, facilitar las compras y fortalecer la relación entre vecinos y productores**, ofreciendo una experiencia intuitiva, rápida y accesible desde cualquier dispositivo.

