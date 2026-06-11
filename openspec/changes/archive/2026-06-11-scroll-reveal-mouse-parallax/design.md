# Design: scroll-reveal-mouse-parallax

## Context

Tanda v0.4 del ROADMAP.md: `ScrollReveal` (Tier 3, adelantable) + `MouseParallax` (Tier 1 pendiente). Introduce la única decisión arquitectónica nueva de la tanda: el hook `useInView` sobre IntersectionObserver — deliberadamente más chico que el "motor de scroll" completo (posición continua), que el roadmap difiere a v0.5. MouseParallax no necesita nada nuevo: es el patrón de CSS vars por mousemove de SpotlightCard aplicado a capas con profundidad.

Constraints heredados (vinculantes, ver `openspec/specs/component-authoring/spec.md`): cero deps de runtime, `'use client'` + SSR-safe, customización en dos capas (props + `--aui-*`), `respectReducedMotion` default `true`, ejemplo standalone por componente, docs en README, tests de lógica pura.

## Goals / Non-Goals

**Goals:**
- Hook público `useInView` reutilizable (lo van a consumir los components de scroll de v0.5+)
- `ScrollReveal` con entrada animada al entrar al viewport y stagger entre hijos, sin JS por frame (CSS transitions)
- `MouseParallax` con capas de profundidad arbitrarias, sin re-renders de React por frame
- Dos ejemplos standalone y documentación completa

**Non-Goals:**
- Motor de scroll de posición continua (scroll listener + RAF o CSS scroll-driven animations) — decisión de v0.5 con design propio
- `ParallaxLayers` ligado a scroll (v0.5); MouseParallax responde solo al mouse
- Re-reveal coreografiado al salir/entrar repetidamente (se soporta `once={false}` simple: el estado sigue a la intersección)
- Touch/gyroscope para MouseParallax (degrada a estático en touch, mismo criterio que v0.2)

## Decisions

### D1: useInView expone un boolean por IntersectionObserver, con fallback "visible"

**Decision:** `useInView(ref, { threshold = 0.15, rootMargin = '0px', once = true }): boolean`. Crea un IntersectionObserver en `useEffect`, retorna `false` en SSR y primer render de cliente, y actualiza al intersecar. Con `once`, deja de observar tras la primera intersección (el boolean queda `true`). Si `IntersectionObserver` no existe en el entorno, retorna `true` inmediatamente.

**Por qué fallback `true` y no `false`:** el consumidor principal es un reveal — si el browser no puede observar, lo seguro es mostrar el contenido, nunca dejarlo oculto para siempre. Mismo criterio defensivo que el `@supports` de ShinyText (el texto nunca queda invisible).

**Por qué `once` default `true`:** el caso de uso dominante de un reveal es entrar una vez; re-observar indefinidamente deja listeners vivos sin valor. `once={false}` queda para quien quiera que el estado siga a la visibilidad.

**Alternativa considerada:** retornar también el `entry` (ratio, bounds). Rechazado: ningún consumidor de esta tanda lo necesita y agranda la API pública; si v0.5 lo necesita, se extiende de forma compatible.

### D2: ScrollReveal anima con CSS transitions sobre hijos directos envueltos en items

**Decision:** El root es un `<div>` observado por `useInView`. Cada hijo directo se envuelve en un `<div class="aui-reveal-item">` que porta el estado inicial (opacity 0 + `translate` según `direction`/`distance`) y la transition. Al intersecar, el root recibe `data-aui-visible` y el CSS inyectado lleva los items a su estado final. El stagger es `transition-delay: calc(var(--aui-reveal-stagger, 0.1s) * var(--aui-reveal-i))`, con `--aui-reveal-i` seteada inline por item según su índice. Cero JS por frame: el JS solo togglea un atributo.

**Por qué wrappers y no `cloneElement`:** clonar exige que cada hijo sea un elemento que acepte `className`/`style` (falla con strings, fragments, componentes que no spread-ean), y acopla el efecto a la implementación de los children. El wrapper `div` es predecible; se documenta que participa del layout (los items son block; para grids/flex el consumer pone `display: contents`… no: `display: contents` anula transforms). Se documenta en README que el root acepta `className`/`style` para integrarse al layout (e.g. el root mismo puede ser el grid, y los items son las celdas).

