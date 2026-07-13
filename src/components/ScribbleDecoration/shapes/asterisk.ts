import { asterisk as handDrawnAsterisk } from '../../../utils/hand-drawn'
import type { ScribbleShape } from './types'

/** Asterisco: tres trazos que se cruzan por el centro de la caja. */
export const asterisk: ScribbleShape = ({ width, height }, seed, options) =>
  handDrawnAsterisk(width, height, seed, options)
