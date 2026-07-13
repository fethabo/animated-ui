import { ImageTrail } from '@fethabo/animated-ui/image-trail'

// Pool de imágenes como data-URIs SVG: gradientes generados inline, sin requests externas.
const tile = (from: string, to: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/></linearGradient></defs><rect width='300' height='200' rx='18' fill='url(#g)'/></svg>`,
  )}`

const IMAGES = [
  tile('#7c3aed', '#0ea5e9'),
  tile('#0ea5e9', '#22d3ee'),
  tile('#f472b6', '#7c3aed'),
  tile('#22d3ee', '#a78bfa'),
  tile('#a78bfa', '#0ea5e9'),
]

export default function ImageTrailDemo() {
  return (
    <ImageTrail
      images={IMAGES}
      size={150}
      imageStyle={{ borderRadius: 14, boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
      style={{
        minHeight: 340,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 12,
        background: '#0a0a12',
        color: '#e5e7eb',
      }}
    >
      <h2 style={{ margin: 0, fontWeight: 500, opacity: 0.7 }}>move around here</h2>
    </ImageTrail>
  )
}
