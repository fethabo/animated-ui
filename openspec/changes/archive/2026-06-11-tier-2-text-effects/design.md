# Design: tier-2-text-effects

## Context

Tanda v0.3 del ROADMAP.md: dos efectos de texto (`ShinyText`, `ScrambleText`) que abren la categoría sin decisiones arquitectónicas nuevas. ShinyText usa el motor CSS (keyframes inyectados via `injectStyles`, cero JS por frame); ScrambleText usa RAF con mutación directa del DOM, el mismo principio de "el hot path no pasa por React" establecido en PixelBackground.

Constraints heredados (vinculantes, ver `openspec/specs/component-authoring/spec.md`): cero deps de runtime, `'use client'` + SSR-safe, customización en dos capas (props + `--aui-*`), `respectReducedMotion` default `true`, ejemplo standalone por componente, docs en README, tests de lógica pura.

## Goals / Non-Goals

**Goals:**
- `ShinyText` con brillo en loop sobre el texto, CSS puro, gradiente y velocidad customizables — cubriendo de paso el caso de uso de `GradientText` (fusión anticipada por el roadmap)
- `ScrambleText` con efecto decrypt carácter por carácter, sin re-renders de React por frame y accesible para lectores de pantalla
- Dos ejemplos standalone en `/examples` y documentación completa en README

**Non-Goals:**
- `SplitReveal` (queda en Tier 2 del roadmap para una tanda futura; su problema de accesibilidad por spans merece tratamiento propio)
- Componente `GradientText` separado — el gradiente customizable de ShinyText lo cubre; si a futuro hace falta API dedicada, se evalúa como variante
- Trigger por scroll/viewport (`useInView` llega en v0.4)
- Bump de versión y CHANGELOG — los maneja el usuario con tagman

## Decisions

### D1: ShinyText es CSS puro con `background-clip: text` y keyframes de `background-position`

**Decision:** El texto se renderiza como un `<span>` (display `inline-block`) con `background-clip: text`, `-webkit-background-clip: text` y `color: transparent`. El background es un `linear-gradient` compuesto por el color base más una franja de brillo, con `background-size` ancho y animado via `@keyframes` de `background-position` inyectados con `injectStyles`. Cero JS por frame.

**Por qué `background-position` y no `@property`:** animar la posición del background con keyframes clásicos tiene soporte universal; no requiere Houdini. Es el mismo criterio que llevó a GlowBorder a rotar una capa con `transform` en lugar de animar el ángulo del gradiente.

**Por qué `<span>` y no prop `as` polimórfica:** el componente es un decorador inline de texto; el consumer controla la semántica envolviéndolo (`<h1><ShinyText>…</ShinyText></h1>`). Una prop `as` agregaría superficie de API y complejidad de tipos sin habilitar nada que el wrapping no logre. Precedente: ningún componente del paquete es polimórfico.

**Accesibilidad gratis:** el texto sigue siendo un nodo de texto real (el efecto es solo background), así que no hay nada que arreglar para lectores de pantalla ni para selección/copia.

### D2: ScrambleText muta `textContent` via ref, sin estado de React en el hot path

**Decision:** El componente renderiza el texto final (prop `text: string`, no `children` — el scrambler necesita un string plano) y en `useEffect` arranca un loop RAF que recalcula el frame y escribe `el.textContent` directamente. Sin `setState` por frame.

Estructura DOM: root `<span>` con `aria-label={text}` + un `<span aria-hidden="true">` interior que es el que muta. Los lectores de pantalla ven siempre el texto final estable; los caracteres aleatorios intermedios quedan ocultos.

**Por qué no `setState` por tick:** un re-render de React por frame para escribir un string es exactamente el anti-patrón que PixelBackground evitó con canvas. Mutar `textContent` es una operación de texto pura.

