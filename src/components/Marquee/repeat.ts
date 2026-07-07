/*
 * Cálculos puros del Marquee — sin DOM. El componente mide una vez (observer,
 * no por frame) y deriva acá cuántas repeticiones necesita el loop sin
 * huecos y cuánto dura un ciclo a la velocidad pedida.
 */

/**
 * Cuántas veces repetir el contenido para que media pista cubra el contenedor
 * sin huecos: el loop sin costura traslada media pista por ciclo, así que esa
 * mitad debe medir al menos el contenedor. Con medidas degeneradas retorna 1.
 */
export function repeatCount(contentSize: number, containerSize: number): number {
  if (contentSize <= 0 || containerSize <= 0) return 1
  return Math.max(1, Math.ceil(containerSize / contentSize))
}

/**
 * Segundos que tarda un ciclo del loop: la distancia trasladada por ciclo
 * (`repeats` bloques de contenido con su `gap`) a `speed` px/s. Retorna `0`
 * con parámetros degenerados (el componente deja el default del CSS).
 */
export function cycleDuration(
  contentSize: number,
  gap: number,
  repeats: number,
  speed: number,
): number {
  if (contentSize <= 0 || repeats <= 0 || speed <= 0) return 0
  return (repeats * (contentSize + gap)) / speed
}
