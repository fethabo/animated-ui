## Context

`AnimatedBackground` ([src/components/AnimatedBackground/](../../../src/components/AnimatedBackground/)) implementa cada variante como un módulo en `variants/` que exporta un `AnimatedBackgroundVariant` (`name`, `css` estático inyectado una vez, y `cssVars()` que mapea `colors`/`speed`/`intensity` a custom properties inline). El shell común (`index.tsx`) resuelve la variante desde el registro `VARIANTS`, inyecta el CSS base + el de la variante, y apaga toda animación con `[data-aui-static]` cuando corresponde reduced motion. La variante nueva `bubbles` debe encajar en ese contrato sin tocar el shell más allá del registro.

## Goals / Non-Goals

**Goals:**

- Burbujas translúcidas de varios tamaños que ascienden lentamente en loop continuo y sin salto visible al reiniciar el ciclo.
- Leve deriva horizontal para que el movimiento no se sienta mecánico.
- CSS puro (gradientes + `@keyframes`), cero JS por frame, cero deps.
- Contrato estándar: `colors`/`speed`/`intensity`, CSS vars `--aui-bubbles-*` documentadas en el source, degradación estática legible bajo reduced motion.

**Non-Goals:**

- Randomización por JS de posiciones/tamaños de burbujas (las fases se fijan en el CSS, como en `lava`).
- Interacciones (pop al click, respuesta al mouse) — fuera del alcance de `AnimatedBackground`.
- Cambios al API público del componente más allá del nuevo valor del union `variant`.

## Decisions

**1. Burbujas como capas de `radial-gradient` tileadas con `repeat-y`, no elementos DOM.**
Cada capa de `background-image` define una burbuja (círculo con rim translúcido) sobre un tile de altura fija con `background-repeat: repeat`. Al repetirse verticalmente, una sola capa produce una columna infinita de burbujas; varias capas con tamaños de tile y posiciones x distintas producen la variedad de tamaños y densidad. Alternativa descartada: N `<span>`/pseudo-elementos por burbuja — más DOM, y el patrón del componente es un solo `<div>` sin hijos.

**2. Ascenso por `transform: translateY` en pseudo-elementos, no por `background-position`.**
Las capas de burbujas viven en `::before` y `::after` (altura ≥ 200% del contenedor, tiles repetidos). El loop anima `translateY` exactamente un múltiplo de la altura de tile, así el frame final es idéntico al inicial (loop seamless). `transform` es animable en compositor (a diferencia de `background-position`, que usa `lava`), lo que importa aquí porque el ascenso es continuo y a pantalla potencialmente completa. Dos pseudo-elementos con duraciones distintas dan dos "planos" de parallax.

**3. Deriva horizontal como sway global suave por pseudo-elemento.**
Una segunda animación de `translateX` corta y `alternate` sobre cada pseudo-elemento (fases distintas entre `::before` y `::after`). Mover todas las burbujas de un plano juntas es imperceptible como tal y evita romper el loop seamless del eje y. Se combina en la misma propiedad `transform` dentro de los mismos keyframes (y + x) para no pelear animaciones.

**4. Translucidez derivada con `color-mix()` manteniendo `colors` como colores sólidos.**
El contrato de `colors` en las demás variantes acepta hex sólidos; las burbujas necesitan alpha. Se deriva con `color-mix(in srgb, var(--aui-bubbles-color-N) X%, transparent)` en el CSS estático, así el consumer sigue pasando `['#7dd3fc', '#a5b4fc', '#082f49']` sin pensar en rgba. `color-mix` es baseline desde 2023, consistente con el target de browsers modernos del paquete. El consumer que quiera control total puede pisar las vars con un rgba propio.

**5. CSS custom properties y mapeo de props.**

| Var | Default | Prop |
|---|---|---|
| `--aui-bubbles-base` | color de fondo oscuro | `colors[2]` |
| `--aui-bubbles-color-1` | tinte de burbuja 1 | `colors[0]` |
| `--aui-bubbles-color-2` | tinte de burbuja 2 | `colors[1]` |
| `--aui-bubbles-speed` | `24s` (lento por diseño) | `speed` |
| `--aui-bubbles-size` | diámetro base de burbuja | — (solo CSS) |
| `--aui-bubbles-opacity` | `1` | `intensity` |

Mismo esquema de asignación que `lava` (`colors[2]` = base). Default de `speed` deliberadamente alto: el pedido es movimiento lento.

**6. Reduced motion sin regla extra de posición.**
`[data-aui-static]` ya apaga las animaciones de pseudo-elementos (el CSS base cubre `::before`/`::after`). Como los tiles `repeat-y` distribuyen burbujas a todas las alturas aun sin animación, el estado estático queda naturalmente legible (burbujas repartidas por el contenedor) sin necesitar una composición estática dedicada como la de `lava`. Solo hay que verificar visualmente que las posiciones base del tile no dejen franjas vacías.

## Risks / Trade-offs

- [Loop con salto visible si el recorrido de `translateY` no coincide con un múltiplo exacto de la altura de tile] → definir alturas de tile y recorrido con las mismas unidades/`calc()` derivadas de `--aui-bubbles-size`, y verificar el punto de wrap en test-app.
- [`color-mix` sin soporte en browsers viejos → burbujas invisibles o sólidas] → mantener un color de fallback dentro del `var()` y aceptar degradación a círculos más sólidos; el paquete ya asume browsers modernos (usa features equivalentes en otras variantes).
- [Pseudo-elementos al 200% de alto con `filter`/muchas capas pueden costar en fullscreen] → sin `filter` (a diferencia de `lava`), capas acotadas (~4–6 gradientes por plano), solo `transform` animado.
- [Sway global puede leerse como "todo el fondo se mueve"] → amplitud chica (pocos px) y fases opuestas entre los dos planos.