**Lógica pura extraíble:** `scrambleFrame(text, revealed, charset, random)` — dado el texto final, cuántos caracteres están revelados y una fuente de aleatoriedad inyectable, devuelve el string del frame (revelados + aleatorios; espacios se preservan). Inyectar `random` la hace determinista y testeable. La progresión de revelado la maneja el loop con timestamps de RAF (`speed` en caracteres/segundo, default ~25), no con contadores de frames — robusto ante displays de 60/120/144 Hz.

**Trigger:** prop `trigger: 'mount' | 'hover' | 'both'` (default `'mount'`). `'hover'` re-ejecuta el scramble en `mouseenter` del root (input directo). Si `text` cambia, el scramble se re-ejecuta desde el estado actual.

**SSR e hidratación:** el render (server y primer render de cliente) produce el texto final; el scramble arranca recién en `useEffect`. Markup estático correcto en SSR y cero mismatch de hidratación.

### D3: Comportamiento bajo prefers-reduced-motion, por componente

Aplicando la regla de `component-authoring` (autónomo se apaga, input directo puede quedar):

| Componente | Con reduced motion |
| --- | --- |
| `ShinyText` | Loop autónomo **apagado** → el gradiente queda estático en su posición inicial (el texto conserva el color/gradiente, sin barrido). Mismo criterio que el loop de GlowBorder. |
| `ScrambleText` | Reveal autónomo (`mount`) **apagado** → texto final directo. El trigger `hover` queda activo (input directo, no desplaza contenido — precedente: behavior `hover` de PixelBackground). |

### D4: CSS custom properties por componente

- `ShinyText`: `--aui-shiny-color` (color base del texto), `--aui-shiny-highlight` (color del brillo), `--aui-shiny-speed` (duración del loop), `--aui-shiny-angle` (dirección del barrido). Todas seteadas inline desde props con defaults.
- `ScrambleText`: `--aui-scramble-color` (color de los caracteres aún no revelados; default `currentColor` para que sea opt-in). Los parámetros restantes (`speed`, `charset`, `trigger`) son de comportamiento, no visuales — sin CSS var, precedente `maxAngle` de TiltCard.

El estilo de los caracteres no revelados se logra sin spans extra: el span mutante usa `color: var(--aui-scramble-color, currentColor)` solo si se decide visualmente diferenciar — v0.3 lo mantiene en un solo color para no partir el texto en nodos; la var queda aplicada al span completo durante el scramble y se limpia al terminar.

## Risks / Trade-offs

- **`background-clip: text` necesita prefijo `-webkit-`** → se inyectan ambas declaraciones en el CSS; soporte universal en los browsers objetivo. Sin fallback adicional: si fallara, el texto quedaría con `color: transparent`. Mitigación extra: `@supports not (-webkit-background-clip: text)` en el CSS inyectado restaura `color: var(--aui-shiny-color)`.
- **ScrambleText con fuentes proporcionales produce jitter de ancho** (los caracteres aleatorios miden distinto que los finales) → puede mover el layout circundante durante el scramble. Mitigación: documentar en README la recomendación de `font-variant-numeric: tabular-nums`/monospace para textos sensibles; el efecto dura < 2s con defaults. No se reserva ancho artificialmente (mediría mal con line breaks).
- **ScrambleText recibe `text` como prop y no `children`** → API levemente distinta al resto del paquete. Mitigación: documentado en README y tipos; es la única forma de garantizar un string plano scrambleable (children arbitrarios con elementos no son scrambleables).
- **Charset con caracteres de doble ancho o combinables** (emoji, acentos descompuestos) → el scrambler opera por code points (`Array.from(text)`), no por unidades UTF-16, para no partir surrogates. Grafemas compuestos pueden renderizarse raros durante el scramble; aceptable y documentado.
- **Touch devices con `trigger='hover'`** → sin `mouseenter` sostenido; el texto queda en su estado final, que es válido. Mismo criterio que los efectos de cursor de v0.2.
