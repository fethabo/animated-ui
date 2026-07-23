// Verificación de los behavior hooks (useTilt / useMagnetic / useSpotlight /
// useGlowBorder): cada efecto lado a lado — izquierda el componente, derecha
// el hook aplicado a un componente "de terceros" (FancyCard: forwardea ref,
// className y style, como cualquier design system). Con opciones equivalentes
// ambos lados deben comportarse igual.
import { forwardRef } from 'react'
import {
  TiltCard,
  useTilt,
  MagneticElement,
  useMagnetic,
  SpotlightCard,
  useSpotlight,
  GlowBorder,
  useGlowBorder,
} from '@fethabo/animated-ui'

// Simula el componente de un design system externo: renderiza su propio
// elemento y forwardea ref/props — el contrato mínimo que piden los hooks.
const FancyCard = forwardRef(function FancyCard({ children, style, ...rest }, ref) {
  return (
    <article
      ref={ref}
      style={{
        width: 220,
        padding: '2rem 1.5rem',
        borderRadius: 16,
        background: '#12121f',
        border: '1px solid #333',
        textAlign: 'center',
        ...style,
      }}
      {...rest}
    >
      {children}
    </article>
  )
})

const pairStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(240px, 1fr))',
    gap: '2.5rem 3rem',
    alignItems: 'center',
    justifyItems: 'center',
    padding: '4rem 1rem 2rem',
  },
  caption: { margin: '0.75rem 0 0', opacity: 0.5, fontSize: 12, textAlign: 'center' },
}

function Pair({ caption, children }) {
  return (
    <div>
      {children}
      <p style={pairStyles.caption}>{caption}</p>
    </div>
  )
}

// Los hooks se usan dentro de un componente propio (no en el render prop del
// panel) para respetar las rules of hooks.
function HooksShowcase({ maxAngle, strength, radius, speed, followCursor, respectReducedMotion }) {
  const tiltRef = useTilt({ maxAngle, respectReducedMotion })
  const magneticRef = useMagnetic({ strength, respectReducedMotion })
  const spotlightRef = useSpotlight({ radius })
  const glowRef = useGlowBorder({ speed, followCursor, respectReducedMotion })

  return (
    <div style={pairStyles.grid}>
      <Pair caption="<TiltCard> (componente)">
        <TiltCard maxAngle={maxAngle} respectReducedMotion={respectReducedMotion}>
          <FancyCard>TiltCard</FancyCard>
        </TiltCard>
      </Pair>
      <Pair caption="useTilt(ref) sobre FancyCard">
        <FancyCard ref={tiltRef}>useTilt</FancyCard>
      </Pair>

      <Pair caption="<MagneticElement> (componente, con hitArea)">
        <MagneticElement strength={strength} respectReducedMotion={respectReducedMotion}>
          <FancyCard>MagneticElement</FancyCard>
        </MagneticElement>
      </Pair>
      <Pair caption="useMagnetic(ref) — zona = el propio elemento">
        <FancyCard ref={magneticRef}>useMagnetic</FancyCard>
      </Pair>

      <Pair caption="<SpotlightCard> (componente)">
        <SpotlightCard radius={radius} style={{ borderRadius: 16 }}>
          <FancyCard style={{ background: 'transparent', border: '1px solid #333' }}>
            SpotlightCard
          </FancyCard>
        </SpotlightCard>
      </Pair>
      <Pair caption="useSpotlight(ref) sobre FancyCard">
        <FancyCard ref={spotlightRef}>useSpotlight</FancyCard>
      </Pair>

      <Pair caption="<GlowBorder> (componente)">
        <GlowBorder
          speed={speed}
          followCursor={followCursor}
          respectReducedMotion={respectReducedMotion}
          contentStyle={{ background: '#12121f', padding: '2rem 1.5rem', textAlign: 'center', width: 220, boxSizing: 'border-box' }}
        >
          GlowBorder
        </GlowBorder>
      </Pair>
      <Pair caption="useGlowBorder(ref) — el contenido pone su background">
        <div ref={glowRef} style={{ width: 220 }}>
          <div
            style={{
              background: '#12121f',
              borderRadius: 11,
              padding: '2rem 1.5rem',
              textAlign: 'center',
            }}
          >
            useGlowBorder
          </div>
        </div>
      </Pair>
    </div>
  )
}

export default {
  id: 'behavior-hooks',
  title: 'Behavior hooks — componente vs hook (paridad)',
  height: 'auto',
  controls: [
    { prop: 'maxAngle', type: 'number', min: 0, max: 30, step: 1, default: 12 },
    { prop: 'strength', type: 'number', min: 0, max: 1, step: 0.05, default: 0.35 },
    { prop: 'radius', type: 'number', min: 100, max: 500, step: 10, default: 250 },
    { prop: 'speed', type: 'number', min: 1, max: 12, step: 1, default: 4 },
    { prop: 'followCursor', type: 'boolean', default: false },
  ],
  render: (props) => <HooksShowcase {...props} />,
}
