import { afterEach, describe, expect, it } from 'vitest'
import { clearStroke, prepareStroke, svgStrokeCss, DRAWABLE_SELECTOR } from './svg-stroke'

const SVG_NS = 'http://www.w3.org/2000/svg'

function makePath(): SVGElement {
  return document.createElementNS(SVG_NS, 'path')
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('prepareStroke', () => {
  it('mide con getTotalLength y deja el trazo enrollado (vars + clase)', () => {
    const el = makePath()
    ;(el as unknown as { getTotalLength: () => number }).getTotalLength = () => 123.4
    expect(prepareStroke(el, 2)).toBe(true)
    expect(el.style.getPropertyValue('--aui-stroke-len')).toBe('124px')
    expect(el.style.getPropertyValue('--aui-stroke-i')).toBe('2')
    expect(el.classList.contains('aui-stroke')).toBe(true)
  })

  it('sin getTotalLength (browser antiguo/jsdom) no toca el elemento', () => {
    const el = makePath()
    expect(prepareStroke(el)).toBe(false)
    expect(el.classList.contains('aui-stroke')).toBe(false)
    expect(el.style.getPropertyValue('--aui-stroke-len')).toBe('')
  })

  it('si la medición lanza o devuelve una longitud inválida, no toca el elemento', () => {
    const throwing = makePath()
    ;(throwing as unknown as { getTotalLength: () => number }).getTotalLength = () => {
      throw new Error('no rendered')
    }
    expect(prepareStroke(throwing)).toBe(false)
    expect(throwing.classList.contains('aui-stroke')).toBe(false)

    const zero = makePath()
    ;(zero as unknown as { getTotalLength: () => number }).getTotalLength = () => 0
    expect(prepareStroke(zero)).toBe(false)
    expect(zero.classList.contains('aui-stroke')).toBe(false)
  })
})

describe('clearStroke', () => {
  it('deshace prepareStroke: el trazo vuelve a estar completo y visible', () => {
    const el = makePath()
    ;(el as unknown as { getTotalLength: () => number }).getTotalLength = () => 80
    prepareStroke(el, 1)
    clearStroke(el)
    expect(el.classList.contains('aui-stroke')).toBe(false)
    expect(el.style.getPropertyValue('--aui-stroke-len')).toBe('')
    expect(el.style.getPropertyValue('--aui-stroke-i')).toBe('')
  })
})

describe('svgStrokeCss', () => {
  it('define el estado enrollado, el dibujo por data-aui-drawn y el ciclo por data-aui-repeat', () => {
    const css = svgStrokeCss()
    expect(css).toContain('.aui-stroke')
    expect(css).toContain('stroke-dasharray: var(--aui-stroke-len, none)')
    expect(css).toContain('[data-aui-drawn] .aui-stroke')
    expect(css).toContain('@keyframes aui-stroke-draw')
    expect(css).toContain('[data-aui-drawn][data-aui-repeat] .aui-stroke')
    expect(css).toContain('@keyframes aui-stroke-cycle')
  })

  it('el stagger es delay indexado por --aui-stroke-i', () => {
    expect(svgStrokeCss()).toContain('var(--aui-stroke-stagger, 0s) * var(--aui-stroke-i, 0)')
  })
})

describe('DRAWABLE_SELECTOR', () => {
  it('matchea los elementos con trazo y permite filtrar el opt-out', () => {
    document.body.innerHTML = `
      <svg>
        <path d="M 0 0 L 10 10" />
        <line x1="0" y1="0" x2="10" y2="10" />
        <g data-aui-no-draw><circle r="5" /></g>
        <text>no dibujable</text>
      </svg>`
    const all = Array.from(document.querySelectorAll<SVGElement>(DRAWABLE_SELECTOR))
    expect(all).toHaveLength(3)
    const optIn = all.filter((el) => !el.closest('[data-aui-no-draw]'))
    expect(optIn).toHaveLength(2)
  })
})
