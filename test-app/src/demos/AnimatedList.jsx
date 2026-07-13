import { useRef, useState } from 'react'
import { AnimatedList } from '@fethabo/animated-ui'

// La lista es estado del demo: los botones mutan (agregar/quitar/mezclar/
// ordenar) y AnimatedList anima entrada/salida/reorden entre renders. El
// panel controla las props; `grid` alterna el root entre columna y grilla
// para verificar el FLIP bidimensional.
const INITIAL = ['Diseñar', 'Implementar', 'Testear', 'Documentar', 'Publicar']

const buttonStyle = {
  padding: '0.4rem 0.9rem',
  borderRadius: 8,
  border: '1px solid #333',
  background: '#1e1b2e',
  color: '#e5e5e5',
  cursor: 'pointer',
}

function Demo({ grid, ...props }) {
  const counterRef = useRef(0)
  const [items, setItems] = useState(INITIAL)

  // Los updaters de React deben ser puros (pueden ejecutarse más de una vez):
  // toda la aleatoriedad se computa fuera de setItems, sobre el valor actual.
  const add = () => setItems([...items, `Tarea ${++counterRef.current}`])
  const removeRandom = () =>
    setItems(items.filter((_, i) => i !== Math.floor(Math.random() * items.length)))
  const shuffle = () =>
    setItems(
      items
        .map((item) => [item, Math.random()])
        .sort((a, b) => a[1] - b[1])
        .map(([item]) => item),
    )
  const sort = () => setItems([...items].sort())

  return (
    <div style={{ width: 'min(640px, 90%)' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button style={buttonStyle} onClick={add}>➕ Agregar</button>
        <button style={buttonStyle} onClick={removeRandom}>➖ Quitar</button>
        <button style={buttonStyle} onClick={shuffle}>🔀 Mezclar</button>
        <button style={buttonStyle} onClick={sort}>🔤 Ordenar</button>
      </div>
      <AnimatedList
        {...props}
        style={
          grid
            ? { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }
            : { display: 'flex', flexDirection: 'column', gap: 10 }
        }
        itemStyle={{
          padding: '0.7rem 1rem',
          borderRadius: 10,
          background: '#1e1b2e',
          border: '1px solid #333',
          color: '#e5e5e5',
        }}
      >
        {items.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </AnimatedList>
    </div>
  )
}

export default {
  id: 'animated-list',
  title: 'AnimatedList — entrada, salida y reorden FLIP (mutá la lista con los botones)',
  height: '85vh',
  controls: [
    { prop: 'duration', type: 'number', min: 0.1, max: 1.5, step: 0.05, default: 0.35 },
    {
      prop: 'easing',
      type: 'enum',
      options: ['ease', 'ease-out', 'ease-in-out', 'cubic-bezier(0.22, 1, 0.36, 1)'],
      default: 'ease',
    },
    { prop: 'enter', type: 'enum', options: ['fade', 'scale-in', 'slide', 'none'], default: 'fade' },
    { prop: 'exit', type: 'enum', options: ['fade', 'scale-out', 'none'], default: 'fade' },
    { prop: 'stagger', type: 'number', min: 0, max: 0.3, step: 0.01, default: 0.05 },
    { prop: 'grid', type: 'boolean', default: false },
  ],
  render: (props) => <Demo {...props} />,
}
