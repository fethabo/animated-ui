import { ShinyText } from '@fethabo/animated-ui'

export default {
  id: 'shiny-text',
  title: 'ShinyText — barrido de brillo',
  height: '50vh',
  controls: [
    { prop: 'text', type: 'text', default: 'Gradiente cyan (caso GradientText)' },
    { prop: 'color', type: 'color', default: '#155e75' },
    { prop: 'highlight', type: 'color', default: '#22d3ee' },
    { prop: 'speed', type: 'number', min: 0.5, max: 10, step: 0.5, default: 2 },
    { prop: 'angle', type: 'number', min: 0, max: 360, step: 5, default: 90 },
  ],
  render: ({ text, ...props }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', position: 'relative' }}>
      <h1 style={{ fontSize: '2.5rem', margin: 0 }}>
        <ShinyText {...props}>{text}</ShinyText>
      </h1>
      {/* Caso fijo: el panel controla props; este ejemplo muestra el override
          por CASCADA. La var en el padre pisa el default sin pasar props, y a
          8s el barrido se ve casi sin movimiento. */}
      <div style={{ '--aui-shiny-speed': '8s', fontSize: '1.5rem' }}>
        <ShinyText>Barrido lento via --aui-shiny-speed en el padre (override por cascada)</ShinyText>
      </div>
    </div>
  ),
}
