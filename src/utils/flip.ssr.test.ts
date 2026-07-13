// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { diffKeys, invert } from './flip'
import { cancelTracked, createTracker, playKeyframes } from './flip-play'

describe('motor FLIP en entorno sin DOM', () => {
  it('la lógica pura opera con rects sintéticos sin document', () => {
    expect(typeof document).toBe('undefined')
    const inversion = invert({ left: 0, top: 0, width: 10, height: 10 }, {
      left: 100,
      top: 50,
      width: 10,
      height: 10,
    })
    expect(inversion).toEqual({ dx: -100, dy: -50, sx: 1, sy: 1 })
    expect(diffKeys(['a'], ['b']).exited).toEqual(['a'])
  })

  it('el helper de play se importa y opera sin document', () => {
    const tracker = createTracker()
    // Un objeto sin `animate`: playKeyframes degrada a null sin tocar el DOM.
    const fake = {} as Element
    expect(playKeyframes(tracker, fake, [{ opacity: 0 }], { duration: 1, easing: 'ease' })).toBeNull()
    expect(() => cancelTracked(tracker, fake)).not.toThrow()
  })
})
