import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import {
  cancelTracked,
  createTracker,
  hasTracked,
  playInversion,
  playKeyframes,
  type AnimationTracker,
} from './flip-play'

// jsdom no implementa WAAPI: se stubbea `element.animate` con una Animation
// falsa que expone onfinish/oncancel para disparar el ciclo de vida a mano.
interface FakeAnimation {
  cancel: Mock
  onfinish: (() => void) | null
  oncancel: (() => void) | null
}

function stubAnimate(element: HTMLElement): Mock {
  const animate = vi.fn((): FakeAnimation => {
    const animation: FakeAnimation = {
      onfinish: null,
      oncancel: null,
      cancel: vi.fn(() => animation.oncancel?.()),
    }
    return animation
  })
  ;(element as unknown as { animate: Mock }).animate = animate
  return animate
}

let tracker: AnimationTracker
let element: HTMLElement

beforeEach(() => {
  tracker = createTracker()
  element = document.createElement('div')
})

describe('playKeyframes: lanzamiento y rastreo', () => {
  it('llama a element.animate con los keyframes y el timing', () => {
    const animate = stubAnimate(element)
    playKeyframes(tracker, element, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 300,
      easing: 'ease-out',
      delay: 50,
    })
    expect(animate).toHaveBeenCalledWith(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 300, easing: 'ease-out', delay: 50 },
    )
    expect(hasTracked(tracker, element)).toBe(true)
  })

  it('retorna null y no rastrea si el entorno no soporta WAAPI', () => {
    const animation = playKeyframes(tracker, element, [{ opacity: 0 }], {
      duration: 300,
      easing: 'ease',
    })
    expect(animation).toBeNull()
    expect(hasTracked(tracker, element)).toBe(false)
  })

  it('un segundo play sobre el mismo elemento cancela la animación en vuelo', () => {
    stubAnimate(element)
    const first = playKeyframes(tracker, element, [{ opacity: 0 }], {
      duration: 300,
      easing: 'ease',
    }) as unknown as FakeAnimation
    const second = playKeyframes(tracker, element, [{ opacity: 1 }], {
      duration: 300,
      easing: 'ease',
    }) as unknown as FakeAnimation
    expect(first.cancel).toHaveBeenCalledOnce()
    expect(second.cancel).not.toHaveBeenCalled()
    expect(tracker.get(element)).toBe(second as unknown as Animation)
  })

  it('onSettled corre una única vez al terminar', () => {
    stubAnimate(element)
    const onSettled = vi.fn()
    const animation = playKeyframes(
      tracker,
      element,
      [{ opacity: 0 }],
      { duration: 300, easing: 'ease' },
      onSettled,
    ) as unknown as FakeAnimation
    animation.onfinish?.()
    animation.oncancel?.()
    expect(onSettled).toHaveBeenCalledOnce()
  })

  it('onSettled también corre si la animación se cancela por interrupción', () => {
    stubAnimate(element)
    const onSettled = vi.fn()
    playKeyframes(tracker, element, [{ opacity: 0 }], { duration: 300, easing: 'ease' }, onSettled)
    cancelTracked(tracker, element)
    expect(onSettled).toHaveBeenCalledOnce()
  })

  it('al terminar (onfinish) la animación se desregistra sola', () => {
    stubAnimate(element)
    const animation = playKeyframes(tracker, element, [{ opacity: 0 }], {
      duration: 300,
      easing: 'ease',
    }) as unknown as FakeAnimation
    animation.onfinish?.()
    expect(hasTracked(tracker, element)).toBe(false)
  })
})

describe('cancelTracked', () => {
  it('cancela y desregistra la animación en vuelo', () => {
    stubAnimate(element)
    const animation = playKeyframes(tracker, element, [{ opacity: 0 }], {
      duration: 300,
      easing: 'ease',
    }) as unknown as FakeAnimation
    cancelTracked(tracker, element)
    expect(animation.cancel).toHaveBeenCalledOnce()
    expect(hasTracked(tracker, element)).toBe(false)
  })

  it('sin animación en vuelo es un no-op', () => {
    expect(() => cancelTracked(tracker, element)).not.toThrow()
  })

  it('el rastreo es local al tracker: otro tracker no ve la animación', () => {
    stubAnimate(element)
    playKeyframes(tracker, element, [{ opacity: 0 }], { duration: 300, easing: 'ease' })
    const other = createTracker()
    expect(hasTracked(other, element)).toBe(false)
  })
})

describe('playInversion: keyframes FLIP', () => {
  it('anima desde la inversión hacia identidad (solo traslación)', () => {
    const animate = stubAnimate(element)
    playInversion(
      tracker,
      element,
      { dx: -100, dy: -50, sx: 1, sy: 1 },
      { duration: 350, easing: 'ease' },
    )
    expect(animate).toHaveBeenCalledWith(
      [{ transform: 'translate(-100px, -50px)' }, { transform: 'translate(0px, 0px)' }],
      { duration: 350, easing: 'ease', delay: 0 },
    )
  })

  it('incluye scale solo cuando la inversión lo trae', () => {
    const animate = stubAnimate(element)
    playInversion(
      tracker,
      element,
      { dx: 10, dy: 0, sx: 0.5, sy: 2 },
      { duration: 350, easing: 'ease' },
    )
    expect(animate).toHaveBeenCalledWith(
      [
        { transform: 'translate(10px, 0px) scale(0.5, 2)' },
        { transform: 'translate(0px, 0px) scale(1, 1)' },
      ],
      { duration: 350, easing: 'ease', delay: 0 },
    )
  })
})
