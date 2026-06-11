## Context

Tanda v0.2 del ROADMAP.md: tres efectos de mouse sobre contenedores (`SpotlightCard`, `GlowBorder`, `MagneticElement`). Es la tanda de menor riesgo del roadmap porque no introduce ninguna decisión arquitectónica nueva: reutiliza los tres motores de la foundation (CSS injection via `injectStyles`, WAAPI con momentum de `TiltCard`) y los hooks existentes (`useMousePosition`, `useReducedMotion`).

Constraints heredados (vinculantes, ver `openspec/specs/component-authoring/spec.md`): cero deps de runtime, `'use client'` + SSR-safe, customización en dos capas (props + `--aui-*`), `respectReducedMotion` default `true`, ejemplo standalone por componente, docs en README, tests de lógica pura.

## Goals / Non-Goals

**Goals:**
- `SpotlightCard` con spotlight radial que sigue al cursor sin re-renders de React por frame
- `GlowBorder` con borde cónico animado, modos loop y cursor-reactivo, con soporte universal de browsers
- `MagneticElement` con atracción al cursor y retorno elástico, reutilizando el patrón WAAPI de TiltCard
- Tres ejemplos standalone en `/examples` y documentación completa en README
- Publicación como v0.2.0

**Non-Goals:**
- Efectos de texto, scroll o canvas (tandas v0.3+)
- Composición automática entre componentes (e.g. SpotlightCard que incluya tilt) — se componen anidándolos, no se fusionan
- Hook público nuevo: si surge lógica compartida de proximidad, queda como util interna hasta que un tercer consumidor la justifique

## Decisions

### D1: SpotlightCard actualiza CSS custom properties por mousemove, sin estado de React

**Decision:** El spotlight es un overlay (`position: absolute`, `pointer-events: none`) con un `radial-gradient` centrado en `var(--aui-spotlight-x) var(--aui-spotlight-y)`. El handler de `mousemove` escribe esas dos variables directamente en el style del root (`element.style.setProperty`), sin `setState`.

**Por qué:** Pasar la posición por estado de React provocaría un re-render por frame de todo el subtree. Mutar dos custom properties es una operación de estilo pura que el browser composita sin tocar React. Es el mismo principio que llevó a canvas en PixelBackground: el hot path no pasa por React.

**Alternativa considerada:** render prop con la posición (como TiltState). Rechazada como mecanismo principal por el costo de re-render; el overlay CSS cubre el caso de uso central.

La visibilidad del spotlight transiciona con `opacity` en enter/leave (CSS transition, no JS).

### D2: GlowBorder usa una capa cónica oversized rotada con `transform`, no `@property`

**Decision:** Estructura de tres capas: root (`position: relative`, `overflow: hidden`, `border-radius`, `padding` = ancho del borde) → capa glow (`position: absolute`, sobredimensionada para cubrir las esquinas al rotar, `background: conic-gradient(...)`, animada con `@keyframes` de `transform: rotate`) → contenido (`position: relative`, con su propio background y `border-radius` interior, tapando todo menos el anillo del padding).

**Por qué no `@property --angle`:** Animar el ángulo del gradiente requiere `@property` (Houdini), que Firefox soporta recién desde 128 y degradaría a borde estático en versiones previas. Rotar una capa con `transform` logra el mismo efecto visual, corre en el compositor (GPU), y funciona en todos los browsers que ya soporta el paquete.

**Modo cursor-reactivo:** con `followCursor`, la rotación autónoma se reemplaza por apuntar el gradiente hacia el cursor: se calcula `atan2` desde el centro del elemento y se interpola el ángulo con el mismo patrón WAAPI-con-momentum de TiltCard (animar `transform: rotate(<angle>)` de la capa glow).

**Trade-off:** la capa oversized rota píxeles que quedan fuera del clip — costo de composición marginal y aceptable.

### D3: MagneticElement amplía su zona de atracción con padding transparente (hit-area), no con listener global

**Decision:** El root del wrapper es más grande que el contenido visible: una prop `hitArea` (px, default `40`) agrega padding transparente alrededor. El `mousemove` se escucha en el root; el contenido se traslada hacia el cursor proporcionalmente a `strength` (0–1, default `0.35`) usando WAAPI sobre `translate`, con el patrón de interpolación-con-momentum de TiltCard. Al salir, retorno con easing elástico (keyframes WAAPI con overshoot).

**Por qué no `window.mousemove`:** un listener global por instancia escala mal (N elementos magnéticos = N handlers calculando distancia en cada movimiento de mouse de toda la página) y complica el cleanup. El hit-area acotado da el efecto "me atrae antes de tocarlo" con costo proporcional al uso real.

**Trade-off:** el padding agranda el layout box del wrapper. Se documenta en README (el hit-area participa del layout; con `hitArea={0}` el wrapper colapsa al tamaño del contenido).

**Render prop:** siguiendo el precedente de `TiltState`, `MagneticElement` acepta children como función con `MagneticState = { offsetX, offsetY, isActive }` para efectos derivados. `SpotlightCard` y `GlowBorder` no exponen render prop: su estado vive en CSS y no habilita efectos derivados que el consumer no pueda lograr con CSS puro.

### D4: Comportamiento bajo prefers-reduced-motion, por componente

Aplicando la regla de `component-authoring` (autónomo se apaga, input directo puede quedar):

| Componente | Con reduced motion |
| --- | --- |
| `SpotlightCard` | **Activo** — es iluminación decorativa que sigue al input directo, no mueve contenido (precedente: behavior `hover` de PixelBackground). |
| `GlowBorder` | Loop autónomo **apagado** → borde con gradiente estático. El modo `followCursor` queda activo (input directo, no mueve contenido). |
| `MagneticElement` | **Inactivo** — traslada contenido real, igual que la rotación de TiltCard: `offsetX`/`offsetY` quedan en 0, `isActive` sigue reportándose. |

### D5: CSS custom properties por componente

- `SpotlightCard`: `--aui-spotlight-color`, `--aui-spotlight-radius`, `--aui-spotlight-opacity` (estéticas, seteadas desde props con defaults) + `--aui-spotlight-x`/`--aui-spotlight-y` (runtime, escritas por el handler).
- `GlowBorder`: `--aui-glow-color-1..3`, `--aui-glow-speed`, `--aui-glow-width` (ancho del borde), `--aui-glow-radius` (border-radius), `--aui-glow-opacity`.
- `MagneticElement`: sin CSS vars — sus parámetros (`strength`, `hitArea`) son de comportamiento, no visuales (precedente: `maxAngle` de TiltCard tampoco tiene CSS var).

## Risks / Trade-offs

- **GlowBorder impone estructura de wrapper (padding + contenido con background propio)** → el consumer no puede poner su background en el root sin tapar el anillo. Mitigación: la API expone el slot de contenido claramente y el README lo documenta con ejemplo; `--aui-glow-radius` mantiene los radios exterior/interior coherentes.
- **MagneticElement con hit-area agranda el layout** → puede sorprender en layouts ajustados. Mitigación: documentar + `hitArea={0}` como escape.
- **SpotlightCard sobre contenido con `overflow: hidden` propio** → el overlay vive dentro del root, así que clips del consumer no lo rompen; pero un `position` no-static en hijos puede taparlo. Mitigación: overlay con `z-index` documentado y `pointer-events: none` garantizado.
- **Touch devices** → los tres efectos son de cursor; en touch no hay `mousemove` sostenido. Los componentes degradan a su estado estático (sin spotlight, glow en loop, sin atracción), que es visualmente válido. No se simula con touch events en v0.2.
