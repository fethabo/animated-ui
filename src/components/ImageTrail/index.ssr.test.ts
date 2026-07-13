// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { ImageTrail } from './index'

const IMAGES = ['/a.jpg', '/b.jpg']

describe('ImageTrail en SSR (sin document)', () => {
  it('renderiza el contenedor, los children y la capa sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(ImageTrail, { images: IMAGES }, 'contenido'))
    expect(html).toContain('aui-image-trail')
    expect(html).toContain('aui-image-trail-layer')
    expect(html).toContain('contenido')
  })

  it('materializa tamaño y duración como CSS vars inline en el root', () => {
    const html = renderToString(
      createElement(ImageTrail, { images: IMAGES, size: 160, duration: 1200 }),
    )
    expect(html).toContain('--aui-image-trail-size:160px')
    expect(html).toContain('--aui-image-trail-duration:1200ms')
  })

  it('acepta className y props HTML en el root', () => {
    const html = renderToString(
      createElement(ImageTrail, { images: IMAGES, className: 'mi-trail', id: 'imgs' }),
    )
    expect(html).toContain('aui-image-trail mi-trail')
    expect(html).toContain('id="imgs"')
  })
})
