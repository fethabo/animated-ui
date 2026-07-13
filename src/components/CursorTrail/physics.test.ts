import { describe, expect, it } from 'vitest'
import {
  advanceEmitter,
  ageLinePoints,
  createEmitterState,
  lineSegments,
  resetEmitter,
  spawnParticle,
  stepTrailParticles,
  type LinePoint,
  type TrailParticle,
} from './physics'

const spawn = (life = 1): TrailParticle =>
  spawnParticle({ x: 10, y: 10, size: 6, life, colors: ['#fff'], random: () => 0.5 })

describe('advanceEmitter: throttle por distancia', () => {
  it('la primera muestra solo ancla el emisor, sin emitir', () => {
    const state = createEmitterState()
    expect(advanceEmitter(state, 50, 50, 10)).toEqual([])
    expect(state.last).toEqual({ x: 50, y: 50 })
  })

  it('no emite mientras el recorrido acumulado no supera el umbral', () => {
    const state = createEmitterState()
    advanceEmitter(state, 0, 0, 10)
    expect(advanceEmitter(state, 4, 0, 10)).toEqual([])
    expect(advanceEmitter(state, 8, 0, 10)).toEqual([])
  })

  it('acumula entre muestras y emite al cruzar el umbral', () => {
    const state = createEmitterState()
    advanceEmitter(state, 0, 0, 10)
    advanceEmitter(state, 6, 0, 10)
    const points = advanceEmitter(state, 12, 0, 10)
    expect(points).toHaveLength(1)
    expect(points[0]).toEqual({ x: 10, y: 0 })
  })

  it('un movimiento largo emite varios puntos interpolados equiespaciados', () => {
    const state = createEmitterState()
    advanceEmitter(state, 0, 0, 10)
    const points = advanceEmitter(state, 35, 0, 10)
    expect(points.map((p) => p.x)).toEqual([10, 20, 30])
    expect(state.traveled).toBeCloseTo(5)
  })

  it('resetEmitter vuelve al estado inicial (reingreso sin conectar tramos)', () => {
    const state = createEmitterState()
    advanceEmitter(state, 0, 0, 10)
    advanceEmitter(state, 8, 0, 10)
    resetEmitter(state)
    expect(state.last).toBeNull()
    expect(advanceEmitter(state, 100, 100, 10)).toEqual([])
  })
})

describe('stepTrailParticles: vida y culling', () => {
  it('integra la deriva y decae la vida', () => {
    const p = spawn(1)
    const particles = [p]
    stepTrailParticles(particles, 0.25)
    expect(p.life).toBeCloseTo(0.75)
    expect(particles).toHaveLength(1)
  })

  it('descarta en su lugar las partículas con vida agotada', () => {
    const particles = [spawn(0.1), spawn(1), spawn(0.05)]
    stepTrailParticles(particles, 0.2)
    expect(particles).toHaveLength(1)
    expect(particles[0].life).toBeCloseTo(0.8)
  })

  it('spawnParticle toma color de la paleta y radio con jitter acotado', () => {
    const p = spawnParticle({
      x: 0,
      y: 0,
      size: 8,
      life: 1,
      colors: ['#111', '#222'],
      random: () => 0.99,
    })
    expect(['#111', '#222']).toContain(p.color)
    expect(p.radius).toBeGreaterThan(0)
    expect(p.radius).toBeLessThanOrEqual(4)
  })
})

describe('modo line: envejecimiento y geometría', () => {
  const freshPoints = (): LinePoint[] => [
    { x: 0, y: 0, age: 0 },
    { x: 10, y: 0, age: 0 },
    { x: 20, y: 0, age: 0 },
    { x: 30, y: 0, age: 0 },
  ]

  it('ageLinePoints envejece y descarta los puntos que superan maxAge', () => {
    const points: LinePoint[] = [
      { x: 0, y: 0, age: 0.45 },
      { x: 10, y: 0, age: 0.1 },
    ]
    ageLinePoints(points, 0.1, 0.5)
    expect(points).toHaveLength(1)
    expect(points[0].age).toBeCloseTo(0.2)
  })

  it('lineSegments produce grosor y alpha decrecientes hacia la cola', () => {
    const segments = lineSegments(freshPoints(), 6, 0.5)
    expect(segments).toHaveLength(3)
    for (let i = 0; i < segments.length - 1; i++) {
      expect(segments[i].width).toBeLessThan(segments[i + 1].width)
      expect(segments[i].alpha).toBeLessThan(segments[i + 1].alpha)
    }
  })

  it('la edad desvanece los segmentos (freshness multiplicativo)', () => {
    const fresh = lineSegments(freshPoints(), 6, 0.5)
    const aged = freshPoints().map((p) => ({ ...p, age: 0.25 }))
    const faded = lineSegments(aged, 6, 0.5)
    expect(faded[2].alpha).toBeLessThan(fresh[2].alpha)
  })

  it('con menos de dos puntos no hay segmentos', () => {
    expect(lineSegments([{ x: 0, y: 0, age: 0 }], 6, 0.5)).toEqual([])
    expect(lineSegments([], 6, 0.5)).toEqual([])
  })
})
