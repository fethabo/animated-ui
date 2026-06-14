## Context

Esta tanda (Wave A del roadmap de efectos nuevos) agrupa cuatro entregables de **bajo riesgo arquitectónico**: tres reutilizan motores ya establecidos y el cuarto extiende un componente existente con una variante CSS. No introduce ningún motor nuevo. Se documenta en `design.md` porque toca varios componentes a la vez y porque hay decisiones de API y de accesibilidad que conviene fijar antes de codear, no por complejidad técnica nueva.

Motores reutilizados (ver `ROADMAP.md` y la spec `component-authoring`):
- **RAF de texto** (patrón `ScrambleText`): muta `textContent` por ref, progresión por timestamp, accesible via `aria-label`. → `TypewriterText`.
- **CSS puro + `useInView`** (patrón `ScrollReveal`): el JS togglea un atributo, la entrada es una CSS transition. → `SplitReveal`.
- **Scroll-driver** (`subscribeScroll` + `useInView`, patrón `StickyScenes`/`ParallaxLayers`): escribe CSS vars sin estado de React en el hot path. → `StackedCards`.
- **CSS keyframes inyectados** (patrón variantes de `AnimatedBackground`): → variante `lava`.

## Goals / Non-Goals

**Goals:**
- Cubrir tres efectos de landing muy pedidos (typing, split reveal, stacked cards) + la estética lava lamp, sin dependencias nuevas.
- Mantener accesibilidad: los efectos de texto exponen el contenido completo a lectores de pantalla.
- Mantener el principio de "sin estado de React en el hot path" para el efecto ligado a scroll.
- API consistente con los componentes existentes (props + CSS vars `--aui-*`, `respectReducedMotion`, spread de props HTML).

**Non-Goals:**
- No se introduce ningún motor de animación nuevo (eso es Wave C).
- `TypewriterText` NO implementa resaltado de sintaxis ni markdown; opera sobre texto plano (como `ScrambleText`).
- `SplitReveal` NO maneja rich text/HTML anidado; opera sobre un string de texto plano.
- `StackedCards` NO implementa scroll-jacking ni snap; respeta el scroll nativo del usuario.
- La variante `lava` NO usa WebGL ni canvas (decisión explícita del usuario: "no metamos un engine").

## Decisions

### Decisión 1: `TypewriterText` y `SplitReveal` son componentes separados

Idea original #1 ("nuevos efectos de text-reveal como typing") se separa en dos componentes porque son motores y APIs distintos:
- `TypewriterText` es **temporal** (RAF, char por char en el tiempo, cursor, loop de strings).
- `SplitReveal` es **espacial/declarativo** (CSS transitions con stagger, dispara por viewport).

Forzarlos en un solo componente con un prop `mode` mezclaría dos modelos mentales y dos motores. Separados, cada uno es chico y enfocado. *Alternativa descartada:* un único `RevealText` con `effect="typing" | "split"` — se descartó por acoplar RAF y CSS en un mismo componente con superficies de props disjuntas.

### Decisión 2: `TypewriterText` reutiliza el patrón exacto de `ScrambleText`

Mismo loop RAF con progresión por timestamp (independiente de Hz), misma estrategia de accesibilidad (`aria-label` con texto final + caracteres visibles `aria-hidden`), misma mutación por ref sin re-render. La lógica pura (qué substring mostrar dado el tiempo transcurrido, transiciones del modo loop type→pause→delete→next) se extrae a un módulo `typewriter.ts` testeable con vitest, igual que `scramble.ts`. *Alternativa descartada:* animar con CSS `steps()` sobre `width`/`ch` — no soporta cursor multi-string ni borrado, y rompe con texto multilínea.

### Decisión 3: `SplitReveal` parte en el cliente y preserva accesibilidad + SSR

El texto se renderiza completo y visible para SSR/SEO desde el primer paint; tras la hidratación se parte en spans (`char`/`word`/`line`) marcados `aria-hidden`, con el `aria-label` portando el texto completo en el root. El stagger se logra con una CSS var de índice por unidad (`--aui-split-i`, patrón `--aui-reveal-i` de `ScrollReveal`) multiplicada por `--aui-split-stagger` en el `transition-delay`. Partir por **línea** requiere medir el wrapping real del texto renderizado (depende del ancho): se hace tras el montaje midiendo las cajas de las palabras y agrupándolas por `offsetTop`. *Alternativa descartada:* partir en el server — el split por línea depende del layout del cliente (ancho del contenedor, fuente cargada), imposible de resolver en SSR.

