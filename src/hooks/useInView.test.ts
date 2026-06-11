import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, createElement, useRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { useInView, type UseInViewOptions } from './useInView'

// act() con createRoot requiere este flag fuera de un test runner de React.
;(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true

type IOCallback = (entries: Array<{ isIntersecting: boolean }>) => void

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  callback: IOCallback
  options: IntersectionObserverInit | undefined
  observed: Element[] = []
  disconnected = false

  constructor(callback: IOCallback, options?: IntersectionObserverInit) {
    this.callback = callback
    this.options = options
    MockIntersectionObserver.instances.push(this)
  }

  observe(element: Element) {
    this.observed.push(element)
  }

  disconnect() {
    this.disconnected = true
  }

  unobserve() {}

  trigger(isIntersecting: boolean) {
    act(() => this.callback([{ isIntersecting }]))
  }
}

function Probe({ options }: { options?: UseInViewOptions }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, options)
  return createElement('div', { ref, 'data-inview': String(inView) })
}

let container: HTMLDivElement
let root: Root

function mount(options?: UseInViewOptions) {
  act(() => root.render(createElement(Probe, { options })))
  return () => container.firstElementChild?.getAttribute('data-inview')
}

beforeEach(() => {
  MockIntersectionObserver.instances = []
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

describe('useInView', () => {
  it('reporta false hasta que el elemento interseca, y true al entrar', () => {
    const inView = mount()
    expect(inView()).toBe('false')

    const observer = MockIntersectionObserver.instances[0]
    expect(observer.observed).toHaveLength(1)
    observer.trigger(true)
    expect(inView()).toBe('true')
  })

  it('pasa threshold y rootMargin al observer', () => {
    mount({ threshold: 0.5, rootMargin: '-40px' })
    const observer = MockIntersectionObserver.instances[0]
    expect(observer.options).toMatchObject({ threshold: 0.5, rootMargin: '-40px' })
  })

  it('con once (default) deja de observar tras la primera intersección y queda en true', () => {
    const inView = mount()
    const observer = MockIntersectionObserver.instances[0]
    observer.trigger(true)
    expect(observer.disconnected).toBe(true)
    observer.trigger(false)
    expect(inView()).toBe('true')
  })

  it('con once=false el valor sigue a la visibilidad', () => {
    const inView = mount({ once: false })
    const observer = MockIntersectionObserver.instances[0]
    observer.trigger(true)
    expect(inView()).toBe('true')
    expect(observer.disconnected).toBe(false)
    observer.trigger(false)
    expect(inView()).toBe('false')
  })

  it('desconecta el observer al desmontar', () => {
    mount()
    const observer = MockIntersectionObserver.instances[0]
    act(() => root.unmount())
    expect(observer.disconnected).toBe(true)
    root = createRoot(container)
  })

  it('sin IntersectionObserver en el entorno cae a true (contenido nunca oculto)', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    const inView = mount()
    expect(inView()).toBe('true')
  })
})
