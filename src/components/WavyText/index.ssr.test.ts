// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { WavyText } from './index'

describe('WavyText en SSR (sin document)', () => {
  it('renderiza todos los caracteres y el aria-label completo', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(WavyText, null, 'Hola mar'))
    expect(html).toContain('aui-wavy')
    expect(html).toContain('aria-label="Hola mar"')
    for (const ch of ['H', 'o', 'l', 'a', 'm', 'r']) expect(html).toContain(`>${ch}</span>`)
  })

  it('preserva los espacios como unidades no animadas (white-space: pre)', () => {
    const html = renderToString(createElement(WavyText, null, 'a  b'))
    // Cada espacio es una unidad propia con white-space: pre — ninguno colapsa.
    expect((html.match(/aui-wavy-space/g) ?? []).length).toBe(2)
    expect((html.match(/> <\/span>/g) ?? []).length).toBe(2)
  })

  it('setea el índice de stagger inline por carácter animado (sin contar espacios)', () => {
    const html = renderToString(createElement(WavyText, null, 'ab c'))
    expect(html).toContain('--aui-wavy-i:0')
    expect(html).toContain('--aui-wavy-i:1')
    expect(html).toContain('--aui-wavy-i:2')
    expect(html).not.toContain('--aui-wavy-i:3')
  })

  it('los caracteres son aria-hidden (el texto se anuncia una vez via aria-label)', () => {
    const html = renderToString(createElement(WavyText, null, 'ab'))
    expect((html.match(/aria-hidden="true"/g) ?? []).length).toBe(2)
  })

  it('materializa amplitude/speed/stagger como CSS vars y respeta as', () => {
    const html = renderToString(
      createElement(WavyText, { as: 'h2', amplitude: 4, speed: 3, stagger: 0.1, children: 'Ola' }),
    )
    expect(html).toContain('<h2')
    expect(html).toContain('--aui-wavy-amplitude:4px')
    expect(html).toContain('--aui-wavy-speed:3s')
    expect(html).toContain('--aui-wavy-stagger:0.1s')
  })

  it('acepta className y props HTML en el root', () => {
    const html = renderToString(
      createElement(WavyText, { className: 'mi-texto', id: 'w', children: 'X' }),
    )
    expect(html).toContain('aui-wavy mi-texto')
    expect(html).toContain('id="w"')
  })
})
