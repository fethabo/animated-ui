/*
 * CSS custom properties de ShinyText
 * (overrideables desde el CSS del consumer, e.g. `.mi-texto { --aui-shiny-speed: 5s; }`):
 *
 *   --aui-shiny-color      default `#71717a` — color base del texto
 *   --aui-shiny-highlight  default `#fafafa` — color de la franja de brillo
 *   --aui-shiny-speed      default `3s`      — duración de un barrido del loop
 *   --aui-shiny-angle      default `120deg`  — dirección del gradiente/barrido
 */

/**
 * Genera el CSS de ShinyText. El efecto es CSS puro: el texto se vuelve
 * transparente y el gradiente (clipeado a los glifos con `background-clip:
 * text`) se desplaza con keyframes de `background-position` — cero JS por
 * frame.
 *
 * El gradiente abre y cierra con el color base, así el tile de 200% se
 * repite sin costura durante el loop. Un frame de `@supports` restaura el
 * color base si el browser no soporta clipear el background al texto, para
 * que el texto nunca quede invisible.
 */
export function shinyCss(): string {
  return `
.aui-shiny {
  display: inline-block;
  background-image: linear-gradient(
    var(--aui-shiny-angle, 120deg),
    var(--aui-shiny-color, #71717a) 0%,
    var(--aui-shiny-color, #71717a) 40%,
    var(--aui-shiny-highlight, #fafafa) 50%,
    var(--aui-shiny-color, #71717a) 60%,
    var(--aui-shiny-color, #71717a) 100%
  );
  background-size: 200% 100%;
  background-position: 0 0;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.aui-shiny[data-aui-loop] {
  animation: aui-shiny-sweep var(--aui-shiny-speed, 3s) linear infinite;
}
@keyframes aui-shiny-sweep {
  from { background-position: 100% 0; }
  to { background-position: -100% 0; }
}
@supports not ((-webkit-background-clip: text) or (background-clip: text)) {
  .aui-shiny {
    background-image: none;
    color: var(--aui-shiny-color, #71717a);
  }
}
`
}

export interface ShinyVarsInput {
  color?: string
  highlight?: string
  speed?: number
  angle?: number
}

/**
 * Materializa las props estéticas como CSS custom properties inline.
 * Solo setea las provistas explícitamente: los defaults viven como fallback
 * de `var()` en el CSS inyectado, así la cascada del consumer puede pisarlos.
 */
export function shinyVars({ color, highlight, speed, angle }: ShinyVarsInput): Record<string, string> {
  const vars: Record<string, string> = {}
  if (color !== undefined) vars['--aui-shiny-color'] = color
  if (highlight !== undefined) vars['--aui-shiny-highlight'] = highlight
  if (speed !== undefined) vars['--aui-shiny-speed'] = `${speed}s`
  if (angle !== undefined) vars['--aui-shiny-angle'] = `${angle}deg`
  return vars
}
