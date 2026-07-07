import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { RotatingText } from './index'

// act() con createRoot requiere este flag fuera de un test runner de React.
;(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  vi.useFakeTimers()
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.useRealTimers()
})

const word = () => container.querySelector('.aui-rotating-word')?.textContent

describe('RotatingText: ciclo de rotación', () => {
  it('avanza por la lista en orden y vuelve al principio (loop default)', () => {
    act(() =>
      root.render(createElement(RotatingText, { words: ['uno', 'dos', 'tres'], interval: 100 })),
    )
    expect(word()).toBe('uno')
    act(() => vi.advanceTimersByTime(100))
    expect(word()).toBe('dos')
    act(() => vi.advanceTimersByTime(100))
    expect(word()).toBe('tres')
    act(() => vi.advanceTimersByTime(100))
    expect(word()).toBe('uno')
  })

  it('con loop=false se detiene en la última palabra', () => {
    act(() =>
      root.render(
        createElement(RotatingText, { words: ['uno', 'dos'], interval: 100, loop: false }),
      ),
    )
    act(() => vi.advanceTimersByTime(100))
    expect(word()).toBe('dos')
    act(() => vi.advanceTimersByTime(500))
    expect(word()).toBe('dos') // sin más timers programados
  })

  it('con una sola palabra no programa timers', () => {
    act(() => root.render(createElement(RotatingText, { words: ['única'], interval: 100 })))
    act(() => vi.advanceTimersByTime(1000))
    expect(word()).toBe('única')
  })
})
