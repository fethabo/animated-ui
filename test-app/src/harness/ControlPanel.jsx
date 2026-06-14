// Panel de controles genérico del harness de verificación visual.
// Recibe un descriptor declarativo de controles + un render prop
// `(props) => ReactNode` y bindea en vivo los valores a las props del demo,
// sin recargar. Ver openspec/specs/test-app-harness/spec.md.
import { useMemo, useState } from 'react'

// Control estándar inyectado en TODO panel: permite verificar el
// comportamiento de movimiento reducido sin tocar la config del SO.
const REDUCED_MOTION_CONTROL = {
  prop: 'respectReducedMotion',
  type: 'boolean',
  label: 'respectReducedMotion',
  default: true,
}

// Normaliza el descriptor: agrega respectReducedMotion si el demo no lo declara.
function withReducedMotion(controls) {
  const hasIt = controls.some((c) => c.prop === 'respectReducedMotion')
  return hasIt ? controls : [...controls, REDUCED_MOTION_CONTROL]
}

// Estado inicial = { [prop]: default } de cada control.
function initialState(controls) {
  const state = {}
  for (const c of controls) state[c.prop] = c.default
  return state
}

const styles = {
  wrap: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    width: 240,
    fontFamily: 'system-ui, sans-serif',
    fontSize: 12,
    color: '#e5e5e5',
  },
  toggle: {
    width: '100%',
    padding: '6px 10px',
    borderRadius: 8,
    border: '1px solid #333',
    background: 'rgba(10,10,18,0.85)',
    color: '#e5e5e5',
    cursor: 'pointer',
    textAlign: 'left',
    backdropFilter: 'blur(4px)',
  },
  body: {
    marginTop: 6,
    padding: 10,
    borderRadius: 8,
    border: '1px solid #333',
    background: 'rgba(10,10,18,0.9)',
    backdropFilter: 'blur(4px)',
    maxHeight: '60vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  row: { display: 'flex', flexDirection: 'column', gap: 4 },
  label: { display: 'flex', justifyContent: 'space-between', gap: 8, opacity: 0.85 },
  value: { opacity: 0.6, fontVariantNumeric: 'tabular-nums' },
  inputText: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '4px 6px',
    borderRadius: 6,
    border: '1px solid #333',
    background: '#0a0a12',
    color: '#e5e5e5',
  },
  multi: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  chip: (on) => ({
    padding: '2px 8px',
    borderRadius: 999,
    border: `1px solid ${on ? '#7c3aed' : '#333'}`,
    background: on ? '#7c3aed' : 'transparent',
    color: on ? '#fff' : '#aaa',
    cursor: 'pointer',
  }),
  swatch: (on, color) => ({
    width: 22,
    height: 22,
    borderRadius: 6,
    border: `2px solid ${on ? '#fff' : 'transparent'}`,
    background: color,
    cursor: 'pointer',
    outline: '1px solid #333',
  }),
}

function Control({ control, value, onChange }) {
  const { type, label, prop } = control
  const name = label ?? prop

  if (type === 'number') {
    return (
      <div style={styles.row}>
        <span style={styles.label}>
          <span>{name}</span>
          <span style={styles.value}>{value}</span>
        </span>
        <input
          type="range"
          min={control.min}
          max={control.max}
          step={control.step ?? 1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    )
  }

  if (type === 'color') {
    return (
      <div style={styles.row}>
        <span style={styles.label}>
          <span>{name}</span>
          <span style={styles.value}>{value}</span>
        </span>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    )
  }

  if (type === 'enum') {
    return (
      <div style={styles.row}>
        <span style={styles.label}>{name}</span>
        <select style={styles.inputText} value={value} onChange={(e) => onChange(e.target.value)}>
          {control.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (type === 'boolean') {
    return (
      <label style={{ ...styles.label, cursor: 'pointer' }}>
        <span>{name}</span>
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
      </label>
    )
  }

  if (type === 'text') {
    return (
      <div style={styles.row}>
        <span style={styles.label}>{name}</span>
        <input
          style={styles.inputText}
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    )
  }

  if (type === 'multi') {
    const selected = Array.isArray(value) ? value : []
    const toggle = (opt) =>
      onChange(selected.includes(opt) ? selected.filter((o) => o !== opt) : [...selected, opt])
    // Si las opciones parecen colores, muestra swatches; si no, chips de texto.
    const asColors = control.asColors
    return (
      <div style={styles.row}>
        <span style={styles.label}>{name}</span>
        <div style={styles.multi}>
          {control.options.map((opt) => {
            const on = selected.includes(opt)
            return asColors ? (
              <div
                key={opt}
                title={opt}
                style={styles.swatch(on, opt)}
                onClick={() => toggle(opt)}
              />
            ) : (
              <span key={opt} style={styles.chip(on)} onClick={() => toggle(opt)}>
                {opt}
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  return null
}

export function ControlPanel({ controls, children }) {
  const normalized = useMemo(() => withReducedMotion(controls), [controls])
  const [state, setState] = useState(() => initialState(normalized))
  const [open, setOpen] = useState(false)

  const set = (prop, val) => setState((s) => ({ ...s, [prop]: val }))

  return (
    <>
      {children(state)}
      <div style={styles.wrap}>
        <button style={styles.toggle} onClick={() => setOpen((o) => !o)}>
          {open ? '▾ Controles' : '▸ Controles'}
        </button>
        {open && (
          <div style={styles.body}>
            {normalized.map((c) => (
              <Control
                key={c.prop}
                control={c}
                value={state[c.prop]}
                onChange={(v) => set(c.prop, v)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
