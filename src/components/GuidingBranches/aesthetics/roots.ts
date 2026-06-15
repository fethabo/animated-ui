/*
 * Estética `roots` (default): ramas orgánicas con trazo suave. Usa el esqueleto
 * compartido tal cual (segmentos rectos con vagabundeo), evocando raíces que se
 * extienden desde el puntero.
 */
import { buildSkeleton } from './skeleton'
import type { AestheticModule } from './types'

export const roots: AestheticModule = {
  name: 'roots',
  generate(rng, origin, params) {
    return buildSkeleton(rng, origin, params)
  },
}
