import { describe, expect, it } from 'vitest'
import { groupByLine, splitText } from './split'

describe('splitText — char', () => {
  it('parte por code point, marcando los espacios', () => {
    expect(splitText('ab c', 'char')).toEqual([
      { text: 'a', isSpace: false },
      { text: 'b', isSpace: false },
      { text: ' ', isSpace: true },
      { text: 'c', isSpace: false },
    ])
  })

  it('no parte surrogates (emoji cuenta como un carácter)', () => {
    expect(splitText('🎉a', 'char')).toEqual([
      { text: '🎉', isSpace: false },
      { text: 'a', isSpace: false },
    ])
  })

  it('texto vacío → sin unidades', () => {
    expect(splitText('', 'char')).toEqual([])
  })
})

describe('splitText — word', () => {
  it('separa palabras preservando los espacios como unidades', () => {
    expect(splitText('Hola mundo animado', 'word')).toEqual([
      { text: 'Hola', isSpace: false },
      { text: ' ', isSpace: true },
      { text: 'mundo', isSpace: false },
      { text: ' ', isSpace: true },
      { text: 'animado', isSpace: false },
    ])
  })

  it('preserva runs de múltiples espacios', () => {
    const units = splitText('a   b', 'word')
    expect(units).toEqual([
      { text: 'a', isSpace: false },
      { text: '   ', isSpace: true },
      { text: 'b', isSpace: false },
    ])
  })
})

describe('groupByLine', () => {
  it('agrupa unidades consecutivas con el mismo offsetTop en una línea', () => {
    // Tres palabras en y=0, dos en y=24 → líneas [0,0,0,1,1]
    expect(groupByLine([0, 0, 0, 24, 24])).toEqual([0, 0, 0, 1, 1])
  })

  it('cada cambio de offsetTop incrementa la línea', () => {
    expect(groupByLine([0, 24, 48])).toEqual([0, 1, 2])
  })

  it('lista vacía → sin líneas', () => {
    expect(groupByLine([])).toEqual([])
  })

  it('todas en la misma línea → todas índice 0', () => {
    expect(groupByLine([10, 10, 10])).toEqual([0, 0, 0])
  })
})
