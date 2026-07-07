// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { FlowField } from './index'

describe('FlowField en SSR (sin document)', () => {
  it('renderiza el contenedor y el canvas sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(FlowField))
    expect(html).toContain('aui-flow-field')
    expect(html).toContain('<canvas')
  })

  it('materializa paleta y fondo como CSS vars inline en el root', () => {
    const html = renderToString(
      createElement(FlowField, { colors: ['#22d3ee'], background: '#111827' }),
    )
    expect(html).toContain('--aui-flow-color-0:#22d3ee')
    expect(html).toContain('--aui-flow-background:#111827')
  })

  it('acepta className y props HTML en el root', () => {
    const html = renderToString(createElement(FlowField, { className: 'mi-flow', id: 'flow' }))
    expect(html).toContain('aui-flow-field mi-flow')
    expect(html).toContain('id="flow"')
  })
})
