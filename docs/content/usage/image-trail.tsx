import { ImageTrail } from '@fethabo/animated-ui/image-trail'

// SVG data-URIs (sin requests externas).
const tile = (from: string, to: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/></linearGradient></defs><rect width='300' height='200' rx='16' fill='url(#g)'/></svg>`,
  )}`

const images = [tile('#7c3aed', '#0ea5e9'), tile('#0ea5e9', '#22d3ee'), tile('#f472b6', '#7c3aed')]

export function Example() {
  return (
    <ImageTrail
      images={images}
      size={140}
      imageStyle={{ borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.35)' }}
      style={{ minHeight: 320 }}
    >
      <h2>Movete por acá</h2>
    </ImageTrail>
  )
}
