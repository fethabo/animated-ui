/*
 * Estética `circuit`: trazos ortogonales (giros a 90°) que se expanden desde el
 * puntero hacia afuera en todas direcciones, evocando pistas de circuito que
 * crecen. A diferencia de `roots`/`lightning` (orgánicos), los segmentos solo
 * avanzan en los ejes; el sesgo hacia el radio creciente hace que la red llene
 * los 360° hasta la frontera (`maxDistance`).
 */
import { range } from '../../../utils/prng'
import type { AestheticModule, Branch, Point } from './types'

/** Direcciones ortogonales: 0,1 horizontales; 2,3 verticales. */
const AX: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
]

/** Índice del eje ortogonal más cercano a un ángulo (para el sesgo directed). */
function nearestAxis(angle: number): number {
  const a = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
  if (a < Math.PI / 4 || a >= (7 * Math.PI) / 4) return 0 // +x
  if (a < (3 * Math.PI) / 4) return 2 // +y
  if (a < (5 * Math.PI) / 4) return 1 // -x
  return 3 // -y
}

export const circuit: AestheticModule = {
  name: 'circuit',
  generate(rng, origin, params): Branch[] {
    const { maxDistance, density, depth, bias } = params
    const widthAt = (d: number) => Math.max(0.4, Math.pow(0.7, depth - d))
    const branches: Branch[] = []
    const step = maxDistance / 6
    const branchProb = Math.min(0.7, 0.28 + density * 0.07)
    const dist = (p: Point) => Math.hypot(p.x - origin.x, p.y - origin.y)

    // Elige la perpendicular que aleja más del origen (expansión 360°),
    // con algo de azar para variar la forma.
    const outward = (pos: Point, dir: number): number => {
      const perps = dir < 2 ? [2, 3] : [0, 1]
      if (rng() < 0.3) return perps[rng() < 0.5 ? 0 : 1]
      const d0 = dist({ x: pos.x + AX[perps[0]][0] * step, y: pos.y + AX[perps[0]][1] * step })
      const d1 = dist({ x: pos.x + AX[perps[1]][0] * step, y: pos.y + AX[perps[1]][1] * step })
      return d1 > d0 ? perps[1] : perps[0]
    }

    const grow = (start: Point, dir0: number, budget: number, d: number, delay: number, turn: boolean) => {
      const nodes: Point[] = [start]
      let pos = start
      let traveled = 0
      let dir = dir0
      while (traveled < budget) {
        if (turn && rng() > 0.72) dir = outward(pos, dir)
        const np: Point = { x: pos.x + AX[dir][0] * step, y: pos.y + AX[dir][1] * step }
        if (dist(np) > maxDistance) break
        nodes.push(np)
        pos = np
        traveled += step
        if (d > 0 && traveled > step && rng() < branchProb) {
          grow(pos, outward(pos, dir), budget * range(rng, 0.4, 0.6), d - 1, delay + traveled, true)
        }
      }
      if (nodes.length >= 2) branches.push({ points: nodes, delay, width: widthAt(d) })
    }

    if (bias === null) {
      // Ambient: troncos repartidos en los 4 ejes, cycleando, con staircases.
      const trunks = Math.max(4, Math.round(density * 1.5))
      for (let t = 0; t < trunks; t++) {
        grow(origin, t % 4, maxDistance * range(rng, 0.75, 1), depth, 0, true)
      }
    } else {
      // Directed: un tronco recto al eje más cercano al target (rama dominante),
      // más secundarios que se dispersan.
      grow(origin, nearestAxis(bias), maxDistance * 0.95, depth, 0, false)
      const trunks = Math.max(1, Math.round(density / 2))
      for (let t = 0; t < trunks; t++) {
        grow(origin, t % 4, maxDistance * range(rng, 0.4, 0.7), depth - 1, 0, true)
      }
    }

    return branches
  },
}
