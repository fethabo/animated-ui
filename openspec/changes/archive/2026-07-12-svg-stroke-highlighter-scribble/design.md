## Context

El paquete tiene motores CSS, canvas, WAAPI, scroll y ruido — pero nunca usó SVG. La técnica de line-drawing (`stroke-dasharray: L; stroke-dashoffset: L → 0`) es el estándar para "dibujar" trazos y es CSS puro por frame; lo único que requiere JS es la **medición** (`path.getTotalLength()`, solo disponible post-montaje) y, para la estética hand-drawn, la **generación procedural de paths**. Esta wave introduce ambas primitivas como decisión arquitectónica (análoga a `noise.ts` en Wave H: una primitiva → tres componentes).

## Goals / Non-Goals

**Goals:**

- Primitiva interna de line-drawing reutilizable: medir paths, setear vars de dash y animar con CSS inyectado (cero JS por frame).
- Generador procedural seedable de paths hand-drawn (módulo puro testeable, sin DOM).
- Tres componentes: TextHighlighter (inline, sobre texto), DrawPath (wrapper de SVGs del consumer), ScribbleDecoration (shapes decorativas standalone).
- Biblioteca de shapes de ScribbleDecoration extensible por contrato (precedente: `aesthetics/` de GuidingBranches).

**Non-Goals:**

- No se anima morphing de paths (interpolación de `d`) — solo line-drawing por dash.
- No se recorren SVGs animados por JS por frame: la animación es 100% CSS.
- TextHighlighter no re-dibuja en cambios de wrapping multi-línea complejos (ver decisión 4).
- Las utils del motor quedan internas (como `noise.ts`); no se exportan.

## Decisions

### 1. Animación por CSS inyectado con vars de dash, no WAAPI ni RAF

Cada path animable recibe inline `stroke-dasharray: <L>` y `stroke-dashoffset: <L>` (medidos post-montaje) y una clase con `animation`/`transition` inyectada via `injectStyles` que lleva el offset a 0; el delay por índice implementa el stagger (patrón `--aui-split-i` de SplitReveal). Alternativas: WAAPI (`path.animate`) — funciona, pero pierde la degradación gratuita y la pisabilidad por CSS vars que es convención del paquete; RAF — innecesario, no hay física.

**Retrigger** (con `once={false}`): re-ocultar = restaurar el offset a L sin transición (toggle de atributo `data-aui-drawn`, patrón ScrollReveal).

### 2. Medición en efecto post-montaje, render SSR completo y visible

`getTotalLength()` no existe en SSR/jsdom. El markup SSR renderiza los paths **completos y visibles** (sin dash), y el efecto de cliente los "rebobina" (setea dash/offset) inmediatamente antes de armar el trigger — mismo compromiso pre-hidratación que SplitReveal (contenido visible para SEO/no-JS; el rebobinado post-hidratación puede producir un flash breve, aceptado y documentado). En jsdom, `getTotalLength` se mockea en tests.

### 3. Paths hand-drawn: generador procedural en módulo puro (`hand-drawn.ts`)

Shapes paramétricas (underline, wavy underline, circle/ellipse abierta, strike, box, arrow, asterisk, spiral) generadas como strings `d` de curvas cuadráticas/cúbicas con **jitter seedable** via `createPrng(seed)`: puntos de control perturbados, doble pasada opcional para el look "marcador" (el círculo que se cierra dos veces). Módulo puro: recibe dimensiones + seed, retorna `d` — testeable sin DOM (determinismo, bounds). Alternativa considerada: paths estáticos hardcodeados — rechazada: no se adaptan al tamaño medido del texto y pierden la variación orgánica.

### 4. TextHighlighter: SVG overlay absoluto medido sobre el span

El componente envuelve el texto en un `<span>` relativo y posiciona detrás/encima un `<svg>` absoluto dimensionado por `useResizeObserver` del span; el path se regenera (misma seed) al cambiar el tamaño. Para texto que wrappea en varias líneas, el shape se dibuja sobre el bounding box completo (comportamiento estándar de las libs del género; documentado — se recomienda aplicarlo a frases cortas). Dispara con `useInView` (`trigger="in-view"`, default) o al montar. El SVG es `aria-hidden` y `pointer-events:none`: el texto queda intacto para selección y lectores.

### 5. DrawPath: medir descendientes sin reestructurar el SVG del consumer

DrawPath clona nada y muta poco: en el efecto busca `path, line, polyline, circle, rect, ellipse` descendientes (los no-path también exponen `getTotalLength()` en browsers modernos), les setea dash vars inline y la clase de animación con stagger por orden documental. `strokeWidth`/`stroke` del consumer se respetan; el componente solo controla el dibujo. Filtro opt-out: elementos con `data-aui-no-draw` se saltean.

### 6. ScribbleDecoration: shapes como módulos registrables

Contrato `ScribbleShape = (size, seed, options) => d` con las shapes builtin en módulos separados (tree-shakeables) y prop `shape: 'arrow' | 'asterisk' | 'spiral' | 'underline' | 'circle' | ScribbleShape` — el consumer puede pasar su propia función (mismo patrón extensible que las `aesthetics/` de GuidingBranches). Loop opcional (`repeat`): re-dibuja con animación cíclica.

### 7. Reduced motion: trazo completo estático

Con `prefers-reduced-motion`, los tres componentes muestran el trazo final completo sin animación (equivalente al "estado final directo" de ScrollReveal/SplitReveal). El shape hand-drawn se conserva (es estética, no movimiento).

## Risks / Trade-offs

- [Flash de "rebobinado" post-hidratación (decisión 2)] → el efecto corre en `useLayoutEffect` (antes del paint del cliente) minimizando la ventana; documentado.
- [`getTotalLength()` de shapes no-path en browsers viejos] → fallback: si el elemento no expone el método, se deja visible sin animar (degradación silenciosa).
- [Highlight sobre texto multi-línea puede verse tosco] → documentado con recomendación de uso (palabras/frases cortas); el bounding box es el comportamiento esperado del género.
- [Regenerar el path en cada resize podría ser frecuente] → `useResizeObserver` ya coalesce; la generación es barata (decenas de puntos).
- [jsdom sin medición real] → `getTotalLength` mockeado en tests; el determinismo del generador se testea en el módulo puro sin DOM.

## Migration Plan

Cambio aditivo; sin migración para consumers. La fila del motor ya figura como ⬜ en ROADMAP (pasa a ✅ al completar). Rollback = no publicar los exports nuevos.

## Open Questions

- ¿`hand-drawn.ts` y `svg-stroke.ts` como dos utils o una? Se decide en la primera task con el código a la vista (criterio: si `svg-stroke.ts` queda en <30 líneas, se fusionan).
