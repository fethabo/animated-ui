import { GlitchText } from '@fethabo/animated-ui'

export default {
  id: 'glitch-text',
  title: 'GlitchText — ráfagas intermitentes (probá trigger=hover pasando el mouse)',
  height: '40vh',
  controls: [
    { prop: 'trigger', type: 'enum', options: ['loop', 'hover'], default: 'loop' },
    { prop: 'intensity', type: 'number', min: 1, max: 12, step: 0.5, default: 3 },
    { prop: 'frequency', type: 'number', min: 1, max: 6, step: 1, default: 1 },
    { prop: 'burstDuration', type: 'number', min: 0.1, max: 1.5, step: 0.05, default: 0.3 },
  ],
  render: (props) => (
    <GlitchText {...props} as="h1" style={{ fontSize: '3rem', fontFamily: 'monospace' }}>
      ERROR 404
    </GlitchText>
  ),
}
