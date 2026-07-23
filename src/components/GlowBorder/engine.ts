import { injectStyles, styleId } from '../../utils/inject-styles'
import { createLayer, enhanceHost, type EnhancedHost } from '../../utils/enhance-host'
import { pointerAngle, unwrapAngle } from './geometry'
import { glowVars, type GlowVarsInput } from './vars'

// La capa cónica se sobredimensiona (inset: -150%) para que al rotar siga
// cubriendo las esquinas del contenedor en aspect ratios de hasta ~4:1.
// Se anima `transform` (compositor, soporte universal) en vez del ángulo
// del gradiente, que requeriría `@property`.
export const GLOW_CSS = `
.aui-glow {
  position: relative;
  overflow: hidden;
  padding: var(--aui-glow-width, 1px);
  border-radius: var(--aui-glow-radius, 12px);
  isolation: isolate;
}
.aui-glow-layer {
  position: absolute;
  inset: -150%;
  z-index: -1;
  background: conic-gradient(
    from 0deg,
    var(--aui-glow-color-1, #7c3aed),
    var(--aui-glow-color-2, #0ea5e9),
    var(--aui-glow-color-3, #ec4899),
    var(--aui-glow-color-1, #7c3aed)
  );
  opacity: var(--aui-glow-opacity, 1);
}
.aui-glow[data-aui-loop] > .aui-glow-layer {
  animation: aui-glow-spin var(--aui-glow-speed, 4s) linear infinite;
}
@keyframes aui-glow-spin {
  to { transform: rotate(360deg); }
}
.aui-glow-content {
  position: relative;
  border-radius: calc(var(--aui-glow-radius, 12px) - var(--aui-glow-width, 1px));
}
`

export interface GlowEngineOptions extends GlowVarsInput {
  /** Con `true` el gradiente apunta hacia el cursor (WAAPI con momentum) en vez del loop. */
  followCursor: boolean
  /** Apaga el loop autónomo (`followCursor` sigue activo: responde a input directo). */
  reducedMotion: boolean
  /**
   * Modo hook: el motor decora el host (clase `aui-glow`, CSS vars, capa
   * cónica inyectada y atributo de loop) y lo restaura al destruir. El
   * componente pasa `false` porque su JSX ya renderiza todo eso (visible en
   * SSR) y provee su propia capa via el parámetro `layer`.
   */
  decorate: boolean
}

export interface GlowEngineInstance {
  /** Merge de opciones en vivo; re-aplica vars y el gating del loop sin reconstruir. */
  update(patch: Partial<GlowEngineOptions>): void
  /** Remueve listeners y restaura el host (capa, clase, vars, atributo de loop). */
  destroy(): void
}

/**
 * Motor imperativo del glow border (DOM puro, sin React). El loop autónomo
 * es CSS puro gateado por el atributo `data-aui-loop`; el modo `followCursor`
 * anima la rotación de la capa cónica con WAAPI, consolidando la animación
 * anterior (`commitStyles`) para preservar momentum y tomando siempre el
 * camino corto de ángulo (`unwrapAngle`).
 */
export function attachGlow(
  host: HTMLElement,
  options: GlowEngineOptions,
  layer?: HTMLElement,
): GlowEngineInstance {
  let current = { ...options }
  let animation: Animation | null = null
  let angle = 0

  injectStyles(styleId('glow-border'), GLOW_CSS)

  let enhanced: EnhancedHost | null = null
  let glowLayer = layer ?? null
  if (current.decorate) {
    glowLayer = createLayer('aui-glow-layer')
    enhanced = enhanceHost(host, {
      classes: ['aui-glow'],
      vars: glowVars(current),
      layers: [glowLayer],
    })
    // La capa va detrás del contenido: al frente del DOM pero z-index -1
    // dentro del contexto aislado del host. El contenido del consumer debe
    // aportar su propio background para tapar el centro del gradiente.
    host.insertBefore(glowLayer, host.firstChild)
  }

  const syncLoop = () => {
    if (!current.decorate) return
    const loopActive = !current.followCursor && !current.reducedMotion
    if (loopActive) host.setAttribute('data-aui-loop', '')
    else host.removeAttribute('data-aui-loop')
  }
  syncLoop()

  const onMouseMove = (event: MouseEvent) => {
    if (!current.followCursor) return
    const target = glowLayer
    if (!target || typeof target.animate !== 'function') return
    const rect = host.getBoundingClientRect()
    const raw = pointerAngle(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      event.clientX,
      event.clientY,
    )
    // Camino corto desde el ángulo actual; consolidar la animación anterior
    // antes de la próxima preserva el momentum (patrón TiltCard).
    const targetAngle = unwrapAngle(angle, raw)
    const previous = animation
    if (previous) {
      try {
        previous.commitStyles()
      } catch {
        // commitStyles falla si el elemento ya no está renderizado; se ignora.
      }
      previous.cancel()
    }
    animation = target.animate([{ transform: `rotate(${targetAngle}deg)` }], {
      duration: 200,
      fill: 'forwards',
      easing: 'ease-out',
    })
    angle = targetAngle
  }

  // Al salir el cursor no se resetea el ángulo: el borde queda estable donde
  // estaba, sin saltos (requirement de glow-border).
  host.addEventListener('mousemove', onMouseMove)

  return {
    update(patch) {
      current = { ...current, ...patch }
      enhanced?.setVars(glowVars(current))
      syncLoop()
    },
    destroy() {
      host.removeEventListener('mousemove', onMouseMove)
      if (animation) {
        animation.cancel()
        animation = null
      }
      if (current.decorate) host.removeAttribute('data-aui-loop')
      enhanced?.restore()
    },
  }
}
