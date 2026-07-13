import { CountUp } from '@fethabo/animated-ui/count-up'

export function Example() {
  return (
    <CountUp value={12500} separator="," prefix="$" duration={2000} />
  )
}
