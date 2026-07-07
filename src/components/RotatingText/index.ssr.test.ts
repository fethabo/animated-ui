// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { RotatingText } from './index'

describe('RotatingText en SSR (sin document)', () => {
  it('el markup del servidor contiene la primera palabra', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(
      createElement(RotatingText, { words: ['webs', 'apps', 'magia'] }, 'Hacemos '),
    )
    expect(html).toContain('aui-rotating')
    expect(html).toContain('webs')
    expect(html).not.toContain('>apps<')
  })

  it('expone el aria-label estático con base + lista completa (sin aria-live)', () => {
    const html = renderToString(
      createElement(RotatingText, { words: ['webs', 'apps'] }, 'Hacemos '),
    )
    expect(html).toContain('aria-label="Hacemos webs, apps"')
    expect(html).not.toContain('aria-live')
    expect(html).toContain('aria-hidden="true"')
  })

  it('materializa duración y color como CSS vars inline', () => {
    const html = renderToString(
      createElement(RotatingText, { words: ['a'], duration: 0.6, color: '#0ea5e9' }),
    )
    expect(html).toContain('--aui-rotating-duration:0.6s')
    expect(html).toContain('--aui-rotating-color:#0ea5e9')
  })

  it('acepta className y props HTML en el root', () => {
    const html = renderToString(
      createElement(RotatingText, { words: ['a'], className: 'mi-hero', id: 'rot' }),
    )
    expect(html).toContain('aui-rotating mi-hero')
    expect(html).toContain('id="rot"')
  })
})
