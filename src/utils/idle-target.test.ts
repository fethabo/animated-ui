import { afterEach, describe, expect, it, vi } from 'vitest'
import { clampDistance, createIdleWatcher, rectCenter, resolveTargetElement, vectorTo } from './idle-target'

describe('rectCenter', () => {
  it('calcula el centro del rect', () => {
    expect(rectCenter({ left: 10, top: 20, width: 100, height: 40 })).toEqual({ x: 60, y: 40 })
  })
})

describe('vectorTo', () => {
  const rect = { left: 100, top: 0, width: 40, height: 40 } // centro (120, 20)

  it('apunta hacia la derecha cuando el target está a la derecha', () => {
    const v = vectorTo({ x: 0, y: 20 }, rect)
    expect(v.dx).toBe(120)
    expect(v.dy).toBe(0)
    expect(v.distance).toBe(120)
    expect(v.angle).toBe(0)
  })

  it('calcula ángulo y distancia diagonales', () => {
    const v = vectorTo({ x: 120, y: 20 }, { left: 120, top: 20, width: 0, height: 0 })
    // mismo punto → distancia 0, ángulo 0 (sin NaN)
    expect(v.distance).toBe(0)
    expect(v.angle).toBe(0)
  })

  it('orienta hacia abajo-derecha', () => {
    const v = vectorTo({ x: 0, y: 0 }, { left: 10, top: 10, width: 0, height: 0 })
    expect(v.angle).toBeCloseTo(Math.PI / 4)
  })
})

describe('clampDistance', () => {
  it('limita a max cuando supera', () => {
    expect(clampDistance(500, 240)).toBe(240)
  })
  it('respeta distancias menores', () => {
    expect(clampDistance(100, 240)).toBe(100)
  })
  it('max <= 0 no limita', () => {
    expect(clampDistance(500, 0)).toBe(500)
  })
})

describe('resolveTargetElement', () => {
  it('devuelve null sin target (modo ambient)', () => {
    expect(resolveTargetElement(null)).toBeNull()
    expect(resolveTargetElement(undefined)).toBeNull()
  })

  it('acepta un Element directo', () => {
    const el = document.createElement('div')
    expect(resolveTargetElement(el)).toBe(el)
  })

  it('acepta un RefObject', () => {
    const el = document.createElement('button')
    expect(resolveTargetElement({ current: el })).toBe(el)
  })

  it('acepta un selector CSS', () => {
    const el = document.createElement('div')
    el.id = 'cta-test'
    document.body.appendChild(el)
    expect(resolveTargetElement('#cta-test')).toBe(el)
    el.remove()
  })

  it('selector sin match devuelve null (degrada a ambient)', () => {
    expect(resolveTargetElement('#no-existe-jamas')).toBeNull()
  })
})

describe('createIdleWatcher', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  function makeElement() {
    const el = document.createElement('div')
    el.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 200 }) as DOMRect
    document.body.appendChild(el)
    return el
  }

  // jsdom no implementa PointerEvent: simulamos uno con las props que lee el handler.
  function pointerMove(el: HTMLElement, clientX: number, clientY: number) {
    const ev = new Event('pointermove') as Event & {
      pointerType: string
      clientX: number
      clientY: number
    }
    ev.pointerType = 'mouse'
    ev.clientX = clientX
    ev.clientY = clientY
    el.dispatchEvent(ev)
  }

  it('dispara onIdle tras idleDelay sin movimiento', () => {
    vi.useFakeTimers()
    const el = makeElement()
    const onIdle = vi.fn()
    const onActive = vi.fn()
    const cleanup = createIdleWatcher({ element: el, idleDelay: 1000, onIdle, onActive })
    expect(onIdle).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1000)
    expect(onIdle).toHaveBeenCalledTimes(1)
    cleanup()
    el.remove()
  })

  it('un movimiento reinicia el timer y llama onActive', () => {
    vi.useFakeTimers()
    const el = makeElement()
    const onIdle = vi.fn()
    const onActive = vi.fn()
    const cleanup = createIdleWatcher({ element: el, idleDelay: 1000, onIdle, onActive })
    vi.advanceTimersByTime(800)
    pointerMove(el, 50, 60)
    expect(onActive).toHaveBeenCalled()
    vi.advanceTimersByTime(800) // 1600 total, pero el timer se reinició a los 800
    expect(onIdle).not.toHaveBeenCalled()
    vi.advanceTimersByTime(200)
    expect(onIdle).toHaveBeenCalledTimes(1)
    cleanup()
    el.remove()
  })

  it('reporta la última posición del cursor relativa al elemento', () => {
    vi.useFakeTimers()
    const el = makeElement()
    let captured: { x: number; y: number } | null = null
    const cleanup = createIdleWatcher({
      element: el,
      idleDelay: 500,
      onIdle: (c) => (captured = c),
      onActive: () => {},
    })
    pointerMove(el, 30, 40)
    vi.advanceTimersByTime(500)
    expect(captured).toEqual({ x: 30, y: 40 })
    cleanup()
    el.remove()
  })

  it('tras cleanup no dispara más', () => {
    vi.useFakeTimers()
    const el = makeElement()
    const onIdle = vi.fn()
    const cleanup = createIdleWatcher({ element: el, idleDelay: 500, onIdle, onActive: () => {} })
    cleanup()
    vi.advanceTimersByTime(1000)
    expect(onIdle).not.toHaveBeenCalled()
    el.remove()
  })
})
