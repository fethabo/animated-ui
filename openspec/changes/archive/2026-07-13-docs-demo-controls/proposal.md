# Proposal: docs-demo-controls

## Why

La web de documentación (change `docs-site`) muestra un demo curado y estático por componente. El `test-app/` tiene un `ControlPanel` que deja variar props en runtime (incluidas las variantes), y esa interactividad es justo lo que hace explorable la doc — sin ella, para entender el efecto de una prop hay que leer el código y editarlo. Además hay dos defectos visibles: el scroll no se ve sobre el tema dark, y el demo de TiltCard renderiza mal (estila el root del componente en vez de un hijo, así que el tilt/glare toma como referencia el contenido y no la card).

## What Changes

- **Controles interactivos en los demos**: se porta el patrón del `ControlPanel` del test-app a la docs. El contrato del módulo de demo se extiende con un `export const controls` opcional (descriptor declarativo: number/boolean/enum/color/text/multi); si existe, la vista envuelve el demo en un panel que bindea los valores a las props en vivo. Los demos sin `controls` siguen funcionando igual.
- Se migran a controles los demos donde más aporta: los que tienen **variantes/presets** (AnimatedBackground `variant`, RotatingText `transition`, ParticleField `drift`, Dock `orientation`, Marquee `direction`, SplitReveal `preset`/`split`, etc.) y props escalares expresivas (ángulos, velocidades, cantidades, colores).
- **Fix scrollbar**: estilos de scrollbar visibles sobre el tema dark (WebKit + Firefox), en el chrome (sidebar, bloques de código) y el scroll de la página.
- **Fix TiltCard demo**: mover el estilo visual de la card a un `<div>` hijo del TiltCard (root mínimo con `position: relative`), como en el test-app, para que el tilt y el glare tomen como referencia la card y no su contenido. Auditar los demás demos por el mismo antipatrón.

## Capabilities

### New Capabilities
<!-- Ninguna: extiende la capability existente docs-site. -->

### Modified Capabilities

- `docs-site`: los demos pueden exponer un panel de controles opcional que varía props en runtime; y se fijan los criterios de correctitud visual (scroll visible en tema dark, el demo refleja el uso correcto del componente).

## Impact

- **Código nuevo**: `docs/src/components/ControlPanel.tsx` (+ su CSS), tipos del descriptor de controles en el contrato de demo (`docs/src/content.ts`).
- **Código modificado**: `docs/src/pages/ComponentPage.tsx` (envolver el demo en el panel si hay `controls`); demos en `docs/src/demos/*.tsx` que sumen controles o los que tengan el antipatrón de estilo (TiltCard); `docs/src/styles/base.css` (scrollbars).
- **Sin impacto** en la librería publicada (`src/`), en `test-app/`, ni en el pipeline de contenido/props/i18n.
- **Dependencia**: se apoya en el change `docs-site` (aún activo). Idealmente se archiva `docs-site` antes de archivar este.
