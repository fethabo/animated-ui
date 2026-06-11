// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { ScrollReveal } from './index'

describe('ScrollReveal en SSR (sin document)', () => {
  it('renderiza sin errores con el contenido presente en el markup', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(
      createElement(ScrollReveal, null, createElement('p', null, 'primero'), createElement('p', null, 'segundo')),
    )
    expect(html).toContain('primero')
    expect(html).toContain('segundo')
  })

  it('envuelve cada hijo directo en un item con su índice de stagger', () => {
    const html = renderToString(
      createElement(ScrollReveal, null, createElement('p', null, 'a'), createElement('p', null, 'b')),
    )
    expect(html.match(/aui-reveal-item/g)).toHaveLength(2)
    expect(html).toContain('--aui-reveal-i:0')
    expect(html).toContain('--aui-reveal-i:1')
  })

  it('parte oculto (sin data-aui-visible) y con la dirección en el root', () => {
    const html = renderToString(createElement(ScrollReveal, { direction: 'left' }, 'contenido'))
    expect(html).toContain('data-aui-dir="left"')
    expect(html).not.toContain('data-aui-visible')
  })

  it('materializa las props visuales como vars inline en el root', () => {
    const html = renderToString(createElement(ScrollReveal, { distance: 40, stagger: 0.3 }, 'x'))
    expect(html).toContain('--aui-reveal-distance:40px')
    expect(html).toContain('--aui-reveal-stagger:0.3s')
  })
})
