// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { BorderBeam } from './index'

describe('BorderBeam en SSR (sin document)', () => {
  it('renderiza el contenedor, la capa del cometa y los children sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(
      createElement(BorderBeam, null, createElement('button', null, 'Acción')),
    )
    expect(html).toContain('aui-border-beam')
    expect(html).toContain('aui-border-beam-comet')
    expect(html).toContain('<button')
    expect(html).toContain('Acción')
  })

  it('materializa los parámetros como CSS vars inline en el root', () => {
    const html = renderToString(
      createElement(BorderBeam, {
        colorFrom: '#f59e0b',
        colorTo: '#ef4444',
        size: 120,
        duration: 8,
        delay: 2,
        borderWidth: 3,
      }),
    )
    expect(html).toContain('--aui-beam-color-from:#f59e0b')
    expect(html).toContain('--aui-beam-color-to:#ef4444')
    expect(html).toContain('--aui-beam-size:120px')
    expect(html).toContain('--aui-beam-duration:8s')
    expect(html).toContain('--aui-beam-delay:2s')
    expect(html).toContain('--aui-beam-border-width:3px')
  })

  it('la capa del cometa está oculta para tecnologías asistivas', () => {
    const html = renderToString(createElement(BorderBeam))
    expect(html).toContain('aria-hidden="true"')
  })

  it('acepta className y props HTML en el root', () => {
    const html = renderToString(createElement(BorderBeam, { className: 'mi-card', id: 'card' }))
    expect(html).toContain('aui-border-beam mi-card')
    expect(html).toContain('id="card"')
  })
})
