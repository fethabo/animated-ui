// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { Dock } from './index'

describe('Dock en SSR (sin document)', () => {
  it('renderiza la fila y los ítems a escala base sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(
      createElement(
        Dock,
        null,
        createElement(Dock.Item, null, 'A'),
        createElement(Dock.Item, null, 'B'),
      ),
    )
    expect(html).toContain('aui-dock')
    expect((html.match(/aui-dock-item/g) ?? []).length).toBeGreaterThanOrEqual(2)
  })

  it('materializa gap y retorno como CSS vars inline en el root', () => {
    const html = renderToString(createElement(Dock, { gap: 16, returnDuration: 0.4 }))
    expect(html).toContain('--aui-dock-gap:16px')
    expect(html).toContain('--aui-dock-return:0.4s')
  })

  it('marca la orientación vertical en el root', () => {
    const html = renderToString(createElement(Dock, { orientation: 'vertical' }))
    expect(html).toContain('data-aui-orientation="vertical"')
  })

  it('acepta className y props HTML en Dock y Dock.Item', () => {
    const html = renderToString(
      createElement(
        Dock,
        { className: 'mi-dock', id: 'dock' },
        createElement(Dock.Item, { className: 'mi-item' }, 'A'),
      ),
    )
    expect(html).toContain('aui-dock mi-dock')
    expect(html).toContain('id="dock"')
    expect(html).toContain('aui-dock-item mi-item')
  })
})
