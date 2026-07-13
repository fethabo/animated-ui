// auto-height.tsx — Contenedor que transiciona su altura cuando el contenido
// cambia: la forma de animar height: auto (acordeones, tabs, disclosure).
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// El contenedor nunca fija su altura: en useLayoutEffect (después del layout
// nuevo, antes del paint) se compara la altura natural nueva con la última
// registrada y se anima entre ambas con element.animate() —overflow: hidden
// solo durante la transición—; al terminar, el efecto WAAPI expira y el
// contenedor sigue en height: auto, fluyendo con el layout. Si el contenido
// vuelve a cambiar en vuelo, se parte desde la altura visual actual (el
// getBoundingClientRect refleja la animación) sin saltos. Con
// prefers-reduced-motion el ajuste es instantáneo.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useLayoutEffect, useRef, useState } from 'react'

const DURATION = 300 // ms
const EASING = 'ease'

const PANELS = [
  'Un resumen corto.',
  'Un panel bastante más alto: varias líneas de contenido que fuerzan al contenedor a crecer. La transición de altura hace que el contenido de abajo se desplace suavemente en lugar de saltar. Al terminar, la altura vuelve a auto y el layout sigue fluido ante resizes.',
  'Otro texto intermedio, de un par de líneas, para alternar alturas entre los tres paneles.',
]

export default function AutoHeightDemo() {
  const [panel, setPanel] = useState(0)
  const boxRef = useRef<HTMLDivElement>(null)
  const lastHeightRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return
    // Altura visual actual (si hay animación en vuelo, la refleja).
    const inFlight = box.getAnimations().length > 0
    const visual = box.getBoundingClientRect().height
    box.getAnimations().forEach((a) => a.cancel())
    const target = box.getBoundingClientRect().height // natural, tras cancelar
    const from = inFlight ? visual : lastHeightRef.current
    lastHeightRef.current = target
    if (from === null || Math.abs(from - target) < 0.5) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    box.animate(
      [
        { height: `${from}px`, overflow: 'hidden' },
        { height: `${target}px`, overflow: 'hidden' },
      ],
      { duration: DURATION, easing: EASING },
    )
  }, [panel])

  return (
    <div style={{ padding: '2rem', background: '#0a0a12', minHeight: '50vh', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {PANELS.map((_, i) => (
          <button key={i} onClick={() => setPanel(i)}>
            Panel {i + 1}
          </button>
        ))}
      </div>
      <div
        ref={boxRef}
        style={{ borderRadius: 12, background: '#1e1b2e', color: '#e5e5e5', maxWidth: 480 }}
      >
        <p style={{ margin: 0, padding: '1rem' }}>{PANELS[panel]}</p>
      </div>
      <p style={{ color: '#888', maxWidth: 480 }}>
        El contenido de abajo se desplaza suavemente cuando el panel cambia de altura.
      </p>
    </div>
  )
}
