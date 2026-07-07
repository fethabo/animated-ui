import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { ConfettiBurst } from './index'
import type { ConfettiBurstHandle } from './types'

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

describe('ConfettiBurst.fire()', () => {
  it('no lanza sin contexto 2d disponible (jsdom no implementa canvas)', () => {
    let handle: ConfettiBurstHandle | null = null
    act(() =>
      root.render(
        createElement(ConfettiBurst, {
          ref: (h: ConfettiBurstHandle | null) => {
            handle = h
          },
        }),
      ),
    )
    expect(handle).not.toBeNull()
    // jsdom: getContext('2d') retorna null → fire() debe ser no-op seguro.
    expect(() => handle!.fire()).not.toThrow()
    expect(() => handle!.fire({ count: 200, origin: { x: 0.5, y: 1 } })).not.toThrow()
  })

  it('no lanza tras el desmontaje (canvas ya no montado)', () => {
    let handle: ConfettiBurstHandle | null = null
    act(() =>
      root.render(
        createElement(ConfettiBurst, {
          ref: (h: ConfettiBurstHandle | null) => {
            if (h) handle = h
          },
        }),
      ),
    )
    const fired = handle!
    act(() => root.unmount())
    expect(() => fired.fire()).not.toThrow()
    root = createRoot(container)
  })
})
