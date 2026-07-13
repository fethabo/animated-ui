import { spiral as handDrawnSpiral } from '../../../utils/hand-drawn'
import type { ScribbleShape } from './types'

/** Espiral elíptica desde el centro hacia afuera (~2.5 vueltas). */
export const spiral: ScribbleShape = ({ width, height }, seed, options) =>
  handDrawnSpiral(width, height, seed, options)
