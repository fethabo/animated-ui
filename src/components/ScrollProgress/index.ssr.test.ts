// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { ScrollProgress } from './index'

describe('ScrollProgress en SSR (sin document)', () => {
  it('renderiza sin errores con la barra en 0 y oculta a tecnologías asistivas', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(ScrollProgress))
    expect(html).toContain('aria-hidden="true"')
    expect(html).toContain('data-aui-position="top"')
    expect(html).toContain('aui-progress-bar')
  })

  it('posición bottom y vars inline desde props', () => {
    const html = renderToString(
      createElement(ScrollProgress, { position: 'bottom', color: '#22d3ee', height: 5, zIndex: 99 }),
    )
    expect(html).toContain('data-aui-position="bottom"')
    expect(html).toContain('--aui-progress-color:#22d3ee')
    expect(html).toContain('--aui-progress-height:5px')
    expect(html).toContain('--aui-progress-z:99')
  })
})
