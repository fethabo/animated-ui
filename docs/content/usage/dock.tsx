import { Dock } from '@fethabo/animated-ui/dock'

const ICONS = ['🏠', '🔍', '💬', '🎵', '⚙️']

export function Example() {
  return (
    <Dock magnification={1.5} radius={120}>
      {ICONS.map((icon) => (
        <Dock.Item key={icon}>
          <button>{icon}</button>
        </Dock.Item>
      ))}
    </Dock>
  )
}
