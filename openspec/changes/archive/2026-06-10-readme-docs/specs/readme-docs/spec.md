## ADDED Requirements

### Requirement: El README contiene una tabla resumen de todos los componentes disponibles
El `README.md` SHALL incluir una sección `## Components` con una tabla Markdown que liste cada componente exportado por el paquete, con su descripción concisa en una línea y un link anchor a su sección de detalle.

#### Scenario: Developer encuentra un componente rápidamente
- **WHEN** un developer abre el README en GitHub o en su editor
- **THEN** SHALL ver en la tabla resumen todos los componentes disponibles, su descripción de una línea, y un link a la documentación de props de cada uno

#### Scenario: Tabla resumen refleja el estado actual del paquete
- **WHEN** se agrega un nuevo componente al paquete en cualquier change
- **THEN** ese componente SHALL aparecer en la tabla resumen del README en ese mismo change

### Requirement: Cada componente tiene una sección de documentación con tabla de props
El `README.md` SHALL incluir una sección `## <ComponentName>` por cada componente exportado. Cada sección SHALL contener: una descripción de 2-4 líneas del componente, un ejemplo de uso mínimo en bloque de código, y una tabla de props.

#### Scenario: Tabla de props tiene columnas fijas
- **WHEN** un developer consulta la sección de un componente
- **THEN** SHALL ver una tabla con exactamente las columnas: `Prop`, `Tipo`, `Default`, `Descripción`

#### Scenario: Props sin default se marcan explícitamente
- **WHEN** una prop es requerida (no tiene valor default)
- **THEN** la columna Default SHALL mostrar `—` (em dash) en lugar de estar vacía

#### Scenario: CSS custom properties documentadas por componente
- **WHEN** un componente expone CSS custom properties (`--aui-*`)
- **THEN** SHALL existir una subsección `### CSS Custom Properties` dentro de la sección del componente, con una tabla `Variable | Default | Descripción`

### Requirement: El README documenta la compatibilidad con frameworks y JS/TS
El `README.md` SHALL incluir una sección `## Compatibility` que declare explícitamente: versiones de React soportadas, compatibilidad con Vite / Next.js / Astro, y que el paquete es usable desde proyectos JavaScript y TypeScript.

#### Scenario: Developer JS verifica compatibilidad antes de instalar
- **WHEN** un developer que usa JavaScript (sin TypeScript) lee el README
- **THEN** SHALL encontrar mención explícita de que el paquete funciona en proyectos JavaScript

### Requirement: El README incluye instrucciones de instalación y uso básico
El `README.md` SHALL comenzar con el nombre del paquete, una descripción de una línea, el comando de instalación (`npm install @fethabo/animated-ui`), y un ejemplo de importación y uso mínimo.

#### Scenario: Instalación en 30 segundos
- **WHEN** un developer nuevo llega al README
- **THEN** SHALL poder copiar el comando de instalación y un ejemplo de uso sin necesidad de leer más de la primera pantalla

### Requirement: El README se actualiza en cada change que modifique la API pública
Todo change que agregue un componente nuevo, elimine uno existente, o modifique las props de un componente SHALL incluir como tarea explícita la actualización del README. Esta tarea SHALL ser la última del grupo de tareas del componente afectado.

#### Scenario: Change de nuevo componente incluye tarea de README
- **WHEN** se crea un change que agrega un componente nuevo al paquete
- **THEN** el `tasks.md` de ese change SHALL incluir una tarea del tipo `X.Y Actualizar README: agregar sección y tabla de props de <ComponentName>`

#### Scenario: Change de modificación de props incluye tarea de README
- **WHEN** se crea un change que agrega, renombra, o elimina props de un componente existente
- **THEN** el `tasks.md` de ese change SHALL incluir una tarea del tipo `X.Y Actualizar README: actualizar tabla de props de <ComponentName>`

### Requirement: El formato del README usa Markdown estándar compatible con GitHub
El `README.md` SHALL usar únicamente sintaxis Markdown compatible con GitHub Flavored Markdown (GFM): tablas, bloques de código con language tag, headers `#`/`##`/`###`, y listas. No SHALL usar extensiones MDX, HTML inline, ni componentes personalizados.

#### Scenario: README se renderiza correctamente en GitHub
- **WHEN** el archivo `README.md` se visualiza en la página del repositorio en GitHub
- **THEN** las tablas, bloques de código, y headers SHALL renderizarse correctamente sin HTML visible ni errores de formato
