// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { subscribeScroll } from './scroll-driver'

describe('subscribeScroll en SSR (sin window)', () => {
  it('no lanza errores y retorna un cleanup no-op', () => {
    expect(typeof window).toBe('undefined')
    let cleanup: (() => void) | undefined
    expect(() => {
      cleanup = subscribeScroll(() => {})
    }).not.toThrow()
    expect(() => cleanup?.()).not.toThrow()
  })
})
