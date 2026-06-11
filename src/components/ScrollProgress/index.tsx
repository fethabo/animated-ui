'use client'
import { useEffect, useRef } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { pageProgress, subscribeScroll } from '../../utils/scroll-driver'
import type { ScrollProgressProps } from './types'

export type { ScrollProgressPosition, ScrollProgressProps } from './types'

// scaleX (compositado) en lugar de width: el avance no fuerza relayout.
const CSS = `
.aui-progress {
  position: fixed;
  left: 0;
  right: 0;
  height: var(--aui-progress-height, 3px);
  background: var(--aui-progress-bg, transparent);
  z-index: var(--aui-progress-z, 50);
  pointer-events: none;
}
.aui-progress[data-aui-position="top"] { top: 0; }
.aui-progress[data-aui-position="bottom"] { bottom: 0; }
.aui-progress-bar {
  height: 100%;
  background: var(--aui-progress-color, #7c3aed);
  transform: scaleX(var(--aui-progress, 0));
  transform-origin: left;
  will-change: transform;
}
`

/**
 * Barra fija de progreso de lectura de la página.
 *
 * El progreso ([0, 1]) se escribe como `--aui-progress` directamente sobre
 * el elemento (sin estado de React) y la barra avanza con `scaleX`
 * compositado. `aria-hidden` por default: es un reflejo decorativo de la
 * posición de scroll que el browser ya expone; un `progressbar` actualizado
 * por frame generaría anuncios constantes en lectores de pantalla. Queda
 * activa bajo reduced motion (refleja input directo, no desplaza contenido).
 */
export function ScrollProgress({
  position = 'top',
  color,
  height,
  trackColor,
  zIndex,
  respectReducedMotion: _respectReducedMotion = true,
  className,
  style,
  ...rest
}: ScrollProgressProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    injectStyles(styleId('scroll-progress'), CSS)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    return subscribeScroll(() => {
      const doc = document.documentElement
      root.style.setProperty(
        '--aui-progress',
        String(pageProgress(window.scrollY ?? doc.scrollTop, doc.scrollHeight, doc.clientHeight)),
      )
    })
  }, [])

  const vars: Record<string, string> = {}
  if (color !== undefined) vars['--aui-progress-color'] = color
  if (height !== undefined) vars['--aui-progress-height'] = `${height}px`
  if (trackColor !== undefined) vars['--aui-progress-bg'] = trackColor
  if (zIndex !== undefined) vars['--aui-progress-z'] = String(zIndex)

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-aui-position={position}
      className={`aui-progress${className ? ` ${className}` : ''}`}
      style={{ ...vars, ...style }}
      {...rest}
    >
      <div className="aui-progress-bar" />
    </div>
  )
}
