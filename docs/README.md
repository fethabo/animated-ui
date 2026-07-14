# @fethabo/animated-ui — sitio de documentación

App de documentación (Vite + React) para la librería. Muestra **todos los
componentes de la versión publicada**, agrupados por categoría, con demo vivo,
props, ejemplos con copiar y limitaciones, en español e inglés.

No confundir con `test-app/`: esa es la herramienta interna de verificación
visual (harness con panel de controles). Esta web documenta lo publicado.

## Desarrollo

```bash
cd docs
npm install
npm run dev
```

`predev`/`prebuild` corren `scripts/build-content.mjs`, que:

1. valida que el registry (`src/registry.json`) esté sincronizado con los
   `exports` de `package.json` (componente publicado sin página ⇒ error);
2. extrae la tabla de props desde los JSDoc de `src/**/types.ts`
   (`scripts/extract-props.mjs` → `src/generated/props.json`);
3. valida completitud de contenido y cobertura de traducciones;
4. resalta el código con Shiki (build time);
5. renderiza la prosa Markdown → HTML.

En `dev` corre con `--lax` (faltantes = warnings) para poder desarrollar
contenido incrementalmente. En `build` es estricto: **cualquier faltante
rompe el build**. Todo `src/generated/` es contenido derivado y está
gitignoreado — nunca se edita a mano.

## Agregar/actualizar un componente

Por cada componente (slug kebab-case, igual al subpath export):

- `src/registry.json` — entrada con `slug`, `name`, `category` (y `example`
  si el archivo de `examples/` tiene otro nombre).
- `content/<slug>.es.md` y `content/<slug>.en.md` — prosa con frontmatter
  (`title`, `description`) + características, CSS custom properties, limitaciones.
- `content/usage/<slug>.tsx` — snippet de uso con el paquete.
- `content/props-es/<slug>.json` — traducción ES de las descripciones de props
  (las EN salen del JSDoc; el build valida cobertura).
- `src/demos/<slug>.tsx` — demo curado (`export default`).
- `examples/<slug>.tsx` (en la raíz del repo) — ejemplo standalone copy-paste.

## Deploy (Hostinger — servidor nginx, SSH/SFTP)

La web es un sitio estático (`dist/`). El deploy usa **SSH/SFTP** y el server
corre **nginx**. Se sirve en `https://animated-ui-docs.fethabo.cloud`
(subdominio propio con TLS de Let's Encrypt); el acceso SSH al server es por
`server.fethabo.cloud` (host distinto, `SSH_HOST`).

### 1. Configurar nginx en el server (una vez)

Copiar/adaptar [`deploy/nginx.conf.example`](deploy/nginx.conf.example) como
server block. Lo esencial es el fallback SPA:

```nginx
root /var/www/animated-ui-docs;   # = SSH_TARGET del deploy
location / {
  try_files $uri $uri/ /index.html;   # deep links y recarga sin 404
}
```

Luego `sudo nginx -t && sudo systemctl reload nginx`.

### 2. Deploy automático al publicar un Release

El workflow `.github/workflows/deploy-docs.yml` buildea la librería y la docs
desde el tag y sube `docs/dist` por **rsync sobre SSH**. Configurar en el repo
(Settings → Secrets and variables → Actions):

- **Secrets**: `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY` (contenido completo de
  la clave privada; la pública va en `~/.ssh/authorized_keys` del server).
- **Variables**: `SSH_TARGET` (carpeta destino, = `root` de nginx),
  `SSH_PORT` (opcional, default `22`), `DOCS_BASE` (opcional, default `/`;
  usar `/docs/` solo si se sirve desde subcarpeta en vez de la raíz).

### 3. Deploy manual (fallback)

Desde un checkout limpio del tag, con clave SSH o contraseña:

```bash
cd docs
SSH_HOST=123.45.67.89 SSH_USER=usuario \
  SSH_KEY=~/.ssh/id_ed25519 SSH_TARGET=/var/www/animated-ui-docs \
  npm run deploy
```

Buildea y sube `docs/dist` por SFTP. (En vez de `SSH_KEY` se puede usar
`SSH_PASSWORD`.)

> El build también copia un `public/.htaccess` (fallback SPA para Apache). En
> nginx no se usa: el routing lo resuelve el `try_files` del paso 1.