**SSR y primer paint:** el estado oculto se renderiza desde el primer paint (server incluido) — sin flash de contenido que se esconde. El contenido sigue en el DOM (SEO/lectores). El costo: sin JS el contenido quedaría oculto; mitigado porque (a) el paquete ya exige hidratación para todo, (b) reduced motion y browsers sin IntersectionObserver muestran directo. Trade-off documentado en README.

**Reduced motion:** el reveal es autónomo → con la preferencia activa los items renderizan visibles en su posición final, sin transición. Se resuelve con `useReducedMotion` (estado, no imperativo: acá no hay loop que arrancar, solo qué CSS aplicar, y el primer render `false` produce el estado oculto que igualmente se corrige al hidratar).

### D3: MouseParallax escribe CSS vars normalizadas; las capas se desplazan con calc() puro

**Decision:** El root trackea `mousemove` con un handler directo (patrón SpotlightCard, sin `useMousePosition`: ese hook pasa por `setState` y re-renderiza por movimiento) y escribe `--aui-parallax-x`/`--aui-parallax-y` normalizadas a [-1, 1] respecto del centro del contenedor. `MouseParallax.Layer` (subcomponente público) acepta `depth` (px de desplazamiento máximo, positivo = sigue al mouse, negativo = se opone) y se traslada con CSS puro: `translate: calc(var(--aui-parallax-x, 0) * var(--aui-parallax-depth) ) ...`, suavizado con `transition: translate 0.2s ease-out`. Al salir el cursor, las vars vuelven a 0 y las capas regresan al centro con la misma transition.

**Por qué transition CSS y no WAAPI con momentum:** las capas pueden ser muchas; una `Animation` WAAPI por capa por mousemove multiplica objetos y trabajo. La transition corre en el compositor, da el suavizado esperado, y el costo no escala con la frecuencia de eventos. TiltCard necesita WAAPI porque interpola un estado que expone por render prop; acá el estado vive solo en CSS.

**Por qué subcomponente `MouseParallax.Layer` y no render prop:** un render prop con la posición re-renderizaría todo el subtree por frame (el anti-patrón que esta tanda evita). `Layer` es declarativo, componible y cada capa es un solo `<div>` con una var inline. Es el primer subcomponente público del paquete; precedente interno: variants/behaviors de AnimatedBackground/PixelBackground.

**Reduced motion:** desplaza contenido → con la preferencia activa el handler no escribe vars y las capas quedan en 0 (estático). Input directo pero con movimiento de contenido: mismo criterio que TiltCard/MagneticElement, no el de SpotlightCard.

### D4: CSS custom properties

- `ScrollReveal`: `--aui-reveal-duration` (default `0.6s`), `--aui-reveal-distance` (default `24px`), `--aui-reveal-stagger` (default `0.1s`), `--aui-reveal-easing` (default `cubic-bezier(0.22, 1, 0.36, 1)`). `--aui-reveal-i` es de runtime (índice por item, seteada por el componente). `direction`, `threshold` y `once` son de comportamiento, sin CSS var.
- `MouseParallax`: `--aui-parallax-ease` (default `0.2s`, duración del suavizado). `--aui-parallax-x`/`--aui-parallax-y` son de runtime (escritas por el handler); `--aui-parallax-depth` la setea cada `Layer` desde su prop. `depth` es por capa, prop-first.

## Risks / Trade-offs

- **Contenido oculto pre-hidratación en ScrollReveal** → en conexiones lentas el contenido tarda en aparecer. Mitigación: documentado; reduced motion y entornos sin IntersectionObserver muestran directo; el contenido permanece en el DOM. Es el comportamiento estándar de las librerías de reveal.
- **Los wrappers `.aui-reveal-item` participan del layout** → en grids/flex el consumer debe tratar los items como celdas (el root acepta `className` para ser él mismo el grid). Documentado con ejemplo en README.
- **`translate` como propiedad CSS independiente** (no `transform`) en MouseParallax y ScrollReveal → soporte universal en browsers modernos (2022+); evita pisar `transform` del consumer. Si un consumer necesita soportar browsers viejos, puede pisar con su propio CSS. Documentado.
- **IntersectionObserver con `threshold` alto y elementos más grandes que el viewport** → un elemento que nunca alcanza el ratio no revela. Mitigación: default `0.15` (bajo) y `rootMargin` configurable; documentado.
- **Touch devices en MouseParallax** → sin `mousemove`, capas estáticas centradas: estado visualmente válido. Sin simulación con touch/gyro en v0.4.
