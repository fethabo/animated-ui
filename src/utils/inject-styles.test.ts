import { afterEach, describe, expect, it } from 'vitest'
import { injectStyles, styleId } from './inject-styles'

describe('injectStyles', () => {
  afterEach(() => {
    document.head.querySelectorAll('style').forEach((el) => el.remove())
  })

  it('inyecta un style tag en el head con el ID dado', () => {
    injectStyles('aui-test-styles', '.aui-test { color: red; }')

    const tag = document.getElementById('aui-test-styles')
    expect(tag).not.toBeNull()
    expect(tag?.tagName).toBe('STYLE')
    expect(tag?.textContent).toContain('.aui-test')
    expect(tag?.parentElement).toBe(document.head)
  })

  it('no duplica style tags cuando se llama varias veces con el mismo ID', () => {
    injectStyles('aui-dup-styles', '.a {}')
    injectStyles('aui-dup-styles', '.a {}')
    injectStyles('aui-dup-styles', '.a {}')

    const tags = document.head.querySelectorAll('#aui-dup-styles')
    expect(tags.length).toBe(1)
  })

  it('mantiene el contenido del primer inject ante IDs repetidos', () => {
    injectStyles('aui-first-styles', '.first {}')
    injectStyles('aui-first-styles', '.second {}')

    expect(document.getElementById('aui-first-styles')?.textContent).toBe('.first {}')
  })
})

describe('styleId', () => {
  it('genera IDs con el formato aui-<name>-styles', () => {
    expect(styleId('animated-background')).toBe('aui-animated-background-styles')
    expect(styleId('pixel-background')).toBe('aui-pixel-background-styles')
    expect(styleId('tilt-card')).toBe('aui-tilt-card-styles')
  })

  it('todos los IDs generados cumplen el patrón esperado', () => {
    const names = ['animated-background', 'animated-background-aurora', 'pixel-background']
    for (const name of names) {
      expect(styleId(name)).toMatch(/^aui-[a-z0-9-]+-styles$/)
    }
  })
})