### Decisión 4: `StackedCards` se apoya en `position: sticky` nativo + scroll-driver para la profundidad

El apilado físico lo da `position: sticky; top: offsetTop` en cada wrapper de card; el navegador hace el "pin" gratis. El scroll-driver solo se usa para calcular, por card, cuántas cards tiene encima y escribir `--aui-stack-depth` (entero) y un progreso fraccional, con los que `transform: scale()` y `opacity` interpolan en el compositor. Esto mantiene cero estado de React por frame. El contenedor reserva recorrido de scroll con una altura igual a `(N) × cardTravel` para que cada card alcance su pin antes de la siguiente. *Alternativa descartada:* posicionar todo con `position: absolute` y traducir por JS (como hace una librería de scroll-jacking) — más caro, pelea con el scroll nativo y rompe accesibilidad/print.

### Decisión 5: La variante `lava` usa el truco "gooey" CSS, no canvas

`lava` es un módulo en `variants/lava.ts` siguiendo el patrón de las otras cuatro variantes. Varios blobs (`radial-gradient` o pseudo-elementos opacos) animados con `@keyframes` de `translateY` a distinta fase; el contenedor aplica `filter: blur(N) contrast(M)` para fundir los bordes (los píxeles semitransparentes del blur se "endurecen" con contrast, creando el metaball gooey). *Trade-off conocido:* el gooey exige blobs opacos sobre fondo opaco (no funciona con transparencia real) y `filter` sobre áreas grandes tiene costo de pintado. Se mitiga acotando el blur y documentando que `lava` rinde mejor en contenedores acotados que a pantalla completa en gama baja. *Alternativa descartada:* SVG `feGaussianBlur` + `feColorMatrix` — funciona pero agrega un `<svg>` de filtro y es más verboso que el filter CSS; el resultado visual es equivalente.

## Risks / Trade-offs

- **[Split por línea es sensible al layout]** → Medir tras el montaje (y re-medir en resize vía `useResizeObserver`); con reduced motion o pre-hidratación se muestra el texto completo, así que nunca queda roto.
- **[Fuentes web que cargan tarde desplazan el split]** → Re-medir on resize cubre el reflow; documentar que para textos críticos conviene `font-display: swap` estable. Aceptable: es decorativo.
- **[`filter` de la variante lava es caro a pantalla completa en móviles]** → Acotar blur por default, degradar a estático con reduced motion, documentar el caso de uso recomendado (contenedor acotado).
- **[StackedCards y altura reservada]** → Si el consumer pone cards de alturas muy dispares, el recorrido reservado puede no calzar perfecto. Se documenta el modelo (recorrido por card configurable) y se elige un default que funcione con cards de altura similar.
- **[Cursor del typewriter y layout shift]** → El cursor se renderiza como elemento inline de ancho fijo; documentar usar monospace o `ch` si el shift molesta (mismo caveat que `ScrambleText`).

## Migration Plan

Todo aditivo, sin breaking changes:
1. Implementar los tres componentes nuevos en `src/components/` y la variante `lava`.
2. Exportar desde `src/index.ts`; agregar `'lava'` al union `AnimatedBackgroundVariantName`.
3. Documentar en README y agregar ejemplos en `/examples`.
4. Actualizar `ROADMAP.md` marcando SplitReveal (Tier 2) y las entradas nuevas.

Rollback: revertir el commit de la tanda; al ser aditivo no afecta a consumers existentes.

## Open Questions

- Naming de `SplitReveal` vs `SplitText`: se elige `SplitReveal` para alinear con el nombre ya listado en `ROADMAP.md` (Tier 2) y con la familia `*Reveal`. Reconsiderable antes de publicar.
- ¿`TypewriterText` debería exponer un callback `onComplete`/`onLoop`? Se deja fuera del alcance inicial; se puede agregar sin romper la API si surge demanda.
