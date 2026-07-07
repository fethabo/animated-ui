// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { TopographicBackground } from './index'

describe('TopographicBackground en SSR (sin document)', () => {
  it('renderiza el contenedor y el canvas sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(TopographicBackground))
    expect(html).toContain('aui-topographic-background')
    expect(html).toContain('<canvas')
  })

  it('materializa color y grosor como CSS vars inline en el root', () => {
    const html = renderToString(
      createElement(TopographicBackground, { color: '#94a3b8', lineWidth: 2 }),
    )
    expect(html).toContain('--aui-topo-color:#94a3b8')
    expect(html).toContain('--aui-topo-line-width:2px')
  })

  it('acepta className y props HTML en el root', () => {
    const html = renderToString(
      createElement(TopographicBackground, { className: 'mi-topo', id: 'topo' }),
    )
    expect(html).toContain('aui-topographic-background mi-topo')
    expect(html).toContain('id="topo"')
  })
})
