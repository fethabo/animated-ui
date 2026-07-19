import type { AnimatedBackgroundVariant } from '../types'

/*
 * CSS custom properties de la variante `bubbles`
 * (overrideables desde el CSS del consumer):
 *
 *   --aui-bubbles-base      default `#0b1e33`  — color de fondo opaco detrás de las burbujas
 *   --aui-bubbles-color-1   default `#7dd3fc`  — primer tinte de burbuja (se translúcida con color-mix)
 *   --aui-bubbles-color-2   default `#a5b4fc`  — segundo tinte de burbuja
 *   --aui-bubbles-speed     default `24s`  — duración de un ciclo de ascenso del plano cercano
 *   --aui-bubbles-size      default `56px` — diámetro base de las burbujas (escala toda la composición)
 *   --aui-bubbles-opacity   default `1`    — intensidad global del efecto
 *
 * Dos planos de parallax en `::before` (lejano: burbujas chicas, más lento) y
 * `::after` (cercano: burbujas grandes, a `--aui-bubbles-speed`). Cada plano es
 * un set de radial-gradients tileados con `background-repeat: repeat`; todas
 * las capas de un plano comparten la altura de tile, y el `@keyframes` traslada
 * el pseudo-elemento exactamente esa altura en Y (loop seamless: el frame final
 * es idéntico al inicial). El sway horizontal va en el mismo `transform` y
 * vuelve a 0 al cierre del ciclo para no romper el wrap. La translucidez se
 * deriva con `color-mix()` para que `colors` siga aceptando hex sólidos.
 */
export const bubbles: AnimatedBackgroundVariant = {
  name: 'bubbles',
  css: `
.aui-bubbles {
  background-color: var(--aui-bubbles-base, #0b1e33);
  opacity: var(--aui-bubbles-opacity, 1);
}
.aui-bubbles::before,
.aui-bubbles::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  background-repeat: repeat;
}
/* Plano lejano: burbujas chicas, ascenso más lento. Tile de alto size*8. */
.aui-bubbles::before {
  bottom: calc(var(--aui-bubbles-size, 56px) * -8);
  background-image:
    radial-gradient(circle calc(var(--aui-bubbles-size, 56px) * 0.2) at 32% 24%,
      color-mix(in srgb, var(--aui-bubbles-color-2, #a5b4fc) 10%, transparent) 0 62%,
      color-mix(in srgb, var(--aui-bubbles-color-2, #a5b4fc) 42%, transparent) 88% 94%,
      transparent 97%),
    radial-gradient(circle calc(var(--aui-bubbles-size, 56px) * 0.14) at 78% 55%,
      color-mix(in srgb, var(--aui-bubbles-color-1, #7dd3fc) 10%, transparent) 0 62%,
      color-mix(in srgb, var(--aui-bubbles-color-1, #7dd3fc) 38%, transparent) 88% 94%,
      transparent 97%),
    radial-gradient(circle calc(var(--aui-bubbles-size, 56px) * 0.26) at 14% 78%,
      color-mix(in srgb, var(--aui-bubbles-color-2, #a5b4fc) 8%, transparent) 0 62%,
      color-mix(in srgb, var(--aui-bubbles-color-2, #a5b4fc) 36%, transparent) 88% 94%,
      transparent 97%);
  background-size:
    calc(var(--aui-bubbles-size, 56px) * 4.6) calc(var(--aui-bubbles-size, 56px) * 8),
    calc(var(--aui-bubbles-size, 56px) * 3.8) calc(var(--aui-bubbles-size, 56px) * 8),
    calc(var(--aui-bubbles-size, 56px) * 5.6) calc(var(--aui-bubbles-size, 56px) * 8);
  background-position:
    0 0,
    calc(var(--aui-bubbles-size, 56px) * 1) calc(var(--aui-bubbles-size, 56px) * 3),
    calc(var(--aui-bubbles-size, 56px) * 2.4) calc(var(--aui-bubbles-size, 56px) * 5.6);
  animation: aui-bubbles-rise-far calc(var(--aui-bubbles-speed, 24s) * 1.7) linear infinite;
}
/* Plano cercano: burbujas grandes, a la velocidad base. Tile de alto size*6. */
.aui-bubbles::after {
  bottom: calc(var(--aui-bubbles-size, 56px) * -6);
  background-image:
    radial-gradient(circle calc(var(--aui-bubbles-size, 56px) * 0.5) at 24% 18%,
      color-mix(in srgb, var(--aui-bubbles-color-1, #7dd3fc) 10%, transparent) 0 62%,
      color-mix(in srgb, var(--aui-bubbles-color-1, #7dd3fc) 45%, transparent) 88% 94%,
      transparent 97%),
    radial-gradient(circle calc(var(--aui-bubbles-size, 56px) * 0.34) at 72% 62%,
      color-mix(in srgb, var(--aui-bubbles-color-2, #a5b4fc) 10%, transparent) 0 62%,
      color-mix(in srgb, var(--aui-bubbles-color-2, #a5b4fc) 42%, transparent) 88% 94%,
      transparent 97%),
    radial-gradient(circle calc(var(--aui-bubbles-size, 56px) * 0.42) at 50% 86%,
      color-mix(in srgb, var(--aui-bubbles-color-1, #7dd3fc) 9%, transparent) 0 62%,
      color-mix(in srgb, var(--aui-bubbles-color-1, #7dd3fc) 40%, transparent) 88% 94%,
      transparent 97%);
  background-size:
    calc(var(--aui-bubbles-size, 56px) * 7) calc(var(--aui-bubbles-size, 56px) * 6),
    calc(var(--aui-bubbles-size, 56px) * 5.4) calc(var(--aui-bubbles-size, 56px) * 6),
    calc(var(--aui-bubbles-size, 56px) * 6.2) calc(var(--aui-bubbles-size, 56px) * 6);
  background-position:
    0 0,
    calc(var(--aui-bubbles-size, 56px) * 1.5) calc(var(--aui-bubbles-size, 56px) * 2),
    calc(var(--aui-bubbles-size, 56px) * 3) calc(var(--aui-bubbles-size, 56px) * 4);
  animation: aui-bubbles-rise-near var(--aui-bubbles-speed, 24s) linear infinite;
}
/* El recorrido en Y es exactamente la altura de tile del plano: wrap sin salto. */
@keyframes aui-bubbles-rise-near {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(calc(var(--aui-bubbles-size, 56px) * 0.12), calc(var(--aui-bubbles-size, 56px) * -3), 0);
  }
  100% {
    transform: translate3d(0, calc(var(--aui-bubbles-size, 56px) * -6), 0);
  }
}
@keyframes aui-bubbles-rise-far {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(calc(var(--aui-bubbles-size, 56px) * -0.1), calc(var(--aui-bubbles-size, 56px) * -4), 0);
  }
  100% {
    transform: translate3d(0, calc(var(--aui-bubbles-size, 56px) * -8), 0);
  }
}
`,
  cssVars({ colors, speed, intensity }) {
    const vars: Record<string, string> = {}
    if (colors?.[0]) vars['--aui-bubbles-color-1'] = colors[0]
    if (colors?.[1]) vars['--aui-bubbles-color-2'] = colors[1]
    if (colors?.[2]) vars['--aui-bubbles-base'] = colors[2]
    if (speed !== undefined) vars['--aui-bubbles-speed'] = `${speed}s`
    if (intensity !== undefined) vars['--aui-bubbles-opacity'] = String(intensity)
    return vars
  },
}
