## Context

El repositorio principal (@fethabo/animated-ui) incorporó recientemente un modo CSS nativo (`add-css-class-mode`) para 4 componentes puramente visuales (`AnimatedBackground`, `ShinyText`, `BorderBeam`, `GlitchText`). Sin embargo, el sitio de documentación (`docs/`) no explica cómo utilizar esta característica, limitando su conocimiento y adopción.

## Goals / Non-Goals

**Goals:**
- Proveer instrucciones claras y ejemplos de código sobre cómo usar el modo CSS en la documentación interactiva de los 4 componentes soportados.
- Documentar el sistema de escape de accesibilidad (`data-aui-motion`).

**Non-Goals:**
- Modificar el código fuente de la biblioteca de React (`src/`).
- Modificar la documentación de componentes que no soportan CSS puro.

## Decisions

- **Inyección en la información existente:** Se extenderán los datos y vistas de documentación de cada componente, agregando el snippet de código HTML + la importación CSS donde corresponda. No se creará una ruta separada de "CSS Mode", sino que será una sección o tab dentro del componente mismo.
- **Multilenguaje (ES/EN):** Se redactarán los textos en español e inglés según la estructura actual de los contenidos de `docs/`.

## Risks / Trade-offs

- Ninguno técnico de alta criticidad, son cambios puramente de contenido en el sitio estático/SPA de la documentación.
