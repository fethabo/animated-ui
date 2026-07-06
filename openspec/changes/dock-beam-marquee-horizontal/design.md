## Context

Wave G no introduce decisiones arquitectónicas nuevas: aplica `useMousePosition` + transforms por ref (patrón MagneticElement/SpotlightCard), CSS puro inyectado y el scroll-driver de v0.5. Este design fija las decisiones locales de cada pieza.

## Mapeo componente → motor

| Componente | Motor | Piezas reutilizadas |
| --- | --- | --- |
| Dock | `useMousePosition` + transforms por ref | patrón MagneticElement, `useReducedMotion` |
| BorderBeam | CSS puro (`offset-path` + keyframes) | `injectStyles` (patrón GlowBorder) |
| Marquee | CSS puro (keyframes de translate) + scroll-driver opt-in | `injectStyles`, `subscribeScroll` (solo con `scrollVelocity`) |
| HorizontalScrollSection | sticky + scroll-driver → CSS var | patrón StickyScenes, `useInView`, `useResizeObserver` |
| AnimatedBackground grid/rays/dots | CSS puro (variantes) | contrato de variantes existente |

## Decisiones

### 1. Dock: composición con `Dock.Item` y escala por distancia

API compuesta `Dock` + `Dock.Item` (patrón `MouseParallax.Layer`). En cada `mousemove` (solo con el cursor dentro del dock, por ref sin re-renders), cada ítem calcula su factor por distancia horizontal al cursor con una campana suave (`cos` recortado sobre `radius`) y aplica `scale`/`translateY` directo al style del ítem. Al salir el cursor, los ítems vuelven con una transition CSS (retorno elástico barato, sin WAAPI por ítem). `magnification` (escala máxima) y `radius` (px de influencia) son props del contenedor.

### 2. BorderBeam: `offset-path: border-box` con fallback

El cometa es un pseudo-nodo posicionado con `offset-path: border-box` + `offset-distance` animado 0→100% — sigue el perímetro incluyendo `border-radius` sin JS. Baseline 2024 en los tres engines; para browsers sin soporte, `@supports not (offset-path: border-box)` degrada a ocultar el cometa (el contenedor y children quedan intactos). Alternativa descartada: replicar el recorrido con 4 keyframes de translate (no sigue esquinas redondeadas).

### 3. Marquee: duplicación aria-hidden y loop sin costura

El contenido se renderiza dos veces (la copia `aria-hidden`) dentro de una pista que anima `translateX(-50%)` en loop — sin JS por frame en el modo base. `scrollVelocity` (opt-in) suscribe al scroll-driver y modula `animation-duration`/skew via CSS vars escritas en el RAF existente del driver; la velocidad de scroll se deriva en el driver sin listeners nuevos. `pauseOnHover` con `animation-play-state`.

### 4. HorizontalScrollSection: altura = recorrido

El root define la altura total (`100dvh + travel`), un inner `position: sticky; top: 0; height: 100dvh; overflow: hidden` contiene la fila horizontal. El scroll-driver escribe `--aui-hscroll-progress` (0→1) en el root; la fila se desplaza con `transform: translateX(calc(...))` compositado. `travel` se mide con `useResizeObserver` (ancho de la fila − viewport). Mismo esqueleto que StickyScenes; sin React state en el hot path.

### 5. Variantes de AnimatedBackground

Cada variante es un módulo propio en `variants/` con el contrato existente (CSS generado + defaults de `colors`/`speed`). `grid`: plano con `perspective` + líneas en gradientes repetidos desplazándose; `rays`: cono de gradientes rotando lento desde un vértice; `dots`: `radial-gradient` repetido con pulso de opacidad/escala. Reduced motion: composición estática, como las variantes actuales.

## Riesgos

- **Dock en touch**: sin cursor no hay magnificación — el dock queda como fila estática funcional (documentar; no simular con touchmove).
- **`offset-path` en browsers viejos**: cubierto por la degradación `@supports` (sin cometa, sin roturas).
- **Marquee con pocos hijos**: si el contenido no llena el ancho, el loop muestra huecos — documentar `minWidth`/repetición recomendada en README y rellenar con repeticiones adicionales si el contenido es más angosto que el contenedor (medido una vez con `useResizeObserver`).
