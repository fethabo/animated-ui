import type { AnimatedBackgroundVariant } from '../types'

/*
 * CSS custom properties de la variante `lava`
 * (overrideables desde el CSS del consumer):
 *
 *   --aui-lava-base      default `#160a2b`  — color de fondo opaco detrás de los blobs
 *   --aui-lava-color-1   default `#ff4d6d`  — primer color de blob
 *   --aui-lava-color-2   default `#ff924d`  — segundo color de blob
 *   --aui-lava-speed     default `16s`  — duración de un ascenso/descenso completo
 *   --aui-lava-blur      default `16px` — desenfoque del truco gooey
 *   --aui-lava-contrast  default `16`   — contraste que "endurece" los bordes del blur
 *   --aui-lava-size      default `280px`— diámetro base de los blobs
 *   --aui-lava-opacity   default `1`    — intensidad global del efecto
 *
 * El efecto "gooey": varios blobs circulares opacos (radial-gradients con
 * `circle closest-side` sobre tiles cuadrados, así son círculos reales y no
 * elipses) ascienden con `@keyframes` de `background-position` a distinta fase;
 * el `filter: blur()` difumina los bordes y `contrast()` los re-endurece,
 * fundiendo los blobs cercanos en formas orgánicas tipo lámpara de lava.
 * Requiere blobs y fondo opacos (no funciona con transparencia real); el
 * `filter` rinde mejor en contenedores acotados que a pantalla completa.
 */
export const lava: AnimatedBackgroundVariant = {
  name: 'lava',
  css: `
.aui-lava {
  background-color: var(--aui-lava-base, #160a2b);
  background-image:
    radial-gradient(circle closest-side, var(--aui-lava-color-1, #ff4d6d) 0 72%, transparent 100%),
    radial-gradient(circle closest-side, var(--aui-lava-color-2, #ff924d) 0 72%, transparent 100%),
    radial-gradient(circle closest-side, var(--aui-lava-color-1, #ff4d6d) 0 72%, transparent 100%),
    radial-gradient(circle closest-side, var(--aui-lava-color-2, #ff924d) 0 72%, transparent 100%),
    radial-gradient(circle closest-side, var(--aui-lava-color-1, #ff4d6d) 0 72%, transparent 100%);
  background-repeat: no-repeat;
  background-size:
    var(--aui-lava-size, 280px) var(--aui-lava-size, 280px),
    calc(var(--aui-lava-size, 280px) * 0.78) calc(var(--aui-lava-size, 280px) * 0.78),
    calc(var(--aui-lava-size, 280px) * 1.12) calc(var(--aui-lava-size, 280px) * 1.12),
    calc(var(--aui-lava-size, 280px) * 0.68) calc(var(--aui-lava-size, 280px) * 0.68),
    calc(var(--aui-lava-size, 280px) * 0.9) calc(var(--aui-lava-size, 280px) * 0.9);
  background-position: 12% 115%, 31% 130%, 52% 120%, 71% 135%, 89% 125%;
  filter: blur(var(--aui-lava-blur, 16px)) contrast(var(--aui-lava-contrast, 16));
  opacity: var(--aui-lava-opacity, 1);
  animation: aui-lava-rise var(--aui-lava-speed, 16s) ease-in-out infinite alternate;
}
@keyframes aui-lava-rise {
  0% {
    background-position: 12% 115%, 31% 130%, 52% 120%, 71% 135%, 89% 125%;
  }
  50% {
    background-position: 12% 42%, 31% 30%, 52% 52%, 71% 28%, 89% 48%;
  }
  100% {
    background-position: 12% -20%, 31% -12%, 52% -25%, 71% -8%, 89% -18%;
  }
}
/* Reduced motion: composición estática de los blobs fundidos, sin ascenso. */
.aui-bg[data-aui-static].aui-lava {
  background-position: 12% 35%, 31% 58%, 52% 42%, 71% 62%, 89% 48%;
}
`,
  cssVars({ colors, speed, intensity }) {
    const vars: Record<string, string> = {}
    if (colors?.[0]) vars['--aui-lava-color-1'] = colors[0]
    if (colors?.[1]) vars['--aui-lava-color-2'] = colors[1]
    if (colors?.[2]) vars['--aui-lava-base'] = colors[2]
    if (speed !== undefined) vars['--aui-lava-speed'] = `${speed}s`
    if (intensity !== undefined) vars['--aui-lava-opacity'] = String(intensity)
    return vars
  },
}
