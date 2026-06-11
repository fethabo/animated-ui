// magnetic-element.tsx — Botón que se siente atraído hacia el cursor.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// El wrapper agranda la zona sensible con padding transparente (hit-area);
// el contenido se traslada con WAAPI consolidando cada animación antes de
// la siguiente (commitStyles), lo que preserva el momentum. Al salir, el
// retorno usa un easing back-out para el rebote elástico.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de
// tipo inline (`: number`, `: string`).

import { useRef, type ReactNode } from 'react'

const STRENGTH = 0.35 // 0 a 1
const HIT_AREA = 40 // px de padding sensible alrededor del contenido
const ELASTIC = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

function MagneticElement({ children }: { children?: ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<Animation | null>(null)

  const moveTo = (x: number, y: number, elastic: boolean) => {
    const element = contentRef.current
    if (!element || typeof element.animate !== 'function') return
    const previous = animationRef.current
    if (previous) {
      try {
        previous.commitStyles()
      } catch {
        // el elemento ya no está renderizado; se ignora
      }
      previous.cancel()
    }
    animationRef.current = element.animate([{ transform: `translate(${x}px, ${y}px)` }], {
      duration: elastic ? 450 : 150,
      fill: 'forwards',
      easing: elastic ? ELASTIC : 'ease-out',
    })
  }

  const onMouseMove = (event: { clientX: number; clientY: number; currentTarget: Element }) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const offsetX = (event.clientX - rect.left - rect.width / 2) * STRENGTH
    const offsetY = (event.clientY - rect.top - rect.height / 2) * STRENGTH
    moveTo(offsetX, offsetY, false)
  }

  return (
    <div onMouseMove={onMouseMove} onMouseLeave={() => moveTo(0, 0, true)} style={{ display: 'inline-block', padding: HIT_AREA }}>
      <div ref={contentRef} style={{ willChange: 'transform' }}>
        {children}
      </div>
    </div>
  )
}

export default function MagneticDemo() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', background: '#050510' }}>
      <MagneticElement>
        <button
          style={{
            padding: '1rem 2.5rem',
            borderRadius: 999,
            border: 'none',
            background: '#7c3aed',
            color: 'white',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Atrapame
        </button>
      </MagneticElement>
    </div>
  )
}
