import { wavyUnderline } from '../../../utils/hand-drawn'
import type { ScribbleShape } from './types'

/** Subrayado ondulado sobre el borde inferior de la caja. */
export const underline: ScribbleShape = ({ width, height }, seed, options) =>
  wavyUnderline(width, height, seed, options)
