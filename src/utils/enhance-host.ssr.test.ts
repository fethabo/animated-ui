// @vitest-environment node
import { describe, expect, it } from 'vitest'

describe('enhance-host en SSR (sin document)', () => {
  it('el módulo importa sin acceder al DOM', async () => {
    expect(typeof document).toBe('undefined')
    const mod = await import('./enhance-host')
    expect(typeof mod.enhanceHost).toBe('function')
    expect(typeof mod.createLayer).toBe('function')
  })
})
