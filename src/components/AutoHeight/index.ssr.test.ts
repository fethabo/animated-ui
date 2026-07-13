// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { AutoHeight } from './index'

describe('AutoHeight en SSR (sin document)', () => {
  it('el markup del servidor fluye con altura natural, sin estilos de medición', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(AutoHeight, null, 'contenido natural'))
    expect(html).toContain('aui-autoheight')
    expect(html).toContain('contenido natural')
    expect(html).not.toContain('height:')
    expect(html).not.toContain('overflow:')
  })

  it('acepta className y props HTML en el root, y materializa la easing como CSS var', () => {
    const html = renderToString(
      createElement(AutoHeight, { className: 'panel', id: 'acordeon', easing: 'ease-in-out' }, 'x'),
    )
    expect(html).toContain('aui-autoheight panel')
    expect(html).toContain('id="acordeon"')
    expect(html).toContain('--aui-autoheight-easing:ease-in-out')
  })
})
