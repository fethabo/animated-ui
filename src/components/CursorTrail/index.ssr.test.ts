// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { CursorTrail } from './index'

describe('CursorTrail en SSR (sin document)', () => {
  it('renderiza el contenedor, los children y el canvas sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(CursorTrail, null, 'contenido'))
    expect(html).toContain('aui-cursor-trail')
    expect(html).toContain('contenido')
    expect(html).toContain('<canvas')
  })

  it('materializa color y tamaño como CSS vars inline en el root', () => {
    const html = renderToString(createElement(CursorTrail, { color: '#22d3ee', size: 12 }))
    expect(html).toContain('--aui-cursor-trail-color:#22d3ee')
    expect(html).toContain('--aui-cursor-trail-size:12px')
  })

  it('acepta className y props HTML en el root', () => {
    const html = renderToString(
      createElement(CursorTrail, { className: 'mi-trail', id: 'trail' }),
    )
    expect(html).toContain('aui-cursor-trail mi-trail')
    expect(html).toContain('id="trail"')
  })
})
