// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { RippleContainer } from './index'

describe('RippleContainer en SSR (sin document)', () => {
  it('renderiza sin errores con los children presentes en el markup', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(
      createElement(RippleContainer, null, createElement('button', null, 'Click acá')),
    )
    expect(html).toContain('Click acá')
    expect(html).toContain('aui-ripple')
    expect(html).toContain('aui-ripple-layer')
  })

  it('materializa las props estéticas como CSS custom properties --aui-ripple-*', () => {
    const html = renderToString(
      createElement(RippleContainer, { color: '#38bdf8', duration: 900, opacity: 0.4 }),
    )
    expect(html).toContain('--aui-ripple-color:#38bdf8')
    expect(html).toContain('--aui-ripple-duration:900ms')
    expect(html).toContain('--aui-ripple-opacity:0.4')
  })

  it('acepta className y style del consumer sin pisar la clase funcional', () => {
    const html = renderToString(
      createElement(RippleContainer, { className: 'mi-clase', style: { width: 100 } }),
    )
    expect(html).toContain('aui-ripple mi-clase')
    expect(html).toContain('width:100px')
  })
})
