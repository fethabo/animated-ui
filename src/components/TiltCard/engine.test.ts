import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { attachTilt } from './engine'
import type { TiltState } from './types'

const last = <T,>(arr: T[]): T => arr[arr.length - 1]

function mockRect(el: HTMLElement, rect: Partial<DOMRect>) {
  el.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100, x: 0, y: 0, ...rect }) as DOMRect
}

function mockAnimate(el: HTMLElement): Mock {
  const animate = vi.fn(() => ({ commitStyles: vi.fn(), cancel: vi.fn() }))
  ;(el as unknown as { animate: unknown }).animate = animate
  return animate
}

function mouseMove(el: HTMLElement, clientX: number, clientY: number) {
  el.dispatchEvent(new MouseEvent('mousemove', { clientX, clientY, bubbles: true }))
}

describe('attachTilt', () => {
  let host: HTMLElement
  let states: TiltState[]

  beforeEach(() => {
    host = document.createElement('div')
    document.body.appendChild(host)
    mockRect(host, {})
    states = []
  })

  it('calcula el tilt desde la posición del mouse y lo reporta via onState', () => {
    const inst = attachTilt(host, {
      maxAngle: 15,
      reducedMotion: false,
      onState: (s) => states.push(s),
    })

    // Centro exacto → sin rotación.
    mouseMove(host, 100, 50)
    expect(last(states)).toEqual({ tiltX: 0, tiltY: 0, isHovering: true })

    // Borde derecho, centro vertical → rotateY máximo positivo.
    mouseMove(host, 200, 50)
    expect(last(states)).toEqual({ tiltX: 0, tiltY: 15, isHovering: true })

    // Borde superior, centro horizontal → rotateX máximo positivo.
    mouseMove(host, 100, 0)
    expect(last(states)).toEqual({ tiltX: 15, tiltY: 0, isHovering: true })

    inst.destroy()
  })

  it('anima el target con WAAPI incluyendo perspective en modo hook', () => {
    const animate = mockAnimate(host)
    const inst = attachTilt(host, { maxAngle: 10, reducedMotion: false, perspective: 800 })

    mouseMove(host, 200, 50)
    const [keyframes, timing] = last(animate.mock.calls) as unknown as [
      Array<Record<string, string>>,
      KeyframeAnimationOptions,
    ]
    expect(keyframes[0].transform).toBe('perspective(800px) rotateX(0deg) rotateY(10deg)')
    expect(timing).toMatchObject({ duration: 150, fill: 'forwards' })
    inst.destroy()
  })

  it('sin perspective el transform es solo rotación (modo componente)', () => {
    const target = document.createElement('div')
    const animate = mockAnimate(target)
    const inst = attachTilt(host, { maxAngle: 10, reducedMotion: false }, target)

    mouseMove(host, 200, 50)
    const [keyframes] = last(animate.mock.calls) as unknown as [Array<Record<string, string>>]
    expect(keyframes[0].transform).toBe('rotateX(0deg) rotateY(10deg)')
    inst.destroy()
  })

  it('con reducedMotion reporta hover pero sin rotación', () => {
    const inst = attachTilt(host, {
      maxAngle: 15,
      reducedMotion: true,
      onState: (s) => states.push(s),
    })

    mouseMove(host, 200, 0)
    expect(last(states)).toEqual({ tiltX: 0, tiltY: 0, isHovering: true })
    inst.destroy()
  })

  it('mouseleave vuelve al estado neutral', () => {
    const inst = attachTilt(host, {
      maxAngle: 15,
      reducedMotion: false,
      onState: (s) => states.push(s),
    })

    mouseMove(host, 200, 50)
    host.dispatchEvent(new MouseEvent('mouseleave'))
    expect(last(states)).toEqual({ tiltX: 0, tiltY: 0, isHovering: false })
    inst.destroy()
  })

  it('update cambia maxAngle en vivo sin re-atar', () => {
    const inst = attachTilt(host, {
      maxAngle: 15,
      reducedMotion: false,
      onState: (s) => states.push(s),
    })

    inst.update({ maxAngle: 30 })
    mouseMove(host, 200, 50)
    expect(last(states)?.tiltY).toBe(30)
    inst.destroy()
  })

  it('destroy remueve los listeners y cancela la animación', () => {
    const animate = mockAnimate(host)
    const inst = attachTilt(host, {
      maxAngle: 15,
      reducedMotion: false,
      onState: (s) => states.push(s),
    })

    mouseMove(host, 200, 50)
    const animation = last(animate.mock.results).value as { cancel: Mock }
    inst.destroy()

    expect(animation.cancel).toHaveBeenCalled()
    const count = states.length
    mouseMove(host, 100, 50)
    expect(states).toHaveLength(count)
  })
})
