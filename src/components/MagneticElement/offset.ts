export interface MagneticOffset {
  offsetX: number
  offsetY: number
}

/**
 * Desplazamiento magnético del contenido: proporcional a la distancia del
 * cursor al centro del área sensible, escalado por `strength`.
 *
 * `relX`/`relY` son la posición del cursor relativa al área (en px desde su
 * esquina superior izquierda); `width`/`height` son las dimensiones del área.
 * Cursor en el centro → offset 0; en un borde → desplazamiento máximo
 * (mitad del área × strength).
 */
export function magneticOffset(
  relX: number,
  relY: number,
  width: number,
  height: number,
  strength: number,
): MagneticOffset {
  return {
    offsetX: (relX - width / 2) * strength,
    offsetY: (relY - height / 2) * strength,
  }
}
