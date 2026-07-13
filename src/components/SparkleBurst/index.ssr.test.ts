// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { SparkleBurst } from './index'

describe('SparkleBurst en SSR (sin document)', () => {
  it('renderiza el overlay y el canvas sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(SparkleBurst))
    expect(html).toContain('aui-sparkle-burst')
    expect(html).toContain('<canvas')
  })

  it('materializa la paleta como CSS vars inline en el root', () => {
    const html = renderToString(
      createElement(SparkleBurst, { colors: ['#fde047', '#ffffff'] }),
    )
    expect(html).toContain('--aui-sparkle-color-0:#fde047')
    expect(html).toContain('--aui-sparkle-color-1:#ffffff')
  })

  it('acepta className y props HTML en el root', () => {
    const html = renderToString(
      createElement(SparkleBurst, { className: 'mi-clase', id: 'sparkles' }),
    )
    expect(html).toContain('aui-sparkle-burst mi-clase')
    expect(html).toContain('id="sparkles"')
  })
})
