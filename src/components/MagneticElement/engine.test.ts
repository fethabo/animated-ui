import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { attachMagnetic } from './engine'
import type { MagneticState } from './types'

const last = <T,>(arr: T[]): T => arr[arr.length - 1]

function mockRect(el: HTMLElement) {
  el.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100, x: 0, y: 0 }) as DOMRect
}

function mockAnimate(el: HTMLElement): Mock {
  const animate = vi.fn(() => ({ commitStyles: vi.fn(), cancel: vi.fn() }))
  ;(el as unknown as { animate: unknown }).animate = animate
  return animate
}

function mouseMove(el: HTMLElement, clientX: number, clientY: number) {
  el.dispatchEvent(new MouseEvent('mousemove', { clientX, clientY, bubbles: true }))
}

describe('attachMagnetic', () => {
  let host: HTMLElement
  let states: MagneticState[]

  beforeEach(() => {
    host = document.createElement('div')
    document.body.appendChild(host)
    mockRect(host)
    states = []
  })

  it('calcula el offset proporcional a la distancia al centro escalado por strength', () => {
    const inst = attachMagnetic(host, {
      strength: 0.35,
      reducedMotion: false,
      onState: (s) => states.push(s),
    })

    // Centro exacto → sin desplazamiento.
    mouseMove(host, 100, 50)
    expect(last(states)).toEqual({ offsetX: 0, offsetY: 0, isActive: true })

    // Borde derecho → offset máximo horizontal (100px del centro × 0.35).
    mouseMove(host, 200, 50)
    expect(last(states)).toEqual({ offsetX: 35, offsetY: 0, isActive: true })

    inst.destroy()
  })

  it('anima el target con translate y easing estándar en movimiento', () => {
    const animate = mockAnimate(host)
    const inst = attachMagnetic(host, { strength: 0.5, reducedMotion: false })

    mouseMove(host, 200, 50)
    const [keyframes, timing] = last(animate.mock.calls) as unknown as [
      Array<Record<string, string>>,
      KeyframeAnimationOptions,
    ]
    expect(keyframes[0].transform).toBe('translate(50px, 0px)')
    expect(timing).toMatchObject({ duration: 150, easing: 'ease-out' })
    inst.destroy()
  })

  it('mouseleave vuelve al origen con easing elástico', () => {
    const animate = mockAnimate(host)
    const inst = attachMagnetic(host, {
      strength: 0.35,
      reducedMotion: false,
      onState: (s) => states.push(s),
    })

    mouseMove(host, 200, 50)
    host.dispatchEvent(new MouseEvent('mouseleave'))

    expect(last(states)).toEqual({ offsetX: 0, offsetY: 0, isActive: false })
    const [keyframes, timing] = last(animate.mock.calls) as unknown as [
      Array<Record<string, string>>,
      KeyframeAnimationOptions,
    ]
    expect(keyframes[0].transform).toBe('translate(0px, 0px)')
    expect(timing).toMatchObject({ duration: 450, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' })
    inst.destroy()
  })

  it('con reducedMotion reporta isActive una sola vez y sin offsets', () => {
    const inst = attachMagnetic(host, {
      strength: 0.35,
      reducedMotion: true,
      onState: (s) => states.push(s),
    })

    mouseMove(host, 200, 50)
    mouseMove(host, 150, 50)
    expect(states).toHaveLength(1)
    expect(states[0]).toEqual({ offsetX: 0, offsetY: 0, isActive: true })
    inst.destroy()
  })

  it('el target puede ser un elemento distinto al host (modo componente)', () => {
    const content = document.createElement('div')
    const animate = mockAnimate(content)
    const inst = attachMagnetic(host, { strength: 0.35, reducedMotion: false }, content)

    mouseMove(host, 200, 50)
    expect(animate).toHaveBeenCalled()
    inst.destroy()
  })

  it('update cambia strength en vivo sin re-atar', () => {
    const inst = attachMagnetic(host, {
      strength: 0.35,
      reducedMotion: false,
      onState: (s) => states.push(s),
    })

    inst.update({ strength: 1 })
    mouseMove(host, 200, 50)
    expect(last(states)?.offsetX).toBe(100)
    inst.destroy()
  })

  it('destroy remueve los listeners', () => {
    const inst = attachMagnetic(host, {
      strength: 0.35,
      reducedMotion: false,
      onState: (s) => states.push(s),
    })

    mouseMove(host, 200, 50)
    const count = states.length
    inst.destroy()
    mouseMove(host, 100, 50)
    expect(states).toHaveLength(count)
  })
})
