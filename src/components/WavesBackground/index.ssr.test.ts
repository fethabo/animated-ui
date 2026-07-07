// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { WavesBackground } from './index'

describe('WavesBackground en SSR (sin document)', () => {
  it('renderiza el contenedor y el canvas sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(WavesBackground))
    expect(html).toContain('aui-waves-background')
    expect(html).toContain('<canvas')
  })

  it('materializa la paleta y el grosor como CSS vars inline en el root', () => {
    const html = renderToString(
      createElement(WavesBackground, { colors: ['#22d3ee', '#a78bfa'], lineWidth: 2 }),
    )
    expect(html).toContain('--aui-waves-color-0:#22d3ee')
    expect(html).toContain('--aui-waves-color-1:#a78bfa')
    expect(html).toContain('--aui-waves-line-width:2px')
  })

  it('acepta className y props HTML en el root', () => {
    const html = renderToString(
      createElement(WavesBackground, { className: 'mi-fondo', id: 'waves' }),
    )
    expect(html).toContain('aui-waves-background mi-fondo')
    expect(html).toContain('id="waves"')
  })
})
