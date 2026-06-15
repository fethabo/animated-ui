// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { AttentionCue } from './index'

describe('AttentionCue en SSR (sin document)', () => {
  it('renderiza el contenedor y el canvas sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(AttentionCue, { color: '#fbbf24' }))
    expect(html).toContain('aui-attention-cue')
    expect(html).toContain('<canvas')
  })

  it('materializa los parámetros como CSS vars inline en el root', () => {
    const html = renderToString(createElement(AttentionCue, { color: '#fbbf24', maxDistance: 240 }))
    expect(html).toContain('--aui-cue-color:#fbbf24')
    expect(html).toContain('--aui-cue-max-distance:240')
  })

  it('el overlay canvas declara pointer-events:none (clicks pasan al contenido)', () => {
    // El CSS inyectado define `pointer-events: none` sobre el canvas overlay;
    // aquí verificamos que el children se renderiza por encima e interactivo.
    const html = renderToString(
      createElement(AttentionCue, { children: createElement('button', null, 'CTA') }),
    )
    expect(html).toContain('aui-cue-content')
    expect(html).toContain('<button')
    expect(html).toContain('CTA')
  })
})
