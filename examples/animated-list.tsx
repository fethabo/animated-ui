// animated-list.tsx — Lista cuyos items animan entrada, salida y
// reordenamiento (FLIP) cuando cambia entre renders.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// La técnica es FLIP (First-Last-Invert-Play): antes de aplicar el render
// nuevo se capturan los rects de los items (fase de render: el DOM todavía
// tiene el layout anterior, y getBoundingClientRect refleja los transforms en
// vuelo); en useLayoutEffect —después del layout nuevo, antes del paint— se
// mide la posición nueva, se invierte la diferencia con transform y se anima
// hacia identidad con element.animate(). Las keys nuevas hacen fade-in y las
// removidas animan un clon estático posicionado que se remueve al terminar.
// Con prefers-reduced-motion los cambios se aplican de inmediato.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useLayoutEffect, useRef, useState } from 'react'

const DURATION = 350 // ms
const EASING = 'ease'

let nextId = 4

export default function AnimatedListDemo() {
  const [items, setItems] = useState([
    { id: 1, text: 'Diseñar' },
    { id: 2, text: 'Implementar' },
    { id: 3, text: 'Testear' },
  ])
  const listRef = useRef<HTMLUListElement>(null)
  const nodesRef = useRef(new Map<number, HTMLLIElement>())
  const prevIdsRef = useRef<number[] | null>(null)

  // First: rects del layout anterior, capturados en la fase de render.
  const firstRects = new Map<number, DOMRect>()
  nodesRef.current.forEach((el, id) => {
    if (el.isConnected) firstRects.set(id, el.getBoundingClientRect())
  })
  const ids = items.map((item) => item.id)

  useLayoutEffect(() => {
    const list = listRef.current
    const prevIds = prevIdsRef.current
    prevIdsRef.current = ids
    if (!list || prevIds === null) return // primer render: sin animar
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Salidas: clon estático en el último rect conocido, removido en finish.
    const listRect = list.getBoundingClientRect()
    for (const id of prevIds) {
      const rect = firstRects.get(id)
      const el = nodesRef.current.get(id)
      if (ids.includes(id) || !rect || !el) continue
      nodesRef.current.delete(id)
      const clone = el.cloneNode(true) as HTMLLIElement
      clone.setAttribute('aria-hidden', 'true')
      Object.assign(clone.style, {
        position: 'absolute',
        margin: '0',
        pointerEvents: 'none',
        left: `${rect.left - listRect.left}px`,
        top: `${rect.top - listRect.top}px`,
        width: `${rect.width}px`,
      })
      list.appendChild(clone)
      const exit = clone.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: DURATION,
        easing: EASING,
      })
      exit.onfinish = () => clone.remove()
    }

    for (const id of ids) {
      const el = nodesRef.current.get(id)
      if (!el) continue
      const first = firstRects.get(id)
      if (!first) {
        // Key nueva: entrada.
        el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: DURATION, easing: EASING })
        continue
      }
      // Persistente: FLIP. Cancelar la animación en vuelo antes de medir Last
      // (el First ya capturó la posición visual actual: no hay salto).
      el.getAnimations().forEach((a) => a.cancel())
      const last = el.getBoundingClientRect()
      const dx = first.left - last.left
      const dy = first.top - last.top
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue
      el.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }],
        { duration: DURATION, easing: EASING },
      )
    }
  })

  // Los updaters de React deben ser puros (pueden ejecutarse más de una vez):
  // la aleatoriedad se computa fuera de setItems, sobre el valor actual.
  const shuffle = () =>
    setItems(
      items
        .map((item) => ({ item, order: Math.random() }))
        .sort((a, b) => a.order - b.order)
        .map(({ item }) => item),
    )
  const add = () => setItems([...items, { id: nextId, text: `Tarea ${nextId++}` }])
  const remove = () => setItems(items.slice(0, -1))

  return (
    <div style={{ padding: '2rem', background: '#0a0a12', minHeight: '50vh', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={add}>Agregar</button>
        <button onClick={remove}>Quitar</button>
        <button onClick={shuffle}>Mezclar</button>
      </div>
      <ul ref={listRef} style={{ position: 'relative', listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item) => (
          <li
            key={item.id}
            ref={(el) => {
              if (el) nodesRef.current.set(item.id, el)
            }}
            style={{
              padding: '0.75rem 1rem',
              marginBottom: 8,
              borderRadius: 8,
              background: '#1e1b2e',
              color: '#e5e5e5',
            }}
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
