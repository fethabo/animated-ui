# Design: spotlight-card-glow-border-magnetic-element

## Context

Tanda v0.2 del ROADMAP.md: tres efectos de mouse sobre contenedores (`SpotlightCard`, `GlowBorder`, `MagneticElement`). Es la tanda de menor riesgo del roadmap: no introduce ninguna decisión arquitectónica nueva, reutiliza los tres motores de la foundation (CSS injection via `injectStyles`, CSS vars mutadas por `mousemove`, WAAPI con momentum de `TiltCard`) y los hooks existentes (`useReducedMotion`).

Constraints heredados (vinculantes, ver `openspec/specs/component-authoring/spec.md`): cero deps de runtime, `'use client'` + SSR-safe, customización en dos capas (props + `--aui-*`), `respectReducedMotion` default `true`, ejemplo standalone por componente, docs en README, tests de lógica pura.

## Goals / Non-Goals

**Goals:**
- `SpotlightCard` con spotlight radial que sigue al cursor sin re-renders de React por frame
- `GlowBorder` con borde cónico animado, modos loop y cursor-reactivo, con soporte universal de browsers
- `MagneticElement` con atracción al cursor y retorno elástico, reutilizando el patrón WAAPI de `TiltCard`
- Tres ejemplos standalone en `/examples` y documentación completa en README

**Non-Goals:**
- Efectos de texto, scroll o canvas (tandas separadas del roadmap)
- Composición automática entre componentes (se componen anidándolos, no se fusionan)
- Hook público nuevo: si surge lógica compartida entre componentes, queda como util interna hasta que un tercer consumidor la justifique
- Bump de versión y CHANGELOG (los maneja el usuario con tagman)

## Decisions

### D1: SpotlightCard actualiza CSS custom properties por mousemove, sin estado de React

**Decision:** El spotlight es un overlay (`position: absolute`, `pointer-events: none`) con un `radial-gradient` centrado en `var(--aui-spotlight-x) var(--aui-spotlight-y)`. El handler de `mousemove` escribe esas dos variables directamente en el style del root (`element.style.setProperty`), sin `setState`. La visibilidad del overlay transiciona con `opacity` en enter/leave mediante CSS transition.

**Rationale:** Pasar la posición por estado de React provocaría un re-render por frame de todo el subtree del card. Mutar dos CSS custom properties es una operación de estilo pura que el browser composita sin tocar React — el mismo principio que llevó al canvas en `PixelBackground` y a las vars en los capas de `MouseParallax`: el hot path de animación no pasa por React.

**Alternativa considerada:** render prop con la posición (como `TiltState`). Rechazada como mecanismo principal por el costo de re-render en cada frame de `mousemove`; el overlay CSS cubre el caso de uso central sin exponer estado que el consumer deba manejar.

### D2: GlowBorder usa una capa cónica oversized rotada con `transform`, no `@property`

**Decision:** Estructura de tres capas: root (`position: relative`, `overflow: hidden`, `padding` = ancho del borde) → capa glow (`position: absolute`, sobredimensionada para cubrir las esquinas al rotar, `background: conic-gradient(...)`, animada con `@keyframes transform: rotate`) → contenido (`position: relative`, con su propio background y `border-radius` interior, tapando todo menos el anillo del padding). En modo `followCursor`, la rotación autónoma se reemplaza por WAAPI que interpola el ángulo orientando el gradiente hacia el cursor.

**Rationale:** Animar `conic-gradient` directamente requiere `@property` (CSS Houdini) para definir el tipo del ángulo como interpolable. Si bien el soporte es ya amplio (Chrome 85+, Firefox 128+, Safari 16.4+), usar `@property` como mecanismo de animación (no solo de tipado) introduce una integración de Houdini distinta de las CSS transitions y WAAPI ya usadas en el paquete. Rotar una capa con `transform` logra el mismo efecto visual, corre en el compositor (GPU), y mantiene coherencia con los mecanismos existentes de animación del paquete. Costo adicional: la capa oversized rota píxeles fuera del clip — marginal y aceptable.

**Alternativa considerada:** `@property --angle` + `@keyframes` animando el ángulo del gradiente. Rechazada para mantener coherencia de mecanismos de animación y reducir superficie de riesgo en browsers con soporte incompleto de Houdini en animaciones.

