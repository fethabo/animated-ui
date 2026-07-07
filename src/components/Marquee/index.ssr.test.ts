// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { Marquee } from './index'

describe('Marquee en SSR (sin document)', () => {
  it('renderiza la pista con el contenido presente en el markup', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(
      createElement(Marquee, null, createElement('span', null, 'Logo')),
    )
    expect(html).toContain('aui-marquee')
    expect(html).toContain('aui-marquee-track')
    expect(html).toContain('Logo')
  })

  it('duplica el contenido con la copia aria-hidden (lectores lo anuncian una vez)', () => {
    const html = renderToString(
      createElement(Marquee, null, createElement('span', null, 'Item')),
    )
    expect((html.match(/aui-marquee-group/g) ?? []).length).toBe(2)
    expect((html.match(/aria-hidden="true"/g) ?? []).length).toBe(1)
  })

  it('materializa el gap como CSS var inline y marca dirección/pausa/fade', () => {
    const html = renderToString(
      createElement(Marquee, { gap: 48, direction: 'right', pauseOnHover: true, fadeEdges: true }),
    )
    expect(html).toContain('--aui-marquee-gap:48px')
    expect(html).toContain('data-aui-reverse')
    expect(html).toContain('data-aui-pause')
    expect(html).toContain('data-aui-fade')
  })

  it('las direcciones verticales marcan la pista como columna', () => {
    const html = renderToString(createElement(Marquee, { direction: 'up' }))
    expect(html).toContain('data-aui-vertical')
  })

  it('acepta className y props HTML en el root', () => {
    const html = renderToString(createElement(Marquee, { className: 'mi-cinta', id: 'cinta' }))
    expect(html).toContain('aui-marquee mi-cinta')
    expect(html).toContain('id="cinta"')
  })
})
