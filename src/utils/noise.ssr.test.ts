// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createNoise2D, fbm } from './noise'

describe('noise en SSR (sin document)', () => {
  it('importa y evalúa sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    expect(typeof window).toBe('undefined')
    const noise = createNoise2D('ssr-seed')
    const v = noise(1.5, 2.5)
    expect(v).toBeGreaterThanOrEqual(-1)
    expect(v).toBeLessThanOrEqual(1)
    const fractal = fbm(noise, 3)
    expect(fractal(0.4, 0.9)).toBeTypeOf('number')
  })

  it('es determinista también en node (estable SSR↔hidratación)', () => {
    const a = createNoise2D('iso')
    const b = createNoise2D('iso')
    expect(a(12.3, 4.56)).toBe(b(12.3, 4.56))
  })
})
