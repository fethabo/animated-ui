// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { ParticleField } from './index'

describe('ParticleField en SSR (sin document)', () => {
  it('renderiza el contenedor y el canvas sin acceder al canvas context', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(ParticleField, { count: 40 }))
    expect(html).toContain('aui-particle-field')
    expect(html).toContain('<canvas')
  })

  it('materializa color y radio como CSS vars inline en el root', () => {
    const html = renderToString(createElement(ParticleField, { color: '#22d3ee', radius: 3 }))
    expect(html).toContain('--aui-particle-color:#22d3ee')
    expect(html).toContain('--aui-particle-radius:3px')
  })
})
