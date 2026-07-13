import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { CustomCursor } from './index'

// act() con createRoot requiere este flag fuera de un test runner de React.
;(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true

let container: HTMLDivElement
let root: Root
let finePointer = true

const dispatch = (target: Element, type: string, init: MouseEventInit = {}) => {
  act(() => {
    target.dispatchEvent(new MouseEvent(type, { bubbles: true, ...init }))
  })
}

beforeEach(() => {
  finePointer = true
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('hover: hover') ? finePointer : false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

const renderCursor = (children?: unknown) => {
  act(() =>
    root.render(
      createElement(
        CustomCursor,
        null,
        createElement('button', { type: 'button' }, 'botón'),
        children as never,
      ),
    ),
  )
  return container.querySelector('.aui-custom-cursor')!
}

describe('CustomCursor: guarda de dispositivo', () => {
  it('con puntero fino monta dot + ring y oculta el cursor nativo scoped', () => {
    const cursorRoot = renderCursor()
    expect(cursorRoot.querySelector('.aui-custom-cursor-dot')).not.toBeNull()
    expect(cursorRoot.querySelector('.aui-custom-cursor-ring')).not.toBeNull()
    expect(cursorRoot.hasAttribute('data-aui-cursor-native-hidden')).toBe(true)
  })

  it('sin (hover: hover) and (pointer: fine) no monta nodos custom ni toca el cursor', () => {
    finePointer = false
    const cursorRoot = renderCursor()
    expect(cursorRoot.querySelector('.aui-custom-cursor-dot')).toBeNull()
    expect(cursorRoot.querySelector('.aui-custom-cursor-ring')).toBeNull()
    expect(cursorRoot.hasAttribute('data-aui-cursor-native-hidden')).toBe(false)
    expect(cursorRoot.textContent).toContain('botón')
  })
})

describe('CustomCursor: estados por delegación', () => {
  it('expone hover al pasar sobre un elemento interactivo y vuelve a idle al salir de él', () => {
    const cursorRoot = renderCursor()
    const button = cursorRoot.querySelector('button')!

    dispatch(button, 'pointerover')
    expect(cursorRoot.getAttribute('data-aui-cursor-state')).toBe('hover')

    dispatch(cursorRoot, 'pointerover')
    expect(cursorRoot.getAttribute('data-aui-cursor-state')).toBe('idle')
  })

  it('expone down mientras dura la presión y restaura hover al soltar', () => {
    const cursorRoot = renderCursor()
    const button = cursorRoot.querySelector('button')!

    dispatch(button, 'pointerover')
    dispatch(button, 'pointerdown')
    expect(cursorRoot.getAttribute('data-aui-cursor-state')).toBe('down')
    dispatch(button, 'pointerup')
    expect(cursorRoot.getAttribute('data-aui-cursor-state')).toBe('hover')
  })

  it('el movimiento escribe --aui-cursor-x/y en el root sin re-renders', () => {
    const cursorRoot = renderCursor() as HTMLElement
    cursorRoot.getBoundingClientRect = () =>
      ({ left: 10, top: 20, width: 200, height: 100 }) as DOMRect

    dispatch(cursorRoot, 'pointermove', { clientX: 60, clientY: 90 })
    expect(cursorRoot.style.getPropertyValue('--aui-cursor-x')).toBe('50px')
    expect(cursorRoot.style.getPropertyValue('--aui-cursor-y')).toBe('70px')
    expect(cursorRoot.hasAttribute('data-aui-cursor-visible')).toBe(true)

    dispatch(cursorRoot, 'pointerleave')
    expect(cursorRoot.hasAttribute('data-aui-cursor-visible')).toBe(false)
  })
})
