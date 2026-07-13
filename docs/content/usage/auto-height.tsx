import { useState } from 'react'
import { AutoHeight } from '@fethabo/animated-ui/auto-height'

export function Example() {
  const [open, setOpen] = useState(false)
  return (
    <AutoHeight>
      <p onClick={() => setOpen((o) => !o)}>
        {open ? 'A longer piece of content that makes the container grow…' : 'Short.'}
      </p>
    </AutoHeight>
  )
}
