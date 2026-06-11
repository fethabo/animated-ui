// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { MouseParallax } from './index'

describe('MouseParallax en SSR (sin document)', () => {
  it('renderiza sin errores con sus capas en posición original', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(
      createElement(
        MouseParallax,
        null,
        createElement(MouseParallax.Layer, { depth: 30 }, 'fondo'),
        createElement(MouseParallax.Layer, { depth: -15 }, 'frente'),
      ),
    )
    expect(html).toContain('fondo')
    expect(html).toContain('frente')
    expect(html.match(/aui-parallax-layer/g)).toHaveLength(2)
  })

  it('materializa depth y ease como vars inline', () => {
    const html = renderToString(
      createElement(MouseParallax, { ease: 0.5 }, createElement(MouseParallax.Layer, { depth: 30 }, 'x')),
    )
    expect(html).toContain('--aui-parallax-ease:0.5s')
    expect(html).toContain('--aui-parallax-depth:30px')
  })
})
