import { AnimatedBackground } from '@fethabo/animated-ui'

// Paleta candidata para el control multi de `colors` (se togglean swatches).
const PALETTE = [
  'rgba(124,58,237,0.4)',
  'rgba(34,211,238,0.3)',
  'rgba(251,191,36,0.4)',
  'rgba(249,115,22,0.3)',
  'rgba(16,185,129,0.35)',
  'rgba(239,68,68,0.3)',
]

export default {
  id: 'animated-background',
  title: 'AnimatedBackground',
  height: '60vh',
  controls: [
    { prop: 'variant', type: 'enum', options: ['aurora', 'beam', 'mesh', 'noise'], default: 'aurora' },
    { prop: 'colors', type: 'multi', asColors: true, options: PALETTE, default: [] },
    { prop: 'speed', type: 'number', min: 1, max: 20, step: 0.5, default: 8 },
    { prop: 'intensity', type: 'number', min: 0, max: 1, step: 0.05, default: 1 },
  ],
  render: (props) => <AnimatedBackground {...props} />,
}
