/*
 * Formateo y easing de CountUp — lógica pura sin DOM, testeable de forma
 * aislada. El RAF del componente llama a formatValue en cada frame, así que
 * la cantidad de decimales es estable durante toda la cuenta.
 */

export interface FormatOptions {
  /** Cantidad de decimales (fija durante toda la cuenta). Default: `0`. */
  decimals?: number
  /** Separador de miles. Default: `''` (sin separador). */
  separator?: string
  /** String antepuesto al número (e.g. `'$'`). Default: `''`. */
  prefix?: string
  /** String pospuesto al número (e.g. `'+'`). Default: `''`. */
  suffix?: string
}

/**
 * Formatea un valor numérico: decimales fijos, separador de miles solo en la
 * parte entera, y prefijo/sufijo. El signo va después del prefijo
 * (`prefix='$'`, `value=-5` → `$-5`).
 */
export function formatValue(
  value: number,
  { decimals = 0, separator = '', prefix = '', suffix = '' }: FormatOptions = {},
): string {
  const sign = value < 0 ? '-' : ''
  const [int, frac] = Math.abs(value).toFixed(decimals).split('.')
  const grouped = separator ? int.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : int
  return `${prefix}${sign}${grouped}${frac ? `.${frac}` : ''}${suffix}`
}

/**
 * Easing de salida (cubic ease-out): arranque rápido, frenado al llegar.
 * Mapea el progreso lineal t ∈ [0, 1] a [0, 1], con easeOut(1) === 1 exacto
 * (la cuenta termina clavada en el valor final).
 */
export function easeOut(t: number): number {
  const clamped = Math.max(0, Math.min(1, t))
  return 1 - (1 - clamped) ** 3
}
