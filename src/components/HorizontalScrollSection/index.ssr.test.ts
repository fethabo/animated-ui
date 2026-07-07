// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { HorizontalScrollSection } from './index'

describe('HorizontalScrollSection en SSR (sin document)', () => {
  it('renderiza la sección con todos los paneles en el markup', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(
      createElement(
        HorizontalScrollSection,
        null,
        createElement('section', null, 'Panel 1'),
        createElement('section', null, 'Panel 2'),
        createElement('section', null, 'Panel 3'),
      ),
    )
    expect(html).toContain('aui-hscroll')
    expect(html).toContain('aui-hscroll-inner')
    expect(html).toContain('aui-hscroll-row')
    expect(html).toContain('Panel 1')
    expect(html).toContain('Panel 2')
    expect(html).toContain('Panel 3')
  })

  it('expone las CSS vars de progreso y recorrido en el root', () => {
    const html = renderToString(createElement(HorizontalScrollSection))
    expect(html).toContain('--aui-hscroll-progress:0')
    expect(html).toContain('--aui-hscroll-travel:0px')
  })

  it('acepta className y props HTML en el root', () => {
    const html = renderToString(
      createElement(HorizontalScrollSection, { className: 'mi-seccion', id: 'hs' }),
    )
    expect(html).toContain('aui-hscroll mi-seccion')
    expect(html).toContain('id="hs"')
  })
})
