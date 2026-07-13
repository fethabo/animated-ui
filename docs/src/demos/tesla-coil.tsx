import { TeslaCoil } from '@fethabo/animated-ui/tesla-coil'

export default function TeslaCoilDemo() {
  return (
    <div className="docs-demo-stage">
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          height: 300,
          borderRadius: 16,
          overflow: 'hidden',
          background: '#05060f',
          border: '1px solid #2c2c4a',
        }}
      >
        <TeslaCoil color="#7dd3fc" boltCount={9} reach={180} cursorBolts={3}>
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: 20,
            }}
          >
            <span style={{ opacity: 0.7 }}>move the cursor over the coil</span>
          </div>
        </TeslaCoil>
      </div>
    </div>
  )
}
