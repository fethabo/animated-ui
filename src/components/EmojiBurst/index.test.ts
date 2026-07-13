import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { EmojiBurst } from './index'
import type { EmojiBurstHandle } from './types'

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
  fillText: vi.fn(),
} as unknown as CanvasRenderingContext2D

let container: HTMLDivElement
let root: Root
let reducedMotion = false

const mountWithHandle = (props: Record<string, unknown> = {}) => {
  let handle: EmojiBurstHandle | null = null
  act(() =>
    root.render(
      createElement(EmojiBurst, {
        ...props,
        ref: (h: EmojiBurstHandle | null) => {
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
  vi.clearAllMocks() // fakeCtx es compartido entre tests
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

describe('EmojiBurst.fire()', () => {
  it('arranca el RAF al disparar, dibuja con fillText y se auto-detiene', () => {
    const handle = mountWithHandle({ count: 5 })
    expect(rafQueue.length).toBe(0) // sin RAF en reposo

    act(() => handle.fire())
    expect(rafQueue.length).toBe(1)

    flushFrame()
    expect(vi.mocked(fakeCtx.fillText)).toHaveBeenCalled()

    for (let i = 0; i < 3000 && rafQueue.length > 0; i++) flushFrame()
    expect(rafQueue.length).toBe(0)
  })

  it('usa la lista de emojis del disparo sin tocar los defaults', () => {
    const handle = mountWithHandle({ count: 3 })
    act(() => handle.fire({ emojis: ['❤️'] }))
    flushFrame()
    const drawn = vi.mocked(fakeCtx.fillText).mock.calls.map((c) => c[0])
    expect(drawn.length).toBeGreaterThan(0)
    expect(drawn.every((e) => e === '❤️')).toBe(true)
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
