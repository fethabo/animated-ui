# build-tooling Specification (delta)

## ADDED Requirements

### Requirement: Todo paquete importado por un script del repo está declarado en package.json

Cualquier módulo que un script de `scripts/` importe por nombre de paquete (no por ruta relativa ni por especificador `node:`) SHALL estar declarado en `devDependencies` de `package.json`. El toolchain NO SHALL depender de que una dependencia transitiva quede accesible por el hoisting del gestor de paquetes.

Los rangos declarados SHALL elegirse para deduplicar con el consumidor transitivo existente cuando haya uno, de modo que el gestor resuelva una sola instancia.

#### Scenario: Build desde una instalación con layout estricto

- **WHEN** se instala con un gestor de layout estricto (pnpm, sin hoisting a la raíz) y se ejecuta `pnpm run build`
- **THEN** todos los imports de los scripts del build SHALL resolver y el build SHALL completarse sin `ERR_MODULE_NOT_FOUND`

#### Scenario: Un script gana una dependencia nueva

- **WHEN** un script de `scripts/` empieza a importar un paquete que no está en `devDependencies`
- **THEN** el build SHALL fallar en una instalación de layout estricto, y la corrección SHALL ser declarar el paquete — NO SHALL ser relajar el layout del gestor (e.g. `shamefully-hoist`)

#### Scenario: Las dependencias del toolchain no llegan al paquete publicado

- **WHEN** se publica el paquete con las dependencias del toolchain declaradas en `devDependencies`
- **THEN** el tarball NO SHALL incluir `scripts/` ni arrastrar esas dependencias al consumer, y el paquete SHALL seguir sin dependencias de runtime

### Requirement: La raíz del repo tiene un único gestor de paquetes, pineado y con un solo lockfile

La raíz SHALL declarar su gestor de paquetes en el campo `packageManager` de `package.json`, incluyendo la versión. SHALL existir exactamente un lockfile en la raíz, el del gestor declarado. Los lockfiles de otros gestores NO SHALL estar presentes ni volver a agregarse.

El repo SHALL tener un guard que evite que reaparezca un lockfile de otro gestor en la raíz, y ese guard SHALL estar anclado a la raíz para no afectar los lockfiles de subproyectos.

#### Scenario: Dev y CI resuelven el mismo árbol

- **WHEN** un mantenedor instala localmente y CI instala en el workflow, ambos desde el mismo commit
- **THEN** ambos SHALL usar el gestor y la versión declarados en `packageManager`, y SHALL obtener el mismo árbol de dependencias

#### Scenario: CI no hardcodea la versión del gestor

- **WHEN** se cambia la versión en el campo `packageManager`
- **THEN** los workflows SHALL adoptar esa versión sin editar los archivos de workflow, porque no declaran una versión propia

#### Scenario: Reaparece un lockfile ajeno en la raíz

- **WHEN** un install con otro gestor genera un lockfile en la raíz del repo
- **THEN** ese archivo NO SHALL quedar trackeado por git

#### Scenario: Los subproyectos conservan su propio gestor

- **WHEN** un subproyecto (`docs/`) mantiene su propio gestor y su propio lockfile trackeado
- **THEN** el guard de la raíz NO SHALL ignorar ese lockfile, y el pipeline de ese subproyecto SHALL seguir instalando con su gestor

### Requirement: CI instala con el lockfile congelado

Los workflows SHALL instalar dependencias con el lockfile congelado de forma explícita. Un `package.json` modificado sin regenerar el lockfile SHALL hacer fallar el paso de instalación con un error atribuible, en vez de resolver versiones nuevas silenciosamente.

#### Scenario: Lockfile desincronizado

- **WHEN** el `package.json` de un commit declara una dependencia que el lockfile no refleja
- **THEN** el paso de instalación en CI SHALL fallar señalando la desincronización, y NO SHALL actualizar el lockfile por su cuenta

### Requirement: Los build scripts de dependencias que el toolchain necesita están allowlisteados

Cuando el gestor de paquetes bloquea los lifecycle scripts de dependencias por defecto, las dependencias cuyo funcionamiento dependa de su build script SHALL estar declaradas en un allowlist explícito en `package.json`. El toolchain NO SHALL depender de que un build script bloqueado igual funcione por una vía de fallback no documentada.

#### Scenario: Dependencia con binario nativo o postinstall

- **WHEN** una dependencia del toolchain declara un `postinstall` y el gestor lo bloquea por defecto
- **THEN** esa dependencia SHALL figurar en el allowlist, y `install` NO SHALL reportarla como *ignored build script*

#### Scenario: Instalación limpia reproducible

- **WHEN** se borra `node_modules` por completo y se instala de cero
- **THEN** el build, los tests y el typecheck SHALL pasar sin ningún paso manual posterior a la instalación
