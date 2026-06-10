import type { AnimatedBackgroundVariant } from '../types'

/*
 * CSS custom properties de la variante `mesh`
 * (overrideables desde el CSS del consumer):
 *
 *   --aui-mesh-color-1   default `#7c3aed` (violeta)  — blob superior izquierdo
 *   --aui-mesh-color-2   default `#db2777` (magenta)  — blob superior derecho
 *   --aui-mesh-color-3   default `#2563eb` (azul)     — blob inferior derecho
 *   --aui-mesh-color-4   default `#0d9488` (teal)     — blob inferior izquierdo
 *   --aui-mesh-speed     default `18s`  — duración de un ciclo de morphing
 *   --aui-mesh-blur      default `40px` — desenfoque que funde los blobs
 *   --aui-mesh-opacity   default `1`    — intensidad global del efecto
 */
export const mesh: AnimatedBackgroundVariant = {
  name: 'mesh',
  css: `
.aui-mesh {
  background-image:
    radial-gradient(circle at 15% 20%, var(--aui-mesh-color-1, #7c3aed) 0%, transparent 50%),
    radial-gradient(circle at 85% 15%, var(--aui-mesh-color-2, #db2777) 0%, transparent 50%),
    radial-gradient(circle at 80% 85%, var(--aui-mesh-color-3, #2563eb) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, var(--aui-mesh-color-4, #0d9488) 0%, transparent 50%);
  background-repeat: no-repeat;
  background-size: 150% 150%, 140% 140%, 160% 160%, 145% 145%;
  filter: blur(var(--aui-mesh-blur, 40px));
  transform: scale(1.15);
  opacity: var(--aui-mesh-opacity, 1);
  animation: aui-mesh-morph var(--aui-mesh-speed, 18s) ease-in-out infinite alternate;
}
@keyframes aui-mesh-morph {
  0% {
    background-position: 0% 0%, 100% 0%, 100% 100%, 0% 100%;
    background-size: 150% 150%, 140% 140%, 160% 160%, 145% 145%;
  }
  33% {
    background-position: 30% 40%, 70% 20%, 60% 70%, 20% 60%;
    background-size: 170% 160%, 130% 150%, 145% 140%, 160% 165%;
  }
  66% {
    background-position: 10% 70%, 90% 50%, 70% 30%, 40% 90%;
    background-size: 140% 145%, 160% 155%, 170% 165%, 135% 140%;
  }
  100% {
    background-position: 50% 20%, 50% 80%, 90% 60%, 10% 40%;
    background-size: 160% 170%, 145% 135%, 150% 155%, 165% 150%;
  }
}
`,
  cssVars({ colors, speed, intensity }) {
    const vars: Record<string, string> = {}
    colors?.slice(0, 4).forEach((color, i) => {
      vars[`--aui-mesh-color-${i + 1}`] = color
    })
    if (speed !== undefined) vars['--aui-mesh-speed'] = `${speed}s`
    if (intensity !== undefined) vars['--aui-mesh-opacity'] = String(intensity)
    return vars
  },
}
