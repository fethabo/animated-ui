/*
 * Lógica pura de MatrixRain — sin DOM ni canvas, testeable de forma aislada.
 * Una columna es un cursor vertical (fila de la cabeza + velocidad propia +
 * delay de reinicio); los glifos salen del charset via el PRNG del paquete.
 * Todo determinista: misma seed + misma grilla ⇒ misma secuencia.
 */
import { createPrng, int, range, type Prng } from '../../utils/prng'

/** Charset default: dígitos + mayúsculas ASCII + katakana simple. */
export const DEFAULT_CHARSET =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン'

/** Tope de columnas simultáneas (palanca de performance en anchos grandes). */
export const MAX_COLUMNS = 400

/** Rango del multiplicador de velocidad por columna (filas/s se escala afuera). */
const COLUMN_SPEED_MIN = 0.6
const COLUMN_SPEED_MAX = 1.6
/** Rango del delay de reinicio de columna, en segundos. */
const RESTART_DELAY_MIN = 0.2
const RESTART_DELAY_MAX = 2.5

export interface RainColumn {
  /** Fila (fraccional) de la cabeza; los glifos se dibujan al cruzar cada fila entera. */
  head: number
  /** Multiplicador de velocidad propio de la columna. */
  speed: number
  /** Segundos restantes antes de (re)arrancar desde arriba. */
  delay: number
}

export interface CreateColumnsOptions {
  columns: number
  rows: number
  seed: string | number
}

/**
 * Crea el estado inicial de las columnas de forma determinista: cabezas
 * repartidas a lo alto (algunas ya cayendo, otras esperando su delay), con
 * velocidad propia por columna.
 */
export function createColumns({ columns, rows, seed }: CreateColumnsOptions): RainColumn[] {
  const rng = createPrng(`${seed}:${columns}x${rows}`)
  const result: RainColumn[] = []
  for (let i = 0; i < columns; i++) {
    const waiting = rng() < 0.3
    result.push({
      head: waiting ? 0 : rng() * rows,
      speed: range(rng, COLUMN_SPEED_MIN, COLUMN_SPEED_MAX),
      delay: waiting ? range(rng, RESTART_DELAY_MIN, RESTART_DELAY_MAX) : 0,
    })
  }
  return result
}

export interface StepColumnsOptions {
  rows: number
  /** Velocidad base en filas por segundo (el multiplicador por columna la modula). */
  rowsPerSecond: number
  /** PRNG del componente, para el delay y la velocidad del reinicio. */
  rng: Prng
}

/**
 * Avanza las columnas `dt` segundos, mutándolas en su lugar. Una columna en
 * delay lo consume antes de arrancar; una cabeza que sale por el borde
 * inferior reinicia desde arriba tras un delay pseudoaleatorio, con velocidad
 * nueva. Retorna, por columna, cuántas filas enteras cruzó la cabeza en este
 * paso (cantidad de glifos nuevos a dibujar).
 */
export function stepColumns(
  columns: RainColumn[],
  dt: number,
  { rows, rowsPerSecond, rng }: StepColumnsOptions,
): number[] {
  const crossed: number[] = new Array(columns.length).fill(0)
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i]
    if (column.delay > 0) {
      column.delay -= dt
      continue
    }
    const before = Math.floor(column.head)
    column.head += column.speed * rowsPerSecond * dt
    crossed[i] = Math.max(0, Math.floor(column.head) - before)
    if (column.head >= rows) {
      column.head = 0
      column.speed = range(rng, COLUMN_SPEED_MIN, COLUMN_SPEED_MAX)
      column.delay = range(rng, RESTART_DELAY_MIN, RESTART_DELAY_MAX)
    }
  }
  return crossed
}

/**
 * Glifo pseudoaleatorio del charset. `charset` vacío retorna cadena vacía.
 */
export function pickGlyph(rng: Prng, charset: string): string {
  if (charset.length === 0) return ''
  return charset[int(rng, 0, charset.length - 1)]
}

/**
 * Grilla derivada del tamaño del canvas y `fontSize`: columnas capadas a
 * `MAX_COLUMNS` (subir `fontSize` baja la densidad — palanca de performance).
 */
export function computeGrid(
  width: number,
  height: number,
  fontSize: number,
): { columns: number; rows: number } {
  return {
    columns: Math.min(MAX_COLUMNS, Math.max(1, Math.floor(width / fontSize))),
    rows: Math.max(1, Math.ceil(height / fontSize)),
  }
}
