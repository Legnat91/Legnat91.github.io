# README

## Descripcion

DAW Study Flow es una app estatica en HTML, CSS y JavaScript vanilla para estudiar asignaturas DAW desde movil o escritorio. Carga el contenido desde `datos.json` y ofrece lectura por temas, conceptos clave, tests IA y tests de profesor con progreso guardado en `localStorage`.

## Mejoras incluidas

- Diseno mobile-first con jerarquia visual mas clara.
- Home orientada a seguir estudiando y no solo a listar contenido.
- Panel de asignatura con busqueda ligera por tema, resumen o claves.
- Vista de lectura separada de la vista de conceptos clave.
- Flujo de test mas limpio con feedback inmediato y pantalla de resultados mas util.
- Examenes practicos de codigo con textarea, pista, solucion y explicacion por ejercicio.
- Navegacion contextual en lectura y test, con recomendaciones y salto entre temas.
- Refactor del JavaScript para separar normalizacion de datos, estado, persistencia y vistas.
- Manejo defensivo de datos incompletos en asignaturas, temas y preguntas.
- Mejor contraste, foco visible, controles tactiles mas grandes y navegacion contextual.
- Microinteracciones suaves, soporte `prefers-reduced-motion` y acabado visual mas pulido.

## Estructura

- `index.html`: shell principal de la app.
- `style.css`: sistema visual y componentes responsive mobile-first.
- `app.js`: carga de datos, estado global, renderizado y flujo de tests.
- `datos.json`: base de contenido.

## Uso

1. Sirve la carpeta desde un servidor local, por ejemplo con XAMPP.
2. Abre `index.html` desde el navegador usando la URL local del proyecto.
3. Navega por asignaturas, abre un tema y lanza tests por tema o globales.
4. En los temas que lo incluyan, abre el examen practico para rellenar o escribir codigo.
4. El progreso y el tema se guardan en `localStorage` del navegador.

## Mantenimiento

- Puedes anadir o editar asignaturas y temas en `datos.json` sin tocar la interfaz.
- Si faltan campos en el JSON, la app aplica fallbacks para no romper el render.
- No requiere build, dependencias ni paso de compilacion.
