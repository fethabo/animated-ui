# Design: parallax-layers-scroll-progress

## Context

Tanda v0.5 del ROADMAP.md: `ParallaxLayers` + `ScrollProgress`, los dos componentes que necesitan **posición continua de scroll**. La foundation dejó documentada la decisión del motor de scroll como pendiente, con tres candidatos: IntersectionObserver (ya cubierto por `useInView` en v0.4, pero solo reporta entrar/salir), scroll listener + RAF, y CSS scroll-driven animations. Este design la resuelve.

Patrones ya establecidos que esta tanda hereda: CSS vars escritas directamente sobre el elemento sin estado de React (SpotlightCard, MouseParallax), subcomponente `Layer` con `depth` (MouseParallax), `translate`/`scale` como propiedades independientes compositadas.

Constraints heredados (vinculantes, ver `openspec/specs/component-authoring/spec.md`): cero deps de runtime, `'use client'` + SSR-safe, customización en dos capas (props + `--aui-*`), `respectReducedMotion` default `true`, ejemplo standalone por componente, docs en README, tests de lógica pura.

## Goals / Non-Goals

**Goals:**
- Decidir y documentar el motor de scroll de posición continua, reutilizable por StickyScenes (v0.6+)
- `ParallaxLayers` con capas de profundidad ligadas al scroll, sin re-renders por frame y sin costo cuando está fuera del viewport
- `ScrollProgress` como barra de progreso de lectura de la página, compositada
- Dos ejemplos standalone y documentación completa

**Non-Goals:**
- Hook público del motor (`useScrollProgress`): queda como util interna hasta que un tercer consumidor lo justifique (mismo criterio que la lógica de proximidad en v0.2)
- `StickyScenes` (v0.6+) — reutilizará este motor
- Scroll horizontal y scroll containers anidados (el motor opera sobre el scroll del documento en v0.5; extensible después)
- Progreso de un contenedor arbitrario en ScrollProgress (v0.5 es progreso de página; si se pide, se extiende con una prop `target`)

## Decisions

### D1: El motor de scroll es un listener pasivo + RAF que escribe CSS vars — CSS scroll-driven animations queda descartada por ahora

**Decision:** Util interna `subscribeScroll(callback)` en `src/utils/scroll-driver.ts`: registra `scroll` y `resize` pasivos sobre `window`, coalesce los eventos con `requestAnimationFrame` (máximo una ejecución del callback por frame), ejecuta el callback una vez al suscribir (posición inicial) y retorna la función de cleanup. Los componentes usan el callback para escribir 1–2 CSS custom properties sobre su elemento; todo el trabajo visual (translate/scale) lo hace el compositor via `calc()` sobre esas vars.

**Alternativas consideradas:**

| Opción | Por qué no (hoy) |
| --- | --- |
| **CSS scroll-driven animations** (`animation-timeline: view()/scroll()`) | Cero JS por frame — el ideal teórico. Pero el soporte es reciente (Chrome 115+, Firefox 136+, Safari 26+): la base instalada de Safari/Firefox viejos obliga a mantener **un fallback JS completo en paralelo**, es decir dos implementaciones, dos superficies de test y dos comportamientos que mantener idénticos, para el mismo efecto visual. El costo del listener JS es ya mínimo (ver abajo). |
| **IntersectionObserver con N thresholds** | Granularidad discreta (saltos entre thresholds), pensado para entrar/salir, no para posición continua suave. Ya lo usamos donde corresponde (`useInView`). |
| **Estado de React por scroll** | Re-render por frame de todo el subtree — el anti-patrón que el paquete evita desde PixelBackground. |

**Por qué el costo del listener es aceptable:** el callback por frame hace una lectura de layout (`getBoundingClientRect` o `scrollTop`) y escribe vars; el movimiento real corre en el compositor. Es el mismo perfil de costo que MouseParallax con mousemove, aplicado a scroll. `passive: true` garantiza no bloquear el scroll del browser.

**Criterio de migración futura** (se anota en el ROADMAP): cuando el baseline de browsers del paquete incluya scroll-driven animations de forma generalizada, el motor puede migrar por dentro sin cambiar la API pública — las vars y `calc()` quedan, cambia quién las anima.

### D2: ParallaxLayers expone el progreso del contenedor como var normalizada; las capas son CSS puro

**Decision:** El root mide en cada tick su posición con `getBoundingClientRect()` y escribe `--aui-parallax-scroll` normalizada a **[-1, 1]**: `-1` cuando el contenedor recién asoma por abajo del viewport, `0` cuando su centro coincide con el centro del viewport, `1` cuando termina de salir por arriba (clampeada fuera de ese rango). La lógica es pura y testeable: `viewportProgress(rectTop, rectHeight, viewportHeight)`.

