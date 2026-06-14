/*
 * Cálculo puro de las líneas de conexión (efecto constellation) — sin DOM ni
 * canvas, testeable de forma aislada. Es el único lugar con costo O(N²): el
 * componente solo lo invoca cuando la prop `links` está activa, preservando el
 * costo O(N) en el caso por default.
 */

/** Punto mínimo necesario para conectar (las partículas aportan `x`, `y`). */
export interface LinkPoint {
  x: number
  y: number
}

/** Segmento a dibujar entre dos puntos, con opacidad ya resuelta en `[0, 1]`. */
export interface LinkSegment {
  x1: number
  y1: number
  x2: number
  y2: number
  /** Opacidad proporcional a la cercanía: 1 al tocarse, 0 en `linkDistance`. */
  opacity: number
}

export interface ComputeLinksOptions {
  /** Distancia máxima en px para conectar dos puntos. */
  linkDistance: number
  /** Posición del cursor relativa al canvas, o `null`/ausente si no aplica. */
  cursor?: { x: number; y: number } | null
}

/**
 * Calcula los segmentos de conexión entre pares de partículas a menos de
 * `linkDistance`, con opacidad proporcional a la cercanía. Descarta pares
 * lejanos con una comparación de bounding box (y luego de distancia al
 * cuadrado) **antes** de la raíz cuadrada, para acotar el costo del doble loop.
 * Si se pasa `cursor`, conecta también cada partícula cercana al cursor con él.
 */
export function computeLinks(
  particles: readonly LinkPoint[],
  { linkDistance, cursor }: ComputeLinksOptions,
): LinkSegment[] {
  const segments: LinkSegment[] = []
  if (linkDistance <= 0) return segments
  const maxSq = linkDistance * linkDistance

  for (let i = 0; i < particles.length; i++) {
    const a = particles[i]
    for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      // Descarte barato por bounding box antes de cualquier multiplicación.
      if (dx > linkDistance || dx < -linkDistance || dy > linkDistance || dy < -linkDistance) {
        continue
      }
      const distSq = dx * dx + dy * dy
      if (distSq >= maxSq) continue
      const dist = Math.sqrt(distSq)
      segments.push({
        x1: a.x,
        y1: a.y,
        x2: b.x,
        y2: b.y,
        opacity: 1 - dist / linkDistance,
      })
    }

    if (cursor) {
      const dx = a.x - cursor.x
      const dy = a.y - cursor.y
      if (dx > linkDistance || dx < -linkDistance || dy > linkDistance || dy < -linkDistance) {
        continue
      }
      const distSq = dx * dx + dy * dy
      if (distSq >= maxSq) continue
      const dist = Math.sqrt(distSq)
      segments.push({
        x1: a.x,
        y1: a.y,
        x2: cursor.x,
        y2: cursor.y,
        opacity: 1 - dist / linkDistance,
      })
    }
  }

  return segments
}
