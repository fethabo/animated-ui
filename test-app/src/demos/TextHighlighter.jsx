import { TextHighlighter } from '@fethabo/animated-ui'

export default {
  id: 'text-highlighter',
  title: 'TextHighlighter — marcador a mano alzada (probá trigger=hover y once=false)',
  height: '60vh',
  controls: [
    {
      prop: 'shape',
      type: 'enum',
      options: ['underline', 'wavy-underline', 'circle', 'highlight', 'strike', 'box'],
      default: 'underline',
    },
    { prop: 'trigger', type: 'enum', options: ['in-view', 'mount', 'hover'], default: 'in-view' },
    { prop: 'once', type: 'boolean', default: false },
    { prop: 'color', type: 'color', default: '#f43f5e' },
    { prop: 'strokeWidth', type: 'number', min: 1, max: 12, step: 0.5, default: 3 },
    { prop: 'duration', type: 'number', min: 0.2, max: 3, step: 0.1, default: 0.9 },
    { prop: 'delay', type: 'number', min: 0, max: 2, step: 0.1, default: 0 },
    { prop: 'seed', type: 'text', default: 'aui' },
  ],
  render: (props) => (
    <div style={{ fontFamily: 'system-ui', color: '#e5e5e5', maxWidth: 520, padding: 24 }}>
      <h2 style={{ fontSize: '2rem' }}>
        Una frase con la parte <TextHighlighter {...props}>importante</TextHighlighter> marcada.
      </h2>
      <p style={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
        Y un caso multi-línea: el shape se dibuja sobre el bounding box completo, así que{' '}
        <TextHighlighter {...props} seed={`${props.seed}-2`}>
          una frase larga que seguramente wrappea en varias líneas
        </TextHighlighter>{' '}
        se marca entera (por eso conviene usarlo en frases cortas).
      </p>
    </div>
  ),
}
