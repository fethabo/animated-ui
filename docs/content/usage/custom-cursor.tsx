import { CustomCursor } from '@fethabo/animated-ui/custom-cursor'

export function Example() {
  return (
    <CustomCursor color="#f0abfc" hoverScale={2} style={{ minHeight: 320 }}>
      <a href="#demo">El anillo se agranda acá</a>
      <div data-aui-cursor>Y acá también</div>
    </CustomCursor>
  )
}
