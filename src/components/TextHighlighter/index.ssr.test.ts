// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { TextHighlighter } from './index'

describe('TextHighlighter en SSR (sin document)', () => {
  it('renderiza el texto presente y visible en el markup, sin SVG', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(
      createElement(TextHighlighter, { children: 'palabra clave' }),
    )
    expect(html).toContain('aui-highlighter')
    expect(html).toContain('palabra clave')
    // El overlay se genera recién con el tamaño medido en el cliente.
    expect(html).not.toContain('<svg')
  })

  it('materializa las props estéticas como CSS vars inline', () => {
    const html = renderToString(
      createElement(TextHighlighter, {
        children: 'hola',
        color: '#f59e0b',
        duration: 1.2,
        strokeWidth: 4,
      }),
    )
    expect(html).toContain('--aui-highlighter-color:#f59e0b')
    expect(html).toContain('--aui-highlighter-duration:1.2s')
    expect(html).toContain('--aui-highlighter-stroke-width:4')
  })

  it('acepta el spread de props HTML del span root', () => {
    const html = renderToString(
      createElement(TextHighlighter, {
        children: 'hola',
        id: 'destacado',
        'data-testid': 'hl',
      } as Parameters<typeof TextHighlighter>[0]),
    )
    expect(html).toContain('id="destacado"')
    expect(html).toContain('data-testid="hl"')
  })
})
