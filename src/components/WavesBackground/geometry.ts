/*
 * Geometría pura de WavesBackground — sin DOM ni canvas. Dado el campo de
 * ruido y el tiempo, produce los puntos de cada línea (muestreo espaciado,
 * nunca por pixel) y el color interpolado por línea; el componente solo
 * dibuja polylines con el resultado.
 */
import type { Noise2D } from '../../utils/noise'

/** Espaciado horizontal del muestreo del ruido en px (presupuesto del design). */
export const SAMPLE_SPACING = 8

/** Escala horizontal del campo: px de canvas → coordenada de ruido. */
const NOISE_SCALE_X = 1 / 260
/** Separación de fase entre líneas en el eje temporal del campo (evita que ondulen en bloque). */
const LINE_PHASE = 0.35

export interface WaveLinePoints {
  /** Polyline de la línea: puntos `{x, y}` espaciados `SAMPLE_SPACING` px. */
  points: Array<{ x: number; y: number }>
  /** Color de la línea, interpolado en la paleta según su posición vertical. */
  color: string
}

export interface ComputeWaveLinesOptions {
  width: number
  height: number
  /** Cantidad de líneas distribuidas verticalmente. */
  lines: number
  /** Amplitud máxima de la ondulación en px. */
  amplitude: number
  /** Tiempo de la deriva (coordenada temporal del campo). */
  t: number
  /** Campo de ruido seedeado (`createNoise2D`). */
  noise: Noise2D
  /** Paleta a interpolar entre la primera y la última línea. */
  colors: readonly string[]
}

/**
 * Calcula las polylines de todas las líneas para el instante `t`. Cada línea
 * vive en `baseY` (distribución vertical uniforme) y se curva con
 * `noise(x, t + fase(línea)) * amplitude`; el tiempo entra como coordenada
 * del campo (corte deslizante), así la ondulación es continua y sin
 * repetición periódica. Determinista: mismo noise + t + dimensiones ⇒ mismos
 * puntos.
 */
export function computeWaveLines({
  width,
  height,
  lines,
  amplitude,
  t,
  noise,
  colors,
}: ComputeWaveLinesOptions): WaveLinePoints[] {
  const result: WaveLinePoints[] = []
  for (let i = 0; i < lines; i++) {
    const baseY = (height * (i + 0.5)) / lines
    const points: Array<{ x: number; y: number }> = []
    // Incluye siempre el borde derecho para que la línea cubra todo el ancho.
    for (let x = 0; x <= width + SAMPLE_SPACING - 1; x += SAMPLE_SPACING) {
      const px = Math.min(x, width)
      const y = baseY + noise(px * NOISE_SCALE_X, t + i * LINE_PHASE) * amplitude
      points.push({ x: px, y })
      if (px === width) break
    }
    const fraction = lines > 1 ? i / (lines - 1) : 0
    result.push({ points, color: interpolatePalette(colors, fraction) })
  }
  return result
}

/**
 * Color en la posición `fraction` (`0–1`) de la paleta. Entre dos stops hex
 * interpola linealmente en RGB; si algún extremo no es hex parseable, cae al
 * stop más cercano (los colores CSS arbitrarios no se interpolan sin DOM).
 */
export function interpolatePalette(colors: readonly string[], fraction: number): string {
  if (colors.length === 0) return '#ffffff'
  if (colors.length === 1) return colors[0]
  const clamped = Math.max(0, Math.min(1, fraction))
  const scaled = clamped * (colors.length - 1)
  const index = Math.min(Math.floor(scaled), colors.length - 2)
  const local = scaled - index
  const from = parseHex(colors[index])
  const to = parseHex(colors[index + 1])
  if (!from || !to) return local < 0.5 ? colors[index] : colors[index + 1]
  const r = Math.round(from[0] + (to[0] - from[0]) * local)
  const g = Math.round(from[1] + (to[1] - from[1]) * local)
  const b = Math.round(from[2] + (to[2] - from[2]) * local)
  return `rgb(${r}, ${g}, ${b})`
}

/** Parsea `#rgb`/`#rrggbb` a `[r, g, b]`, o `null` si no es hex. */
function parseHex(color: string): [number, number, number] | null {
  const hex = color.trim()
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return null
  const raw = hex.slice(1)
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}
