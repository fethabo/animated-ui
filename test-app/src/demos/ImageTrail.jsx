import { ImageTrail } from '@fethabo/animated-ui'

// Pool fijo del demo (prop no controlable desde el panel).
const IMAGES = [
  'https://picsum.photos/id/1015/300/200',
  'https://picsum.photos/id/1025/300/200',
  'https://picsum.photos/id/1035/300/200',
  'https://picsum.photos/id/1045/300/200',
  'https://picsum.photos/id/1055/300/200',
]

export default {
  id: 'image-trail',
  title: 'ImageTrail — imágenes efímeras que brotan siguiendo el mouse',
  height: '60vh',
  controls: [
    { prop: 'size', type: 'number', min: 60, max: 240, step: 10, default: 140 },
    { prop: 'emitEvery', type: 'number', min: 20, max: 240, step: 10, default: 80 },
    { prop: 'duration', type: 'number', min: 300, max: 2500, step: 100, default: 900 },
    { prop: 'maxConcurrent', type: 'number', min: 1, max: 20, step: 1, default: 8 },
  ],
  render: (props) => (
    <ImageTrail
      {...props}
      images={IMAGES}
      imageStyle={{ borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.35)' }}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        background: '#0f0f1a',
        color: '#e5e5e5',
      }}
    >
      <h2 style={{ margin: 0, fontWeight: 500 }}>Movete por acá</h2>
    </ImageTrail>
  ),
}
