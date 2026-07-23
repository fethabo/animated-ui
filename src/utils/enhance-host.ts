/*
 * Contrato "mejorar y restaurar" de los behavior hooks (capability
 * behavior-hooks): un motor puede tocar el elemento del consumer solo de
 * formas reversibles — clases `aui-`, CSS vars `--aui-*` inline, `position:
 * relative` si el host es `static`, estilos inline puntuales y capas hijas
 * propias — y al destruirse debe dejar el host exactamente como estaba.
 * Este helper centraliza ese snapshot/restore para que ningún motor lo
 * reimplemente a mano.
 */

export interface HostEnhancement {
  /** Clases a agregar al host (se remueven en restore solo las que no tenía). */
  classes?: string[]
  /** CSS vars/estilos inline a setear via setProperty (snapshot del valor previo). */
  vars?: Record<string, string>
  /** Propiedades de style inline (camelCase) a setear, con snapshot del valor previo. */
  styles?: Partial<Record<keyof CSSStyleDeclaration & string, string>>
  /** Fuerza `position: relative` solo si el computed style del host es `static`. */
  ensurePosition?: boolean
  /** Capas hijas propias a inyectar al final del host (se remueven por referencia). */
  layers?: HTMLElement[]
}

export interface EnhancedHost {
  /** Re-aplica CSS vars sobre el host (fast-path de update; snapshotea las nuevas). */
  setVars(vars: Record<string, string>): void
  /** Restaura el host a su estado original y remueve las capas inyectadas. */
  restore(): void
}

/**
 * Crea una capa hija estándar de efecto: invisible para tecnologías
 * asistivas y transparente a los clicks. El posicionamiento y estética
 * los da la clase (CSS inyectado por el motor).
 */
export function createLayer(className: string, tag = 'div'): HTMLElement {
  const layer = document.createElement(tag)
  layer.className = className
  layer.setAttribute('aria-hidden', 'true')
  return layer
}

/**
 * Aplica una mejora reversible sobre el host. Idempotente por construcción:
 * cada `enhanceHost` nuevo snapshotea el estado vigente, así attach →
 * restore → attach (StrictMode) no acumula residuos.
 */
export function enhanceHost(host: HTMLElement, enhancement: HostEnhancement): EnhancedHost {
  const addedClasses: string[] = []
  for (const cls of enhancement.classes ?? []) {
    if (!host.classList.contains(cls)) {
      host.classList.add(cls)
      addedClasses.push(cls)
    }
  }

  // Snapshot perezoso por propiedad: solo la primera escritura de cada
  // nombre guarda el valor inline previo (el que restore repone).
  const previousVars = new Map<string, string>()
  const setVars = (vars: Record<string, string>) => {
    for (const [name, value] of Object.entries(vars)) {
      if (!previousVars.has(name)) previousVars.set(name, host.style.getPropertyValue(name))
      host.style.setProperty(name, value)
    }
  }
  if (enhancement.vars) setVars(enhancement.vars)

  const previousStyles = new Map<string, string>()
  for (const [prop, value] of Object.entries(enhancement.styles ?? {})) {
    if (value === undefined) continue
    const style = host.style as unknown as Record<string, string>
    previousStyles.set(prop, style[prop])
    style[prop] = value
  }

  let previousPosition: string | null = null
  // jsdom reporta '' donde un browser reporta 'static'; ambos son "sin posicionar".
  const computedPosition = getComputedStyle(host).position
  if (enhancement.ensurePosition && (computedPosition === 'static' || computedPosition === '')) {
    previousPosition = host.style.position
    host.style.position = 'relative'
  }

  const layers = enhancement.layers ?? []
  for (const layer of layers) host.appendChild(layer)

  let restored = false
  return {
    setVars,
    restore() {
      if (restored) return
      restored = true
      for (const layer of layers) layer.remove()
      if (previousPosition !== null) host.style.position = previousPosition
      for (const [prop, value] of previousStyles) {
        ;(host.style as unknown as Record<string, string>)[prop] = value
      }
      for (const [name, value] of previousVars) {
        if (value) host.style.setProperty(name, value)
        else host.style.removeProperty(name)
      }
      for (const cls of addedClasses) host.classList.remove(cls)
    },
  }
}
