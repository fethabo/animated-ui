export interface ParallaxOffset {
  x: number
  y: number
}

/**
 * Normaliza la posición del cursor a [-1, 1] respecto del centro del rect:
 * centro → 0, bordes → ±1. Posiciones fuera del rect se clampean para que
 * las capas nunca excedan su `depth` máximo.
 */
export function parallaxOffset(
  rect: { left: number; top: number; width: number; height: number },
  clientX: number,
  clientY: number,
): ParallaxOffset {
  if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 }
  const x = ((clientX - rect.left) / rect.width) * 2 - 1
  const y = ((clientY - rect.top) / rect.height) * 2 - 1
  return {
    x: Math.max(-1, Math.min(1, x)),
    y: Math.max(-1, Math.min(1, y)),
  }
}
