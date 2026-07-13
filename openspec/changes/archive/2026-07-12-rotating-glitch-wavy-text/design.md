## Context

Wave F no introduce decisiones arquitectónicas nuevas. Este design mapea cada componente a su motor y fija tres decisiones locales de implementación (anti-spam de screen readers en RotatingText, duplicación de texto en GlitchText, y reserva de layout en RotatingText).

## Mapeo componente → motor

| Componente | Motor | Piezas reutilizadas |
| --- | --- | --- |
| RotatingText | CSS transitions + timer (`setTimeout` encadenado) | `injectStyles`, `useReducedMotion` |
| GlitchText | CSS puro (keyframes inyectados, pseudo-elementos + `clip-path`) | `injectStyles`, `useReducedMotion` (patrón ShinyText) |
| WavyText | CSS puro (keyframes + `animation-delay` por char) | split compartido (`split-text.ts` de Wave E o extracción aquí), `injectStyles`, `useReducedMotion` |

## Decisiones

### 1. RotatingText: sin `aria-live`

Anunciar cada rotación spamea a los lectores de pantalla. El root expone un `aria-label` estático con el texto base + la lista de palabras (e.g. "Hacemos webs, apps, magia"); la palabra animada visible es `aria-hidden`. Alternativa descartada: `aria-live="polite"`, que interrumpe en cada ciclo.

### 2. RotatingText: layout estable

La palabra rotante se renderiza en un contenedor inline-block cuyo ancho transiciona suavemente entre palabras (medición por ref al cambiar, no por frame), evitando el salto brusco del contenido circundante. Con palabras de largo similar el costo es imperceptible; documentar en README que un `width` fijo via CSS lo elimina del todo.

### 3. GlitchText: duplicación por pseudo-elementos

Las dos capas desplazadas (canal rojo/cyan) son `::before`/`::after` con `content: attr(data-text)`, no nodos React: los pseudo-elementos no existen en el árbol de accesibilidad, así el texto se lee una sola vez. Consecuencia spec-able: `GlitchText` acepta solo texto plano (string), no markup arbitrario.

### 4. WavyText: solo transform

La ondulación anima únicamente `translateY` (compositado); nada de `top`/`margin`. Cada char es `display: inline-block` con `animation-delay: calc(var(--aui-wavy-stagger) * <índice>)` — el índice se setea inline una vez en render.

## Riesgos

- **GlitchText con textos largos**: el `clip-path` animado sobre bloques grandes de texto puede costar pintado — documentar que está pensado para titulares, no párrafos.
- **WavyText y line-height**: chars inline-block pueden alterar la métrica vertical de la línea; mitigación: `line-height` heredado y amplitud default conservadora.
