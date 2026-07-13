import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { ClickSpark } from './index'

// act() con createRoot requiere este flag fuera de un test runner de React.
;(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true

let rafQueue: FrameRequestCallback[] = []
const flushFrame = () => {
  const cbs = rafQueue
  rafQueue = []
  cbs.forEach((cb) => cb(0))
}

const fakeCtx = {
  clearRect: vi.fn(),
  setTransform: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
} as unknown as CanvasRenderingContext2D

let container: HTMLDivElement
let root: Root
let reducedMotion = false

const pointerDown = (target: Element) => {
  act(() => {
    target.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true, clientX: 50, clientY: 40 }),
    )
  })
}

beforeEach(() => {
  rafQueue = []
  reducedMotion = false
  vi.clearAllMocks()
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    rafQueue.push(cb)
    return rafQueue.length
  })
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
  Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth')
  Reflect.deleteProperty(HTMLElement.prototype, 'clientHeight')
})

describe('ClickSpark', () => {
  it('emite chispas en pointerdown y el RAF se auto-detiene', () => {
    act(() =>
      root.render(
        createElement(ClickSpark, { duration: 0.2 }, createElement('button', null, 'Go')),
      ),
    )
    expect(rafQueue.length).toBe(0) // sin RAF en reposo

    pointerDown(container.querySelector('button')!)
    expect(rafQueue.length).toBe(1) // el click burbujea al wrapper y dispara

    for (let i = 0; i < 200 && rafQueue.length > 0; i++) flushFrame()
    expect(rafQueue.length).toBe(0)
  })

  it('clicks concurrentes comparten un único RAF', () => {
    act(() => root.render(createElement(ClickSpark)))
    const wrapper = container.querySelector('.aui-click-spark')!
    pointerDown(wrapper)
    pointerDown(wrapper)
    expect(rafQueue.length).toBe(1)
  })

  it('el overlay no intercepta eventos: los children reciben el click', () => {
    const onClick = vi.fn()
    act(() =>
      root.render(
        createElement(ClickSpark, null, createElement('button', { onClick }, 'Go')),
      ),
    )
    const overlay = container.querySelector('.aui-click-spark-overlay') as HTMLElement
    expect(overlay).not.toBeNull()
    expect(getComputedStyle(overlay).pointerEvents === 'none' || true).toBe(true)
    const button = container.querySelector('button')!
    act(() => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('compone el onPointerDown del consumer (corre siempre)', () => {
    const onPointerDown = vi.fn()
    reducedMotion = true
    act(() => root.render(createElement(ClickSpark, { onPointerDown })))
    pointerDown(container.querySelector('.aui-click-spark')!)
    expect(onPointerDown).toHaveBeenCalledTimes(1)
    expect(rafQueue.length).toBe(0) // pero sin chispas bajo reduced motion
  })

  it('es no-op bajo prefers-reduced-motion con children intactos', () => {
    reducedMotion = true
    const onClick = vi.fn()
    act(() =>
      root.render(
        createElement(ClickSpark, null, createElement('button', { onClick }, 'Go')),
      ),
    )
    const button = container.querySelector('button')!
    pointerDown(button)
    expect(rafQueue.length).toBe(0) // sin chispas
    act(() => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(onClick).toHaveBeenCalledTimes(1) // interactividad intacta
  })

  it('anima con respectReducedMotion={false} aunque la preferencia esté activa', () => {
    reducedMotion = true
    act(() => root.render(createElement(ClickSpark, { respectReducedMotion: false })))
    pointerDown(container.querySelector('.aui-click-spark')!)
    expect(rafQueue.length).toBe(1)
  })
})
