import { Marquee } from '@fethabo/animated-ui/marquee'

const LOGOS = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli']

export function Example() {
  return (
    <Marquee speed={60} pauseOnHover fadeEdges>
      {LOGOS.map((logo) => (
        <span key={logo}>{logo}</span>
      ))}
    </Marquee>
  )
}
