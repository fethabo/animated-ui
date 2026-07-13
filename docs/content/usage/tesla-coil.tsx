import { TeslaCoil } from '@fethabo/animated-ui/tesla-coil'

export function Example() {
  return (
    <div style={{ height: 400 }}>
      <TeslaCoil color="#7dd3fc" boltCount={9} reach={200}>
        <button>Charge</button>
      </TeslaCoil>
    </div>
  )
}
