import { describe, it, expect } from 'vitest'
import { borderBeamCss } from './styles'

describe('borderBeamCss', () => {
  it('includes the base classes and variables with fallbacks', () => {
    const css = borderBeamCss()
    expect(css).toContain('.aui-border-beam')
    expect(css).toContain('.aui-border-beam-layer')
    expect(css).toContain('.aui-border-beam-comet')
    expect(css).toContain('--aui-beam-color-from, #7c3aed')
    expect(css).toContain('--aui-beam-color-to, #0ea5e9')
    expect(css).toContain('--aui-beam-size, 96px')
    expect(css).toContain('--aui-beam-duration, 6s')
    expect(css).toContain('--aui-beam-delay, 0s')
    expect(css).toContain('--aui-beam-border-width, 2px')
  })
})
