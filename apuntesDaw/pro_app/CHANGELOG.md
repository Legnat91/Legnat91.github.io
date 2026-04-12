# CHANGELOG

## 2026-04-12

### UX y responsive

- Redisenada la experiencia completa con enfoque mobile-first.
- Simplificada la cabecera y anadido acceso directo a "seguir estudiando".
- Mejorada la jerarquia visual en home, asignatura, lectura, test y resultados.
- Aumentado el tamano de controles tactiles y mejorado el espaciado en movil.
- Separada la lectura larga de la vista de conceptos clave.
- Anadida navegacion contextual dentro del tema, con salto al tema anterior o siguiente.
- Incorporadas recomendaciones de siguiente paso en lectura, test y resultados.

### Arquitectura

- Reestructurado `app.js` para distinguir persistencia, normalizacion de datos, estado, helpers y vistas.
- Anadidas validaciones defensivas para asignaturas, temas, preguntas y opciones incompletas.
- Rehecho el sistema de render para reducir acoplamiento entre datos, navegacion y UI.

### Visual

- Sustituido el sistema visual anterior por un nuevo set de tokens, superficies y componentes.
- Implementados nuevos estilos responsive para tarjetas, paneles, tabs, progreso y resultados.
- Actualizadas tipografias para dar mas personalidad y legibilidad al producto.
- Anadidas microinteracciones, animaciones de entrada suaves y soporte para `prefers-reduced-motion`.

### Documentacion

- Creado `README.md` con descripcion, uso, estructura y mantenimiento.
- Creado `CHANGELOG.md` con el detalle de cambios principales.
