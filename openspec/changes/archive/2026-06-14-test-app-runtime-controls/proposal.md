## Why

Hoy el `test-app` muestra cada componente con uno o dos presets hardcodeados (ver [test-app/src/main.jsx](../../../test-app/src/main.jsx)): para probar otra variante, color, velocidad o behavior hay que editar el código y recargar. Eso hace lenta y parcial la verificación visual —el paso de QA obligatorio de [component-authoring](../../specs/component-authoring/spec.md)— porque nunca se ejercita la superficie completa de props de cada componente. El issue #3 pide cerrar esa brecha: un configurador por componente que permita variar sus props en runtime. Para que la mejora no se degrade con el tiempo, además la convertimos en parte del definition-of-done: todo componente nuevo debe llegar con su panel de controles.

## What Changes

- **Harness de controles en `test-app`**: se introduce un panel de controles reutilizable que, a partir de un descriptor declarativo de props, renderiza inputs nativos (slider numérico, color, select de enum, toggle booleano, texto, y multi-select para arrays como `colors`/`behaviors`) y bindea su valor en vivo a las props del componente, sin recargar.
- **Un panel por componente**: cada uno de los 15 componentes actuales (`AnimatedBackground`, `GlowBorder`, `ImageDissolve`, `MagneticElement`, `MouseParallax`, `ParallaxLayers`, `ParticleField`, `PixelBackground`, `ScrambleText`, `ScrollProgress`, `ScrollReveal`, `ShinyText`, `SpotlightCard`, `StickyScenes`, `TiltCard`) expone sus props configurables vía el panel, con defaults que reproducen el preset actual.
- **Toggle de `respectReducedMotion`** disponible en cada panel para verificar el comportamiento de movimiento reducido sin tocar la config del SO.
- **Definition-of-done extendido** ([component-authoring](../../specs/component-authoring/spec.md)): se agrega como requirement vinculante que todo componente nuevo SHALL incluir su panel de controles en el harness del `test-app` antes de archivar el change.
- **Sin cambios en la librería**: este change no toca `src/` ni la API pública; solo el `test-app` y la spec de autoría.

## Capabilities

### New Capabilities

- `test-app-harness`: define el harness de verificación visual del `test-app` — el panel de controles declarativo, los tipos de control soportados, el binding en vivo prop↔control, y cómo cada componente se registra en el harness.

### Modified Capabilities

- `component-authoring`: se agrega un requirement al definition-of-done — todo componente debe shippear un panel de controles en el harness del `test-app` que exponga sus props configurables.

## Impact

- **Código**: solo `test-app/` — se reestructura [test-app/src/main.jsx](../../../test-app/src/main.jsx) y se agregan los módulos del harness (panel de controles + descriptores por componente). Sin cambios en `src/`, exports, ni `package.json` de la librería.
- **Dependencias**: ninguna nueva; controles construidos con inputs HTML nativos y React, consistente con el criterio de cero deps de runtime del paquete.
- **Specs**: nueva `test-app-harness`; delta sobre `component-authoring`.
- **Docs**: no requiere cambios de README de consumer (el harness es interno); se menciona el harness en AGENTS.md como parte del flujo de verificación.
- **Sin breaking changes**.
