// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { GlitchText } from './index'

describe('GlitchText en SSR (sin document)', () => {
  it('renderiza el texto con data-text para las capas pseudo-elemento', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(GlitchText, null, 'ERROR 404'))
    expect(html).toContain('aui-glitch')
    expect(html).toContain('ERROR 404')
    expect(html).toContain('data-text="ERROR 404"')
  })

  it('el texto aparece una sola vez en el markup (las capas viven en CSS)', () => {
    const html = renderToString(createElement(GlitchText, null, 'GLITCH'))
    expect((html.match(/GLITCH/g) ?? []).length).toBe(2) // data-text + contenido
  })

  it('respeta la prop as y materializa las CSS vars inline', () => {
    const html = renderToString(
      createElement(GlitchText, { as: 'h1', colors: ['#f0f', '#0ff'], intensity: 6, children: 'Titular' }),
    )
    expect(html).toContain('<h1')
    expect(html).toContain('--aui-glitch-color-1:#f0f')
    expect(html).toContain('--aui-glitch-color-2:#0ff')
    expect(html).toContain('--aui-glitch-intensity:6px')
  })

  it('marca el trigger y acepta className/props HTML', () => {
    const html = renderToString(
      createElement(GlitchText, { trigger: 'hover', className: 'mi-titulo', id: 'g', children: 'X' }),
    )
    expect(html).toContain('data-aui-trigger="hover"')
    expect(html).toContain('aui-glitch mi-titulo')
    expect(html).toContain('id="g"')
  })
})
