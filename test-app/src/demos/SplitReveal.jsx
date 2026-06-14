import { SplitReveal } from '@fethabo/animated-ui'

export default {
  id: 'split-reveal',
  title: 'SplitReveal — stagger por char/word/line (scrolleá hasta acá)',
  height: '80vh',
  controls: [
    { prop: 'text', type: 'text', default: 'Cada unidad entra con un stagger sutil al scrollear' },
    { prop: 'split', type: 'enum', options: ['char', 'word', 'line'], default: 'word' },
    { prop: 'preset', type: 'enum', options: ['fade', 'slide-up', 'blur'], default: 'slide-up' },
    { prop: 'trigger', type: 'enum', options: ['in-view', 'mount'], default: 'in-view' },
    { prop: 'stagger', type: 'number', min: 0, max: 0.3, step: 0.01, default: 0.05 },
    { prop: 'duration', type: 'number', min: 0.1, max: 2, step: 0.1, default: 0.6 },
    { prop: 'distance', type: 'number', min: 0, max: 80, step: 4, default: 16 },
    { prop: 'once', type: 'boolean', default: true },
  ],
  render: (props) => (
    <div style={{ maxWidth: 720, textAlign: 'center', position: 'relative' }}>
      <h1 style={{ fontSize: '2.6rem', lineHeight: 1.25, margin: 0 }}>
        <SplitReveal {...props} />
      </h1>
    </div>
  ),
}
