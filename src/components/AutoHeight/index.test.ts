import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { AutoHeight } from './index'

// act() con createRoot requiere este flag fuera de un test runner de React.
;(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true

// jsdom no tiene layout: los rects del root salen de una cola de medidas
// programadas por el test (el componente mide 1 vez por commit en reposo y
// 2 en vuelo: altura visual + altura destino). WAAPI se stubbea en el
// prototipo y los tests afirman sobre las llamadas.
interface FakeAnimation {
  cancel: Mock
  onfinish: (() => void) | null
  oncancel: (() => void) | null
}

let animateMock: Mock
let animations: FakeAnimation[]
let rectQueue: { h: number; w: number }[]
let container: HTMLDivElement
let root: Root

function mockRect(this: HTMLElement): DOMRect {
  let h = 0
  let w = 350
  if (this.classList.contains('aui-autoheight')) {
    const next = rectQueue.length > 1 ? rectQueue.shift()! : rectQueue[0] ?? { h: 0, w: 0 }
    h = next.h
    w = next.w
  }
  return {
    left: 0,
    top: 0,
    width: w,
    height: h,
    right: w,
    bottom: h,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect
}

beforeEach(() => {
  animations = []
  rectQueue = []
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
  vi.unstubAllGlobals()
})

const render = (text: string, props: Record<string, unknown> = {}) =>
  act(() => root.render(createElement(AutoHeight, props, text)))

const rootEl = () => container.querySelector('.aui-autoheight') as HTMLElement

describe('AutoHeight: transición de altura', () => {
  it('la primera medición (montaje) no anima', () => {
    rectQueue = [{ h: 100, w: 400 }]
    render('a')
    expect(animateMock).not.toHaveBeenCalled()
  })

  it('un cambio de contenido anima entre la altura previa y la nueva, sin fijar height inline', () => {
    rectQueue = [{ h: 100, w: 400 }]
    render('a')
    rectQueue = [{ h: 300, w: 400 }]
    render('contenido más alto', { duration: 0.4 })
    expect(animateMock).toHaveBeenCalledOnce()
    const [keyframes, options] = animateMock.mock.calls[0] as [Keyframe[], KeyframeEffectOptions]
    expect(keyframes[0]).toMatchObject({ height: '100px', overflow: 'hidden' })
    expect(keyframes[1]).toMatchObject({ height: '300px', overflow: 'hidden' })
    expect(options.duration).toBe(400)
    // La altura real nunca se fija inline: al expirar el efecto queda `auto`.
    expect(rootEl().style.height).toBe('')
    animations[0].onfinish?.()
    expect(rootEl().style.height).toBe('')
  })

  it('sin cambio de tamaño no anima', () => {
    rectQueue = [{ h: 100, w: 400 }]
    render('a')
    render('a', { duration: 0.5 })
    expect(animateMock).not.toHaveBeenCalled()
  })

  it('un cambio en vuelo redirige desde la altura visual actual, sin saltos', () => {
    rectQueue = [{ h: 100, w: 400 }]
    render('a')
    rectQueue = [{ h: 300, w: 400 }]
    render('b')
    expect(animateMock).toHaveBeenCalledOnce()
    // En vuelo a 220px de altura visual, el contenido vuelve a cambiar.
    rectQueue = [
      { h: 220, w: 400 },
      { h: 400, w: 400 },
    ]
    render('c')
    expect(animations[0].cancel).toHaveBeenCalled()
    const [keyframes] = animateMock.mock.calls[1] as [Keyframe[]]
    expect(keyframes[0]).toMatchObject({ height: '220px' })
    expect(keyframes[1]).toMatchObject({ height: '400px' })
  })
})

describe('AutoHeight: modo width', () => {
  it('anima también el ancho y fija/restaura el ancho del contenido durante la transición', () => {
    rectQueue = [{ h: 100, w: 200 }]
    render('a', { width: true })
    rectQueue = [{ h: 100, w: 500 }]
    render('b', { width: true })
    expect(animateMock).toHaveBeenCalledOnce()
    const [keyframes] = animateMock.mock.calls[0] as [Keyframe[]]
    expect(keyframes[0]).toMatchObject({ width: '200px' })
    expect(keyframes[1]).toMatchObject({ width: '500px' })
    // El contenido queda fijado a su ancho destino mientras anima…
    const content = container.querySelector('.aui-autoheight-content') as HTMLElement
    expect(content.style.width).toBe('350px')
    // …y se restaura al terminar.
    animations[0].onfinish?.()
    expect(content.style.width).toBe('')
  })

  it('sin la prop width los cambios de ancho no animan', () => {
    rectQueue = [{ h: 100, w: 200 }]
    render('a')
    rectQueue = [{ h: 100, w: 500 }]
    render('b')
    expect(animateMock).not.toHaveBeenCalled()
  })
})

describe('AutoHeight: reduced motion', () => {
  it('con prefers-reduced-motion el ajuste es instantáneo manteniendo height auto', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      addEventListener: () => {},
      removeEventListener: () => {},
    }))
    rectQueue = [{ h: 100, w: 400 }]
    render('a')
    rectQueue = [{ h: 300, w: 400 }]
    render('b')
    expect(animateMock).not.toHaveBeenCalled()
    expect(rootEl().style.height).toBe('')
  })
})
