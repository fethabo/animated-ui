import { describe, it, expect } from 'vitest'
import { glitchTextCss } from './styles'

describe('glitchTextCss', () => {
  it('includes the base class and variables with fallbacks', () => {
    const css = glitchTextCss()
    expect(css).toContain('.aui-glitch')
    expect(css).toContain('--aui-glitch-color-1, #ff004d')
    expect(css).toContain('--aui-glitch-color-2, #00fff9')
    expect(css).toContain('--aui-glitch-intensity, 3px')
  })
})
