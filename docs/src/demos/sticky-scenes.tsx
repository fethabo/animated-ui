import { StickyScenes } from '@fethabo/animated-ui/sticky-scenes'

const scene = { display: 'grid', placeItems: 'center', height: '100dvh' }

// scroll-driven + position:sticky ⇒ demoLayout 'flow' (sin recorte).
export default function StickyScenesDemo() {
  return (
    <StickyScenes sceneDuration={600}>
      <StickyScenes.Scene style={scene}>
        <h1 style={{ fontSize: '3rem', margin: 0 }}>Scene one</h1>
      </StickyScenes.Scene>
      <StickyScenes.Scene style={scene}>
        <h1 style={{ fontSize: '3rem', margin: 0, transform: 'translateY(calc((1 - var(--aui-scene-progress, 0)) * 60px))', color: 'hsl(calc(var(--aui-scene-progress, 0) * 280), 80%, 70%)' }}>
          Scene two (interpolated)
        </h1>
      </StickyScenes.Scene>
      <StickyScenes.Scene style={scene}>
        <h1 style={{ fontSize: '3rem', margin: 0 }}>Scene three</h1>
      </StickyScenes.Scene>
    </StickyScenes>
  )
}

export const demoLayout = 'flow'
