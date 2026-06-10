export { AnimatedBackground } from './components/AnimatedBackground'
export type {
  AnimatedBackgroundProps,
  AnimatedBackgroundVariantName,
} from './components/AnimatedBackground'

export { PixelBackground } from './components/PixelBackground'
export type {
  BehaviorName,
  CellColorFn,
  PixelBackgroundProps,
  PixelBehavior,
  PixelCell,
  PixelFrameContext,
} from './components/PixelBackground'

export { TiltCard } from './components/TiltCard'
export type { TiltCardProps, TiltState } from './components/TiltCard'

export { useReducedMotion } from './hooks/useReducedMotion'
export { useMousePosition } from './hooks/useMousePosition'
export { useResizeObserver } from './hooks/useResizeObserver'
export { injectStyles, styleId } from './utils/inject-styles'
