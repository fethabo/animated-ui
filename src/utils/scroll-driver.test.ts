import { afterEach, describe, expect, it, vi } from 'vitest'
import { pageProgress, subscribeScroll, viewportProgress } from './scroll-driver'

describe('viewportProgress', () => {
  // Viewport de 1000px, elemento de 500px.
  it('elemento recién asomando por abajo → -1', () => {
    expect(viewportProgress(1000, 500, 1000)).toBe(-1)
  })

  it('elemento centrado en el viewport → 0', () => {
    expect(viewportProgress(250, 500, 1000)).toBe(0)
  })

  it('elemento terminando de salir por arriba → 1', () => {
    expect(viewportProgress(-500, 500, 1000)).toBe(1)
  })

  it('posiciones intermedias son proporcionales', () => {
    // A mitad de camino entre asomar (-1) y centrado (0).
    expect(viewportProgress(625, 500, 1000)).toBeCloseTo(-0.5)
  })

  it('clampea fuera del rango visible', () => {
    expect(viewportProgress(5000, 500, 1000)).toBe(-1)
    expect(viewportProgress(-5000, 500, 1000)).toBe(1)
  })

  it('dimensiones degeneradas → 0 sin dividir por cero', () => {
    expect(viewportProgress(0, 0, 0)).toBe(0)
  })
})

describe('pageProgress', () => {
  it('inicio de página → 0, final → 1, mitad → 0.5', () => {
    expect(pageProgress(0, 3000, 1000)).toBe(0)
    expect(pageProgress(2000, 3000, 1000)).toBe(1)
    expect(pageProgress(1000, 3000, 1000)).toBe(0.5)
  })

  it('página sin overflow → 0 (sin división por cero)', () => {
    expect(pageProgress(0, 1000, 1000)).toBe(0)
    expect(pageProgress(0, 500, 1000)).toBe(0)
  })

  it('clampea valores fuera de rango', () => {
    expect(pageProgress(-50, 3000, 1000)).toBe(0)
    expect(pageProgress(9999, 3000, 1000)).toBe(1)
  })
})

describe('subscribeScroll (coalescing por RAF)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function stubRaf() {
    const pending: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => pending.push(cb))
    vi.stubGlobal('cancelAnimationFrame', () => {})
    return {
      flush() {
        const batch = pending.splice(0)
        batch.forEach((cb) => cb(0))
      },
      get pendingCount() {
        return pending.length
      },
    }
  }

  it('ejecuta el callback al suscribir (posición inicial), tras el primer frame', () => {
    const raf = stubRaf()
    const callback = vi.fn()
    const cleanup = subscribeScroll(callback)
    expect(callback).not.toHaveBeenCalled()
    raf.flush()
    expect(callback).toHaveBeenCalledTimes(1)
    cleanup()
  })

  it('múltiples eventos de scroll en un frame → una sola ejecución', () => {
    const raf = stubRaf()
    const callback = vi.fn()
    const cleanup = subscribeScroll(callback)
    raf.flush() // inicial

    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('resize'))
    expect(raf.pendingCount).toBe(1)
    raf.flush()
    expect(callback).toHaveBeenCalledTimes(2)
    cleanup()
  })

  it('tras el cleanup no ejecuta más', () => {
    const raf = stubRaf()
    const callback = vi.fn()
    const cleanup = subscribeScroll(callback)
    raf.flush()
    cleanup()

    window.dispatchEvent(new Event('scroll'))
    raf.flush()
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
