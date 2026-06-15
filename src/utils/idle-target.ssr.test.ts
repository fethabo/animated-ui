// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { resolveTargetElement, vectorTo } from './idle-target'

describe('idle-target en SSR (sin DOM)', () => {
  it('resolveTargetElement con selector no lanza sin document', () => {
    expect(typeof document).toBe('undefined')
    expect(() => resolveTargetElement('#cta')).not.toThrow()
    expect(resolveTargetElement('#cta')).toBeNull()
  })

  it('la geometría pura sigue funcionando en Node', () => {
    const v = vectorTo({ x: 0, y: 0 }, { left: 10, top: 0, width: 0, height: 0 })
    expect(v.dx).toBe(10)
  })
})
