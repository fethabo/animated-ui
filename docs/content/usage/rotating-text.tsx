import { RotatingText } from '@fethabo/animated-ui/rotating-text'

export function Example() {
  return (
    <h2>
      <RotatingText words={['faster', 'lighter', 'smoother']} transition="slide-up">
        We build{' '}
      </RotatingText>
    </h2>
  )
}
