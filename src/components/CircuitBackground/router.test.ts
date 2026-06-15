import { describe, expect, it } from 'vitest'
import { routeCircuit } from './router'

const SIZE = { width: 800, height: 600 }

describe('routeCircuit', () => {
  it('es determinista por seed/tamaño/densidad', () => {
    const a = routeCircuit({ ...SIZE, seed: 'pcb', density: 1 })
    const b = routeCircuit({ ...SIZE, seed: 'pcb', density: 1 })
    expect(a.tracks).toEqual(b.tracks)
    expect(a.pads).toEqual(b.pads)
  })

  it('seeds distintas producen trazados distintos', () => {
    const a = routeCircuit({ ...SIZE, seed: 'uno', density: 1 })
    const b = routeCircuit({ ...SIZE, seed: 'dos', density: 1 })
    expect(a.tracks).not.toEqual(b.tracks)
  })

  it('todos los segmentos giran a 90° (cada tramo es axis-aligned)', () => {
    const { tracks } = routeCircuit({ ...SIZE, seed: 'angles', density: 1.5 })
    expect(tracks.length).toBeGreaterThan(0)
    for (const poly of tracks) {
      for (let i = 1; i < poly.length; i++) {
        const dx = Math.abs(poly[i].x - poly[i - 1].x)
        const dy = Math.abs(poly[i].y - poly[i - 1].y)
        // Un solo eje varía por segmento (ortogonal): uno de los dos es ~0.
        const axisAligned = dx < 0.001 || dy < 0.001
        expect(axisAligned).toBe(true)
      }
    }
  })

  it('la densidad escala la cantidad de pistas', () => {
    const low = routeCircuit({ ...SIZE, seed: 'd', density: 0.5 })
    const high = routeCircuit({ ...SIZE, seed: 'd', density: 2.5 })
    expect(high.tracks.length).toBeGreaterThan(low.tracks.length)
  })

  it('no excede el área', () => {
    const { tracks, pads } = routeCircuit({ ...SIZE, seed: 'bounds', density: 3 })
    const all = [...tracks.flat(), ...pads]
    for (const p of all) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(SIZE.width)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(SIZE.height)
    }
  })

  it('siembra pads en las terminaciones de cada pista', () => {
    const { tracks, pads } = routeCircuit({ ...SIZE, seed: 'pads', density: 1 })
    expect(pads.length).toBeGreaterThanOrEqual(tracks.length * 2)
  })

  it('tamaño degenerado no lanza y devuelve trazado vacío', () => {
    const empty = routeCircuit({ width: 0, height: 0, seed: 'x', density: 1 })
    expect(empty.tracks).toEqual([])
    expect(empty.pads).toEqual([])
  })
})
