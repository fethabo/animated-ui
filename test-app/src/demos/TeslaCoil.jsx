import { TeslaCoil } from '@fethabo/animated-ui'

export default {
  id: 'tesla-coil',
  title: 'TeslaCoil — rayos jagged desde el centro (mové el mouse encima)',
  height: '80vh',
  controls: [
    { prop: 'color', type: 'color', default: '#7dd3fc' },
    { prop: 'boltCount', type: 'number', min: 1, max: 20, step: 1, default: 9 },
    { prop: 'lineWidth', type: 'number', min: 1, max: 6, step: 1, default: 2 },
    { prop: 'frequency', type: 'number', min: 2, max: 30, step: 1, default: 12 },
    { prop: 'reach', type: 'number', min: 60, max: 320, step: 10, default: 200 },
    { prop: 'jitter', type: 'number', min: 2, max: 50, step: 1, default: 18 },
    { prop: 'followCursor', type: 'boolean', default: true },
    { prop: 'cursorBolts', type: 'number', min: 0, max: 8, step: 1, default: 3 },
    { prop: 'cursorTrigger', type: 'enum', options: ['hover', 'click'], default: 'hover' },
  ],
  render: (props) => (
    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: '#05060f' }}>
      <div style={{ width: 560, height: 440 }}>
        <TeslaCoil {...props}>
          {/* El botón va abajo para no tapar el nodo central ni los rayos. */}
          <div style={{ height: 440, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 20 }}>
            <button style={{ padding: '10px 18px', borderRadius: 10 }}>Cargar (clickeable)</button>
          </div>
        </TeslaCoil>
      </div>
    </div>
  ),
}
