'use client'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { groupByLine, splitText } from './split'
import { splitRevealCss, splitVars } from './styles'
import type { SplitRevealProps } from './types'

export type { SplitMode, SplitPreset, SplitRevealProps, SplitTrigger } from './types'

/**
 * Parte un texto en unidades (`char`/`word`/`line`) y revela cada una con
 * stagger via CSS transitions puras (cero JS por frame: el JS solo togglea un
 * atributo). Dispara al montar o al entrar al viewport (`useInView`).
 *
 * El texto se renderiza completo y visible desde el primer paint (SSR/SEO) y
 * se parte recién tras la hidratación, con el `aria-label` en el root portando
 * el texto completo y las unidades marcadas `aria-hidden`. El modo `line` mide
 * el wrapping real tras el montaje y re-mide en resize. Con reduced motion (o
 * sin IntersectionObserver) se muestra el texto completo de inmediato.
 */
export function SplitReveal({
  text,
  split = 'word',
  preset = 'slide-up',
  trigger = 'in-view',
  stagger,
  duration,
  distance,
  threshold = 0.15,
  once = true,
  respectReducedMotion = true,
  className,
  style,
  ...rest
}: SplitRevealProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()
  const isStatic = respectReducedMotion && reducedMotion

  // Pre-hidratación se muestra el texto plano; el split ocurre tras montar.
  const [mounted, setMounted] = useState(false)
  const [mountRevealed, setMountRevealed] = useState(false)
  const { width } = useResizeObserver(rootRef)

  const inView = useInView(rootRef, { threshold, once })

  useEffect(() => {
    injectStyles(styleId('split-reveal'), splitRevealCss())
    setMounted(true)
  }, [])

  // trigger='mount': revelar un frame después de partir, para que las
  // unidades existan en su estado oculto antes de transicionar.
  useEffect(() => {
    if (trigger !== 'mount' || !mounted || isStatic) return
    const id = requestAnimationFrame(() => setMountRevealed(true))
    return () => cancelAnimationFrame(id)
  }, [trigger, mounted, isStatic])

  const revealed = trigger === 'mount' ? mountRevealed : inView
  const doSplit = mounted && !isStatic

  // Modo line: medir el offsetTop real de cada unidad y reescribir
  // --aui-split-i con el índice de línea. Re-mide al cambiar el ancho.
  useEffect(() => {
    if (!doSplit || split !== 'line') return
    const root = rootRef.current
    if (!root) return
    const units = Array.from(root.querySelectorAll<HTMLElement>('.aui-split-unit'))
    const lines = groupByLine(units.map((el) => el.offsetTop))
    units.forEach((el, i) => el.style.setProperty('--aui-split-i', String(lines[i])))
  }, [doSplit, split, text, width])

  const rootStyle: CSSProperties = { ...splitVars({ stagger, duration, distance }), ...style }

  return (
    <span
      ref={rootRef}
      aria-label={text}
      className={`aui-split${className ? ` ${className}` : ''}`}
      data-aui-preset={preset}
      data-aui-visible={revealed ? '' : undefined}
      data-aui-static={isStatic ? '' : undefined}
      style={rootStyle}
      {...rest}
    >
      {doSplit ? <SplitUnits text={text} split={split} /> : text}
    </span>
  )
}

/**
 * Renderiza las unidades partidas. Los espacios se emiten como texto plano
 * (no animado) para preservar el espaciado y los puntos de corte de línea;
 * las unidades visibles llevan `--aui-split-i` con su índice secuencial (en
 * modo `line` lo sobrescribe la medición de layout).
 */
function SplitUnits({ text, split }: { text: string; split: SplitRevealProps['split'] }) {
  const units = splitText(text, split === 'line' ? 'word' : (split as 'char' | 'word'))
  let animIndex = 0
  return (
    <>
      {units.map((unit, i) => {
        if (unit.isSpace) {
          return (
            <span key={i} aria-hidden="true">
              {unit.text}
            </span>
          )
        }
        const idx = animIndex++
        return (
          <span
            key={i}
            className="aui-split-unit"
            aria-hidden="true"
            style={{ '--aui-split-i': idx } as CSSProperties}
          >
            {unit.text}
          </span>
        )
      })}
    </>
  )
}
