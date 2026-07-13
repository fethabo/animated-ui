// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { EmojiBurst } from './index'

describe('EmojiBurst en SSR (sin document)', () => {
  it('renderiza el overlay y el canvas sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(EmojiBurst))
    expect(html).toContain('aui-emoji-burst')
    expect(html).toContain('<canvas')
  })

  it('acepta className y props HTML en el root', () => {
    const html = renderToString(
      createElement(EmojiBurst, { className: 'mi-clase', id: 'emojis' }),
    )
    expect(html).toContain('aui-emoji-burst mi-clase')
    expect(html).toContain('id="emojis"')
  })
})
