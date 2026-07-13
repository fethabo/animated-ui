import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { CursorTrail } from './index'

// act() con createRoot requiere este flag fuera de un test runner de React.
;(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true

let rafCalls = 0

const fakeCtx = {
  clearRect: vi.fn(),
  setTransform: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
} as unknown as CanvasRenderingContext2D

let container: HTMLDivElement
let root: Root
let reducedMotion = false

// jsdom no implementa PointerEvent: un MouseEvent con type 'pointermove'
// dispara el mismo listener (pointerType queda undefined ≠ 'touch').
const pointerMove = (target: Element, x: number, y: number) => {
  act(() => {
    target.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: x, clientY: y }))
  })
}

beforeEach(() => {
  rafCalls = 0
  reducedMotion = false
  vi.stubGlobal('requestAnimationFrame', (() => {
    rafCalls++
    return rafCalls
  }) as typeof requestAnimationFrame)
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('prefers-reduced-motion') && reducedMotion,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
  HTMLCanvasElement.prototype.getContext = vi.fn(
    () => fakeCtx,
  ) as unknown as typeof HTMLCanvasElement.prototype.getContext
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get: () => 400,
  })
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get: () => 300,
  })
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

describe('CursorTrail: emisión y reduced motion', () => {
  it('mover el puntero más allá del umbral enciende el RAF de la estela', () => {
    act(() => root.render(createElement(CursorTrail, { emitEvery: 10 }, 'contenido')))
    const trailRoot = container.querySelector('.aui-cursor-trail')!

    pointerMove(trailRoot, 0, 0)
    expect(rafCalls).toBe(0) // primera muestra: solo ancla
    pointerMove(trailRoot, 50, 0)
    expect(rafCalls).toBeGreaterThan(0)
  })

  it('un movimiento menor al umbral no emite ni enciende el RAF', () => {
    act(() => root.render(createElement(CursorTrail, { emitEvery: 100 }, 'contenido')))
    const trailRoot = container.querySelector('.aui-cursor-trail')!

    pointerMove(trailRoot, 0, 0)
    pointerMove(trailRoot, 5, 5)
    expect(rafCalls).toBe(0)
  })

  it('bajo reduced motion el efecto es no-op total: sin dibujo ni RAF', () => {
    reducedMotion = true
    act(() => root.render(createElement(CursorTrail, { emitEvery: 10 }, 'contenido')))
    const trailRoot = container.querySelector('.aui-cursor-trail')!

    pointerMove(trailRoot, 0, 0)
    pointerMove(trailRoot, 200, 200)
    pointerMove(trailRoot, 0, 0)
    expect(rafCalls).toBe(0)
  })

  it('con respectReducedMotion=false la estela corre aunque haya reduce', () => {
    reducedMotion = true
    act(() =>
      root.render(
        createElement(CursorTrail, { emitEvery: 10, respectReducedMotion: false }, 'contenido'),
      ),
    )
    const trailRoot = container.querySelector('.aui-cursor-trail')!

    pointerMove(trailRoot, 0, 0)
    pointerMove(trailRoot, 200, 200)
    expect(rafCalls).toBeGreaterThan(0)
  })
})
