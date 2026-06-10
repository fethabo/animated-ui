// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { injectStyles } from './inject-styles'

describe('injectStyles en SSR (sin document)', () => {
  it('no lanza errores cuando document no existe', () => {
    expect(typeof document).toBe('undefined')
    expect(() => injectStyles('aui-ssr-styles', '.x {}')).not.toThrow()
  })
})
