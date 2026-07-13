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

## Deploy (Hostinger)

La web se publica al **publicar un Release** en GitHub: el workflow
`.github/workflows/deploy-docs.yml` buildea la librería y la docs desde el tag
y las sube por FTP. Requiere configurar en el repo (Settings → Secrets and
variables → Actions):

- **Secrets**: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`.
- **Variables** (opcionales): `FTP_SERVER_DIR` (carpeta destino, default `/`),
  `DOCS_BASE` (default `/`; usar `/docs/` si se sirve desde subcarpeta en vez
  de un subdominio dedicado).

### Deploy manual (fallback)

Si el workflow falla, desde un checkout limpio del tag:

```bash
cd docs
FTP_HOST=ftp.tudominio.com FTP_USER=usuario FTP_PASSWORD=clave npm run deploy
```

Buildea y sube `docs/dist`. Para subcarpeta, exportá además `FTP_DIR` y
`DOCS_BASE`.

### Routing en el servidor

El build incluye un `.htaccess` que reescribe las rutas de la SPA a
`index.html` (deep links y recarga de `/es/components/<slug>` sin 404). Si se
sirve desde una subcarpeta, ajustar `RewriteBase` en `public/.htaccess` a esa
ruta además de setear `DOCS_BASE`.