`ParallaxLayers.Layer` (mismo patrón público que `MouseParallax.Layer`) acepta `depth` (px de desplazamiento máximo; positivo se mueve con el scroll — más lento que el contenido, sensación de fondo —, negativo contra él) y se traslada con `translate: 0 calc(var(--aui-parallax-scroll, 0) * var(--aui-parallax-scroll-depth))`, sin transition (el scroll ya es continuo; una transition agregaría lag tipo "rubber band", a diferencia del mouse donde suaviza).

**Activación por visibilidad:** el root usa `useInView` (`once: false`, `rootMargin: '100px'`, `threshold: 0`) y solo se suscribe al scroll driver mientras interseca. N contenedores parallax fuera de pantalla cuestan cero por frame. Es la primera composición de los dos motores de scroll del paquete y el patrón que StickyScenes reutilizará.

**API simétrica con MouseParallax deliberadamente:** mismo subcomponente `Layer`, misma semántica de `depth` en px, mismo namespace conceptual. Un consumer que sabe usar uno sabe usar el otro.

### D3: ScrollProgress es una barra fija animada con scale compositado

**Decision:** Renderiza un track fijo (`position: fixed`, `top` o `bottom` según prop `position`, ancho completo) con una barra interior que escala: `transform: scaleX(var(--aui-progress, 0))` con `transform-origin: left`. El tick escribe `--aui-progress` = `pageProgress(scrollTop, scrollHeight, clientHeight)` ∈ [0, 1] (0 si la página no tiene overflow). Se usa `transform: scaleX` y no `width` porque escala en el compositor sin relayout.

El componente renderiza el track aunque el progreso sea 0 (la barra vacía es información: "hay más para leer"). `aria-hidden="true"` por default: es decorativo/duplicado de la posición de scroll que ya expone el browser; un rol `progressbar` con `aria-valuenow` actualizado por frame generaría spam en lectores de pantalla.

### D4: Comportamiento bajo prefers-reduced-motion, por componente

| Componente | Con reduced motion |
| --- | --- |
| `ParallaxLayers` | **Inactivo** — desplaza contenido real creando movimiento relativo durante el scroll (la clase de efecto que más afecta a usuarios con sensibilidad vestibular). Capas quietas en su posición de layout; el contenido queda íntegro y legible. Mismo criterio que MouseParallax/TiltCard. |
| `ScrollProgress` | **Activo** — no desplaza contenido: refleja 1:1 la posición de scroll que el usuario controla directamente, como la scrollbar nativa (precedente: SpotlightCard, input directo sin movimiento de contenido). `respectReducedMotion` se acepta por consistencia de API y se documenta que no tiene efecto en esta versión. |

En ambos, el chequeo usa `useReducedMotion` (reactivo): con la preferencia activa, ParallaxLayers no se suscribe al driver y limpia sus vars a 0.

### D5: CSS custom properties

- `ParallaxLayers`: `--aui-parallax-scroll` (runtime, escrita por el driver), `--aui-parallax-scroll-depth` (por capa, desde la prop `depth`, default `40px`). Sin vars estéticas: el contenedor no pinta nada propio.
- `ScrollProgress`: `--aui-progress` (runtime), `--aui-progress-color` (default `#7c3aed`), `--aui-progress-height` (default `3px`), `--aui-progress-bg` (default `transparent`, color del track), `--aui-progress-z` (default `50`, z-index del fixed). `position` (`'top' | 'bottom'`) es de comportamiento/layout, prop sin var.

## Risks / Trade-offs

- **`getBoundingClientRect` por frame durante scroll en ParallaxLayers** → lectura de layout forzada. Mitigación: una sola lectura por frame y por contenedor visible (coalescido por RAF + activación por visibilidad); no hay escrituras de layout intercaladas en el mismo tick (las vars solo afectan transform compositado), así que no hay layout thrashing.
- **Capas que se desplazan pueden revelar "huecos" en los bordes del contenedor** → comportamiento estándar del parallax: el consumer dimensiona las capas de fondo más grandes que el contenedor (e.g. `inset: -10%`). Documentado en README con ejemplo.
- **ScrollProgress con `position: fixed` compite con headers fijos del consumer** → `--aui-progress-z` configurable y documentado; el track no captura eventos (`pointer-events: none`).
- **Páginas sin overflow** → `pageProgress` retorna 0 (división por cero guardada); la barra queda vacía, estado correcto.
- **Zoom/resize cambian las medidas** → el driver también escucha `resize` y recalcula.
- **Scroll containers custom (no `window`)** → fuera de alcance de v0.5; el motor está encapsulado en una util, extenderlo a un `target` después no rompe API pública.
