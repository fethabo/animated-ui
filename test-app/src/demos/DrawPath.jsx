import { DrawPath } from '@fethabo/animated-ui'

export default {
  id: 'draw-path',
  title: 'DrawPath — el SVG del consumer se dibuja trazo a trazo (la grilla gris tiene data-aui-no-draw)',
  height: '60vh',
  controls: [
    { prop: 'trigger', type: 'enum', options: ['in-view', 'mount'], default: 'in-view' },
    { prop: 'once', type: 'boolean', default: false },
    { prop: 'duration', type: 'number', min: 0.2, max: 3, step: 0.1, default: 1.2 },
    { prop: 'stagger', type: 'number', min: 0, max: 1, step: 0.05, default: 0.15 },
    { prop: 'delay', type: 'number', min: 0, max: 2, step: 0.1, default: 0 },
  ],
  render: (props) => (
    <DrawPath {...props} style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
      <svg viewBox="0 0 260 140" width="520" fill="none" strokeWidth="3" strokeLinecap="round">
        {/* Opt-out: la grilla queda visible sin animar. */}
        <g data-aui-no-draw stroke="#333" strokeWidth="1">
          <line x1="0" y1="70" x2="260" y2="70" />
          <line x1="130" y1="0" x2="130" y2="140" />
        </g>
        <path d="M 15 110 Q 65 20 115 80 T 245 50" stroke="#0ea5e9" />
        <circle cx="70" cy="70" r="34" stroke="#f59e0b" />
        <rect x="160" y="75" width="70" height="48" rx="10" stroke="#a3e635" />
        <ellipse cx="195" cy="40" rx="30" ry="18" stroke="#e879f9" />
        <polyline points="20,30 40,15 60,35 80,12" stroke="#f43f5e" />
      </svg>
    </DrawPath>
  ),
}
