// marquee.tsx — Cinta infinita de contenido sin costura, con pausa en hover.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// CSS puro: la pista contiene dos mitades idénticas (la copia aria-hidden,
// los lectores anuncian el contenido una vez) y anima translateX exactamente
// media pista por ciclo (el -gap/2 compensa el gap central) — el loop es sin
// costura y no hay JS por frame. pauseOnHover = animation-play-state. Con
// prefers-reduced-motion la cinta queda estática.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect } from 'react'

const GAP = 40 // px entre ítems y repeticiones
const DURATION = 18 // s por ciclo

const CSS = `
.marquee {
  overflow: hidden;
  display: flex;
  /* Fade en los extremos con máscara de gradiente. */
  mask-image: linear-gradient(to right, transparent, #000 48px, #000 calc(100% - 48px), transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, #000 48px, #000 calc(100% - 48px), transparent);
}
.marquee-track {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: max-content;
  gap: ${GAP}px;
  animation: marquee-scroll ${DURATION}s linear infinite;
}
.marquee:hover .marquee-track {
  animation-play-state: paused; /* pausa en hover, reanuda sin salto */
}
.marquee-group {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: ${GAP}px;
}
@keyframes marquee-scroll {
  to { transform: translateX(calc(-50% - ${GAP / 2}px)); }
}
@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; }
}
`

const LOGOS = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Stark', 'Wayne']

function Group({ hidden }: { hidden?: boolean }) {
  return (
    <div className="marquee-group" aria-hidden={hidden || undefined}>
      {LOGOS.map((logo) => (
        <span
          key={logo}
          style={{
            padding: '10px 22px',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.08)',
            color: '#e5e5e5',
            fontFamily: 'system-ui',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {logo}
        </span>
      ))}
    </div>
  )
}

export default function MarqueeDemo() {
  useEffect(() => {
    if (document.getElementById('marquee-demo-css')) return
    const style = document.createElement('style')
    style.id = 'marquee-demo-css'
    style.textContent = CSS
    document.head.appendChild(style)
  }, [])

  return (
    <div style={{ display: 'grid', alignItems: 'center', height: '40vh', background: '#0a0a12' }}>
      <div className="marquee">
        <div className="marquee-track">
          <Group />
          <Group hidden />
        </div>
      </div>
    </div>
  )
}
