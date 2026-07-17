## Why

El deploy de la docs (`deploy-docs.yml`) tiene dos problemas evidenciados en el release `0.7.2`:

1. **Corre en paralelo al publish, sin depender de su resultado.** Ambos workflows se disparan con `release: published`. Si `npm publish` falla, la web se actualiza igual y queda anunciando en el header una versión que no existe en npm. (En `0.6.5` el publish falló; con el pipeline actual la docs se habría deployado igual.)
2. **La conexión SSH al servidor de Hostinger es frágil.** El attempt 1 del deploy de `0.7.2` falló en el step `Setup SSH key`: `ssh-keyscan` (timeout default de 5s, un solo intento) no obtuvo respuesta del servidor y salió con exit 1. Además el step redirige stderr a `/dev/null`, así que el log no muestra la causa. Hizo falta re-correr el workflow a mano 2 minutos después.

## What Changes

- `deploy-docs.yml` deja de dispararse con `release: published` y pasa a dispararse con `workflow_run` al completarse "Publish to NPM", deployando solo si el publish terminó en `success` y fue disparado por una release. Se conserva `workflow_dispatch` como fallback manual.
- El checkout pasa a usar el commit del run del publish (`workflow_run.head_sha`), preservando la garantía de que la web se buildea desde el tag publicado y no desde `main`.
- El step de SSH se robustece: `ssh-keyscan` con timeout explícito más generoso y reintentos con espera, stderr visible en el log, y validación de que `known_hosts` quedó poblado antes de seguir. El `rsync` también reintenta ante fallas transitorias.

## Capabilities

### New Capabilities

<!-- Ninguna. -->

### Modified Capabilities

- `docs-deploy`: el requirement de deploy atado al release pasa a exigir dependencia del publish exitoso (si el publish falla, la web no cambia), y se agrega un requirement de resiliencia de la conexión SSH (reintentos y errores diagnosticables).

## Impact

- `.github/workflows/deploy-docs.yml`: trigger, checkout y steps de SSH/rsync. Único archivo afectado.
- `publish.yml` no cambia, pero su nombre (`Publish to NPM`) pasa a ser contrato: si se renombra, hay que actualizar el `workflow_run` de deploy-docs.
- El deploy manual (`npm run deploy`) y la config de servidor no cambian.
