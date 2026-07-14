# Design: docs-complete-demo-controls

## Context

`docs-demo-controls` dejó el mecanismo listo: un demo exporta `controls: DemoControl[]` y `ComponentPage` lo envuelve en `ControlPanel`. Pero la adopción es parcial (19/50) y sin cobertura de color completa. El `props.json` generado por `extract-props.mjs` ya lista, por componente, todas las props públicas con su tipo y default — es el checklist natural de "qué controlar".

Tipos de control disponibles: `number` (range), `boolean` (checkbox), `enum` (select), `color` (color picker), `text`, `multi` (chips/swatches). El descriptor vive en el `.tsx` del demo como array literal.

## Goals / Non-Goals

**Goals:**
- Los 50 demos con controles completos: toda prop pública controlable expuesta, incluidas las de color.
- Cobertura verificada en build (no depender de la memoria del autor).
- Paletas (`colors[]`) editables vía swatches preset.
- Panel alcanzable también en demos `flow` (sticky/scroll-driven).

**Non-Goals:**
- No se controlan props de contenido (children, `text`, `words`, `emojis`, `src`/`alt`), refs/handles, `className`/`style`, funciones (`cellColor`, `easing`) ni `seed`/`target`. Son excluidas explícitas.
- No se auto-generan los controles desde `props.json` (los rangos, opciones de enum y "esto es un color" requieren criterio humano); `props.json` se usa como checklist de cobertura, no como generador.
- No se toca la librería ni el test-app.

## Decisions

### D1 — Cobertura como invariante de build

Regla: para cada componente, el conjunto de `prop` de sus `controls` declarados SHALL cubrir todas sus props públicas de `props.json` **menos** las excluidas. Un faltante rompe el build (en `dev` con `--lax`, warning).

Implementación en `build-content.mjs`:
- Se extrae la lista de `prop` de cada demo parseando el array `controls` del `.tsx` con un regex sobre `prop: '<name>'` (el descriptor es siempre un literal, así que el parseo es estable). No se ejecuta el TSX ni se agrega un toolchain de parsing TS.
- Se cruza contra `Object.keys` de las props del componente en `props.json`, restando la lista de exclusión.
- Alternativa considerada — validación en runtime (overlay dev): se descarta; el proyecto ya usa el build como gate de sincronía y es donde se atrapan estos huecos antes de publicar.

### D2 — Lista de exclusión compartida

Un módulo `docs/scripts/control-exclusions.mjs` (consumido por el pipeline) define:
- **Por tipo/heurística**: props cuyo tipo en `props.json` es una función (`=> `), `ReactNode`/`ElementType`, o que sean `className`/`style`.
- **Por nombre, global**: `seed`, `target`, `src`, `alt`, `className`, `style`, `children`.
- **Por componente** (`controlsExclude[slug]`): props de contenido específicas (`words`, `text`, `emojis`, `charset`, `cellColor`, `easing`, etc.) que no tienen un input razonable.

La exclusión es explícita y versionada: agregar un componente obliga a decidir qué se excluye, y el resto queda cubierto por defecto.

### D3 — Colores: simple vs paleta

- Prop de color simple (string hex: `color`, `highlight`, `background`, `trackColor`, `pulseColor`, `headColor`, `scrambleColor`, `fromColor`, `toColor`, `colorFrom`, `colorTo`, `linkColor`) → control `color`.
- Prop de paleta (`colors: string[]`) → control `multi` con `asColors: true` sobre un set preset de ~8 swatches de la identidad del sitio (`#7c3aed #0ea5e9 #10b981 #ec4899 #f59e0b #ef4444 #22d3ee #a78bfa`), con el default = la paleta actual del demo. El usuario togglea qué colores integran la paleta. Es la misma mecánica que el `multi asColors` del test-app.
- `cellColor` (función) → excluida (no hay input para una función).

### D4 — Panel en demos `flow`

Los demos con `demoLayout: 'flow'` (sticky-scenes, stacked-cards, horizontal-scroll-section) son altos y scrollean con la página; un panel `position: absolute` dentro del frame se iría de vista. Para esos, el panel usa `position: fixed` (esquina inferior-derecha del viewport). `ComponentPage` ya conoce `demoFlow`; se pasa una prop `fixed` al `ControlPanel` para alternar el modo de posicionamiento.

### D5 — Demos que reinician (mount/one-shot)

- Demos con `trigger='mount'` re-montados por key (SplitReveal, ScribbleDecoration, y ahora DrawPath, ScrambleText, TypewriterText, CountUp, TextHighlighter): la key incluye las props (patrón ya usado) para re-disparar al cambiar un control.
- One-shot (bursts, ClickSpark): los controles ajustan los defaults del próximo disparo; ya establecido.
- Scroll-driven no-sticky (TextScrollReveal, ScrollProgress, MouseParallax, ParallaxLayers): controles de sus props (offset, color, ease, depth) sin re-montaje.

## Risks / Trade-offs

- [El regex que extrae `prop:` de los controles podría no matchear un formato distinto] → El descriptor se escribe siempre como array literal con `prop: '<name>'`; se documenta el formato y la validación misma atrapa el caso (si no parsea, cuenta 0 controles → falla por cobertura). Bajo riesgo.
- [Un control con `prop`/`default` que no existe o mistipa la prop rompe el demo en runtime, no en typecheck] → La cobertura valida que exista control por prop, pero no el binding inverso; se cubre con la pasada de QA en browser y con que los defaults salgan de `props.json`.
- [Paletas como `multi` con set fijo limita a los swatches preset] → Aceptado: el objetivo es explorar el efecto de la paleta, no elegir cualquier color arbitrario para cada slot; el set preset cubre la variedad visual. Los colores simples sí son `color` picker libre.
- [Demos `flow` con panel fijo podrían tapar contenido en viewports chicos] → Panel colapsado por defecto y en esquina; el toggle es chico.
- [Volumen: 50 demos tocados] → Mecánico y verificable por la validación de cobertura + QA; el riesgo es de tiempo, no de diseño.
