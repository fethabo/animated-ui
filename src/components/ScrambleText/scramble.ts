/**
 * Pool default del scramble: letras, números y símbolos "de terminal" que
 * dan el look decrypt/Matrix sin caracteres de doble ancho.
 */
export const DEFAULT_CHARSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&?!<>+=*'

/**
 * Genera un frame del scramble: los primeros `revealed` caracteres del texto
 * final, y el resto reemplazado por caracteres aleatorios del charset.
 *
 * - Opera por code points (`Array.from`), no por unidades UTF-16, para no
 *   partir surrogates (emoji, símbolos fuera del BMP).
 * - El whitespace del texto original se preserva en todos los frames, así la
 *   silueta de las palabras se mantiene estable.
 * - La aleatoriedad se inyecta (`random: () => number` en [0, 1)) para que
 *   los tests sean deterministas.
 */
export function scrambleFrame(
  text: string,
  revealed: number,
  charset: string,
  random: () => number,
): string {
  const chars = Array.from(text)
  const pool = Array.from(charset)
  if (pool.length === 0) return text

  let frame = ''
  for (let i = 0; i < chars.length; i++) {
    if (i < revealed || /\s/.test(chars[i])) {
      frame += chars[i]
    } else {
      frame += pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))]
    }
  }
  return frame
}
