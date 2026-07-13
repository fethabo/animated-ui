import { circle as handDrawnCircle } from '../../../utils/hand-drawn'
import type { ScribbleShape } from './types'

/** Elipse abierta que llena la caja y se cierra pasándose de largo. */
export const circle: ScribbleShape = ({ width, height }, seed, options) =>
  handDrawnCircle(width, height, seed, options)
