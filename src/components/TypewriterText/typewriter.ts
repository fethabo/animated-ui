/*
 * Lógica pura del typewriter — sin DOM, testeable de forma aislada.
 *
 * Dado el tiempo transcurrido desde el inicio y la configuración, calcula qué
 * substring mostrar. La progresión es por timestamp (ms), no por frames, así
 * la velocidad percibida es idéntica en 60 y 144 Hz. Opera por code points
 * (`Array.from`) para no partir surrogates (emoji, símbolos fuera del BMP).
 */

export interface TypewriterConfig {
  /** Caracteres escritos por segundo. */
  speed: number
  /** Caracteres borrados por segundo (modo loop). */
  deleteSpeed: number
  /** Milisegundos de pausa con el string completo antes de borrar. */
  pauseDuration: number
  /** Milisegundos antes de empezar a escribir. */
  startDelay: number
  /** Si cicla (escribe→pausa→borra→siguiente) entre los strings. */
  loop: boolean
}

export interface TypewriterState {
  /** Substring visible en este instante. */
  text: string
  /** `true` cuando la animación terminó (solo en modo no-loop). */
  done: boolean
}

function sliceCodePoints(str: string, count: number): string {
  return Array.from(str).slice(0, Math.max(0, count)).join('')
}

function codePointLength(str: string): number {
  return Array.from(str).length
}

/**
 * Estado del typewriter en `elapsedMs` ms desde el montaje.
 *
 * - Modo no-loop (o string único): escribe `strings[0]` carácter por carácter
 *   y se queda completo (`done: true`) al terminar.
 * - Modo loop: recorre los strings en ciclo — escribe cada uno, lo mantiene
 *   `pauseDuration` ms, lo borra a `deleteSpeed`, y pasa al siguiente,
 *   volviendo al primero tras el último. Nunca reporta `done`.
 */
export function typewriterFrameAt(
  strings: string[],
  elapsedMs: number,
  config: TypewriterConfig,
): TypewriterState {
  const list = strings.length > 0 ? strings : ['']
  const { speed, deleteSpeed, pauseDuration, startDelay, loop } = config

  // Antes del startDelay no se muestra nada todavía.
  const t = elapsedMs - startDelay
  if (t <= 0) return { text: '', done: false }

  if (!loop) {
    const target = list[0]
    const total = codePointLength(target)
    const typed = Math.floor((t / 1000) * speed)
    if (typed >= total) return { text: target, done: true }
    return { text: sliceCodePoints(target, typed), done: false }
  }

  // Duración de cada tramo del ciclo: escribir + pausar + borrar, por string.
  const segments = list.map((str) => {
    const len = codePointLength(str)
    const typeDur = speed > 0 ? (len / speed) * 1000 : 0
    const deleteDur = deleteSpeed > 0 ? (len / deleteSpeed) * 1000 : 0
    return { str, len, typeDur, deleteDur }
  })
  const cycleDuration = segments.reduce(
    (sum, s) => sum + s.typeDur + pauseDuration + s.deleteDur,
    0,
  )
  // Todos los strings vacíos (o velocidades nulas sin pausa): nada que animar.
  if (cycleDuration <= 0) return { text: '', done: false }

  let local = t % cycleDuration
  for (const seg of segments) {
    if (local < seg.typeDur) {
      const typed = Math.floor((local / 1000) * speed)
      return { text: sliceCodePoints(seg.str, Math.min(typed, seg.len)), done: false }
    }
    local -= seg.typeDur

    if (local < pauseDuration) {
      return { text: seg.str, done: false }
    }
    local -= pauseDuration

    if (local < seg.deleteDur) {
      const deleted = Math.floor((local / 1000) * deleteSpeed)
      return { text: sliceCodePoints(seg.str, Math.max(0, seg.len - deleted)), done: false }
    }
    local -= seg.deleteDur
  }

  // Borde de redondeo: caer en el límite exacto del ciclo → vacío.
  return { text: '', done: false }
}
