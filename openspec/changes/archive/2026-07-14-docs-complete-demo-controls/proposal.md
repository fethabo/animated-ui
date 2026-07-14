# Proposal: docs-complete-demo-controls

## Why

El change `docs-demo-controls` agregó el panel de controles pero solo a 19 de los 50 demos, y de forma parcial: **31 demos no tienen ningún control** y varios de los 19 no exponen sus props de color. El objetivo es que **todos** los demos tengan controles completos — cubriendo sus props públicas controlables, incluidas las de color — para que cualquier componente sea explorable sin leer ni editar código. Además, sin una regla de cobertura verificada, es fácil volver a quedar corto en el próximo componente.

## What Changes

- **Controles en los 31 demos que hoy no tienen ninguno** (border-beam, glow-border, spotlight-card, ripple-container, magnetic-element, tesla-coil, circuit-background, matrix-rain, starfield-background, topographic-background, pixel-background, cursor-trail, custom-cursor, image-trail, click-spark, attention-cue, count-up, scramble-text, typewriter-text, text-highlighter, text-scroll-reveal, scroll-progress, mouse-parallax, parallax-layers, sticky-scenes, stacked-cards, horizontal-scroll-section, image-dissolve, draw-path, animated-list, auto-height).
- **Completar los controles de color** en todos los demos con props de color: color simple → control `color`; paleta (`colors[]`) → control `multi` con `asColors` sobre un set de swatches preset (togglear qué colores integran la paleta).
- **Cobertura por prop**: cada demo declara controles para todas sus props públicas controlables (escalares, booleanas, enums, colores), usando el `props.json` generado como checklist. Las props no controlables se excluyen por convención documentada (children/contenido, refs/handles, `className`/`style`, funciones como `cellColor`/`easing`, `src`/`alt`, `seed`, `target`).
- **Validación de cobertura en build**: el pipeline cruza los controles declarados de cada demo contra sus props públicas (menos las excluidas) y **falla el build** si a un demo le falta un control para una prop controlable o si un demo no declara controles.
- **Panel usable en demos `flow`** (scroll-driven/sticky): el panel se fija al viewport para seguir siendo alcanzable cuando el demo es alto.

## Capabilities

### New Capabilities
<!-- Ninguna. -->

### Modified Capabilities

- `docs-site`: se fija la cobertura completa de controles por demo (todas las props controlables, incluidas colores) como requisito verificado en build; y el panel funciona también en los demos de layout `flow`.

## Impact

- **Código modificado**: los 50 `docs/src/demos/*.tsx` (los 31 sin controles suman `controls` + reciben props; los 19 completan colores/props faltantes); `docs/src/components/ControlPanel.tsx`/CSS (soporte de panel fijo para `flow`); `docs/scripts/build-content.mjs` (validación de cobertura) y una lista de exclusión compartida.
- **Sin impacto** en la librería (`src/`), test-app, ni el contenido/props/i18n del pipeline (solo se suma una validación).
- **Dependencia**: se apoya en `docs-demo-controls` (aún activo). Idealmente se archiva ese change antes de archivar este.
