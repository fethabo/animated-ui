import { describe, expect, it } from 'vitest'
import {
  advanceImageEmitter,
  createImageEmitterState,
  resetImageEmitter,
} from './emitter'

const opts = (overrides: Partial<Parameters<typeof advanceImageEmitter>[3]> = {}) => ({
  emitEvery: 10,
  imageCount: 3,
  liveCount: 0,
  maxConcurrent: 5,
  ...overrides,
})

describe('advanceImageEmitter: umbral de distancia', () => {
  it('la primera muestra solo ancla, sin emitir', () => {
    const state = createImageEmitterState()
    expect(advanceImageEmitter(state, 50, 50, opts())).toBeNull()
  })

  it('no emite mientras el recorrido acumulado no supera el umbral', () => {
    const state = createImageEmitterState()
    advanceImageEmitter(state, 0, 0, opts())
    expect(advanceImageEmitter(state, 4, 0, opts())).toBeNull()
    expect(advanceImageEmitter(state, 8, 0, opts())).toBeNull()
  })

  it('emite en el punto actual al cruzar el umbral y reinicia el acumulado', () => {
    const state = createImageEmitterState()
    advanceImageEmitter(state, 0, 0, opts())
    const emission = advanceImageEmitter(state, 12, 0, opts())
    expect(emission).toEqual({ x: 12, y: 0, index: 0 })
    expect(state.traveled).toBe(0)
  })

  it('resetImageEmitter olvida la última muestra pero conserva la rotación', () => {
    const state = createImageEmitterState()
    advanceImageEmitter(state, 0, 0, opts())
    advanceImageEmitter(state, 20, 0, opts())
    resetImageEmitter(state)
    expect(advanceImageEmitter(state, 100, 100, opts())).toBeNull()
    advanceImageEmitter(state, 120, 100, opts())
    expect(state.nextIndex).toBe(2)
  })
})

describe('advanceImageEmitter: rotación cíclica del pool', () => {
  it('rota las imágenes en orden y reinicia desde la primera', () => {
    const state = createImageEmitterState()
    advanceImageEmitter(state, 0, 0, opts())
    const indices: number[] = []
    for (let i = 1; i <= 5; i++) {
      const emission = advanceImageEmitter(state, i * 20, 0, opts())
      if (emission) indices.push(emission.index)
    }
    expect(indices).toEqual([0, 1, 2, 0, 1])
  })

  it('con pool vacío nunca emite', () => {
    const state = createImageEmitterState()
    advanceImageEmitter(state, 0, 0, opts({ imageCount: 0 }))
    expect(advanceImageEmitter(state, 100, 0, opts({ imageCount: 0 }))).toBeNull()
  })
})

describe('advanceImageEmitter: cap de concurrencia', () => {
  it('al alcanzar maxConcurrent no emite', () => {
    const state = createImageEmitterState()
    advanceImageEmitter(state, 0, 0, opts())
    expect(advanceImageEmitter(state, 50, 0, opts({ liveCount: 5 }))).toBeNull()
  })

  it('al liberarse un nodo la emisión se reanuda sin exigir más recorrido', () => {
    const state = createImageEmitterState()
    advanceImageEmitter(state, 0, 0, opts())
    advanceImageEmitter(state, 50, 0, opts({ liveCount: 5 }))
    const emission = advanceImageEmitter(state, 51, 0, opts({ liveCount: 4 }))
    expect(emission).not.toBeNull()
    expect(emission!.index).toBe(0)
  })
})
