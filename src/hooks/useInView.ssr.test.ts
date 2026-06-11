// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement, useRef } from 'react'
import { renderToString } from 'react-dom/server'
import { useInView } from './useInView'

function Probe() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  return createElement('div', { ref, 'data-inview': String(inView) })
}

describe('useInView en SSR (sin document)', () => {
  it('renderiza sin errores y reporta false', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(Probe))
    expect(html).toContain('data-inview="false"')
  })
})
