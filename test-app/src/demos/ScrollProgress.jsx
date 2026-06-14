import { ScrollProgress } from '@fethabo/animated-ui'

// La barra es position:fixed: se ve en todo el scroll de la página, pero su
// panel de controles vive en esta Section.
export default {
  id: 'scroll-progress',
  title: 'ScrollProgress — barra global de progreso de lectura',
  height: '40vh',
  controls: [
    { prop: 'position', type: 'enum', options: ['top', 'bottom'], default: 'top' },
    { prop: 'color', type: 'color', default: '#22d3ee' },
    { prop: 'height', type: 'number', min: 1, max: 16, step: 1, default: 4 },
  ],
  render: (props) => <ScrollProgress {...props} />,
}
