import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { DrawPath } from './index'

// act() con createRoot requiere este flag fuera de un test runner de React.
;(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

const svgProto = (globalThis as unknown as { SVGElement: { prototype: Record<string, unknown> } })
  .SVGElement.prototype

const consumerSvg = () =>
  createElement(
    'svg',
    { viewBox: '0 0 100 100' },
    createElement('path', { d: 'M 0 0 L 100 100', stroke: 'red' }),
    createElement('path', { d: 'M 100 0 L 0 100', stroke: 'blue' }),
    createElement('path', { d: 'M 0 50 L 100 50', stroke: 'green', 'data-aui-no-draw': '' }),
  )

describe('DrawPath: rebobinado y stagger', () => {
  it('enrolla los trazos del consumer con índice de stagger por orden documental', () => {
    svgProto.getTotalLength = () => 141.4
    try {
      act(() => root.render(createElement(DrawPath, { children: consumerSvg() })))
      const prepared = container.querySelectorAll<SVGElement>('.aui-stroke')
      expect(prepared).toHaveLength(2)
      expect(prepared[0].style.getPropertyValue('--aui-stroke-i')).toBe('0')
      expect(prepared[1].style.getPropertyValue('--aui-stroke-i')).toBe('1')
      expect(prepared[0].style.getPropertyValue('--aui-stroke-len')).toBe('142px')
      // Los estilos del consumer no se tocan.
      expect(prepared[0].getAttribute('stroke')).toBe('red')
    } finally {
      delete svgProto.getTotalLength
    }
  })

  it('los elementos con data-aui-no-draw se saltean (visibles sin animar)', () => {
    svgProto.getTotalLength = () => 100
    try {
      act(() => root.render(createElement(DrawPath, { children: consumerSvg() })))
      const optOut = container.querySelector<SVGElement>('[data-aui-no-draw]')
      expect(optOut?.classList.contains('aui-stroke')).toBe(false)
      expect(optOut?.style.getPropertyValue('--aui-stroke-len')).toBe('')
    } finally {
      delete svgProto.getTotalLength
    }
  })

  it('sin getTotalLength (browser antiguo), los trazos quedan visibles sin animar', () => {
    act(() => root.render(createElement(DrawPath, { children: consumerSvg() })))
    expect(container.querySelectorAll('.aui-stroke')).toHaveLength(0)
    expect(container.querySelectorAll('path')).toHaveLength(3)
  })

  it('sin IntersectionObserver, trigger=in-view degrada a visible (data-aui-drawn)', () => {
    act(() => root.render(createElement(DrawPath, { children: consumerSvg() })))
    expect(container.querySelector('.aui-draw')?.hasAttribute('data-aui-drawn')).toBe(true)
  })
})
