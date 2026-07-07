/*
 * Generador puro del CSS de las ráfagas de GlitchText — sin DOM. El glitch es
 * intermitente: ráfagas breves equiespaciadas dentro del ciclo, separadas por
 * períodos estables (capas invisibles). Los recortes por frame salen de una
 * secuencia fija (nada de aleatoriedad en runtime: el CSS se genera igual en
 * SSR y cliente).
 */

/** Ventana de una ráfaga dentro del ciclo, en porcentaje `[0, 100]`. */
export interface BurstWindow {
  start: number
  end: number
}

/** Duración del ciclo completo del glitch en segundos. */
export const GLITCH_CYCLE_S = 3

/** Recortes verticales (top%, bottom%) que ciclan por frame de ráfaga — patrón fijo. */
const CLIP_PATTERN: Array<[number, number]> = [
  [10, 55],
  [65, 10],
  [30, 40],
  [80, 4],
  [45, 30],
  [5, 75],
]

/**
 * Ventanas de ráfaga equiespaciadas: `frequency` ráfagas por ciclo, cada una
 * de `burstFraction` del slot que le toca (clampeado para que nunca se
 * solapen). Determinista.
 */
export function burstWindows(frequency: number, burstFraction: number): BurstWindow[] {
  const bursts = Math.max(1, Math.floor(frequency))
  const fraction = Math.min(0.8, Math.max(0.02, burstFraction))
  const slot = 100 / bursts
  return Array.from({ length: bursts }, (_, i) => {
    const start = i * slot + slot * 0.08
    return { start, end: Math.min(100, start + slot * fraction) }
  })
}

/**
 * Keyframes de una capa del glitch: invisible y alineada fuera de las
 * ráfagas; dentro de cada ráfaga, visible, desplazada `sign · intensity` y
 * con recortes que cambian entre el inicio, el medio y el fin de la ráfaga.
 */
export function glitchLayerKeyframes(name: string, windows: BurstWindow[], sign: 1 | -1): string {
  const off = 'opacity: 0; transform: none; clip-path: inset(50% 0 50% 0);'
  const shift = `transform: translateX(calc(${sign} * var(--aui-glitch-intensity, 3px)));`
  const frames: string[] = [`  0% { ${off} }`]
  windows.forEach((w, i) => {
    const mid = (w.start + w.end) / 2
    const [t1, b1] = CLIP_PATTERN[(i * 2) % CLIP_PATTERN.length]
    const [t2, b2] = CLIP_PATTERN[(i * 2 + 1) % CLIP_PATTERN.length]
    frames.push(`  ${w.start.toFixed(2)}% { ${off} }`)
    frames.push(
      `  ${(w.start + 0.01).toFixed(2)}% { opacity: 1; ${shift} clip-path: inset(${t1}% 0 ${b1}% 0); }`,
    )
    frames.push(
      `  ${mid.toFixed(2)}% { opacity: 1; ${shift} clip-path: inset(${t2}% 0 ${b2}% 0); }`,
    )
    frames.push(`  ${w.end.toFixed(2)}% { ${off} }`)
  })
  frames.push(`  100% { ${off} }`)
  return `@keyframes ${name} {\n${frames.join('\n')}\n}`
}

/**
 * CSS completo de una configuración de ráfagas (`frequency` × `burstFraction`),
 * identificada por `key`: los dos keyframes (una capa por canal, desplazadas
 * en sentidos opuestos) y las reglas que los activan en modo `loop` (autónomo)
 * o `hover` (solo con el cursor encima).
 */
export function buildGlitchCss(key: string, frequency: number, burstFraction: number): string {
  const windows = burstWindows(frequency, burstFraction)
  const nameA = `aui-glitch-a-${key}`
  const nameB = `aui-glitch-b-${key}`
  return `
${glitchLayerKeyframes(nameA, windows, -1)}
${glitchLayerKeyframes(nameB, windows, 1)}
.aui-glitch[data-aui-glitch='${key}'][data-aui-trigger='loop']:not([data-aui-static])::before,
.aui-glitch[data-aui-glitch='${key}'][data-aui-trigger='hover']:not([data-aui-static]):hover::before {
  animation: ${nameA} var(--aui-glitch-cycle, ${GLITCH_CYCLE_S}s) linear infinite;
}
.aui-glitch[data-aui-glitch='${key}'][data-aui-trigger='loop']:not([data-aui-static])::after,
.aui-glitch[data-aui-glitch='${key}'][data-aui-trigger='hover']:not([data-aui-static]):hover::after {
  animation: ${nameB} var(--aui-glitch-cycle, ${GLITCH_CYCLE_S}s) linear infinite;
}
`
}
