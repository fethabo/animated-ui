## Why

El paquete tiene categorías maduras de texto (ShinyText, ScrambleText), scroll (ScrollReveal, ParallaxLayers, StickyScenes) y backgrounds CSS (AnimatedBackground), pero faltan tres efectos muy pedidos en landings modernas que **no requieren ninguna decisión arquitectónica nueva**: revelado de texto tipo máquina de escribir, revelado por palabra/línea con stagger, y el patrón de "cards que se apilan" al scrollear. Esta tanda los cubre reutilizando los motores existentes (RAF de texto, CSS puro, scroll-driver), por lo que es de bajo riesgo y alto valor inmediato. Suma además una variante `lava` a AnimatedBackground para la estética "lava lamp".

## What Changes

- **Nuevo `TypewriterText`**: revela un texto carácter por carácter (efecto máquina de escribir) con cursor parpadeante opcional, y modo loop opcional que escribe → borra → pasa al siguiente string de una lista. Mismo motor que `ScrambleText` (RAF que muta `textContent` por ref, progresión por timestamp, accesible via `aria-label`).
- **Nuevo `SplitReveal`**: parte un texto en unidades (`char` | `word` | `line`) y revela cada una con stagger, vía CSS puro (preset `fade`, `slide-up`, `blur`). Dispara al montar o al entrar al viewport (reutiliza `useInView`). Accesible: el texto completo queda en `aria-label` y los fragmentos son `aria-hidden`.
- **Nuevo `StackedCards`**: contenedor de scroll donde cada hijo es una "card" que se fija (`position: sticky`) y se va apilando sobre la anterior al scrollear; las cards de abajo se encogen y se oscurecen progresivamente. Reutiliza el motor de scroll (`subscribeScroll` + `useInView`), escribiendo CSS vars sin estado de React en el hot path (patrón de `StickyScenes`/`ParallaxLayers`).
- **Modificación de `AnimatedBackground`**: se agrega la variante `lava` (blobs que ascienden/descienden lentamente fundiéndose con el truco "gooey" `filter: blur() + contrast()`), pasando de cuatro a cinco variantes. CSS puro, sin JS por frame.

## Capabilities

### New Capabilities

- `typewriter-text`: Componente `TypewriterText` que revela texto carácter por carácter con cursor y modo loop multi-string, customizable y accesible.
- `split-reveal`: Componente `SplitReveal` que parte texto en char/word/line y revela cada unidad con stagger via CSS puro, disparable al montar o en viewport.
- `stacked-cards`: Componente `StackedCards` que apila contenedores con `position: sticky` durante el scroll, con encogido/oscurecido progresivo de las cards inferiores.

### Modified Capabilities

- `animated-background`: Se agrega la variante `lava` al set de variantes soportadas (de cuatro a cinco).

## Impact

- **Código nuevo**: `src/components/TypewriterText/`, `src/components/SplitReveal/`, `src/components/StackedCards/`. Variante nueva en `src/components/AnimatedBackground/variants/lava.ts`.
- **Exports**: tres componentes y sus tipos nuevos en `src/index.ts`; `lava` agregado al union `AnimatedBackgroundVariantName`.
- **Docs**: cuatro entradas en README (tres componentes nuevos + fila de variante `lava`), cuatro ejemplos standalone en `/examples`, y actualización de `ROADMAP.md` (Tier 2, Tier 3, Tier 4).
- **Dependencias**: ninguna nueva (criterio no negociable). Reutiliza `useInView`, `useReducedMotion`, `subscribeScroll`, `injectStyles`.
- **Sin breaking changes**: todo es aditivo; la API pública existente no cambia.
