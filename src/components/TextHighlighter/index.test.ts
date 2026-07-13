import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { TextHighlighter } from './index'

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
  act(() =>
    root.render(createElement(TextHighlighter, { children: 'frase corta', seed: 'test', ...props })),
  )

const path = () => container.querySelector<SVGPathElement>('.aui-highlighter-path')

describe('TextHighlighter: generación y regeneración del shape', () => {
  it('genera el path con el tamaño medido y lo regenera en resize (misma seed)', () => {
    render()
    // Sin medición todavía: no hay SVG.
    expect(path()).toBeNull()

    FakeResizeObserver.instances[0].resize(200, 28)
    const first = path()?.getAttribute('d')
    expect(first).toBeTruthy()

    FakeResizeObserver.instances[0].resize(260, 28)
    const resized = path()?.getAttribute('d')
    expect(resized).toBeTruthy()
    expect(resized).not.toBe(first)

    // Volver al tamaño original reproduce exactamente el mismo path (seed fija).
    FakeResizeObserver.instances[0].resize(200, 28)
    expect(path()?.getAttribute('d')).toBe(first)
  })

  it('shapes distintos producen paths distintos para el mismo tamaño', () => {
    render({ shape: 'underline' })
    FakeResizeObserver.instances[0].resize(200, 28)
    const underline = path()?.getAttribute('d')

    render({ shape: 'circle' })
    expect(path()?.getAttribute('d')).not.toBe(underline)
  })
})

describe('TextHighlighter: accesibilidad', () => {
  it('el texto es real y el SVG queda fuera del árbol de accesibilidad', () => {
    render()
    FakeResizeObserver.instances[0].resize(200, 28)

    const rootEl = container.querySelector('.aui-highlighter')
    expect(rootEl?.textContent).toBe('frase corta')

    const svg = container.querySelector('.aui-highlighter-svg')
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
    expect(svg?.getAttribute('focusable')).toBe('false')
  })
})

describe('TextHighlighter: rebobinado y triggers', () => {
  it('con getTotalLength disponible, el trazo queda enrollado (clase + var de longitud)', () => {
    const proto = (globalThis as unknown as { SVGElement: { prototype: unknown } }).SVGElement
      .prototype as Record<string, unknown>
    proto.getTotalLength = () => 240
    try {
      render()
      FakeResizeObserver.instances[0].resize(200, 28)
      const p = path()
      expect(p?.classList.contains('aui-stroke')).toBe(true)
      expect(p?.style.getPropertyValue('--aui-stroke-len')).toBe('240px')
    } finally {
      delete proto.getTotalLength
    }
  })

  it('sin IntersectionObserver, trigger=in-view dispara igual (data-aui-drawn presente)', () => {
    render()
    FakeResizeObserver.instances[0].resize(200, 28)
    // useInView degrada a visible cuando no hay IntersectionObserver (jsdom).
    expect(container.querySelector('.aui-highlighter')?.hasAttribute('data-aui-drawn')).toBe(true)
  })

  it('trigger=hover dibuja al entrar el puntero y, con once=false, des-dibuja al salir', () => {
    render({ trigger: 'hover', once: false })
    FakeResizeObserver.instances[0].resize(200, 28)
    const rootEl = container.querySelector('.aui-highlighter') as HTMLElement
    expect(rootEl.hasAttribute('data-aui-drawn')).toBe(false)

    act(() => {
      rootEl.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }))
    })
    // React 18 delega mouseenter via mouseover; simular con eventos nativos.
    if (!rootEl.hasAttribute('data-aui-drawn')) {
      act(() => {
        rootEl.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
      })
    }
    expect(rootEl.hasAttribute('data-aui-drawn')).toBe(true)

    act(() => {
      rootEl.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))
    })
    expect(rootEl.hasAttribute('data-aui-drawn')).toBe(false)
  })
})
