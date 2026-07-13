// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { StarfieldBackground } from './index'

describe('StarfieldBackground en SSR (sin document)', () => {
  it('renderiza el contenedor y el canvas sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(StarfieldBackground))
    expect(html).toContain('aui-starfield-background')
    expect(html).toContain('<canvas')
  })

  it('materializa paleta y fondo como CSS vars inline en el root', () => {
    const html = renderToString(
      createElement(StarfieldBackground, { colors: ['#fff'], background: '#000010' }),
    )
    expect(html).toContain('--aui-starfield-color-0:#fff')
    expect(html).toContain('--aui-starfield-background:#000010')
  })

  it('con fixed posiciona el root como fixed', () => {
    const html = renderToString(createElement(StarfieldBackground, { fixed: true }))
    expect(html).toContain('position:fixed')
  })

  it('acepta className y props HTML en el root', () => {
    const html = renderToString(
      createElement(StarfieldBackground, { className: 'mi-cielo', id: 'cielo' }),
    )
    expect(html).toContain('aui-starfield-background mi-cielo')
    expect(html).toContain('id="cielo"')
  })
})
