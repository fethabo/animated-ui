'use client'
import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import { diffKeys, invert, isIdentity, type FlipRect } from '../../utils/flip'
import { cancelTracked, createTracker, playInversion, playKeyframes } from '../../utils/flip-play'
import type { AnimatedListEnterPreset, AnimatedListExitPreset, AnimatedListProps } from './types'

export type {
  AnimatedListEnterPreset,
  AnimatedListExitPreset,
  AnimatedListProps,
} from './types'

// El root es posicionado para anclar los clones de salida; los wrappers de
// items no imponen layout propio (heredan el rol de celda del grid/flex del
// consumer via `itemClassName`/`itemStyle`).
const CSS = `
.aui-animated-list {
  position: relative;
}
.aui-animated-list-exit {
  position: absolute;
  margin: 0;
  box-sizing: border-box;
  pointer-events: none;
}
`

const ENTER_KEYFRAMES: Record<Exclude<AnimatedListEnterPreset, 'none'>, Keyframe[]> = {
  fade: [{ opacity: 0 }, { opacity: 1 }],
  'scale-in': [
    { opacity: 0, transform: 'scale(0.85)' },
    { opacity: 1, transform: 'scale(1)' },
  ],
  slide: [
    { opacity: 0, transform: 'translateY(14px)' },
    { opacity: 1, transform: 'translateY(0px)' },
  ],
}

const EXIT_KEYFRAMES: Record<Exclude<AnimatedListExitPreset, 'none'>, Keyframe[]> = {
  fade: [{ opacity: 1 }, { opacity: 0 }],
  'scale-out': [
    { opacity: 1, transform: 'scale(1)' },
    { opacity: 0, transform: 'scale(0.85)' },
  ],
}

// La easing y la duración se resuelven en el play (no en el render): así un
// override de la CSS var en cascada gana sobre el default de la prop.
function resolveEasing(root: HTMLElement, fallback: string): string {
  if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
    return fallback
  }
  const value = window
    .getComputedStyle(root)
    .getPropertyValue('--aui-animated-list-easing')
    .trim()
  return value || fallback
}

function resolveDuration(root: HTMLElement, fallback: number): number {
  if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
    return fallback
  }
  const value = parseFloat(
    window.getComputedStyle(root).getPropertyValue('--aui-animated-list-duration'),
  )
  return Number.isFinite(value) ? value : fallback
}

/**
 * Contenedor cuyos hijos keyed animan **entrada** (preset configurable, con
 * stagger opcional), **salida** (un clon visual estático anima en el último
 * rect del item y se remueve del DOM al terminar) y **reordenamiento** (FLIP:
 * el rect de cada hijo se captura antes del render nuevo y la diferencia se
 * anima con WAAPI hacia identidad, antes del paint). La identidad de cada hijo
 * es su `key` de React — no hay API paralela.
 *
 * El root puede ser el propio grid/flex del consumer (`className`/`style`);
 * cada hijo va envuelto en un wrapper medible que actúa como celda
 * (`itemClassName`/`itemStyle`). Cero re-renders por animación.
 *
 * Trade-offs documentados: el clon de salida es inerte (sin handlers ni
 * updates durante ~la duración de la salida) y las listas muy grandes miden un
 * rect por item por commit (recomendado ≤ ~100 items). Con
 * `prefers-reduced-motion` los cambios se aplican de inmediato, sin clones.
 * El primer render (SSR/hidratación) no anima.
 */
