import { describe, expect, it } from 'vitest'
import { registerBorderBeam } from './index'
import { styleId } from '../../utils/inject-styles'

describe('registerBorderBeam', () => {
  it('se inyecta una sola vez aunque se llame múltiples veces', () => {
    registerBorderBeam()
    registerBorderBeam()
    const tags = document.querySelectorAll(`#${styleId('border-beam')}`)
    expect(tags).toHaveLength(1)
  })
})
