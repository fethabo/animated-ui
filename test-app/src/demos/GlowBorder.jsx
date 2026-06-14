import { GlowBorder } from '@fethabo/animated-ui'

const PALETTE = ['#7c3aed', '#22d3ee', '#fbbf24', '#f97316', '#10b981', '#ef4444', '#ffffff']

export default {
  id: 'glow-border',
  title: 'GlowBorder — loop / followCursor',
  height: '50vh',
  controls: [
    { prop: 'followCursor', type: 'boolean', default: false },
    { prop: 'colors', type: 'multi', asColors: true, options: PALETTE, default: ['#fbbf24', '#f97316'] },
    { prop: 'width', type: 'number', min: 1, max: 8, step: 1, default: 2 },
    { prop: 'radius', type: 'number', min: 0, max: 40, step: 1, default: 16 },
    { prop: 'speed', type: 'number', min: 1, max: 12, step: 0.5, default: 4 },
    { prop: 'opacity', type: 'number', min: 0, max: 1, step: 0.05, default: 1 },
  ],
  render: (props) => (
    <GlowBorder {...props} contentStyle={{ background: '#1a1410', padding: '3rem 2rem', width: 280 }}>
      <strong>GlowBorder</strong>
      <p style={{ opacity: 0.7 }}>Loop autónomo, o apunta al cursor con followCursor.</p>
    </GlowBorder>
  ),
}
