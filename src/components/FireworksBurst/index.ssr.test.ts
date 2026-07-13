// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { FireworksBurst } from './index'

describe('FireworksBurst en SSR (sin document)', () => {
  it('renderiza el overlay y el canvas sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(FireworksBurst))
    expect(html).toContain('aui-fireworks-burst')
    expect(html).toContain('<canvas')
  })

  it('materializa la paleta como CSS vars inline en el root', () => {
    const html = renderToString(
      createElement(FireworksBurst, { colors: ['#f43f5e', '#fbbf24'] }),
    )
    expect(html).toContain('--aui-fireworks-color-0:#f43f5e')
    expect(html).toContain('--aui-fireworks-color-1:#fbbf24')
  })

  it('acepta className y props HTML en el root', () => {
    const html = renderToString(
      createElement(FireworksBurst, { className: 'mi-clase', id: 'fuegos' }),
    )
    expect(html).toContain('aui-fireworks-burst mi-clase')
    expect(html).toContain('id="fuegos"')
  })
})
