// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { DrawPath } from './index'

const svgChild = createElement(
  'svg',
  { viewBox: '0 0 100 100' },
  createElement('path', { d: 'M 10 10 L 90 90', stroke: '#0ea5e9' }),
  createElement('circle', { cx: 50, cy: 50, r: 20, stroke: '#f59e0b' }),
)

describe('DrawPath en SSR (sin document)', () => {
  it('sirve el SVG del consumer completo y visible, sin dash aplicado', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(DrawPath, { children: svgChild }))
    expect(html).toContain('aui-draw')
    expect(html).toContain('<svg')
    expect(html).toContain('M 10 10 L 90 90')
    expect(html).toContain('<circle')
    // El rebobinado (clase + vars de dash) ocurre recién en el cliente.
    expect(html).not.toContain('aui-stroke')
    expect(html).not.toContain('stroke-dasharray')
  })

  it('materializa las props estéticas como CSS vars inline en el root', () => {
    const html = renderToString(
      createElement(DrawPath, { children: svgChild, duration: 2, stagger: 0.3 }),
    )
    expect(html).toContain('--aui-draw-duration:2s')
    expect(html).toContain('--aui-draw-stagger:0.3s')
  })

  it('acepta el spread de props HTML del root', () => {
    const html = renderToString(
      createElement(DrawPath, {
        children: svgChild,
        'aria-label': 'ilustración',
      } as Parameters<typeof DrawPath>[0]),
    )
    expect(html).toContain('aria-label="ilustración"')
  })
})
