import fs from 'node:fs/promises'
import path from 'node:path'
import { shinyCss } from '../src/components/ShinyText/styles'
import { borderBeamCss } from '../src/components/BorderBeam/styles'
import { animatedBackgroundCss } from '../src/components/AnimatedBackground/styles'
import { VARIANTS } from '../src/components/AnimatedBackground/index'
import { glitchTextCss } from '../src/components/GlitchText/styles'
import { buildGlitchCss } from '../src/components/GlitchText/glitch-css'

async function generateCss() {
  const distCss = path.resolve(process.cwd(), 'dist/css')
  await fs.mkdir(distCss, { recursive: true })

  // 1. ShinyText
  await fs.writeFile(path.join(distCss, 'shiny-text.css'), shinyCss())

  // 2. BorderBeam
  await fs.writeFile(path.join(distCss, 'border-beam.css'), borderBeamCss())

  // 3. GlitchText
  const glitchCss = glitchTextCss() + '\n' + buildGlitchCss('f1-b10', 1, 0.1) // Defaults
  await fs.writeFile(path.join(distCss, 'glitch-text.css'), glitchCss)

  // 4. AnimatedBackground
  let bgCss = animatedBackgroundCss()
  for (const variant of Object.values(VARIANTS)) {
    bgCss += '\n' + variant.css
  }
  await fs.writeFile(path.join(distCss, 'animated-background.css'), bgCss)

  // 5. Global bundle
  const allCss = [
    shinyCss(),
    borderBeamCss(),
    glitchCss,
    bgCss
  ].join('\n')
  await fs.writeFile(path.join(distCss, 'animated-ui.css'), allCss)

  console.log('✅ CSS generado en dist/css/')
}

generateCss().catch(err => {
  console.error(err)
  process.exit(1)
})
