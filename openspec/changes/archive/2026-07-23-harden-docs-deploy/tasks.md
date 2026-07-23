## 1. Encadenar el deploy al publish

- [x] 1.1 Cambiar el trigger de `deploy-docs.yml`: reemplazar `release: types: [published]` por `workflow_run` sobre el workflow "Publish to NPM" con `types: [completed]`, conservando `workflow_dispatch`
- [x] 1.2 Agregar al job `deploy` la condición `if`: correr con `workflow_dispatch`, o con `workflow_run` solo si `conclusion == 'success'` y `workflow_run.event == 'release'`
- [x] 1.3 Cambiar el checkout a `ref: ${{ github.event.workflow_run.head_sha || github.ref }}` para buildear desde el commit del tag publicado
- [x] 1.4 Actualizar los comentarios de ambos YAML: en `deploy-docs.yml` documentar el nuevo flujo y en `publish.yml` advertir que el nombre "Publish to NPM" es contrato del `workflow_run` de deploy-docs

## 2. Resiliencia de la conexión SSH

- [x] 2.1 Reescribir el step `Setup SSH key`: `ssh-keyscan -T 15` con hasta 5 intentos y espera incremental entre intentos, sin `2>/dev/null`, y fallo explícito si `known_hosts` queda sin entradas tras agotar los reintentos
- [x] 2.2 Envolver el `rsync` en un loop de hasta 3 intentos con espera entre intentos, preservando flags y destino actuales

## 3. Verificación

- [x] 3.1 Validar sintaxis de los workflows (`actionlint` si está disponible; si no, parseo YAML) — repo sin ESLint configurado y sin JS tocado: el paso de ESLint del CLAUDE.md no aplica
- [x] 3.2 Probar el fallback manual: correr `deploy-docs` vía `workflow_dispatch` y verificar que deploya OK con la condición nueva
- [x] 3.3 Probar el encadenamiento en la próxima release: verificar que deploy-docs se dispara solo al terminar el publish en success, que el checkout es el commit del tag (header de la web muestra la versión nueva) y que el log de `Setup SSH key` muestra los intentos de keyscan
