// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { AnimatedList } from './index'

const item = (key: string, text: string) => createElement('span', { key }, text)

describe('AnimatedList en SSR (sin document)', () => {
  it('el markup del servidor contiene todos los hijos en su estado final', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(
      createElement(AnimatedList, null, [item('a', 'uno'), item('b', 'dos'), item('c', 'tres')]),
    )
    expect(html).toContain('aui-animated-list')
    expect(html).toContain('uno')
    expect(html).toContain('dos')
    expect(html).toContain('tres')
  })

  it('envuelve cada hijo en un wrapper medible con clase custom', () => {
    const html = renderToString(
      createElement(
        AnimatedList,
        { itemClassName: 'celda' },
        [item('a', 'uno'), item('b', 'dos')],
      ),
    )
    expect(html.match(/aui-animated-list-item celda/g)).toHaveLength(2)
  })

  it('acepta `as`, className y props HTML en el root, y materializa la easing como CSS var', () => {
    const html = renderToString(
      createElement(
        AnimatedList,
        { as: 'ul', className: 'mi-grid', id: 'lista', easing: 'ease-out' },
        [item('a', 'uno')],
      ),
    )
    expect(html).toContain('<ul')
    expect(html).toContain('aui-animated-list mi-grid')
    expect(html).toContain('id="lista"')
    expect(html).toContain('--aui-animated-list-easing:ease-out')
  })
})
