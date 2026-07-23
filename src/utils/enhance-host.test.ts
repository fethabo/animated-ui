import { describe, expect, it } from 'vitest'
import { createLayer, enhanceHost } from './enhance-host'

describe('enhanceHost', () => {
  it('agrega clases y las remueve en restore, sin tocar las que el host ya tenía', () => {
    const host = document.createElement('div')
    host.className = 'mi-card aui-glow'
    const enhanced = enhanceHost(host, { classes: ['aui-glow', 'aui-spotlight'] })

    expect(host.classList.contains('aui-spotlight')).toBe(true)
    enhanced.restore()
    expect(host.className).toBe('mi-card aui-glow')
  })

  it('setea CSS vars y restaura el valor inline previo (o las remueve si no había)', () => {
    const host = document.createElement('div')
    host.style.setProperty('--aui-glow-speed', '9s')
    const enhanced = enhanceHost(host, {
      vars: { '--aui-glow-speed': '4s', '--aui-glow-width': '2px' },
    })

    expect(host.style.getPropertyValue('--aui-glow-speed')).toBe('4s')
    expect(host.style.getPropertyValue('--aui-glow-width')).toBe('2px')
    enhanced.restore()
    expect(host.style.getPropertyValue('--aui-glow-speed')).toBe('9s')
    expect(host.style.getPropertyValue('--aui-glow-width')).toBe('')
  })

  it('setVars posteriores participan del snapshot y del restore', () => {
    const host = document.createElement('div')
    const enhanced = enhanceHost(host, {})
    enhanced.setVars({ '--aui-spotlight-x': '10px' })
    enhanced.setVars({ '--aui-spotlight-x': '20px' })

    expect(host.style.getPropertyValue('--aui-spotlight-x')).toBe('20px')
    enhanced.restore()
    expect(host.style.getPropertyValue('--aui-spotlight-x')).toBe('')
  })

  it('setea estilos inline con snapshot del valor previo', () => {
    const host = document.createElement('div')
    host.style.willChange = 'opacity'
    const enhanced = enhanceHost(host, { styles: { willChange: 'transform' } })

    expect(host.style.willChange).toBe('transform')
    enhanced.restore()
    expect(host.style.willChange).toBe('opacity')
  })

  it('fuerza position relative solo si el host es static, y restaura el inline previo', () => {
    const staticHost = document.createElement('div')
    document.body.appendChild(staticHost)
    const enhanced = enhanceHost(staticHost, { ensurePosition: true })
    expect(staticHost.style.position).toBe('relative')
    enhanced.restore()
    expect(staticHost.style.position).toBe('')

    const positioned = document.createElement('div')
    positioned.style.position = 'absolute'
    document.body.appendChild(positioned)
    const enhanced2 = enhanceHost(positioned, { ensurePosition: true })
    expect(positioned.style.position).toBe('absolute')
    enhanced2.restore()
    expect(positioned.style.position).toBe('absolute')

    staticHost.remove()
    positioned.remove()
  })

  it('inyecta capas al final del host y las remueve por referencia', () => {
    const host = document.createElement('div')
    host.appendChild(document.createElement('span'))
    const layer = createLayer('aui-spotlight-overlay')
    const enhanced = enhanceHost(host, { layers: [layer] })

    expect(host.lastElementChild).toBe(layer)
    expect(layer.getAttribute('aria-hidden')).toBe('true')
    enhanced.restore()
    expect(host.querySelector('.aui-spotlight-overlay')).toBeNull()
    expect(host.children).toHaveLength(1)
  })

  it('restore es idempotente', () => {
    const host = document.createElement('div')
    const enhanced = enhanceHost(host, { classes: ['aui-glow'] })
    enhanced.restore()
    enhanced.restore()
    expect(host.classList.contains('aui-glow')).toBe(false)
  })

  it('attach → restore → attach no acumula residuos (patrón StrictMode)', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    const first = enhanceHost(host, {
      classes: ['aui-glow'],
      vars: { '--aui-glow-speed': '4s' },
      ensurePosition: true,
      layers: [createLayer('aui-glow-layer')],
    })
    first.restore()

    const second = enhanceHost(host, {
      classes: ['aui-glow'],
      vars: { '--aui-glow-speed': '4s' },
      ensurePosition: true,
      layers: [createLayer('aui-glow-layer')],
    })

    expect(host.querySelectorAll('.aui-glow-layer')).toHaveLength(1)
    second.restore()
    expect(host.querySelectorAll('.aui-glow-layer')).toHaveLength(0)
    expect(host.classList.contains('aui-glow')).toBe(false)
    expect(host.style.position).toBe('')
    expect(host.style.getPropertyValue('--aui-glow-speed')).toBe('')
    host.remove()
  })
})
