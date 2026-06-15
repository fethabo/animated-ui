// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createPrng, int, pick, range } from './prng'

describe('prng en SSR (sin DOM)', () => {
  it('importar y usar no toca el DOM ni aleatoriedad global', () => {
    expect(typeof window).toBe('undefined')
    expect(typeof document).toBe('undefined')
    let rng: ReturnType<typeof createPrng> | undefined
    expect(() => {
      rng = createPrng('ssr')
    }).not.toThrow()
    // Sigue siendo determinista en Node, sin Math.random/Date.now.
    const a = createPrng('ssr')
    expect(rng?.()).toBe(a())
    expect(() => {
      range(a, 0, 1)
      int(a, 0, 10)
      pick(a, [1, 2, 3])
    }).not.toThrow()
  })
})
