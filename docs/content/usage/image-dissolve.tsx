import { useState } from 'react'
import { ImageDissolve } from '@fethabo/animated-ui/image-dissolve'

export function Example() {
  const [src, setSrc] = useState('/a.jpg')
  return (
    <div onClick={() => setSrc((s) => (s === '/a.jpg' ? '/b.jpg' : '/a.jpg'))}>
      <ImageDissolve src={src} alt="Gallery image" duration={800} />
    </div>
  )
}
