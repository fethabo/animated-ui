// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { SplitReveal } from './index'

describe('SplitReveal en SSR (sin document)', () => {
  it('renderiza sin errores y el texto completo está presente en el markup', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(SplitReveal, { text: 'Hola mundo animado' }))
    expect(html).toContain('Hola mundo animado')
  })

  it('expone aria-label con el texto completo original', () => {
    const html = renderToString(createElement(SplitReveal, { text: 'Texto revelado' }))
    expect(html).toContain('aria-label="Texto revelado"')
  })

  it('materializa el preset como data-attribute', () => {
    const html = renderToString(createElement(SplitReveal, { text: 'x', preset: 'blur' }))
    expect(html).toContain('data-aui-preset="blur"')
  })

  it('materializa las props estéticas como CSS custom properties', () => {
    const html = renderToString(
      createElement(SplitReveal, { text: 'x', stagger: 0.1, duration: 0.8, distance: 40 }),
    )
    expect(html).toContain('--aui-split-stagger:0.1s')
    expect(html).toContain('--aui-split-duration:0.8s')
    expect(html).toContain('--aui-split-distance:40px')
  })
})
