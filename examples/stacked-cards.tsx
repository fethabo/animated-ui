// stacked-cards.tsx — Cards que se fijan y se apilan al scrollear.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// El apilado físico lo da `position: sticky; top: offset` en cada wrapper (el
// navegador hace el pin gratis); cada wrapper reserva `cardTravel` px de
// recorrido. Un listener pasivo de scroll (coalescido por RAF) calcula, por
// card, cuántas tiene encima (profundidad) y lo escribe como --aui-stack-depth,
// con el que `scale`/`opacity` interpolan en el compositor — sin estado de
// React: scrollear no re-renderiza. La card más reciente queda arriba.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef, type ReactNode } from 'react'

const OFFSET_TOP = 60 // px desde el top del viewport donde se fija el stack
const CARD_TRAVEL = 420 // px de scroll (y altura) por card
const SCALE_STEP = 0.05 // encogido por nivel de profundidad
const OPACITY_STEP = 0.15 // oscurecido por nivel de profundidad

const STYLE_ID = 'stacked-cards-demo-styles'
const CSS = `
.sc-item { position: sticky; top: ${OFFSET_TOP}px; height: ${CARD_TRAVEL}px; }
.sc-card {
  height: 100%;
  transform-origin: top center;
  transform: scale(calc(1 - ${SCALE_STEP} * var(--depth, 0)));
  opacity: calc(1 - ${OPACITY_STEP} * var(--depth, 0));
}
@media (prefers-reduced-motion: reduce) {
  .sc-card { transform: none; opacity: 1; }
}
`

function StackedCards({ children }: { children: ReactNode[] }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const n = children.length

  useEffect(() => {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style')
      style.id = STYLE_ID
      style.textContent = CSS
      document.head.appendChild(style)
    }
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const items = root.querySelectorAll<HTMLElement>('.sc-item')
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const scrolled = Math.max(0, OFFSET_TOP - root.getBoundingClientRect().top)
        items.forEach((item, i) => {
          const raw = scrolled / CARD_TRAVEL - i
          const max = Math.max(0, n - 1 - i)
          const depth = Math.max(0, Math.min(raw, max))
          item.style.setProperty('--depth', String(depth))
        })
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [n])

  return (
    <div ref={rootRef}>
      {children.map((child, i) => (
        <div key={i} className="sc-item">
          <div className="sc-card">{child}</div>
        </div>
      ))}
    </div>
  )
}

const COLORS = ['#7c3aed', '#db2777', '#2563eb', '#0d9488']

export default function StackedCardsDemo() {
  return (
    <div style={{ background: '#050510', color: '#fff', fontFamily: 'system-ui' }}>
      <div style={{ height: '50vh', display: 'grid', placeItems: 'center' }}>
        <p style={{ opacity: 0.5 }}>Scrolleá ↓</p>
      </div>

      <StackedCards>
        {COLORS.map((color, i) => (
          <div
            key={i}
            style={{
              height: '100%',
              borderRadius: 24,
              background: color,
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.4)',
            }}
          >
            <h2 style={{ fontSize: '2.5rem' }}>Card {i + 1}</h2>
          </div>
        ))}
      </StackedCards>

      <div style={{ height: '50vh', display: 'grid', placeItems: 'center' }}>
        <p style={{ opacity: 0.5 }}>Fin</p>
      </div>
    </div>
  )
}
