/*
 * Esqueleto de árbol compartido por las estéticas de `GuidingBranches`: un
 * crecimiento ramificado de troncos que parten del origen, vagan hacia un
 * ángulo (sesgado al target en directed, repartidos en ambient) y sueltan
 * sub-ramas recursivamente. Acotado por `maxDistance`. Función pura y
 * determinista por el PRNG. Cada estética convierte estos nodos en su trazo
 * propio (recto/orgánico en `roots`, jagged en `lightning`).
 */
import { range } from '../../../utils/prng'
import type { Prng } from '../../../utils/prng'
import type { BranchParams, Branch, Point } from './types'

/** Una rama del esqueleto: nodos rectos + delay de aparición (px). */
export type SkeletonBranch = Branch

/**
 * Construye el esqueleto de ramas. En directed (`bias` numérico) el tronco
 * dominante apunta al target con poca dispersión; en ambient (`bias === null`)
 * los troncos se reparten alrededor del origen. Ningún nodo supera `maxDistance`.
 */
export function buildSkeleton(rng: Prng, origin: Point, params: BranchParams): SkeletonBranch[] {
  const { maxDistance, density, depth, bias } = params
  const curl = Math.max(0, params.curl)
  const branches: SkeletonBranch[] = []
  const branchProb = Math.min(0.7, 0.25 + density * 0.08)
  // Más segmentos (paso corto) ⇒ curvas suaves en vez de tramos rectos largos.
  const step = maxDistance / (6 + curl * 8)

  const dist = (p: Point) => Math.hypot(p.x - origin.x, p.y - origin.y)

  // `curlScale` atenúa la curvatura (el tronco dominante en directed va más
  // derecho hacia el target). Crece nodo a nodo con una `turnRate` que varía
  // lento → arcos orgánicos (raíz que se dobla), no zigzag de rayo.
  const grow = (start: Point, angle: number, budget: number, d: number, delay: number, curlScale: number) => {
    const nodes: Point[] = [start]
    let pos = start
    let traveled = 0
    let ang = angle
    const driftMag = (0.1 + curl * 0.55) * curlScale
    let turnRate = range(rng, -driftMag, driftMag)
    const maxTurn = driftMag * 2.2
    while (traveled < budget) {
      turnRate += range(rng, -driftMag * 0.5, driftMag * 0.5)
      turnRate = Math.max(-maxTurn, Math.min(maxTurn, turnRate))
      ang += turnRate
      const seg = Math.min(step, budget - traveled)
      const np: Point = { x: pos.x + Math.cos(ang) * seg, y: pos.y + Math.sin(ang) * seg }
      if (dist(np) > maxDistance) break // acotado por maxDistance
      nodes.push(np)
      pos = np
      traveled += seg
      // Suelta una sub-rama (las raíces se bifurcan abriéndose).
      if (d > 0 && traveled > step && rng() < branchProb) {
        const childAngle = ang + (rng() < 0.5 ? -1 : 1) * range(rng, 0.5, 1.1)
        grow(pos, childAngle, budget * range(rng, 0.4, 0.6), d - 1, delay + traveled, curlScale)
      }
    }
    if (nodes.length >= 2) {
      // Afina las ramas según su profundidad (las puntas son más finas).
      branches.push({ points: nodes, delay, width: Math.max(0.35, Math.pow(0.62, depth - d)) })
    }
  }

  if (bias === null) {
    const trunks = Math.max(2, Math.round(density))
    for (let t = 0; t < trunks; t++) {
      const base = (t / trunks) * Math.PI * 2 + range(rng, -0.3, 0.3)
      grow(origin, base, maxDistance * range(rng, 0.75, 1), depth, 0, 1)
    }
  } else {
    // Tronco dominante: derecho hacia el target (curvatura atenuada), el más
    // largo. Secundarios: dispersos y curvos.
    grow(origin, bias + range(rng, -0.12, 0.12), maxDistance, depth, 0, 0.3)
    const trunks = Math.max(1, Math.round(density / 2))
    for (let t = 0; t < trunks; t++) {
      grow(origin, bias + range(rng, -1.2, 1.2), maxDistance * range(rng, 0.45, 0.7), depth - 1, 0, 1)
    }
  }

  return branches
}
