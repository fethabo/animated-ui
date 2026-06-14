/*
 * CSS custom properties de SplitReveal
 * (overrideables desde el CSS del consumer, e.g. `.mi-split { --aui-split-stagger: 0.05s; }`):
 *
 *   --aui-split-duration  default `0.6s`  — duración de la transición de cada unidad
 *   --aui-split-stagger   default `0.05s` — delay incremental entre unidades
 *   --aui-split-distance  default `16px`  — desplazamiento inicial del preset `slide-up`
 *   --aui-split-blur      default `8px`   — desenfoque inicial del preset `blur`
 *   --aui-split-easing    default `cubic-bezier(0.22, 1, 0.36, 1)` — curva de la transición
 *
 * `--aui-split-i` es de runtime (índice por unidad, lo setea el componente;
 * en modo `line` es el índice de línea medido).
 */

/**
 * Genera el CSS de SplitReveal. La animación es una CSS transition pura: las
 * unidades parten ocultas (opacity 0 + el estado inicial del preset) y
 * transicionan a su estado final cuando el root recibe `data-aui-visible` —
 * el JS solo togglea ese atributo, cero JS por frame. El stagger es
 * `transition-delay = stagger × índice` de cada unidad.
 *
 * Con `data-aui-static` (reduced motion) las unidades renderizan visibles sin
 * transición. Se usa `translate` (propiedad independiente) para no pisar
 * `transform` del consumer.
 */
export function splitRevealCss(): string {
  return `
.aui-split-unit {
  display: inline-block;
  white-space: pre;
  opacity: 0;
  transition:
    opacity var(--aui-split-duration, 0.6s) var(--aui-split-easing, cubic-bezier(0.22, 1, 0.36, 1)),
    translate var(--aui-split-duration, 0.6s) var(--aui-split-easing, cubic-bezier(0.22, 1, 0.36, 1)),
    filter var(--aui-split-duration, 0.6s) var(--aui-split-easing, cubic-bezier(0.22, 1, 0.36, 1));
  transition-delay: calc(var(--aui-split-stagger, 0.05s) * var(--aui-split-i, 0));
}
.aui-split[data-aui-preset="slide-up"] .aui-split-unit {
  translate: 0 var(--aui-split-distance, 16px);
}
.aui-split[data-aui-preset="blur"] .aui-split-unit {
  filter: blur(var(--aui-split-blur, 8px));
}
.aui-split[data-aui-visible] .aui-split-unit {
  opacity: 1;
  translate: 0 0;
  filter: blur(0);
}
.aui-split[data-aui-static] .aui-split-unit {
  opacity: 1;
  translate: 0 0;
  filter: none;
  transition: none;
}
`
}

export interface SplitVarsInput {
  stagger?: number
  duration?: number
  distance?: number
}

/**
 * Materializa las props estéticas como CSS custom properties inline.
 * Solo setea las provistas explícitamente: los defaults viven como fallback
 * de `var()` en el CSS inyectado, así la cascada del consumer puede pisarlos.
 */
export function splitVars({ stagger, duration, distance }: SplitVarsInput): Record<string, string> {
  const vars: Record<string, string> = {}
  if (stagger !== undefined) vars['--aui-split-stagger'] = `${stagger}s`
  if (duration !== undefined) vars['--aui-split-duration'] = `${duration}s`
  if (distance !== undefined) vars['--aui-split-distance'] = `${distance}px`
  return vars
}
