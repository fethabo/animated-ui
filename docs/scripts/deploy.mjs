// Deploy manual de la docs a Hostinger por FTP (fallback del workflow de CI).
// Buildea la docs y sube docs/dist al servidor. Pensado para correr desde un
// tag limpio: la web debe reflejar una versión publicada.
//
// Requiere las credenciales por variables de entorno:
//   FTP_HOST, FTP_USER, FTP_PASSWORD   (obligatorias)
//   FTP_DIR                            (opcional, default '/')
//   DOCS_BASE                          (opcional, default '/')
//
// Uso (PowerShell):
//   $env:FTP_HOST='ftp.tudominio.com'; $env:FTP_USER='...'; $env:FTP_PASSWORD='...'
//   npm run deploy
//
// Depende de `basic-ftp` (devDependency). Instalá con: npm i -D basic-ftp

import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const docsRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

const { FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_DIR = '/' } = process.env
const missing = ['FTP_HOST', 'FTP_USER', 'FTP_PASSWORD'].filter((k) => !process.env[k])
if (missing.length > 0) {
  console.error(`[docs] deploy: faltan variables de entorno: ${missing.join(', ')}`)
  process.exit(1)
}

console.log('[docs] deploy: buildeando…')
execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], {
  cwd: docsRoot,
  stdio: 'inherit',
})

const { Client } = await import('basic-ftp')
const client = new Client()
try {
  await client.access({ host: FTP_HOST, user: FTP_USER, password: FTP_PASSWORD, secure: true })
  console.log(`[docs] deploy: subiendo docs/dist → ${FTP_HOST}:${FTP_DIR}`)
  await client.ensureDir(FTP_DIR)
  await client.clearWorkingDir()
  await client.uploadFromDir(join(docsRoot, 'dist'))
  console.log('[docs] deploy: OK')
} catch (error) {
  console.error('[docs] deploy: FALLÓ —', error.message)
  process.exit(1)
} finally {
  client.close()
}
