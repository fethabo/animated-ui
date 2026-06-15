/*
 * Estética `lightning`: reutiliza `jagged-bolt` para convertir cada segmento del
 * esqueleto en un trazo quebrado tipo relámpago, dando ramas eléctricas en vez
 * de orgánicas. Respeta los mismos parámetros (`color`, `speed`, `duration`,
 * `maxDistance`, densidad) vía el contrato común.
 */
import { jaggedBolt } from '../../../utils/jagged-bolt'
import { buildSkeleton } from './skeleton'
import type { AestheticModule, Branch, Point } from './types'

export const lightning: AestheticModule = {
  name: 'lightning',
  generate(rng, origin, params) {
    const skeleton = buildSkeleton(rng, origin, params)
    const jitter = params.jitter > 0 ? params.jitter : Math.max(3, params.maxDistance * 0.04)
    return skeleton.map((branch): Branch => {
      // Cada par de nodos consecutivos se vuelve un mini-rayo; se concatenan.
      const points: Point[] = [branch.points[0]]
      for (let i = 1; i < branch.points.length; i++) {
        const bolt = jaggedBolt(rng, branch.points[i - 1], branch.points[i], { jitter, detail: 2 })
        // Evita duplicar el nodo inicial de cada bolt (ya está en `points`).
        for (let k = 1; k < bolt.length; k++) points.push(bolt[k])
      }
      return { points, delay: branch.delay, width: branch.width }
    })
  },
}
