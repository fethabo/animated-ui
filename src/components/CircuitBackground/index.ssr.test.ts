// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { CircuitBackground } from './index'

describe('CircuitBackground en SSR (sin document)', () => {
  it('renderiza el contenedor y el canvas sin acceder al canvas context', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(CircuitBackground, { seed: 'ssr' }))
    expect(html).toContain('aui-circuit-background')
    expect(html).toContain('<canvas')
  })

  it('materializa los parámetros como CSS vars inline en el root', () => {
    const html = renderToString(
      createElement(CircuitBackground, { trackColor: '#1e3a5f', pulseColor: '#22d3ee', lineWidth: 3 }),
    )
    expect(html).toContain('--aui-circuit-track-color:#1e3a5f')
    expect(html).toContain('--aui-circuit-pulse-color:#22d3ee')
    expect(html).toContain('--aui-circuit-line-width:3px')
  })
})
