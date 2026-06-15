// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { TeslaCoil } from './index'

describe('TeslaCoil en SSR (sin document)', () => {
  it('renderiza el contenedor y el canvas sin acceder al canvas context', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(TeslaCoil, { color: '#7dd3fc' }))
    expect(html).toContain('aui-tesla-coil')
    expect(html).toContain('<canvas')
  })

  it('materializa los parámetros como CSS vars inline en el root', () => {
    const html = renderToString(createElement(TeslaCoil, { color: '#7dd3fc', reach: 200, lineWidth: 3 }))
    expect(html).toContain('--aui-tesla-color:#7dd3fc')
    expect(html).toContain('--aui-tesla-reach:200')
    expect(html).toContain('--aui-tesla-line-width:3px')
  })

  it('renderiza children superpuestos (interactivos: el canvas tiene pointer-events:none)', () => {
    const html = renderToString(
      createElement(TeslaCoil, { children: createElement('button', null, 'Click') }),
    )
    expect(html).toContain('aui-tesla-content')
    expect(html).toContain('<button')
    expect(html).toContain('Click')
  })
})
