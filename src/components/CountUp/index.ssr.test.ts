// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { CountUp } from './index'

describe('CountUp en SSR (sin document)', () => {
  it('renderiza sin errores y el markup contiene el valor final (no el inicial)', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(CountUp, { value: 42, from: 0 }))
    expect(html).toContain('42')
    expect(html).toContain('aui-countup')
  })

  it('el valor final va formateado en el markup y en el aria-label', () => {
    const html = renderToString(
      createElement(CountUp, { value: 12500, separator: '.', suffix: '+' }),
    )
    expect(html).toContain('12.500+')
    expect(html).toContain('aria-label="12.500+"')
  })

  it('respeta decimales, prefijo y sufijo en el markup del servidor', () => {
    const html = renderToString(
      createElement(CountUp, { value: 99.5, decimals: 1, prefix: '$', suffix: ' M' }),
    )
    expect(html).toContain('$99.5 M')
  })

  it('acepta className y style del consumer', () => {
    const html = renderToString(
      createElement(CountUp, { value: 7, className: 'mi-stat', style: { fontSize: 32 } }),
    )
    expect(html).toContain('aui-countup mi-stat')
    expect(html).toContain('font-size:32px')
  })
})
