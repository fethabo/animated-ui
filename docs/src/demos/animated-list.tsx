import { useRef, useState } from 'react'
import { AnimatedList } from '@fethabo/animated-ui/animated-list'
import type { DemoControl } from '../content'

const INITIAL = ['Diseñar', 'Implementar', 'Testear', 'Documentar', 'Publicar']
const btn = { padding: '0.4rem 0.9rem', borderRadius: 8, border: '1px solid #2c2c4a', background: '#1e1b2e', color: '#e8e8f0', cursor: 'pointer', font: 'inherit' }

export default function AnimatedListDemo(props: Record<string, unknown>) {
  const counter = useRef(0)
  const [items, setItems] = useState(INITIAL)
  const add = () => setItems([...items, `Tarea ${++counter.current}`])
  const removeRandom = () => setItems(items.filter((_, i) => i !== Math.floor(Math.random() * items.length)))
  const shuffle = () =>
    setItems(
      items
        .map((x) => [x, Math.random()] as const)
        .sort((a, b) => a[1] - b[1])
        .map(([x]) => x),
    )

  return (
    <div className="docs-demo-stage" style={{ width: '100%' }}>
      <div style={{ width: 'min(420px, 90%)' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button style={btn} onClick={add}>➕ Agregar</button>
        <button style={btn} onClick={removeRandom}>➖ Quitar</button>
        <button style={btn} onClick={shuffle}>🔀 Mezclar</button>
      </div>
      <AnimatedList
        enter="slide"
        {...props}
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        itemStyle={{ padding: '0.7rem 1rem', borderRadius: 10, background: '#1e1b2e', border: '1px solid #2c2c4a' }}
      >
        {items.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </AnimatedList>
      </div>
    </div>
  )
}

export const controls: DemoControl[] = [
  {
    prop: 'enter',
    type: 'enum',
    options: ['fade', 'scale-in', 'slide', 'none'],
    default: 'slide',
  },
  { prop: 'exit', type: 'enum', options: ['fade', 'scale-out', 'none'], default: 'fade' },
  { prop: 'duration', type: 'number', min: 0.1, max: 1, step: 0.05, default: 0.35 },
  { prop: 'stagger', type: 'number', min: 0, max: 0.2, step: 0.02, default: 0 },
  {
    prop: 'easing',
    type: 'enum',
    options: ['ease', 'ease-out', 'ease-in-out', 'linear', 'cubic-bezier(0.22, 1, 0.36, 1)'],
    default: 'ease',
  },
]
