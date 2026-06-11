// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { ParallaxLayers } from './index'

describe('ParallaxLayers en SSR (sin document)', () => {
  it('renderiza sin errores con las capas en posición original', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(
      createElement(
        ParallaxLayers,
        null,
        createElement(ParallaxLayers.Layer, { depth: 60 }, 'fondo'),
        createElement(ParallaxLayers.Layer, { depth: -20 }, 'frente'),
      ),
    )
    expect(html).toContain('fondo')
    expect(html).toContain('frente')
    expect(html.match(/aui-parallax-scroll-layer/g)).toHaveLength(2)
  })

  it('materializa depth como var inline por capa', () => {
    const html = renderToString(
      createElement(ParallaxLayers, null, createElement(ParallaxLayers.Layer, { depth: 60 }, 'x')),
    )
    expect(html).toContain('--aui-parallax-scroll-depth:60px')
  })
})
