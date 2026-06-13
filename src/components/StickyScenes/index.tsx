'use client'
import { Children, isValidElement, useEffect, useRef, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { subscribeScroll } from '../../utils/scroll-driver'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { sceneAt, stickyProgress } from './progress'
import type { StickySceneProps, StickyScenesProps } from './types'

export type { StickySceneProps, StickyScenesProps } from './types'

const CSS = `
.aui-sticky-scenes-inner {
  position: sticky;
  top: 0;
  height: 100dvh;
  overflow: hidden;
}
.aui-sticky-scene {
  position: absolute;
  inset: 0;
}
.aui-sticky-scenes--no-motion .aui-sticky-scene,
.aui-sticky-scenes--no-motion .aui-sticky-scene * {
  transition: none !important;
}
`

/**
 * Escena individual de `StickyScenes`. Recibe `data-aui-active="true"` del
 * contenedor cuando es la escena en curso; el consumer engancha ahí sus
 * transitions CSS (`[data-aui-active] .mi-elemento { ... }`). Por defecto las
 * escenas se apilan (`position: absolute; inset: 0`).
 */
function StickyScene({ children, className, style, ...rest }: StickySceneProps) {
  return (
    <div
      className={`aui-sticky-scene${className ? ` ${className}` : ''}`}
      data-aui-scene=""
      style={style}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * Contenedor de escenas sticky ligadas al scroll. El inner wrapper se mantiene
 * fijo (`position: sticky; top: 0; height: 100dvh`) mientras se scrollea el
 * rango del contenedor; el progreso se descompone en escena activa + progreso
 * dentro de ella y se escribe como `--aui-scene-index` / `--aui-scene-progress`
 * directamente sobre el inner wrapper (sin React state en el hot path).
 *
 * Cada `StickyScenes.Scene` recibe `data-aui-active` cuando le toca. Con
 * `prefers-reduced-motion` el scroll sigue activo pero las transitions de las
 * escenas se anulan (cada escena aparece de inmediato).
 */
export function StickyScenes({
  sceneDuration = 600,
  respectReducedMotion = true,
  children,
  className,
  style,
  ...rest
}: StickyScenesProps) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  const reducedMotion = useReducedMotion()
  const inView = useInView(outerRef, { once: false, rootMargin: '0px', threshold: 0 })
  const noMotion = respectReducedMotion && reducedMotion

  const nScenes = Children.toArray(children).filter(
    (child) => isValidElement(child) && child.type === StickyScene,
  ).length

  useEffect(() => {
    injectStyles(styleId('sticky-scenes'), CSS)
  }, [])

  // Estado inicial: primera escena activa hasta que el scroll diga otra cosa.
  useEffect(() => {
    const inner = innerRef.current
    if (!inner) return
    const scenes = inner.querySelectorAll<HTMLElement>('[data-aui-scene]')
    scenes.forEach((scene, i) => {
      if (i === 0) scene.setAttribute('data-aui-active', 'true')
      else scene.removeAttribute('data-aui-active')
    })
  }, [nScenes])

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner || nScenes === 0 || !inView) return

    const scenes = inner.querySelectorAll<HTMLElement>('[data-aui-scene]')

    return subscribeScroll(() => {
      const rect = outer.getBoundingClientRect()
      const progress = stickyProgress(rect.top, outer.offsetHeight, window.innerHeight)
      const { sceneIndex, sceneProgress } = sceneAt(progress, nScenes)

      inner.style.setProperty('--aui-scene-index', String(sceneIndex))
      inner.style.setProperty('--aui-scene-progress', String(sceneProgress))

      scenes.forEach((scene, i) => {
        if (i === sceneIndex) scene.setAttribute('data-aui-active', 'true')
        else scene.removeAttribute('data-aui-active')
      })
    })
  }, [nScenes, inView])

  return (
    <div
      ref={outerRef}
      className={`aui-sticky-scenes${noMotion ? ' aui-sticky-scenes--no-motion' : ''}${
        className ? ` ${className}` : ''
      }`}
      style={{ height: `calc(100dvh + ${nScenes * sceneDuration}px)`, ...style }}
      {...rest}
    >
      <div ref={innerRef} className="aui-sticky-scenes-inner" style={{ '--aui-scene-index': 0, '--aui-scene-progress': 0 } as CSSProperties}>
        {children}
      </div>
    </div>
  )
}

StickyScenes.Scene = StickyScene
