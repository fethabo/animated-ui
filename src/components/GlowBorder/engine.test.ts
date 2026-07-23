import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { attachGlow, GLOW_CSS } from './engine'

const last = <T,>(arr: T[]): T => arr[arr.length - 1]

function mockRect(el: HTMLElement) {
  el.getBoundingClientRect = () =>
    ({ left: 10, top: 20, width: 200, height: 100, right: 210, bottom: 120, x: 10, y: 20 }) as DOMRect
}

function mockAnimate(el: HTMLElement): Mock {
  const animate = vi.fn(() => ({ commitStyles: vi.fn(), cancel: vi.fn() }))
  ;(el as unknown as { animate: unknown }).animate = animate
  return animate
}

function mouseMove(el: HTMLElement, clientX: number, clientY: number) {
  el.dispatchEvent(new MouseEvent('mousemove', { clientX, clientY, bubbles: true }))
}

describe('attachGlow', () => {
  let host: HTMLElement

  beforeEach(() => {
    document.getElementById('aui-glow-border-styles')?.remove()
    host = document.createElement('div')
    host.appendChild(document.createElement('p'))
    document.body.appendChild(host)
    mockRect(host)
  })

  it('inyecta el CSS una sola vez', () => {
    const inst = attachGlow(host, { followCursor: false, reducedMotion: false, decorate: false })
    expect(document.getElementById('aui-glow-border-styles')?.textContent).toBe(GLOW_CSS)
    inst.destroy()
  })

  it('en modo decorado agrega clase, vars, capa como primera hija y el atributo de loop', () => {
    const inst = attachGlow(host, {
      followCursor: false,
      reducedMotion: false,
      decorate: true,
      colors: ['#f00', '#0f0'],
      speed: 6,
    })

    expect(host.classList.contains('aui-glow')).toBe(true)
    expect(host.style.getPropertyValue('--aui-glow-color-1')).toBe('#f00')
    expect(host.style.getPropertyValue('--aui-glow-speed')).toBe('6s')
    expect(host.firstElementChild?.className).toBe('aui-glow-layer')
    expect(host.hasAttribute('data-aui-loop')).toBe(true)
    inst.destroy()
  })

  it('con reducedMotion el loop queda apagado; update lo re-evalúa en vivo', () => {
    const inst = attachGlow(host, { followCursor: false, reducedMotion: true, decorate: true })
    expect(host.hasAttribute('data-aui-loop')).toBe(false)

    inst.update({ reducedMotion: false })
    expect(host.hasAttribute('data-aui-loop')).toBe(true)

    inst.update({ followCursor: true })
    expect(host.hasAttribute('data-aui-loop')).toBe(false)
    inst.destroy()
  })

  it('followCursor anima la capa hacia el ángulo del cursor con WAAPI', () => {
    const inst = attachGlow(host, { followCursor: true, reducedMotion: false, decorate: true })
    const layer = host.querySelector('.aui-glow-layer') as HTMLElement
    const animate = mockAnimate(layer)

    // Cursor a la derecha del centro (110, 70) → atan2(0, 100) + 90 = 90°.
    mouseMove(host, 210, 70)
    const [keyframes, timing] = last(animate.mock.calls) as unknown as [
      Array<Record<string, string>>,
      KeyframeAnimationOptions,
    ]
    expect(keyframes[0].transform).toBe('rotate(90deg)')
    expect(timing).toMatchObject({ duration: 200, fill: 'forwards' })
    inst.destroy()
  })

  it('en modo componente anima la capa provista y no decora el host', () => {
    const layer = document.createElement('div')
    const animate = mockAnimate(layer)
    const inst = attachGlow(host, { followCursor: true, reducedMotion: false, decorate: false }, layer)

    mouseMove(host, 210, 70)
    expect(animate).toHaveBeenCalled()
    expect(host.classList.contains('aui-glow')).toBe(false)
    expect(host.hasAttribute('data-aui-loop')).toBe(false)
    inst.destroy()
  })

  it('sin followCursor el mousemove no anima', () => {
    const layer = document.createElement('div')
    const animate = mockAnimate(layer)
    const inst = attachGlow(host, { followCursor: false, reducedMotion: false, decorate: false }, layer)

    mouseMove(host, 210, 70)
    expect(animate).not.toHaveBeenCalled()
    inst.destroy()
  })

  it('destroy restaura el host por completo', () => {
    const inst = attachGlow(host, {
      followCursor: false,
      reducedMotion: false,
      decorate: true,
      colors: ['#f00'],
    })
    inst.destroy()

    expect(host.classList.contains('aui-glow')).toBe(false)
    expect(host.querySelector('.aui-glow-layer')).toBeNull()
    expect(host.hasAttribute('data-aui-loop')).toBe(false)
    expect(host.style.getPropertyValue('--aui-glow-color-1')).toBe('')
    expect(host.children).toHaveLength(1)
  })
})
