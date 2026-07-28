import { describe, it, expect } from 'vitest'
import { animatedBackgroundCss } from './styles'

describe('animatedBackgroundCss', () => {
  it('includes the base class and static fallback', () => {
    const css = animatedBackgroundCss()
    expect(css).toContain('.aui-bg')
    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
  })
})
