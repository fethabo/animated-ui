// Deploy manual de la docs a Hostinger por SFTP (fallback del workflow de CI).
// Buildea la docs y sube docs/dist al servidor. Pensado para correr desde un
// tag limpio: la web debe reflejar una versión publicada.
//
// Requiere las credenciales por variables de entorno:
//   SSH_HOST, SSH_USER          (obligatorias)
//   SSH_PASSWORD  o  SSH_KEY     (una de las dos: contraseña, o ruta a la clave privada)
//   SSH_PORT                     (opcional, default 22)
//   SSH_TARGET                   (obligatoria: carpeta destino en el server)
//   DOCS_BASE                    (opcional, default '/')
//
// Uso (PowerShell, con clave):
//   $env:SSH_HOST='123.45.67.89'; $env:SSH_USER='usuario'
//   $env:SSH_KEY='C:\Users\Fede\.ssh\id_ed25519'; $env:SSH_TARGET='/home/usuario/htdocs/docs'
//   npm run deploy
//
// Depende de `ssh2-sftp-client` (devDependency).

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const docsRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

const { SSH_HOST, SSH_USER, SSH_PASSWORD, SSH_KEY, SSH_PORT = '22', SSH_TARGET } = process.env
const missing = ['SSH_HOST', 'SSH_USER', 'SSH_TARGET'].filter((k) => !process.env[k])
if (!SSH_PASSWORD && !SSH_KEY) missing.push('SSH_PASSWORD o SSH_KEY')
if (missing.length > 0) {
  console.error(`[docs] deploy: faltan variables de entorno: ${missing.join(', ')}`)
  process.exit(1)
}

console.log('[docs] deploy: buildeando…')
execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], {
  cwd: docsRoot,
  stdio: 'inherit',
})

const { default: SftpClient } = await import('ssh2-sftp-client')
const sftp = new SftpClient()
try {
  await sftp.connect({
    host: SSH_HOST,
    port: Number(SSH_PORT),
    username: SSH_USER,
    ...(SSH_KEY ? { privateKey: readFileSync(SSH_KEY) } : { password: SSH_PASSWORD }),
  })
  console.log(`[docs] deploy: subiendo docs/dist → ${SSH_USER}@${SSH_HOST}:${SSH_TARGET}`)
  await sftp.uploadDir(join(docsRoot, 'dist'), SSH_TARGET)
  console.log('[docs] deploy: OK')
} catch (error) {
  console.error('[docs] deploy: FALLÓ —', error.message)
  process.exit(1)
} finally {
  await sftp.end()
}
