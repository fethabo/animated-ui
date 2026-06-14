import { describe, expect, it } from 'vitest'
import { computeLinks, type LinkPoint } from './links'

describe('computeLinks', () => {
  it('conecta pares dentro de linkDistance', () => {
    const ps: LinkPoint[] = [
      { x: 0, y: 0 },
      { x: 30, y: 0 },
    ]
    const segs = computeLinks(ps, { linkDistance: 50 })
    expect(segs).toHaveLength(1)
    expect(segs[0]).toMatchObject({ x1: 0, y1: 0, x2: 30, y2: 0 })
  })

  it('no conecta pares fuera de linkDistance', () => {
    const ps: LinkPoint[] = [
      { x: 0, y: 0 },
      { x: 200, y: 0 },
    ]
    expect(computeLinks(ps, { linkDistance: 50 })).toHaveLength(0)
  })

  it('no conecta exactamente en el límite (distancia === linkDistance)', () => {
    const ps: LinkPoint[] = [
      { x: 0, y: 0 },
      { x: 50, y: 0 },
    ]
    expect(computeLinks(ps, { linkDistance: 50 })).toHaveLength(0)
  })

  it('la opacidad es proporcional a la cercanía (más cerca = más opaco)', () => {
    const near = computeLinks(
      [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
      ],
      { linkDistance: 100 },
    )
    const far = computeLinks(
      [
        { x: 0, y: 0 },
        { x: 90, y: 0 },
      ],
      { linkDistance: 100 },
    )
    expect(near[0].opacity).toBeCloseTo(0.9)
    expect(far[0].opacity).toBeCloseTo(0.1)
    expect(near[0].opacity).toBeGreaterThan(far[0].opacity)
  })

  it('cada par aparece una sola vez (no duplica i-j y j-i)', () => {
    const ps: LinkPoint[] = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 20, y: 0 },
    ]
    // 3 puntos colineales cercanos: pares (0,1),(0,2),(1,2) = 3 segmentos.
    expect(computeLinks(ps, { linkDistance: 100 })).toHaveLength(3)
  })

  it('incluye líneas al cursor cuando está dentro de linkDistance', () => {
    const ps: LinkPoint[] = [{ x: 0, y: 0 }]
    const segs = computeLinks(ps, { linkDistance: 50, cursor: { x: 20, y: 0 } })
    expect(segs).toHaveLength(1)
    expect(segs[0]).toMatchObject({ x1: 0, y1: 0, x2: 20, y2: 0 })
    expect(segs[0].opacity).toBeCloseTo(0.6)
  })

  it('no conecta al cursor si está fuera de linkDistance', () => {
    const ps: LinkPoint[] = [{ x: 0, y: 0 }]
    expect(computeLinks(ps, { linkDistance: 50, cursor: { x: 200, y: 0 } })).toHaveLength(0)
  })

  it('sin cursor no agrega segmentos de cursor', () => {
    const ps: LinkPoint[] = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
    ]
    expect(computeLinks(ps, { linkDistance: 50, cursor: null })).toHaveLength(1)
  })

  it('linkDistance no positiva no produce segmentos', () => {
    const ps: LinkPoint[] = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ]
    expect(computeLinks(ps, { linkDistance: 0 })).toHaveLength(0)
  })
})
