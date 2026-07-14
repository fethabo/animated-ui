import { ParticleField } from '@fethabo/animated-ui/particle-field'
import type { DemoControl } from '../content'

export default function ParticleFieldDemo(props: Record<string, unknown>) {
  return (
    <div style={{ position: 'relative', minHeight: 320 }}>
      <ParticleField count={90} links color="#7c3aed" cursorInteraction="repel" {...props} />
    </div>
  )
}

export const controls: DemoControl[] = [
  {
    prop: 'drift',
    type: 'enum',
    options: ['bounce', 'snow', 'embers', 'bubbles', 'warp'],
    default: 'bounce',
  },
  {
    prop: 'cursorInteraction',
    type: 'enum',
    options: ['repel', 'attract', 'none'],
    default: 'repel',
  },
  { prop: 'count', type: 'number', min: 10, max: 200, step: 10, default: 90 },
  { prop: 'links', type: 'boolean', default: true },
  { prop: 'color', type: 'color', default: '#7c3aed' },
  { prop: 'linkColor', type: 'color', default: '#7c3aed' },
  { prop: 'linkCursor', type: 'boolean', default: true },
  { prop: 'speed', type: 'number', min: 0.1, max: 2, step: 0.1, default: 0.4 },
  { prop: 'radius', type: 'number', min: 1, max: 8, step: 0.5, default: 2 },
  { prop: 'cursorRadius', type: 'number', min: 40, max: 300, step: 10, default: 120 },
  { prop: 'linkDistance', type: 'number', min: 40, max: 240, step: 10, default: 120 },
  { prop: 'linkWidth', type: 'number', min: 0.5, max: 4, step: 0.5, default: 1 },
]
