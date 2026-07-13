import { useState } from 'react'
import { AnimatedList } from '@fethabo/animated-ui/animated-list'

export function Example() {
  const [items, setItems] = useState(['A', 'B', 'C'])
  return (
    <AnimatedList enter="slide" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item) => (
        <div key={item}>{item}</div>
      ))}
    </AnimatedList>
  )
}
