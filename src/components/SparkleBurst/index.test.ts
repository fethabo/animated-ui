import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { SparkleBurst } from './index'
import type { SparkleBurstHandle } from './types'

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
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  quadraticCurveTo: vi.fn(),
  fill: vi.fn(),
} as unknown as CanvasRenderingContext2D

let container: HTMLDivElement
let root: Root
let reducedMotion = false

const mountWithHandle = (props: Record<string, unknown> = {}) => {
  let handle: SparkleBurstHandle | null = null
  act(() =>
    root.render(
      createElement(SparkleBurst, {
        ...props,
        ref: (h: SparkleBurstHandle | null) => {
          if (h) handle = h
        },
      }),
    ),
  )
  return handle!
}

beforeEach(() => {
  rafQueue = []
  reducedMotion = false
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

describe('SparkleBurst.fire()', () => {
  it('arranca el RAF al disparar y se auto-detiene al apagarse los destellos', () => {
    const handle = mountWithHandle({ count: 5, duration: 0.2 })
    expect(rafQueue.length).toBe(0) // sin RAF en reposo

    act(() => handle.fire())
    expect(rafQueue.length).toBe(1)

    for (let i = 0; i < 500 && rafQueue.length > 0; i++) flushFrame()
    expect(rafQueue.length).toBe(0)
  })

  it('acepta origin por disparo sin tocar los defaults', () => {
    const handle = mountWithHandle()
    expect(() =>
      act(() => handle.fire({ origin: { x: 0.9, y: 0.1 }, count: 3 })),
    ).not.toThrow()
    expect(rafQueue.length).toBe(1)
  })

  it('es no-op bajo prefers-reduced-motion', () => {
    reducedMotion = true
    const handle = mountWithHandle()
    expect(() => act(() => handle.fire())).not.toThrow()
    expect(rafQueue.length).toBe(0)
  })

  it('anima con respectReducedMotion={false} aunque la preferencia esté activa', () => {
    reducedMotion = true
    const handle = mountWithHandle({ respectReducedMotion: false })
    act(() => handle.fire())
    expect(rafQueue.length).toBe(1)
  })
})
