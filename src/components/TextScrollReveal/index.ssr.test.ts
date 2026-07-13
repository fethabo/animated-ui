// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { TextScrollReveal } from './index'

describe('TextScrollReveal en SSR (sin document)', () => {
  it('renderiza sin errores y el markup contiene el texto completo', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(TextScrollReveal, null, 'Hola mundo scrolleado'))
    expect(html).toContain('Hola')
    expect(html).toContain('mundo')
    expect(html).toContain('scrolleado')
    expect(html).toContain('aria-label="Hola mundo scrolleado"')
  })

  it('parte por palabra con unidades aria-hidden y sin duplicar espacios', () => {
    const html = renderToString(createElement(TextScrollReveal, null, 'uno dos tres'))
    expect(html.match(/aui-text-scroll-word/g)).toHaveLength(3)
    expect(html.match(/aui-text-scroll-space/g)).toHaveLength(2)
  })

  it('renderiza el elemento indicado por `as` (default p)', () => {
    expect(renderToString(createElement(TextScrollReveal, { children: 'texto' }))).toMatch(/^<p/)
    expect(renderToString(createElement(TextScrollReveal, { children: 'texto', as: 'h2' }))).toMatch(
      /^<h2/,
    )
  })

  it('materializa las props estéticas como CSS custom properties --aui-text-scroll-*', () => {
    const html = renderToString(
      createElement(TextScrollReveal, {
        children: 'a b',
        fromOpacity: 0.3,
        toOpacity: 0.9,
        fromColor: '#333',
        toColor: '#fff',
      }),
    )
    expect(html).toContain('--aui-text-scroll-from-opacity:0.3')
    expect(html).toContain('--aui-text-scroll-to-opacity:0.9')
    expect(html).toContain('--aui-text-scroll-from-color:#333')
    expect(html).toContain('--aui-text-scroll-to-color:#fff')
    expect(html).toContain('--aui-text-scroll-n:2')
    expect(html).toContain('data-aui-colored')
  })

  it('sin colores no marca data-aui-colored (el texto hereda currentColor)', () => {
    const html = renderToString(createElement(TextScrollReveal, null, 'a b'))
    expect(html).not.toContain('data-aui-colored')
  })

  it('acepta className y style del consumer', () => {
    const html = renderToString(
      createElement(TextScrollReveal, {
        children: 'x',
        className: 'mi-parrafo',
        style: { maxWidth: 600 },
      }),
    )
    expect(html).toContain('aui-text-scroll mi-parrafo')
    expect(html).toContain('max-width:600px')
  })
})
