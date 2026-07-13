import { TypewriterText } from '@fethabo/animated-ui/typewriter-text'

export function Example() {
  return (
    <TypewriterText
      text={['Build once.', 'Ship anywhere.', 'Zero config.']}
      loop
      speed={30}
    />
  )
}
