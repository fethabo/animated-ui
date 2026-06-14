/*
 * Matemática pura de StackedCards — sin DOM, testeable de forma aislada.
 * Traduce la geometría del contenedor a una profundidad por card, con la que
 * el componente interpola escala/opacidad en el compositor.
 */

/**
 * Cuánto se ha scrolleado dentro del rango del stack, en px, desde que el
 * contenedor alcanzó su punto de fijado. Con el top del contenedor en
 * `offsetTop` → 0; a medida que se scrollea hacia abajo (`containerTop`
 * disminuye) crece. Nunca negativo (antes del pin retorna 0).
 */
export function stackScrolled(containerTop: number, offsetTop: number): number {
  return Math.max(0, offsetTop - containerTop)
}

/**
 * Profundidad (continua) de la card `cardIndex`: cuántas cards tiene encima.
 *
 * Cada `cardTravel` px de scroll fija una card nueva sobre las anteriores. La
 * card que se está fijando tiene profundidad 0; las de abajo crecen en
 * profundidad. El valor es fraccional para interpolar suave durante la
 * transición. Se clampa a `totalCards - 1 - cardIndex` (cuántas cards pueden
 * llegar a taparla) para que una card no se encoja indefinidamente.
 */
export function stackDepth(
  scrolled: number,
  cardTravel: number,
  cardIndex: number,
  totalCards: number,
): number {
  if (cardTravel <= 0) return 0
  const raw = scrolled / cardTravel - cardIndex
  const max = Math.max(0, totalCards - 1 - cardIndex)
  return Math.max(0, Math.min(raw, max))
}
