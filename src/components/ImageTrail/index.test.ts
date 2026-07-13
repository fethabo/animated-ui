import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { ImageTrail } from './index'

// act() con createRoot requiere este flag fuera de un test runner de React.
;(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true

const IMAGES = ['/a.jpg', '/b.jpg', '/c.jpg']

let container: HTMLDivElement
let root: Root
let reducedMotion = false

const pointerMove = (target: Element, x: number, y: number) => {
  act(() => {
    target.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: x, clientY: y }))
  })
}

beforeEach(() => {
  reducedMotion = false
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('prefers-reduced-motion') && reducedMotion,
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

const renderTrail = (props: Record<string, unknown> = {}) => {
  act(() =>
    root.render(createElement(ImageTrail, { images: IMAGES, emitEvery: 10, ...props }, 'contenido')),
  )
  return container.querySelector('.aui-image-trail')!
}

const liveImages = () => container.querySelectorAll('.aui-image-trail-img')

describe('ImageTrail: emisión y ciclo de vida', () => {
  it('emite una imagen al superar el umbral de recorrido, en la capa propia', () => {
    const trailRoot = renderTrail()
    pointerMove(trailRoot, 0, 0)
    pointerMove(trailRoot, 50, 0)
    const imgs = liveImages()
    expect(imgs).toHaveLength(1)
    expect(imgs[0].parentElement?.className).toBe('aui-image-trail-layer')
    expect((imgs[0] as HTMLImageElement).getAttribute('src')).toBe('/a.jpg')
  })

  it('rota el pool cíclicamente en orden y reinicia desde la primera', () => {
    const trailRoot = renderTrail({ maxConcurrent: 10 })
    pointerMove(trailRoot, 0, 0)
    for (let i = 1; i <= 4; i++) pointerMove(trailRoot, i * 50, 0)
    const sources = Array.from(liveImages()).map((img) => img.getAttribute('src'))
    expect(sources).toEqual(['/a.jpg', '/b.jpg', '/c.jpg', '/a.jpg'])
  })

  it('cada nodo se remueve solo del DOM al terminar su animación', () => {
    const trailRoot = renderTrail()
    pointerMove(trailRoot, 0, 0)
    pointerMove(trailRoot, 50, 0)
    pointerMove(trailRoot, 100, 0)
    const imgs = Array.from(liveImages())
    expect(imgs).toHaveLength(2)

    imgs.forEach((img) => img.dispatchEvent(new Event('animationend')))
    expect(liveImages()).toHaveLength(0)
  })

  it('respeta el cap maxConcurrent y reanuda al liberarse un nodo', () => {
    const trailRoot = renderTrail({ maxConcurrent: 2 })
    pointerMove(trailRoot, 0, 0)
    for (let i = 1; i <= 5; i++) pointerMove(trailRoot, i * 50, 0)
    expect(liveImages()).toHaveLength(2)

    liveImages()[0].dispatchEvent(new Event('animationend'))
    pointerMove(trailRoot, 500, 0)
    expect(liveImages()).toHaveLength(2)
  })

  it('bajo reduced motion no emite imágenes', () => {
    reducedMotion = true
    const trailRoot = renderTrail()
    pointerMove(trailRoot, 0, 0)
    pointerMove(trailRoot, 200, 0)
    expect(liveImages()).toHaveLength(0)
    expect(trailRoot.textContent).toContain('contenido')
  })
})
