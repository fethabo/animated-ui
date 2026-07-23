import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { act, createElement, useEffect } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { useOneShotCanvas, type OneShotCanvasEngine } from './use-one-shot-canvas'

// act() con createRoot requiere este flag fuera de un test runner de React.
;(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true

// RAF stubbeado: los frames se disparan a mano con flushFrames().
let rafQueue: FrameRequestCallback[] = []
const flushFrame = () => {
  const cbs = rafQueue
  rafQueue = []
  cbs.forEach((cb) => cb(0))
}

// Contexto 2d fake (jsdom no implementa canvas).
const fakeCtx = {
  clearRect: vi.fn(),
  setTransform: vi.fn(),
} as unknown as CanvasRenderingContext2D

let container: HTMLDivElement
let root: Root
let getContextMock: Mock<() => CanvasRenderingContext2D | null>

beforeEach(() => {
  rafQueue = []
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    rafQueue.push(cb)
    return rafQueue.length
  })
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
  getContextMock = vi.fn<() => CanvasRenderingContext2D | null>(() => fakeCtx)
  HTMLCanvasElement.prototype.getContext =
    getContextMock as unknown as typeof HTMLCanvasElement.prototype.getContext
  // jsdom no layoutea: se fija un área para que fire() no aborte por tamaño 0.
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get: () => 300,
  })
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get: () => 200,
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

/** Ráfaga de prueba: vive `steps` frames. */
interface TestBurst {
  steps: number
}

/** Monta un host mínimo que usa el hook y expone el engine. */
function mountHost(
  stepAndDraw: (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    burst: TestBurst,
  ) => boolean,
): OneShotCanvasEngine<TestBurst> {
  let engine: OneShotCanvasEngine<TestBurst> | null = null
  function Host() {
    const e = useOneShotCanvas<TestBurst>(stepAndDraw)
    engine = e
    useEffect(() => {}, [])
    return createElement(
      'div',
      { ref: e.containerRef },
      createElement('canvas', { ref: e.canvasRef }),
    )
  }
  act(() => root.render(createElement(Host)))
  return engine!
}

describe('useOneShotCanvas', () => {
  it('fire spawnea la ráfaga y el RAF se auto-detiene con el pool vacío', () => {
    const step = vi.fn((_ctx, _w, _h, burst: TestBurst) => --burst.steps > 0)
    const engine = mountHost(step)

    engine.fire(() => ({ steps: 3 }))
    expect(rafQueue.length).toBe(1)

    flushFrame() // steps 3 → 2, viva
    expect(rafQueue.length).toBe(1)
    flushFrame() // 2 → 1, viva
    expect(rafQueue.length).toBe(1)
    flushFrame() // 1 → 0, muere → auto-stop
    expect(rafQueue.length).toBe(0)
    expect(step).toHaveBeenCalledTimes(3)

    // Un disparo posterior re-arranca el loop desde cero.
    engine.fire(() => ({ steps: 1 }))
    expect(rafQueue.length).toBe(1)
  })

  it('disparos concurrentes comparten un único RAF', () => {
    const step = vi.fn((_ctx, _w, _h, burst: TestBurst) => --burst.steps > 0)
    const engine = mountHost(step)

    engine.fire(() => ({ steps: 2 }))
    engine.fire(() => ({ steps: 5 }))
    expect(rafQueue.length).toBe(1) // un solo loop

    flushFrame()
    expect(step).toHaveBeenCalledTimes(2) // ambas ráfagas avanzadas en el mismo frame
    flushFrame() // la primera muere, la segunda sigue
    expect(rafQueue.length).toBe(1)
  })

  it('recibe el spawn con las dimensiones del contenedor y limpia por frame', () => {
    const engine = mountHost(() => false)
    const spawn = vi.fn(() => ({ steps: 1 }))
    engine.fire(spawn)
    expect(spawn).toHaveBeenCalledWith(300, 200)
    flushFrame()
    expect(fakeCtx.clearRect).toHaveBeenCalledWith(0, 0, 300, 200)
  })

  it('es no-op sin contexto 2d y con spawn que retorna null', () => {
    getContextMock.mockReturnValueOnce(null)
    const engine = mountHost(() => true)
    const spawn = vi.fn(() => ({ steps: 1 }))
    engine.fire(spawn)
    expect(spawn).not.toHaveBeenCalled() // sin ctx no se spawnea
    expect(rafQueue.length).toBe(0)

    engine.fire(() => null) // spawn aborta el disparo
    expect(rafQueue.length).toBe(0)
  })

  it('cancela el RAF al desmontar', () => {
    const engine = mountHost(() => true)
    engine.fire(() => ({ steps: 99 }))
    expect(rafQueue.length).toBe(1)
    act(() => root.unmount())
    expect(vi.mocked(cancelAnimationFrame)).toHaveBeenCalled()
    root = createRoot(container)
  })
})
