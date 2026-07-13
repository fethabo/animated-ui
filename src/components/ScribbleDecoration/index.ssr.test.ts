// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { ScribbleDecoration } from './index'

describe('ScribbleDecoration en SSR (sin document)', () => {
  it('renderiza el contenedor sin acceder al DOM ni emitir SVG', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(ScribbleDecoration, { shape: 'arrow' }))
    expect(html).toContain('aui-scribble')
    // El garabato se genera recién con el tamaño medido en el cliente.
    expect(html).not.toContain('<svg')
  })

  it('materializa las props estéticas como CSS vars inline', () => {
    const html = renderToString(
      createElement(ScribbleDecoration, { color: '#e11d48', strokeWidth: 5, duration: 1.4 }),
    )
    expect(html).toContain('--aui-scribble-color:#e11d48')
    expect(html).toContain('--aui-scribble-stroke-width:5')
    expect(html).toContain('--aui-scribble-duration:1.4s')
  })

  it('acepta shapes custom por función sin ejecutarlas en el servidor', () => {
    let called = false
    const custom = () => {
      called = true
      return 'M 0 0 L 10 10'
    }
    const html = renderToString(createElement(ScribbleDecoration, { shape: custom }))
    expect(html).toContain('aui-scribble')
    expect(called).toBe(false)
  })
})
