import { StickyScenes } from '@fethabo/animated-ui/sticky-scenes'

export function Example() {
  return (
    <StickyScenes sceneDuration={600}>
      <StickyScenes.Scene><h1>Scene one</h1></StickyScenes.Scene>
      <StickyScenes.Scene>
        <h1 style={{ opacity: 'var(--aui-scene-progress, 0)' }}>Scene two (interpolated)</h1>
      </StickyScenes.Scene>
      <StickyScenes.Scene><h1>Scene three</h1></StickyScenes.Scene>
    </StickyScenes>
  )
}
