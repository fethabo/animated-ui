import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { AnimatedList } from './index'

// act() con createRoot requiere este flag fuera de un test runner de React.
;(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true

// jsdom no tiene layout ni WAAPI: los rects se mockean por posición en el DOM
// (index * 50 de alto) y `animate` se stubbea en el prototipo, así los
// wrappers y los clones lo heredan. Los tests afirman sobre las llamadas.
interface FakeAnimation {
  cancel: Mock
  onfinish: (() => void) | null
  oncancel: (() => void) | null
}

const ITEM_HEIGHT = 50
let animateMock: Mock
let animations: FakeAnimation[]
let container: HTMLDivElement
let root: Root

function mockRect(this: HTMLElement): DOMRect {
  let top = 0
  if (this.classList.contains('aui-animated-list-item')) {
    const parent = this.parentElement
    const index = parent ? Array.prototype.indexOf.call(parent.children, this) : 0
    top = index * ITEM_HEIGHT
  }
  return {
    left: 0,
    top,
    width: 100,
    height: 40,
    right: 100,
    bottom: top + 40,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect
}

beforeEach(() => {
  animations = []
  animateMock = vi.fn((): FakeAnimation => {
    const animation: FakeAnimation = {
      onfinish: null,
      oncancel: null,
      cancel: vi.fn(() => animation.oncancel?.()),
    }
    animations.push(animation)
    return animation
  })
  Object.defineProperty(HTMLElement.prototype, 'animate', {
    configurable: true,
    writable: true,
    value: animateMock,
  })
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(mockRect)
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  delete (HTMLElement.prototype as unknown as Record<string, unknown>).animate
  vi.restoreAllMocks()
})

const item = (key: string) => createElement('span', { key }, key)
const list = (keys: string[], props: Record<string, unknown> = {}) =>
  createElement(AnimatedList, props, keys.map(item))

const wrappers = () => [
  ...container.querySelectorAll('.aui-animated-list-item:not(.aui-animated-list-exit)'),
]
const transformCalls = () =>
  animateMock.mock.calls.filter((call) => 'transform' in (call[0] as Keyframe[])[0])

describe('AnimatedList: reordenamiento FLIP', () => {
  it('el primer render no anima', () => {
    act(() => root.render(list(['a', 'b', 'c'])))
    expect(animateMock).not.toHaveBeenCalled()
  })

  it('un reorden llama a animate con la inversión esperada (First - Last)', () => {
    act(() => root.render(list(['a', 'b', 'c'])))
    act(() => root.render(list(['c', 'a', 'b'])))
    // c: fila 2 → fila 0 ⇒ inversión +100px. a: fila 0 → fila 1 ⇒ -50px.
    const keyframes = transformCalls().map((call) => (call[0] as Keyframe[])[0].transform)
    expect(keyframes).toContain(`translate(0px, ${2 * ITEM_HEIGHT - 0}px)`)
    expect(keyframes).toContain(`translate(0px, ${0 - ITEM_HEIGHT}px)`)
    // Todas las inversiones terminan en identidad.
    for (const call of transformCalls()) {
      expect((call[0] as Keyframe[])[1].transform).toBe('translate(0px, 0px)')
    }
  })

  it('sin cambio de posiciones no lanza animaciones (inversión identidad)', () => {
    act(() => root.render(list(['a', 'b'])))
    act(() => root.render(list(['a', 'b'], { duration: 0.5 })))
    expect(animateMock).not.toHaveBeenCalled()
  })

  it('un segundo reorden en vuelo cancela la animación anterior del elemento', () => {
    act(() => root.render(list(['a', 'b', 'c'])))
    act(() => root.render(list(['c', 'a', 'b'])))
    const inFlight = animations.length
    expect(inFlight).toBeGreaterThan(0)
    act(() => root.render(list(['b', 'c', 'a'])))
    // Cada elemento re-animado canceló su animación en vuelo antes de medir Last.
    expect(animations.slice(0, inFlight).some((a) => a.cancel.mock.calls.length > 0)).toBe(true)
  })

  it('usa la duración y easing configurados', () => {
    act(() => root.render(list(['a', 'b'], { duration: 0.6, easing: 'ease-in-out' })))
    act(() => root.render(list(['b', 'a'], { duration: 0.6, easing: 'ease-in-out' })))
    const options = transformCalls()[0][1] as KeyframeEffectOptions
    expect(options.duration).toBe(600)
    expect(options.easing).toBe('ease-in-out')
  })
})

describe('AnimatedList: entradas', () => {
  it('una key nueva recibe el preset de entrada (fade default)', () => {
    act(() => root.render(list(['a', 'b'])))
    act(() => root.render(list(['a', 'b', 'c'])))
    const fadeCall = animateMock.mock.calls.find(
      (call) => (call[0] as Keyframe[])[0].opacity === 0,
    )
    expect(fadeCall).toBeDefined()
    expect((fadeCall![0] as Keyframe[])[1].opacity).toBe(1)
  })

  it('el preset scale-in incluye transform', () => {
    act(() => root.render(list(['a'], { enter: 'scale-in' })))
    act(() => root.render(list(['a', 'b'], { enter: 'scale-in' })))
    const call = animateMock.mock.calls.find((c) => (c[0] as Keyframe[])[0].opacity === 0)
    expect((call![0] as Keyframe[])[0].transform).toBe('scale(0.85)')
  })

  it('el stagger escalona los delays de entradas simultáneas', () => {
    act(() => root.render(list(['a'], { stagger: 0.1 })))
    act(() => root.render(list(['a', 'b', 'c'], { stagger: 0.1 })))
    const delays = animateMock.mock.calls
      .filter((call) => (call[0] as Keyframe[])[0].opacity === 0)
      .map((call) => (call[1] as KeyframeEffectOptions).delay)
    expect(delays).toEqual([0, 100])
  })

  it("con enter='none' las keys nuevas no animan", () => {
    act(() => root.render(list(['a'], { enter: 'none' })))
    act(() => root.render(list(['a', 'b'], { enter: 'none' })))
    expect(animateMock).not.toHaveBeenCalled()
  })
})

describe('AnimatedList: salidas por clon', () => {
  it('una key removida crea un clon aria-hidden posicionado y lo remueve en finish', () => {
    act(() => root.render(list(['a', 'b'])))
    act(() => root.render(list(['a'])))
    const clone = container.querySelector('.aui-animated-list-exit') as HTMLElement
    expect(clone).not.toBeNull()
    expect(clone.getAttribute('aria-hidden')).toBe('true')
    expect(clone.textContent).toBe('b')
    // Posicionado en el último rect conocido (fila 1).
    expect(clone.style.top).toBe(`${ITEM_HEIGHT}px`)
    expect(clone.style.width).toBe('100px')
    // El hijo real ya no está en el render.
    expect(wrappers()).toHaveLength(1)
    // La animación de salida es un fade sobre el clon.
    const exitAnimation = animations[animations.length - 1]
    exitAnimation.onfinish?.()
    expect(container.querySelector('.aui-animated-list-exit')).toBeNull()
  })

  it("con exit='none' no crea clones", () => {
    act(() => root.render(list(['a', 'b'], { exit: 'none' })))
    act(() => root.render(list(['a'], { exit: 'none' })))
    expect(container.querySelector('.aui-animated-list-exit')).toBeNull()
  })

  it('al desmontar no quedan clones residuales en el DOM', () => {
    act(() => root.render(list(['a', 'b'])))
    act(() => root.render(list(['a'])))
    expect(container.querySelector('.aui-animated-list-exit')).not.toBeNull()
    act(() => root.unmount())
    expect(container.querySelector('.aui-animated-list-exit')).toBeNull()
    // El afterEach vuelve a desmontar sin efecto.
  })
})

describe('AnimatedList: reduced motion', () => {
  it('con prefers-reduced-motion los cambios son instantáneos, sin FLIP ni clones', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      addEventListener: () => {},
      removeEventListener: () => {},
    }))
    act(() => root.render(list(['a', 'b', 'c'])))
    act(() => root.render(list(['c', 'a'])))
    expect(animateMock).not.toHaveBeenCalled()
    expect(container.querySelector('.aui-animated-list-exit')).toBeNull()
    expect(wrappers().map((w) => w.textContent)).toEqual(['c', 'a'])
  })
})
