import { useRef, useState } from 'react'
import { AnimatedList } from '@fethabo/animated-ui/animated-list'

const INITIAL = ['Diseñar', 'Implementar', 'Testear', 'Documentar', 'Publicar']
const btn = { padding: '0.4rem 0.9rem', borderRadius: 8, border: '1px solid #2c2c4a', background: '#1e1b2e', color: '#e8e8f0', cursor: 'pointer', font: 'inherit' }

export default function AnimatedListDemo() {
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
    <div style={{ width: 'min(420px, 90%)' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button style={btn} onClick={add}>➕ Agregar</button>
        <button style={btn} onClick={removeRandom}>➖ Quitar</button>
        <button style={btn} onClick={shuffle}>🔀 Mezclar</button>
      </div>
      <AnimatedList
        enter="slide"
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        itemStyle={{ padding: '0.7rem 1rem', borderRadius: 10, background: '#1e1b2e', border: '1px solid #2c2c4a' }}
      >
        {items.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </AnimatedList>
    </div>
  )
}
