import { describe, expect, it } from 'vitest'
import { registerGlitchText } from './index'
import { styleId } from '../../utils/inject-styles'

describe('registerGlitchText', () => {
  it('se inyecta una sola vez aunque se llame múltiples veces con misma cadencia', () => {
    registerGlitchText({ frequency: 2, burstDuration: 0.3 })
    registerGlitchText({ frequency: 2, burstDuration: 0.3 })
    const baseTags = document.querySelectorAll(`#${styleId('glitch-text')}`)
    const configTags = document.querySelectorAll(`#${styleId('glitch-text-f2-b10')}`)
    expect(baseTags).toHaveLength(1)
    expect(configTags).toHaveLength(1)
  })
})
