// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { ClickSpark } from './index'

describe('ClickSpark en SSR (sin document)', () => {
  it('renderiza el wrapper, los children y el canvas sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(
      createElement(ClickSpark, null, createElement('button', null, 'Click')),
    )
    expect(html).toContain('aui-click-spark')
    expect(html).toContain('<button>Click</button>')
    expect(html).toContain('<canvas')
  })

  it('materializa la paleta como CSS vars inline en el root', () => {
    const html = renderToString(
      createElement(ClickSpark, { colors: ['#fbbf24', '#f59e0b'] }),
    )
    expect(html).toContain('--aui-clickspark-color-0:#fbbf24')
    expect(html).toContain('--aui-clickspark-color-1:#f59e0b')
  })

  it('acepta className y props HTML en el root', () => {
    const html = renderToString(
      createElement(ClickSpark, { className: 'mi-clase', id: 'sparky' }),
    )
    expect(html).toContain('aui-click-spark mi-clase')
    expect(html).toContain('id="sparky"')
  })
})
