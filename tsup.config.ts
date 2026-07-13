import { defineConfig } from 'tsup'

export default defineConfig({
  // Un entry por componente + barrel export: permite a los bundlers
  // resolver subpaths (`@fethabo/animated-ui/tilt-card`) y tree-shakear
  // el barrel sin arrastrar los demás componentes.
  entry: {
    index: 'src/index.ts',
    'animated-background': 'src/components/AnimatedBackground/index.tsx',
    'pixel-background': 'src/components/PixelBackground/index.tsx',
    'tilt-card': 'src/components/TiltCard/index.tsx',
    'spotlight-card': 'src/components/SpotlightCard/index.tsx',
    'glow-border': 'src/components/GlowBorder/index.tsx',
    'magnetic-element': 'src/components/MagneticElement/index.tsx',
    'shiny-text': 'src/components/ShinyText/index.tsx',
    'scramble-text': 'src/components/ScrambleText/index.tsx',
    'scroll-reveal': 'src/components/ScrollReveal/index.tsx',
    'typewriter-text': 'src/components/TypewriterText/index.tsx',
    'split-reveal': 'src/components/SplitReveal/index.tsx',
    'stacked-cards': 'src/components/StackedCards/index.tsx',
    'mouse-parallax': 'src/components/MouseParallax/index.tsx',
    'parallax-layers': 'src/components/ParallaxLayers/index.tsx',
    'scroll-progress': 'src/components/ScrollProgress/index.tsx',
    'particle-field': 'src/components/ParticleField/index.tsx',
    'image-dissolve': 'src/components/ImageDissolve/index.tsx',
    'sticky-scenes': 'src/components/StickyScenes/index.tsx',
    'circuit-background': 'src/components/CircuitBackground/index.tsx',
    'tesla-coil': 'src/components/TeslaCoil/index.tsx',
    'attention-cue': 'src/components/AttentionCue/index.tsx',
    'guiding-branches': 'src/components/GuidingBranches/index.tsx',
    'confetti-burst': 'src/components/ConfettiBurst/index.tsx',
    'waves-background': 'src/components/WavesBackground/index.tsx',
    'flow-field': 'src/components/FlowField/index.tsx',
    'topographic-background': 'src/components/TopographicBackground/index.tsx',
    dock: 'src/components/Dock/index.tsx',
    'border-beam': 'src/components/BorderBeam/index.tsx',
    marquee: 'src/components/Marquee/index.tsx',
    'horizontal-scroll-section': 'src/components/HorizontalScrollSection/index.tsx',
    'rotating-text': 'src/components/RotatingText/index.tsx',
    'glitch-text': 'src/components/GlitchText/index.tsx',
    'wavy-text': 'src/components/WavyText/index.tsx',
    'ripple-container': 'src/components/RippleContainer/index.tsx',
    'fireworks-burst': 'src/components/FireworksBurst/index.tsx',
    'sparkle-burst': 'src/components/SparkleBurst/index.tsx',
    'emoji-burst': 'src/components/EmojiBurst/index.tsx',
    'click-spark': 'src/components/ClickSpark/index.tsx',
    'count-up': 'src/components/CountUp/index.tsx',
    'text-scroll-reveal': 'src/components/TextScrollReveal/index.tsx',
    'cursor-trail': 'src/components/CursorTrail/index.tsx',
    'custom-cursor': 'src/components/CustomCursor/index.tsx',
    'image-trail': 'src/components/ImageTrail/index.tsx',
    'starfield-background': 'src/components/StarfieldBackground/index.tsx',
    'matrix-rain': 'src/components/MatrixRain/index.tsx',
    'text-highlighter': 'src/components/TextHighlighter/index.tsx',
    'draw-path': 'src/components/DrawPath/index.tsx',
    'scribble-decoration': 'src/components/ScribbleDecoration/index.tsx',
    'animated-list': 'src/components/AnimatedList/index.tsx',
    'auto-height': 'src/components/AutoHeight/index.tsx',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  // tsconfig usa `jsx: preserve` (solo typecheck); esbuild necesita
  // emitir JS real, así que forzamos el runtime automático acá.
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
  // esbuild descarta las directivas 'use client' de los módulos al
  // bundlear; el banner las restituye para Next.js App Router.
  banner: {
    js: "'use client';",
  },
})
