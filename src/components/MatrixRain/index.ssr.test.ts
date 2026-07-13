// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { MatrixRain } from './index'

describe('MatrixRain en SSR (sin document)', () => {
  it('renderiza el contenedor y el canvas sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(MatrixRain))
    expect(html).toContain('aui-matrix-rain')
    expect(html).toContain('<canvas')
  })

  it('materializa colores y fondo como CSS vars inline en el root', () => {
    const html = renderToString(
      createElement(MatrixRain, { color: '#22c55e', headColor: '#fff', background: '#000' }),
    )
    expect(html).toContain('--aui-matrix-color:#22c55e')
    expect(html).toContain('--aui-matrix-head-color:#fff')
    expect(html).toContain('--aui-matrix-background:#000')
  })

  it('con fixed posiciona el root como fixed', () => {
    const html = renderToString(createElement(MatrixRain, { fixed: true }))
    expect(html).toContain('position:fixed')
  })

  it('acepta className y props HTML en el root', () => {
    const html = renderToString(createElement(MatrixRain, { className: 'mi-rain', id: 'rain' }))
    expect(html).toContain('aui-matrix-rain mi-rain')
    expect(html).toContain('id="rain"')
  })
})
