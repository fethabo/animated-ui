import { GuidingBranches } from '@fethabo/animated-ui/guiding-branches'

// Quedate quieto ~2s dentro del recuadro: crecen las ramas desde el cursor.
export default function GuidingBranchesDemo() {
  return (
    <GuidingBranches aesthetic="roots" idleDelay={1600} color="#34d399" className="docs-demo-stage" style={{ position: 'relative' }}>
      <p style={{ margin: 0, opacity: 0.7 }}>Dejá el mouse quieto acá adentro…</p>
    </GuidingBranches>
  )
}
