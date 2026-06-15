import { AttentionCue } from '@fethabo/animated-ui'

export default {
  id: 'attention-cue',
  title: 'AttentionCue — dejá el mouse quieto: el trazo apunta al botón',
  height: '80vh',
  controls: [
    { prop: 'idleDelay', type: 'number', min: 500, max: 5000, step: 100, default: 1500 },
    { prop: 'color', type: 'color', default: '#fbbf24' },
    { prop: 'speed', type: 'number', min: 100, max: 1200, step: 20, default: 420 },
    { prop: 'maxDistance', type: 'number', min: 80, max: 500, step: 10, default: 260 },
    { prop: 'duration', type: 'number', min: 200, max: 2000, step: 100, default: 700 },
    { prop: 'lineWidth', type: 'number', min: 1, max: 8, step: 1, default: 3 },
    { prop: 'head', type: 'enum', options: ['arrow', 'dot', 'none'], default: 'arrow' },
    { prop: 'marker', type: 'enum', options: ['beam', 'footprints'], default: 'beam' },
    { prop: 'curve', type: 'number', min: 0, max: 1, step: 0.05, default: 0 },
    { prop: 'showGuide', type: 'boolean', default: false },
  ],
  render: (props) => (
    <div style={{ position: 'absolute', inset: 0, background: '#0b0b12' }}>
      <AttentionCue {...props} target="#aui-cue-target">
        <div style={{ position: 'relative', height: '100%', color: '#eee', fontFamily: 'system-ui' }}>
          <p style={{ padding: 24 }}>Dejá el mouse quieto unos segundos…</p>
          <button id="aui-cue-target" style={{ position: 'absolute', right: 80, bottom: 100, padding: '12px 20px', borderRadius: 10 }}>
            Empezá acá
          </button>
        </div>
      </AttentionCue>
    </div>
  ),
}
