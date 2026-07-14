import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { DemoControl } from '../content'
import { useT } from '../i18n/dict'
import './control-panel.css'

// Control inyectado en TODO panel: permite ver el comportamiento de movimiento
// reducido sin tocar la config del SO. (Portado del harness del test-app.)
const REDUCED_MOTION_CONTROL: DemoControl = {
  prop: 'respectReducedMotion',
  type: 'boolean',
  default: true,
  label: 'respectReducedMotion',
}

function withReducedMotion(controls: DemoControl[]): DemoControl[] {
  const has = controls.some((c) => c.prop === 'respectReducedMotion')
  return has ? controls : [...controls, REDUCED_MOTION_CONTROL]
}

function initialState(controls: DemoControl[]): Record<string, unknown> {
  const state: Record<string, unknown> = {}
  for (const c of controls) state[c.prop] = c.default
  return state
}

// Igualdad estructural liviana: sirve para primitivos y para arrays de strings
// (control `multi`). Se usa para detectar qué props difieren de su default.
function sameValue(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => v === b[i])
  }
  return false
}

// Serializa un valor de prop a su forma JSX: strings entre comillas, el resto
// (números, booleans, arrays) entre llaves.
function formatProp(prop: string, value: unknown): string {
  if (typeof value === 'string') return `${prop}="${value}"`
  if (typeof value === 'boolean') return value ? prop : `${prop}={false}`
  if (Array.isArray(value)) return `${prop}={${JSON.stringify(value)}}`
  return `${prop}={${String(value)}}`
}

// Snippet builder: solo las props cuyo valor difiere de su default.
function buildSnippet(
  componentName: string,
  controls: DemoControl[],
  state: Record<string, unknown>,
): string {
  const changed = controls.filter((c) => !sameValue(state[c.prop], c.default))
  if (changed.length === 0) return `<${componentName} />`
  const lines = changed.map((c) => `  ${formatProp(c.prop, state[c.prop])}`)
  return `<${componentName}\n${lines.join('\n')}\n/>`
}

function Control({
  control,
  value,
  onChange,
}: {
  control: DemoControl
  value: unknown
  onChange: (v: unknown) => void
}) {
  const name = control.label ?? control.prop

  switch (control.type) {
    case 'number':
      return (
        <div className="docs-ctl-row">
          <span className="docs-ctl-label">
            <span>{name}</span>
            <span className="docs-ctl-value">{String(value)}</span>
          </span>
          <input
            type="range"
            min={control.min}
            max={control.max}
            step={control.step ?? 1}
            value={Number(value)}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        </div>
      )
    case 'color':
      return (
        <div className="docs-ctl-row">
          <span className="docs-ctl-label">
            <span>{name}</span>
            <span className="docs-ctl-value">{String(value)}</span>
          </span>
          <input type="color" value={String(value)} onChange={(e) => onChange(e.target.value)} />
        </div>
      )
    case 'enum':
      return (
        <div className="docs-ctl-row">
          <span className="docs-ctl-label">{name}</span>
          <select value={String(value)} onChange={(e) => onChange(e.target.value)}>
            {control.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )
    case 'boolean':
      return (
        <label className="docs-ctl-label docs-ctl-check">
          <span>{name}</span>
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
        </label>
      )
    case 'text':
      return (
        <div className="docs-ctl-row">
          <span className="docs-ctl-label">{name}</span>
          <input
            type="text"
            value={value == null ? '' : String(value)}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )
    case 'multi': {
      const selected = Array.isArray(value) ? (value as string[]) : []
      const toggle = (opt: string) =>
        onChange(
          selected.includes(opt) ? selected.filter((o) => o !== opt) : [...selected, opt],
        )
      return (
        <div className="docs-ctl-row">
          <span className="docs-ctl-label">{name}</span>
          <div className="docs-ctl-multi">
            {control.options.map((opt) => {
              const on = selected.includes(opt)
              return control.asColors ? (
                <button
                  key={opt}
                  type="button"
                  title={opt}
                  className={on ? 'docs-ctl-swatch on' : 'docs-ctl-swatch'}
                  style={{ background: opt }}
                  onClick={() => toggle(opt)}
                />
              ) : (
                <button
                  key={opt}
                  type="button"
                  className={on ? 'docs-ctl-chip on' : 'docs-ctl-chip'}
                  onClick={() => toggle(opt)}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      )
    }
  }
}

// Snippet builder + botón de copiar. Muestra la configuración actual del demo
// como JSX pegable, con solo las props modificadas respecto de su default.
function Snippet({ code }: { code: string }) {
  const t = useT()
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<number>()

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  const onCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="docs-ctl-snippet">
      <div className="docs-ctl-snippet-head">
        <span>{t.currentConfig}</span>
        <button type="button" className="docs-ctl-copy" onClick={onCopy}>
          {copied ? t.copied : t.copy}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
}

/**
 * Panel de controles del demo: mantiene el estado de las props y las bindea en
 * vivo vía render prop `(state) => ReactNode`. El estado se reinicializa al
 * remontar (la vista pasa `key={slug}`) y con el botón Reset. El panel se
 * renderiza como hermano del demo (fuera del frame recortado); en demos flow /
 * full-bleed se ancla al viewport con `anchored`.
 */
export function ControlPanel({
  controls,
  componentName,
  children,
  anchored = false,
}: {
  controls: DemoControl[]
  componentName: string
  children: (state: Record<string, unknown>) => ReactNode
  anchored?: boolean
}) {
  const t = useT()
  const normalized = useMemo(() => withReducedMotion(controls), [controls])
  const [state, setState] = useState<Record<string, unknown>>(() => initialState(normalized))
  const [open, setOpen] = useState(false)

  const set = (prop: string, val: unknown) => setState((s) => ({ ...s, [prop]: val }))
  const reset = () => setState(initialState(normalized))

  const snippet = useMemo(
    () => buildSnippet(componentName, normalized, state),
    [componentName, normalized, state],
  )

  return (
    <>
      {children(state)}
      <div className={anchored ? 'docs-ctl docs-ctl--fixed' : 'docs-ctl'}>
        <div className="docs-ctl-bar">
          <button type="button" className="docs-ctl-toggle" onClick={() => setOpen((o) => !o)}>
            {open ? '▾' : '▸'} {t.controls}
          </button>
          <button type="button" className="docs-ctl-reset" onClick={reset}>
            {t.reset}
          </button>
        </div>
        {open && (
          <div className="docs-ctl-body">
            {normalized.map((c) => (
              <Control
                key={c.prop}
                control={c}
                value={state[c.prop]}
                onChange={(v) => set(c.prop, v)}
              />
            ))}
            <Snippet code={snippet} />
          </div>
        )}
      </div>
    </>
  )
}
