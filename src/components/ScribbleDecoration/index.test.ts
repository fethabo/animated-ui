import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { ScribbleDecoration } from './index'
import { scribbleShapes } from './shapes'
import type { ScribbleShape } from './shapes'

// act() con createRoot requiere este flag fuera de un test runner de React.
;(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true

/** ResizeObserver falso: permite disparar mediciones a demanda. */
class FakeResizeObserver {
  static instances: FakeResizeObserver[] = []
  callback: ResizeObserverCallback
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
    FakeResizeObserver.instances.push(this)
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  resize(width: number, height: number) {
    act(() =>
      this.callback(
        [{ contentRect: { width, height } } as ResizeObserverEntry],
        this as unknown as ResizeObserver,
      ),
    )
  }
}

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  FakeResizeObserver.instances = []
  vi.stubGlobal('ResizeObserver', FakeResizeObserver)
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

const render = (props: Record<string, unknown> = {}) =>
  act(() => root.render(createElement(ScribbleDecoration, { seed: 'test', ...props })))

const path = () => container.querySelector<SVGPathElement>('.aui-scribble-path')

describe('ScribbleDecoration: shapes y determinismo', () => {
  it('misma shape, seed y tamaño ⇒ mismo garabato', () => {
    render({ shape: 'arrow' })
    FakeResizeObserver.instances[0].resize(120, 80)
    const first = path()?.getAttribute('d')
    expect(first).toBeTruthy()

    act(() => root.unmount())
    container.remove()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    render({ shape: 'arrow' })
    FakeResizeObserver.instances[1].resize(120, 80)
    expect(path()?.getAttribute('d')).toBe(first)
  })

  it('el path coincide con el del registro de shapes builtin', () => {
    render({ shape: 'spiral' })
    FakeResizeObserver.instances[0].resize(120, 80)
    expect(path()?.getAttribute('d')).toBe(
      scribbleShapes.spiral({ width: 120, height: 80 }, 'test'),
    )
  })

  it('acepta una shape custom por función con el contrato del paquete', () => {
    const custom: ScribbleShape = ({ width, height }, seed) =>
      `M 0 0 L ${width} ${height} ${String(seed).length}`
    render({ shape: custom })
    FakeResizeObserver.instances[0].resize(100, 50)
    expect(path()?.getAttribute('d')).toBe('M 0 0 L 100 50 4')
  })
})

describe('ScribbleDecoration: accesibilidad y modo repeat', () => {
  it('el SVG es decoración pura (aria-hidden, sin eventos)', () => {
    render()
    FakeResizeObserver.instances[0].resize(120, 80)
    const svg = container.querySelector('.aui-scribble-svg')
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
    expect(svg?.getAttribute('focusable')).toBe('false')
  })

  it('con repeat, el root porta data-aui-repeat (ciclo dibuja→desvanece→redibuja)', () => {
    render({ repeat: true })
    FakeResizeObserver.instances[0].resize(120, 80)
    const rootEl = container.querySelector('.aui-scribble')
    expect(rootEl?.hasAttribute('data-aui-repeat')).toBe(true)
    // Sin IntersectionObserver, in-view degrada a visible: dibujado.
    expect(rootEl?.hasAttribute('data-aui-drawn')).toBe(true)
  })

  it('sin repeat no hay atributo de ciclo', () => {
    render()
    FakeResizeObserver.instances[0].resize(120, 80)
    expect(container.querySelector('.aui-scribble')?.hasAttribute('data-aui-repeat')).toBe(false)
  })
})
