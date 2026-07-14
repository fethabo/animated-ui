import { GuidingBranches } from '@fethabo/animated-ui/guiding-branches'
import type { DemoControl } from '../content'

// Quedate quieto ~2s dentro del recuadro: crecen las ramas desde el cursor.
export default function GuidingBranchesDemo(props: Record<string, unknown>) {
  return (
    <GuidingBranches
      aesthetic="roots"
      idleDelay={1600}
      color="#34d399"
      {...props}
      className="docs-demo-stage"
      style={{ position: 'relative' }}
    >
      <p style={{ margin: 0, opacity: 0.7 }}>Dejá el mouse quieto acá adentro…</p>
    </GuidingBranches>
  )
}

export const controls: DemoControl[] = [
  { prop: 'aesthetic', type: 'enum', options: ['roots', 'lightning', 'circuit'], default: 'roots' },
  { prop: 'color', type: 'color', default: '#34d399' },
  { prop: 'idleDelay', type: 'number', min: 500, max: 4000, step: 100, default: 1600 },
  { prop: 'loop', type: 'boolean', default: false },
  { prop: 'density', type: 'number', min: 1, max: 8, step: 1, default: 4 },
  { prop: 'depth', type: 'number', min: 1, max: 6, step: 1, default: 3 },
  { prop: 'curl', type: 'number', min: 0, max: 1, step: 0.1, default: 0.6 },
  { prop: 'speed', type: 'number', min: 80, max: 800, step: 20, default: 320 },
  { prop: 'maxDistance', type: 'number', min: 80, max: 500, step: 20, default: 260 },
  { prop: 'lineWidth', type: 'number', min: 1, max: 6, step: 0.5, default: 2 },
  { prop: 'duration', type: 'number', min: 400, max: 3000, step: 100, default: 1400 },
  { prop: 'jitter', type: 'number', min: 0, max: 20, step: 1, default: 0 },
]
