import { arrow as handDrawnArrow } from '../../../utils/hand-drawn'
import type { ScribbleShape } from './types'

/** Flecha con fuste arqueado apuntando a la derecha (rotable via CSS transform). */
export const arrow: ScribbleShape = ({ width, height }, seed, options) =>
  handDrawnArrow(width, height, seed, options)
