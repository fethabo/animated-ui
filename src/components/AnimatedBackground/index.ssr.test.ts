// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { AnimatedBackground } from './index'

describe('AnimatedBackground — selección de variante', () => {
  it('aplica la clase de la variante lava al seleccionarla', () => {
    const html = renderToString(createElement(AnimatedBackground, { variant: 'lava' }))
    expect(html).toContain('aui-lava')
  })

  it('la variante lava acepta colores custom como CSS custom properties', () => {
    const html = renderToString(
      createElement(AnimatedBackground, { variant: 'lava', colors: ['#ff6b6b', '#f59e0b'] }),
    )
    expect(html).toContain('--aui-lava-color-1:#ff6b6b')
    expect(html).toContain('--aui-lava-color-2:#f59e0b')
  })

  it('cada variante conocida produce su clase aui-<variant>', () => {
    for (const v of ['aurora', 'mesh', 'noise', 'beam', 'lava'] as const) {
      const html = renderToString(createElement(AnimatedBackground, { variant: v }))
      expect(html).toContain(`aui-${v}`)
    }
  })
})
