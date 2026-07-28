import { describe, expect, it } from 'vitest'
import { registerAnimatedBackground } from './index'
import { styleId } from '../../utils/inject-styles'

describe('registerAnimatedBackground', () => {
  it('se inyecta una sola vez aunque se llame múltiples veces con misma variante', () => {
    registerAnimatedBackground('aurora')
    registerAnimatedBackground('aurora')
    const baseTags = document.querySelectorAll(`#${styleId('animated-background')}`)
    const variantTags = document.querySelectorAll(`#${styleId('animated-background-aurora')}`)
    expect(baseTags).toHaveLength(1)
    expect(variantTags).toHaveLength(1)
  })
})
