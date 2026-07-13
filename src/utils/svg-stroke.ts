/*
 * Motor de line-drawing SVG (Wave L, ver design.md de
 * `svg-stroke-highlighter-scribble`). Técnica: `stroke-dasharray` =
 * `stroke-dashoffset` = longitud medida con `getTotalLength()` (el trazo
 * queda "enrollado", invisible) y una animación CSS lleva el offset a 0 —
 * cero JS por frame. La medición solo existe post-montaje, así que los
 * componentes llaman `prepareStroke` en un layout effect (antes del paint del
 * cliente); el markup SSR queda completo y visible. El stagger entre trazos
 * es delay indexado via `--aui-stroke-i` (patrón `--aui-split-i` de
 * SplitReveal). Interno al paquete, como `noise.ts`.
 *
 * El dash vive en CSS (`.aui-stroke`) leyendo `--aui-stroke-len`, seteada
 * inline por `prepareStroke`: quitar la clase (o nunca medir, e.g. reduced
 * motion o SSR) deja el trazo completo y visible. El retrigger es togglear
 * `data-aui-drawn` en un ancestro: al quitarlo la animación desaparece y el
 * trazo vuelve a su estado enrollado sin transición (patrón ScrollReveal).
 *
 * CSS custom properties del motor (los componentes las mapean desde sus
 * `--aui-<componente>-*` públicas):
 *   --aui-stroke-duration  default `0.9s` — duración del dibujo de cada trazo
 *   --aui-stroke-delay     default `0s`   — delay previo al dibujo
 *   --aui-stroke-stagger   default `0s`   — delay incremental entre trazos
 *   --aui-stroke-easing    default `cubic-bezier(0.45, 0, 0.35, 1)`
 */
import { styleId } from './inject-styles'

export const SVG_STROKE_STYLE_ID = styleId('svg-stroke')

/**
 * Elementos SVG con trazo dibujable. Todos exponen `getTotalLength()` en
 * browsers modernos (SVG 2); en los que no, `prepareStroke` los deja intactos.
 */
export const DRAWABLE_SELECTOR = 'path, line, polyline, circle, rect, ellipse'

/**
 * Mide el elemento y lo deja "enrollado" (dash = offset = longitud) listo
 * para dibujarse cuando un ancestro reciba `data-aui-drawn`. `index` define
 * su posición en el stagger. Devuelve `false` sin tocar el elemento si no
 * expone `getTotalLength()` o la medición falla (queda visible, sin animar).
 */
export function prepareStroke(el: SVGElement, index = 0): boolean {
  const measurable = el as SVGGeometryElement
  if (typeof measurable.getTotalLength !== 'function') return false
  let length = 0
  try {
    length = measurable.getTotalLength()
  } catch {
    return false
  }
  if (!Number.isFinite(length) || length <= 0) return false
  el.style.setProperty('--aui-stroke-len', `${Math.ceil(length)}px`)
  el.style.setProperty('--aui-stroke-i', String(index))
  el.classList.add('aui-stroke')
  return true
}

/** Deshace `prepareStroke`: el elemento vuelve a su trazo completo y visible. */
export function clearStroke(el: SVGElement): void {
  el.classList.remove('aui-stroke')
  el.style.removeProperty('--aui-stroke-len')
  el.style.removeProperty('--aui-stroke-i')
}

/**
 * CSS compartido del motor (un único style tag para los tres componentes).
 * `aui-stroke-draw` dibuja una vez y retiene el estado final (`both`);
 * `aui-stroke-cycle` (con `data-aui-repeat` en el ancestro) dibuja, sostiene,
 * desvanece y rebobina en loop.
 */
export function svgStrokeCss(): string {
  return `
.aui-stroke {
  stroke-dasharray: var(--aui-stroke-len, none);
  stroke-dashoffset: var(--aui-stroke-len, 0);
}
[data-aui-drawn] .aui-stroke {
  animation: aui-stroke-draw var(--aui-stroke-duration, 0.9s) var(--aui-stroke-easing, cubic-bezier(0.45, 0, 0.35, 1)) both;
  animation-delay: calc(var(--aui-stroke-delay, 0s) + var(--aui-stroke-stagger, 0s) * var(--aui-stroke-i, 0));
}
[data-aui-drawn][data-aui-repeat] .aui-stroke {
  animation: aui-stroke-cycle calc(var(--aui-stroke-duration, 0.9s) * 3) var(--aui-stroke-easing, cubic-bezier(0.45, 0, 0.35, 1)) infinite;
  animation-delay: var(--aui-stroke-delay, 0s);
}
@keyframes aui-stroke-draw {
  to { stroke-dashoffset: 0; }
}
@keyframes aui-stroke-cycle {
  0% { stroke-dashoffset: var(--aui-stroke-len, 0); opacity: 1; }
  45%, 72% { stroke-dashoffset: 0; opacity: 1; }
  90% { stroke-dashoffset: 0; opacity: 0; }
  100% { stroke-dashoffset: var(--aui-stroke-len, 0); opacity: 0; }
}
`
}
