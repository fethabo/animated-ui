import { describe, expect, it } from 'vitest'
import { registerShinyText } from '../components/ShinyText'
import { registerBorderBeam } from '../components/BorderBeam'
import { registerAnimatedBackground } from '../components/AnimatedBackground'
import { registerGlitchText } from '../components/GlitchText'

describe('Registration functions SSR safety', () => {
  it('no lanzan error al ejecutarse sin DOM', () => {
    expect(() => registerShinyText()).not.toThrow()
    expect(() => registerBorderBeam()).not.toThrow()
    expect(() => registerAnimatedBackground()).not.toThrow()
    expect(() => registerGlitchText()).not.toThrow()
  })
})
