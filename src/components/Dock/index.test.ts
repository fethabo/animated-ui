import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { Dock } from './index'

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

describe('Dock: interacción intacta', () => {
  it('los ítems reciben foco y clicks en orden normal (la magnificación no intercepta)', () => {
    let clicks = 0
    act(() =>
      root.render(
        createElement(
          Dock,
          null,
          createElement(
            Dock.Item,
            null,
            createElement('button', { id: 'b1', onClick: () => clicks++ }, 'Uno'),
          ),
          createElement(Dock.Item, null, createElement('button', { id: 'b2' }, 'Dos')),
        ),
      ),
    )
    const b1 = container.querySelector<HTMLButtonElement>('#b1')!
    const b2 = container.querySelector<HTMLButtonElement>('#b2')!

    b1.focus()
    expect(document.activeElement).toBe(b1)
    b2.focus()
    expect(document.activeElement).toBe(b2)

    act(() => b1.click())
    expect(clicks).toBe(1)
  })

  it('ningún wrapper del dock introduce tabindex ni aria-hidden sobre los ítems', () => {
    act(() =>
      root.render(
        createElement(Dock, null, createElement(Dock.Item, null, createElement('button', null, 'X'))),
      ),
    )
    const item = container.querySelector('[data-aui-dock-item]')!
    expect(item.getAttribute('tabindex')).toBeNull()
    expect(item.getAttribute('aria-hidden')).toBeNull()
  })
})
