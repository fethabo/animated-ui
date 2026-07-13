import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { RippleContainer } from './index'

// act() con createRoot requiere este flag fuera de un test runner de React.
;(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

// jsdom no implementa PointerEvent: un MouseEvent con type 'pointerdown'
// dispara el mismo listener.
function pointerDown(el: Element, x = 10, y = 10) {
  el.dispatchEvent(new MouseEvent('pointerdown', { clientX: x, clientY: y, bubbles: true }))
}

describe('RippleContainer: ciclo de vida de las ondas', () => {
  it('crea un nodo de onda por pointerdown, posicionado en la capa de ondas', () => {
    act(() => root.render(createElement(RippleContainer, null, 'contenido')))
    const rippleRoot = container.querySelector('.aui-ripple')!

    pointerDown(rippleRoot)
    const waves = container.querySelectorAll('.aui-ripple-wave')
    expect(waves).toHaveLength(1)
    expect(waves[0].parentElement?.className).toBe('aui-ripple-layer')
  })

  it('clicks rápidos generan ondas concurrentes independientes', () => {
    act(() => root.render(createElement(RippleContainer, null, 'contenido')))
    const rippleRoot = container.querySelector('.aui-ripple')!

    pointerDown(rippleRoot, 5, 5)
    pointerDown(rippleRoot, 20, 20)
    pointerDown(rippleRoot, 40, 10)
    expect(container.querySelectorAll('.aui-ripple-wave')).toHaveLength(3)
  })

  it('remueve cada nodo del DOM al terminar su animación (sin acumular)', () => {
    act(() => root.render(createElement(RippleContainer, null, 'contenido')))
    const rippleRoot = container.querySelector('.aui-ripple')!

    pointerDown(rippleRoot)
    pointerDown(rippleRoot)
    const waves = Array.from(container.querySelectorAll('.aui-ripple-wave'))
    expect(waves).toHaveLength(2)

    waves.forEach((wave) => wave.dispatchEvent(new Event('animationend')))
    expect(container.querySelectorAll('.aui-ripple-wave')).toHaveLength(0)
  })

  it('la capa de ondas no intercepta la interacción (pointer-events none + aria-hidden)', () => {
    act(() => root.render(createElement(RippleContainer, null, 'contenido')))
    const layer = container.querySelector('.aui-ripple-layer')!
    expect(layer.getAttribute('aria-hidden')).toBe('true')
  })

  it('el onPointerDown propio del consumer sigue funcionando', () => {
    let consumerCalls = 0
    act(() =>
      root.render(
        createElement(RippleContainer, { onPointerDown: () => consumerCalls++ }, 'contenido'),
      ),
    )
    const rippleRoot = container.querySelector('.aui-ripple')!

    act(() => pointerDown(rippleRoot))
    expect(consumerCalls).toBe(1)
    expect(container.querySelectorAll('.aui-ripple-wave')).toHaveLength(1)
  })
})
