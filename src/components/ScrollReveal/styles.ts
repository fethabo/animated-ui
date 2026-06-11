/*
 * CSS custom properties de ScrollReveal
 * (overrideables desde el CSS del consumer, e.g. `.mi-seccion { --aui-reveal-duration: 1.2s; }`):
 *
 *   --aui-reveal-duration  default `0.6s`  — duración de la transición de entrada
 *   --aui-reveal-distance  default `24px`  — desplazamiento inicial
 *   --aui-reveal-stagger   default `0.1s`  — delay incremental entre hijos
 *   --aui-reveal-easing    default `cubic-bezier(0.22, 1, 0.36, 1)` — curva de la transición
 *
 * `--aui-reveal-i` es de runtime (índice por item, la setea el componente).
 */

/**
 * Genera el CSS de ScrollReveal. La animación es una CSS transition pura:
 * los items parten ocultos (opacity 0 + `translate` según la dirección del
 * root) y transicionan a su estado final cuando el root recibe
 * `data-aui-visible` — el JS solo togglea ese atributo, cero JS por frame.
 * El stagger es `transition-delay = stagger × índice` del item.
 *
 * Con `data-aui-static` (reduced motion) los items renderizan visibles sin
 * transición. Se usa `translate` (propiedad independiente) para no pisar
 * `transform` del consumer.
 */
export function revealCss(): string {
  return `
.aui-reveal > .aui-reveal-item {
  opacity: 0;
  transition:
    opacity var(--aui-reveal-duration, 0.6s) var(--aui-reveal-easing, cubic-bezier(0.22, 1, 0.36, 1)),
    translate var(--aui-reveal-duration, 0.6s) var(--aui-reveal-easing, cubic-bezier(0.22, 1, 0.36, 1));
  transition-delay: calc(var(--aui-reveal-stagger, 0.1s) * var(--aui-reveal-i, 0));
}
.aui-reveal[data-aui-dir="up"] > .aui-reveal-item {
  translate: 0 var(--aui-reveal-distance, 24px);
}
.aui-reveal[data-aui-dir="down"] > .aui-reveal-item {
  translate: 0 calc(-1 * var(--aui-reveal-distance, 24px));
}
.aui-reveal[data-aui-dir="left"] > .aui-reveal-item {
  translate: var(--aui-reveal-distance, 24px) 0;
}
.aui-reveal[data-aui-dir="right"] > .aui-reveal-item {
  translate: calc(-1 * var(--aui-reveal-distance, 24px)) 0;
}
.aui-reveal[data-aui-dir="none"] > .aui-reveal-item {
  translate: 0 0;
}
.aui-reveal[data-aui-visible] > .aui-reveal-item {
  opacity: 1;
  translate: 0 0;
}
.aui-reveal[data-aui-static] > .aui-reveal-item {
  opacity: 1;
  translate: 0 0;
  transition: none;
}
`
}

export interface RevealVarsInput {
  distance?: number
  duration?: number
  stagger?: number
}

/**
 * Materializa las props estéticas como CSS custom properties inline.
 * Solo setea las provistas explícitamente: los defaults viven como fallback
 * de `var()` en el CSS inyectado, así la cascada del consumer puede pisarlos.
 */
export function revealVars({ distance, duration, stagger }: RevealVarsInput): Record<string, string> {
  const vars: Record<string, string> = {}
  if (distance !== undefined) vars['--aui-reveal-distance'] = `${distance}px`
  if (duration !== undefined) vars['--aui-reveal-duration'] = `${duration}s`
  if (stagger !== undefined) vars['--aui-reveal-stagger'] = `${stagger}s`
  return vars
}
