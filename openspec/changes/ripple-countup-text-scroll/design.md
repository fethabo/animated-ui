## Context

Wave E no introduce decisiones arquitectónicas nuevas: los tres componentes aplican motores establecidos. Este design solo mapea cada componente a su motor y documenta la única decisión de diseño real de la tanda (la extracción del split de texto).

## Mapeo componente → motor

| Componente | Motor | Piezas reutilizadas |
| --- | --- | --- |
| RippleContainer | CSS keyframes inyectados | `injectStyles`, `useReducedMotion` |
| CountUp | RAF que muta `textContent` por ref | patrón ScrambleText, `useInView`, `useReducedMotion` |
| TextScrollReveal | Scroll de posición continua → CSS vars | `subscribeScroll`/`viewportProgress` (scroll-driver), split de SplitReveal, `useInView` (activar tracking solo cerca del viewport, patrón ParallaxLayers) |

## Decisiones

### 1. Split de texto compartido (única decisión de la tanda)

`TextScrollReveal` necesita partir el texto por palabra con el mismo contrato de accesibilidad que `SplitReveal` (texto completo en `aria-label`, unidades `aria-hidden`). Opciones:

- **A. Extraer la lógica de split de `SplitReveal` a `src/utils/split-text.ts`** (módulo interno puro) y que ambos componentes la consuman. ✅ **Elegida**, condicional a que la extracción sea limpia: el split por char/word es lógica pura sin DOM; el split por línea (que requiere medición en cliente) queda en `SplitReveal`, que es el único que lo usa.
- B. Duplicar un split por palabra mínimo dentro de `TextScrollReveal`. Fallback si la extracción acopla de más (e.g. si el split de `SplitReveal` está entrelazado con sus presets de animación).

Criterio de aceptación del refactor: los tests existentes de `SplitReveal` pasan sin modificación de comportamiento, y `split-text.ts` queda con tests propios.

### 2. RippleContainer: nodos efímeros, no estado React

Cada click crea un nodo `<span>` posicionado en el punto del click via DOM imperativo (ref al contenedor), y se remueve en `animationend`. Sin `useState` de lista de ripples: evita re-renders y garbage por click. El contenedor escucha `pointerdown` (no `click`) para que la onda arranque al presionar.

### 3. CountUp: SSR renderiza el valor final

El markup del servidor contiene el valor final formateado (SEO y no-JS correctos). Tras hidratar, al entrar al viewport, el RAF anima desde `from` hasta el valor final mutando `textContent` por ref. Con reduced motion se muestra el valor final sin animación (coincide con el markup SSR — cero salto visual).

### 4. TextScrollReveal: progreso en una sola CSS var

El scroll-driver escribe una única var de progreso (`--aui-text-scroll-progress`, 0→1) en el root; cada palabra resuelve su opacidad con `calc()` a partir de su índice (custom prop por unidad seteada inline una vez, en render). Cero JS por palabra por frame — misma arquitectura que ParallaxLayers/StackedCards.

## Riesgos

- **Refactor de SplitReveal**: riesgo de regresión — mitigado por el criterio de aceptación (tests existentes intactos) y por el fallback B.
- **CountUp y layout shift**: números de ancho variable pueden hacer "bailar" el layout durante la cuenta — mitigación: documentar `font-variant-numeric: tabular-nums` en README como recomendación (no imponerlo).
