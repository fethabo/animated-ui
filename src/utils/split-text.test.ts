import { describe, expect, it } from 'vitest'
import { splitText } from './split-text'

describe('splitText (util compartida)', () => {
  it('char: cada code point es una unidad, espacios marcados isSpace', () => {
    const units = splitText('ab c', 'char')
    expect(units).toEqual([
      { text: 'a', isSpace: false },
      { text: 'b', isSpace: false },
      { text: ' ', isSpace: true },
      { text: 'c', isSpace: false },
    ])
  })

  it('char: no parte surrogates (emoji)', () => {
    const units = splitText('a🎉b', 'char')
    expect(units.map((u) => u.text)).toEqual(['a', '🎉', 'b'])
  })

  it('word: preserva los runs de espacios entre palabras', () => {
    const units = splitText('hola  mundo', 'word')
    expect(units).toEqual([
      { text: 'hola', isSpace: false },
      { text: '  ', isSpace: true },
      { text: 'mundo', isSpace: false },
    ])
  })

  it('string vacío: sin unidades', () => {
    expect(splitText('', 'char')).toEqual([])
    expect(splitText('', 'word')).toEqual([])
  })
})