export function AnimatedList({
  duration = 0.35,
  easing = 'ease',
  enter = 'fade',
  exit = 'fade',
  stagger = 0,
  as: Root = 'div',
  itemClassName,
  itemStyle,
  respectReducedMotion = true,
  children,
  className,
  style,
  ...rest
}: AnimatedListProps) {
  const rootRef = useRef<HTMLElement | null>(null)
  const itemsRef = useRef(new Map<string, HTMLElement>())
  const exitStashRef = useRef(new Map<string, HTMLElement>())
  const refCallbacksRef = useRef(new Map<string, (el: HTMLElement | null) => void>())
  const trackerRef = useRef(createTracker())
  const clonesRef = useRef(new Set<HTMLElement>())
  const prevKeysRef = useRef<string[] | null>(null)
  const firstRectsRef = useRef(new Map<string, FlipRect>())

  const reducedMotion = useReducedMotion()
  const isStatic = respectReducedMotion && reducedMotion

  // Callback de ref estable por key: registra el wrapper montado y, al
  // desmontar, lo guarda en el stash de salidas (el nodo detached sigue
  // siendo clonable en el layout effect de este mismo commit).
  const getRefCallback = (key: string) => {
    let callback = refCallbacksRef.current.get(key)
    if (!callback) {
      callback = (el: HTMLElement | null) => {
        if (el) {
          itemsRef.current.set(key, el)
        } else {
          const previous = itemsRef.current.get(key)
          if (previous) exitStashRef.current.set(key, previous)
          itemsRef.current.delete(key)
        }
      }
      refCallbacksRef.current.set(key, callback)
    }
    return callback
  }

  // Snapshot First: se lee en la fase de render, cuando el DOM todavía tiene
  // el layout del commit anterior. `getBoundingClientRect` refleja los
  // transforms en vuelo, así que una interrupción parte de la posición visual
  // actual (design.md, decisión 5). En SSR el map está vacío: no toca el DOM.
  if (itemsRef.current.size > 0) {
    const snapshot = new Map<string, FlipRect>()
    itemsRef.current.forEach((el, key) => {
      if (el.isConnected) snapshot.set(key, el.getBoundingClientRect())
    })
    firstRectsRef.current = snapshot
  }

  const items: { key: string; node: ReactNode }[] = []
  Children.forEach(children, (child, index) => {
    if (child == null || typeof child === 'boolean') return
    const key = isValidElement(child) && child.key != null ? String(child.key) : `.${index}`
    items.push({ key, node: child })
  })
  const keys = items.map((item) => item.key)

  useEffect(() => {
    injectStyles(styleId('animated-list'), CSS)
  }, [])

  // Limpieza al desmontar: clones de salida aún animando fuera del árbol React.
  useEffect(() => {
    const clones = clonesRef.current
    return () => {
      clones.forEach((clone) => clone.remove())
      clones.clear()
    }
  }, [])

  // Last + play, después del layout nuevo y antes del paint.
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current
    const prevKeys = prevKeysRef.current
    prevKeysRef.current = keys
    const stash = exitStashRef.current
    const consumeStash = () => stash.clear()

    // Primer commit (SSR/hidratación): estado final sin animar.
    if (prevKeys === null || !root || isStatic) {
      consumeStash()
      return
    }

    const { entered, exited, persisted } = diffKeys(prevKeys, keys)
    const tracker = trackerRef.current
    const firstRects = firstRectsRef.current
    const timing = {
      duration: resolveDuration(root, duration) * 1000,
      easing: resolveEasing(root, easing),
    }

    // Salidas: clon estático posicionado en el último rect conocido del item,
    // que anima y se remueve en finish — sin nodos residuales.
    if (exit !== 'none') {
      const containerRect = root.getBoundingClientRect()
      for (const key of exited) {
        const el = stash.get(key)
        const rect = firstRects.get(key)
        if (!el || !rect || typeof el.animate !== 'function') continue
        const clone = el.cloneNode(true) as HTMLElement
        clone.classList.add('aui-animated-list-exit')
        clone.setAttribute('aria-hidden', 'true')
        clone.style.left = `${rect.left - containerRect.left}px`
        clone.style.top = `${rect.top - containerRect.top}px`
        clone.style.width = `${rect.width}px`
        clone.style.height = `${rect.height}px`
        root.appendChild(clone)
        clonesRef.current.add(clone)
        playKeyframes(tracker, clone, EXIT_KEYFRAMES[exit], timing, () => {
          clonesRef.current.delete(clone)
          clone.remove()
        })
      }
    }
    consumeStash()

    // Reordenamientos: FLIP por hijo persistente. Se cancela la animación en
    // vuelo antes de medir Last (el transform activo contaminaría el rect);
    // el First ya capturó la posición visual, así que el encadenado no salta.
    for (const key of persisted) {
      const el = itemsRef.current.get(key)
      const first = firstRects.get(key)
      if (!el || !first) continue
      cancelTracked(tracker, el)
      const inversion = invert(first, el.getBoundingClientRect())
      if (!isIdentity(inversion)) playInversion(tracker, el, inversion, timing)
    }

    // Entradas: preset + stagger opcional en orden de aparición.
    if (enter !== 'none') {
      entered.forEach((key, index) => {
        const el = itemsRef.current.get(key)
        if (!el) return
        playKeyframes(tracker, el, ENTER_KEYFRAMES[enter], {
          ...timing,
          delay: index * stagger * 1000,
        })
      })
    }
  })

  return (
    <Root
      ref={rootRef}
      className={`aui-animated-list${className ? ` ${className}` : ''}`}
      style={
        {
          '--aui-animated-list-easing': easing,
          '--aui-animated-list-duration': `${duration}s`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {items.map((item) => (
        <div
          key={item.key}
          ref={getRefCallback(item.key)}
          className={`aui-animated-list-item${itemClassName ? ` ${itemClassName}` : ''}`}
          style={itemStyle}
        >
          {item.node}
        </div>
      ))}
    </Root>
  )
}
