import { beforeEach, describe, expect, it } from 'vitest'
import { attachSpotlight, SPOTLIGHT_CSS } from './engine'

function mockRect(el: HTMLElement) {
  el.getBoundingClientRect = () =>
    ({ left: 10, top: 20, width: 200, height: 100, right: 210, bottom: 120, x: 10, y: 20 }) as DOMRect
}

function mouseMove(el: HTMLElement, clientX: number, clientY: number) {
  el.dispatchEvent(new MouseEvent('mousemove', { clientX, clientY, bubbles: true }))
}

describe('attachSpotlight', () => {
  let host: HTMLElement

  beforeEach(() => {
    document.getElementById('aui-spotlight-card-styles')?.remove()
    host = document.createElement('div')
    document.body.appendChild(host)
    mockRect(host)
  })

  it('inyecta el CSS una sola vez', () => {
    const a = attachSpotlight(host, { decorate: false })
    const b = attachSpotlight(host, { decorate: false })
    expect(document.querySelectorAll('#aui-spotlight-card-styles')).toHaveLength(1)
    expect(document.getElementById('aui-spotlight-card-styles')?.textContent).toBe(SPOTLIGHT_CSS)
    a.destroy()
    b.destroy()
  })

  it('en modo decorado agrega clase, vars y overlay al host', () => {
    const inst = attachSpotlight(host, { decorate: true, color: '#fff', radius: 300 })

    expect(host.classList.contains('aui-spotlight')).toBe(true)
    expect(host.style.getPropertyValue('--aui-spotlight-color')).toBe('#fff')
    expect(host.style.getPropertyValue('--aui-spotlight-radius')).toBe('300px')
    const overlay = host.querySelector('.aui-spotlight-overlay')
    expect(overlay).not.toBeNull()
    expect(overlay?.getAttribute('aria-hidden')).toBe('true')
    inst.destroy()
  })

  it('el tracking escribe las vars de posición relativas al host', () => {
    const inst = attachSpotlight(host, { decorate: true })

    mouseMove(host, 110, 70)
    expect(host.style.getPropertyValue('--aui-spotlight-x')).toBe('100px')
    expect(host.style.getPropertyValue('--aui-spotlight-y')).toBe('50px')
    inst.destroy()
  })

  it('hover se expresa con el atributo data-aui-hover', () => {
    const inst = attachSpotlight(host, { decorate: true })

    host.dispatchEvent(new MouseEvent('mouseenter'))
    expect(host.hasAttribute('data-aui-hover')).toBe(true)
    host.dispatchEvent(new MouseEvent('mouseleave'))
    expect(host.hasAttribute('data-aui-hover')).toBe(false)
    inst.destroy()
  })

  it('update re-aplica vars sin reconstruir el overlay', () => {
    const inst = attachSpotlight(host, { decorate: true, radius: 200 })
    const overlay = host.querySelector('.aui-spotlight-overlay')

    inst.update({ radius: 400 })
    expect(host.style.getPropertyValue('--aui-spotlight-radius')).toBe('400px')
    expect(host.querySelector('.aui-spotlight-overlay')).toBe(overlay)
    expect(host.querySelectorAll('.aui-spotlight-overlay')).toHaveLength(1)
    inst.destroy()
  })

  it('destroy restaura el host por completo', () => {
    const inst = attachSpotlight(host, { decorate: true, color: '#fff' })

    host.dispatchEvent(new MouseEvent('mouseenter'))
    mouseMove(host, 110, 70)
    inst.destroy()

    expect(host.classList.contains('aui-spotlight')).toBe(false)
    expect(host.querySelector('.aui-spotlight-overlay')).toBeNull()
    expect(host.hasAttribute('data-aui-hover')).toBe(false)
    expect(host.style.getPropertyValue('--aui-spotlight-color')).toBe('')
    expect(host.style.getPropertyValue('--aui-spotlight-x')).toBe('')

    const varCount = host.style.length
    expect(varCount).toBe(0)
  })

  it('en modo componente (decorate: false) no toca clases ni inyecta overlay', () => {
    const inst = attachSpotlight(host, { decorate: false })

    expect(host.classList.contains('aui-spotlight')).toBe(false)
    expect(host.querySelector('.aui-spotlight-overlay')).toBeNull()
    mouseMove(host, 110, 70)
    expect(host.style.getPropertyValue('--aui-spotlight-x')).toBe('100px')
    inst.destroy()
  })
})