### D3: MagneticElement amplía su zona de atracción con padding transparente (hit-area), no con listener global

**Decision:** El root del wrapper agrega padding transparente controlado por `hitArea` (px, default `40`). El `mousemove` se escucha en el root; el contenido se traslada hacia el cursor proporcionalmente a `strength` (0–1, default `0.35`) usando WAAPI sobre `translate` con el patrón de interpolación-con-momentum de `TiltCard`. Al salir el cursor, retorno con easing elástico (keyframes WAAPI con overshoot).

**Rationale:** Un listener `window.mousemove` por instancia escala mal (N elementos magnéticos = N handlers calculando distancia en cada movimiento global) y complica el cleanup. El hit-area local da el efecto "atrae antes de tocar" con costo proporcional al uso real. El padding participa del layout — documentado en README con `hitArea={0}` como escape para layouts ajustados.

**Alternativa considerada:** listener global con cálculo de distancia euclidiana. Rechazada por el scaling cuadrático en páginas con múltiples instancias y la complejidad de cleanup; el hit-area logra el mismo efecto perceptivo con menor complejidad.

**Render prop:** siguiendo el precedente de `TiltState`, `MagneticElement` acepta `children` como función con `MagneticState = { offsetX: number, offsetY: number, isActive: boolean }` para efectos derivados (sombras, glow, escala). `SpotlightCard` y `GlowBorder` no exponen render prop: su estado vive en CSS y no habilita efectos que el consumer no pueda lograr con CSS puro.

### D4: Comportamiento bajo prefers-reduced-motion, diferenciado por componente

Aplicando la regla de `component-authoring` (autónomo se apaga; input directo puede quedar activo):

| Componente | Con `prefers-reduced-motion: reduce` |
| --- | --- |
| `SpotlightCard` | **Activo** — iluminación decorativa que responde a input directo del usuario sin desplazar contenido (precedente: behavior `hover` de PixelBackground). |
| `GlowBorder` | Loop autónomo **apagado** → gradiente cónico estático. Modo `followCursor` queda activo (input directo, no desplaza contenido). |
| `MagneticElement` | **Inactivo** — traslada contenido real, igual que la rotación de `TiltCard`: `offsetX`/`offsetY` quedan en 0, `isActive` sigue reportándose para efectos derivados alternativos. |

### D5: CSS custom properties por componente

- `SpotlightCard`: `--aui-spotlight-color` (color del radial-gradient), `--aui-spotlight-radius` (px, radio del spotlight), `--aui-spotlight-opacity` — seteadas inline desde props con defaults, pisables desde CSS en cascada. `--aui-spotlight-x`/`--aui-spotlight-y` son de runtime (escritas por el handler; no documentar como API pública de customización).
- `GlowBorder`: `--aui-glow-color-1`, `--aui-glow-color-2`, `--aui-glow-color-3` (colores del gradiente cónico), `--aui-glow-speed` (duración del loop), `--aui-glow-width` (ancho del borde en px), `--aui-glow-radius` (border-radius coherente para capas exterior e interior), `--aui-glow-opacity`.
- `MagneticElement`: sin CSS vars — sus parámetros (`strength`, `hitArea`) son de comportamiento, no visuales (precedente: `maxAngle` de `TiltCard` tampoco tiene CSS var).

## Risks / Trade-offs

- **GlowBorder impone estructura de wrapper**: el consumer no puede colocar su background directamente en el root sin tapar el anillo; debe ponerlo en el contenido interior. Mitigación: documentar la estructura en README con ejemplo de uso; `--aui-glow-radius` mantiene los radios exterior/interior coherentes automáticamente.
- **MagneticElement con hit-area agranda el bounding box**: puede sorprender en layouts con margen justo o en grids. Mitigación: documentar con aviso explícito; `hitArea={0}` como escape hacia el tamaño del contenido.
- **SpotlightCard con overlay y z-index**: un `position` no-static en hijos puede quedar encima del overlay. Mitigación: z-index documentado; `pointer-events: none` garantizado para que los hijos sigan siendo interactivos.
- **Touch devices**: los tres efectos son de cursor; en touch no hay `mousemove` sostenido. Los componentes degradan a estado estático (sin spotlight, glow en loop, sin atracción), que es visualmente válido. Sin simulación con touch/gyro en esta tanda.
