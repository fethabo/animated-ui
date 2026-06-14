import { StickyScenes } from '@fethabo/animated-ui'

// Las escenas demo quedan fijas; `sceneDuration` y `respectReducedMotion`
// vienen del panel. El contenedor es alto por diseño (sticky scroll), así que
// su panel se ancla a la primera pantalla.
export default {
  id: 'sticky-scenes',
  title: 'StickyScenes',
  // Sin Section: el componente maneja su propia altura de scroll.
  bare: true,
  controls: [{ prop: 'sceneDuration', type: 'number', min: 200, max: 1500, step: 50, default: 700 }],
  render: (props) => (
    <StickyScenes {...props}>
      <StickyScenes.Scene className="ss-demo-scene">
        <h1 style={{ fontSize: '4rem', margin: 0 }}>Escena uno</h1>
      </StickyScenes.Scene>
      <StickyScenes.Scene className="ss-demo-scene">
        {/* Interpola con --aui-scene-progress via calc() puro. */}
        <h1
          style={{
            fontSize: '4rem',
            margin: 0,
            transform: 'translateY(calc((1 - var(--aui-scene-progress, 0)) * 60px))',
            color: 'hsl(calc(var(--aui-scene-progress, 0) * 280), 80%, 70%)',
          }}
        >
          Escena dos (interpolada)
        </h1>
      </StickyScenes.Scene>
      <StickyScenes.Scene className="ss-demo-scene">
        <h1 style={{ fontSize: '4rem', margin: 0 }}>Escena tres</h1>
      </StickyScenes.Scene>
    </StickyScenes>
  ),
}
