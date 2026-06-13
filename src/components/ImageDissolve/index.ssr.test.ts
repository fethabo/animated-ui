// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { ImageDissolve } from './index'

describe('ImageDissolve en SSR (sin document)', () => {
  it('renderiza el <img> con src y alt sin acceder al canvas', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(
      createElement(ImageDissolve, { src: '/foto.jpg', alt: 'Una foto de prueba' }),
    )
    expect(html).toContain('src="/foto.jpg"')
    expect(html).toContain('alt="Una foto de prueba"')
  })

  it('incluye el canvas superpuesto en el markup, oculto por CSS', () => {
    const html = renderToString(
      createElement(ImageDissolve, { src: '/a.png', alt: 'A' }),
    )
    expect(html).toContain('<canvas')
    expect(html).toContain('aui-image-dissolve')
  })
})
