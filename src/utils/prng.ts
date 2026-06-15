/*
 * PRNG seedable, zero-deps (ver design.md de Wave C). El paquete prohíbe
 * `Math.random()`/`Date.now()` en la generación: toda aleatoriedad visual pasa
 * por acá, sembrada por una `seed` (prop o default fijo). Determinista por
 * seed ⇒ estable SSR↔hidratación y reproducible entre repaints.
 *
 * Implementación: hash de string `xmur3` para derivar 32 bits desde la seed +
 * generador `mulberry32`. Suficiente para ruido visual; sin estado global.
 * Interno al paquete — se promueve a público recién cuando un tercer
 * consumidor lo justifique (criterio de `scroll-driver.ts`).
 */

/**
 * Hash de string tipo `xmur3`: deriva un entero de 32 bits desde una cadena.
 * Se usa para convertir una `seed` (string o number) en el estado inicial del
 * generador. Determinista: la misma entrada produce el mismo hash.
 */
function xmur3(str: string): number {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507)
  h = Math.imul(h ^ (h >>> 13), 3266489909)
  return (h ^= h >>> 16) >>> 0
}

/**
 * Generador `mulberry32`: dado un estado de 32 bits, devuelve una función que
 * produce flotantes en `[0, 1)`. Rápido y de buena distribución para ruido
 * visual (no criptográfico).
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Una función generadora de flotantes en `[0, 1)`, determinista por su seed. */
export type Prng = () => number

/**
 * Crea un PRNG determinista a partir de una `seed` (string o number). La misma
 * seed produce siempre la misma secuencia. No usa `Math.random()` ni estado
 * global, por lo que es seguro en module-load y estable SSR↔cliente.
 */
export function createPrng(seed: string | number): Prng {
  return mulberry32(xmur3(String(seed)))
}

/**
 * Flotante en `[min, max)` a partir del siguiente valor del generador.
 */
export function range(rng: Prng, min: number, max: number): number {
  return min + rng() * (max - min)
}

/**
 * Entero en `[min, max]` (ambos inclusive) a partir del generador.
 */
export function int(rng: Prng, min: number, max: number): number {
  return Math.floor(min + rng() * (max - min + 1))
}

/**
 * Elemento aleatorio de un array a partir del generador. Devuelve `undefined`
 * si el array está vacío.
 */
export function pick<T>(rng: Prng, items: readonly T[]): T | undefined {
  if (items.length === 0) return undefined
  return items[Math.floor(rng() * items.length)]
}
