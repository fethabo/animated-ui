// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { CustomCursor } from './index'

describe('CustomCursor en SSR (sin document)', () => {
  it('renderiza el contenedor y los children sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(CustomCursor, null, 'contenido'))
    expect(html).toContain('aui-custom-cursor')
    expect(html).toContain('contenido')
  })

  it('no monta los nodos del cursor custom antes de detectar el dispositivo', () => {
    const html = renderToString(createElement(CustomCursor, null, 'contenido'))
    expect(html).not.toContain('aui-custom-cursor-dot')
    expect(html).not.toContain('aui-custom-cursor-ring')
    expect(html).not.toContain('data-aui-cursor-native-hidden')
    expect(html).toContain('data-aui-cursor-state="idle"')
  })

  it('materializa la customización como CSS vars inline en el root', () => {
    const html = renderToString(
      createElement(CustomCursor, { color: '#f0abfc', dotSize: 10, hoverScale: 2 }),
    )
    expect(html).toContain('--aui-cursor-color:#f0abfc')
    expect(html).toContain('--aui-cursor-dot-size:10px')
    expect(html).toContain('--aui-cursor-hover-scale:2')
  })

  it('acepta className y props HTML en el root', () => {
    const html = renderToString(
      createElement(CustomCursor, { className: 'mi-cursor', id: 'cursor' }),
    )
    expect(html).toContain('aui-custom-cursor mi-cursor')
    expect(html).toContain('id="cursor"')
  })
})
