// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { StackedCards } from './index'

describe('StackedCards en SSR (sin document)', () => {
  it('renderiza sin errores y todas las cards están presentes en el markup', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(
      createElement(
        StackedCards,
        null,
        createElement('div', null, 'Card uno'),
        createElement('div', null, 'Card dos'),
        createElement('div', null, 'Card tres'),
      ),
    )
    expect(html).toContain('Card uno')
    expect(html).toContain('Card dos')
    expect(html).toContain('Card tres')
    expect(html.match(/aui-stack-item/g)).toHaveLength(3)
  })

  it('materializa las props como CSS custom properties --aui-stack-*', () => {
    const html = renderToString(
      createElement(
        StackedCards,
        { offsetTop: 80, scaleStep: 0.04, opacityStep: 0.1, cardTravel: 500 },
        createElement('div', null, 'A'),
      ),
    )
    expect(html).toContain('--aui-stack-offset:80px')
    expect(html).toContain('--aui-stack-scale-step:0.04')
    expect(html).toContain('--aui-stack-opacity-step:0.1')
    expect(html).toContain('--aui-stack-travel:500px')
  })

  it('soporta un número arbitrario de cards', () => {
    const kids = Array.from({ length: 6 }, (_, i) => createElement('div', { key: i }, `c${i}`))
    const html = renderToString(createElement(StackedCards, null, ...kids))
    expect(html.match(/aui-stack-item/g)).toHaveLength(6)
  })
})
