import { StickyScenes } from '@fethabo/animated-ui/sticky-scenes'
import type { DemoControl } from '../content'

// scroll-driven + position:sticky ⇒ demoLayout 'flow' (sin recorte). Las
// escenas se apilan (position:absolute; inset:0) y la visibilidad la maneja el
// consumer vía [data-aui-active]: la clase `docs-ss-scene` hace ese fade.
export default function StickyScenesDemo(props: Record<string, unknown>) {
  return (
    <StickyScenes sceneDuration={600} {...props}>
      <StickyScenes.Scene className="docs-ss-scene">
        <h1 style={{ fontSize: '3rem', margin: 0 }}>Scene one</h1>
      </StickyScenes.Scene>
      <StickyScenes.Scene className="docs-ss-scene">
        <h1 style={{ fontSize: '3rem', margin: 0, transform: 'translateY(calc((1 - var(--aui-scene-progress, 0)) * 60px))', color: 'hsl(calc(var(--aui-scene-progress, 0) * 280), 80%, 70%)' }}>
          Scene two (interpolated)
        </h1>
      </StickyScenes.Scene>
      <StickyScenes.Scene className="docs-ss-scene">
        <h1 style={{ fontSize: '3rem', margin: 0 }}>Scene three</h1>
      </StickyScenes.Scene>
    </StickyScenes>
  )
}

export const demoLayout = 'flow'

export const controls: DemoControl[] = [
  { prop: 'sceneDuration', type: 'number', min: 200, max: 1500, step: 50, default: 600 },
]
