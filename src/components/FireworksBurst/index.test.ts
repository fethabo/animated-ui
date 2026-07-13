import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { FireworksBurst } from './index'
import type { FireworksBurstHandle } from './types'

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
  arc: vi.fn(),
  fill: vi.fn(),
} as unknown as CanvasRenderingContext2D

let container: HTMLDivElement
let root: Root
let reducedMotion = false

/** matchMedia stubbeado: reporta `reducedMotion` para la query de reduce. */
const stubMatchMedia = () => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('prefers-reduced-motion') && reducedMotion,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

const mountWithHandle = (props: Record<string, unknown> = {}) => {
  let handle: FireworksBurstHandle | null = null
  act(() =>
    root.render(
      createElement(FireworksBurst, {
        ...props,
        ref: (h: FireworksBurstHandle | null) => {
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
  stubMatchMedia()
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

describe('FireworksBurst.fire()', () => {
  it('arranca el RAF al disparar y se auto-detiene al morir la ráfaga', () => {
    const handle = mountWithHandle({ rockets: 1, particleCount: 5 })
    expect(rafQueue.length).toBe(0) // sin RAF en reposo

    act(() => handle.fire())
    expect(rafQueue.length).toBe(1)

    // Avanza frames hasta que la ráfaga completa muere y el RAF se detiene.
    for (let i = 0; i < 3000 && rafQueue.length > 0; i++) flushFrame()
    expect(rafQueue.length).toBe(0)
  })

  it('es no-op bajo prefers-reduced-motion', () => {
    reducedMotion = true
    const handle = mountWithHandle()
    expect(() => act(() => handle.fire())).not.toThrow()
    expect(rafQueue.length).toBe(0) // ni un frame animado
  })

  it('anima con respectReducedMotion={false} aunque la preferencia esté activa', () => {
    reducedMotion = true
    const handle = mountWithHandle({ respectReducedMotion: false })
    act(() => handle.fire())
    expect(rafQueue.length).toBe(1)
  })

  it('no lanza tras el desmontaje', () => {
    const handle = mountWithHandle()
    act(() => root.unmount())
    expect(() => handle.fire()).not.toThrow()
    root = createRoot(container)
  })
})
