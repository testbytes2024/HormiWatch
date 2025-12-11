
# Contexto del Proyecto: HormiWatch

## 1. Stack Tecnológico
- **Framework:** Express ~4.18.3
- **Base de Datos:** MySQL (a través de `mysql2` y el ORM Sequelize `~6.35.2`)
- **Lenguaje:** Javascript (ECMAScript Modules)
- **Autenticación:** JWT (jsonwebtoken)
- **Validación:** Zod
- **Otros:** `puppeteer` para generación de PDFs, `firebase` para almacenamiento de archivos (fotos de perfil), `nodemailer` para envío de correos.

## 2. Arquitectura y Estructura
El proyecto sigue una arquitectura modular y orientada a servicios. La estructura principal dentro de `src` es:
- **`database`**: Contiene la configuración de Sequelize y la definición de todos los modelos de la base de datos, separados por base de datos (`hormiwatch` y `cliente`). El archivo `asociaciones.js` es crucial ya que define todas las relaciones (BelongsTo, HasMany, BelongsToMany) entre los modelos de Sequelize.
- **`middlewares`**: Contiene funciones intermedias de Express para tareas como la validación de tokens JWT (`validateToken.js`), validación de roles de usuario (`validateRol.js`), y validación de esquemas de datos con Zod (`ValidatorSchema.js`).
- **`modules`**: Es el corazón de la aplicación. Cada subcarpeta representa un módulo de negocio (ej. `usuarios`, `proyectos`, `tareas`). Típicamente, cada módulo contiene:
    - `controllers`: La lógica de la API (request/response).
    - `model`: La lógica de negocio y acceso a datos, que interactúa con los modelos de Sequelize.
    - `routes`: Las definiciones de las rutas de la API para ese módulo.
    - `schemas`: Esquemas de validación (usando Zod) para los datos de entrada.
- **`services`**: Contiene lógica para tareas que se ejecutan en segundo plano o de forma programada, como `tareasProgramadas.js`.

## 3. Modelo de Datos (Análisis Profundo)
Los modelos de datos se definen con Sequelize en `src/database/hormiwatch/`. No existen archivos `.entity.ts`, sino archivos `.js` que exportan modelos de Sequelize.

**Entidades Principales:**
- `Usuarios`: Almacena la información de los usuarios, incluyendo credenciales, roles y estado.
- `Proyectos`: Define los proyectos de los clientes, con detalles como nombre, tarifa, pool de horas y fechas.
- `Tareas`: Registra las horas trabajadas por los usuarios en diferentes proyectos y servicios.
- `Clientes`: Información de los clientes (replicada desde otra BD).
- `Responsables_cliente`: Contactos o responsables por parte del cliente.
- `Servicios`: Tipos de servicios que se pueden registrar en las tareas.
- `Roles`: Roles de los usuarios (ej. Administrador, Técnico).
- `Asignaciones`: Tabla intermedia que gestiona la relación muchos a muchos entre `Usuarios` y `Proyectos`.

**Relaciones Clave (definidas en `asociaciones.js`):**
- **Uno a Muchos:**
    - `Roles` tiene muchos `Usuarios`.
    - `Usuarios` tiene muchas `Tareas`.
    - `Proyectos` tiene muchas `Tareas`.
    - `Servicios` tiene muchas `Tareas`.
    - `ClientesR` (Cliente) tiene muchos `ResponsablesClienteR`.
    - `ResponsablesClienteR` tiene muchos `Proyectos`.
- **Muchos a Muchos:**
    - `Usuarios` y `Proyectos` se relacionan a través de la tabla `Asignaciones`. Un usuario puede estar asignado a múltiples proyectos y un proyecto puede tener múltiples usuarios.

## 4. Módulos y Funcionalidad
- **`usuarios`**: Gestiona el ciclo de vida completo de los usuarios: registro, login (con JWT), recuperación de contraseña, actualización de perfil y cambio de rol. Integra `bcrypt` para el hash de contraseñas y `firebase` para la subida de fotos de perfil.
- **`proyectos`**: Lógica de negocio para la gestión de proyectos (CRUD). Permite asignar técnicos, definir tarifas, y controlar el `pool_horas`. Su funcionalidad más compleja es la generación de reportes en PDF (`puppeteer`), que incluyen tablas detalladas y gráficos.
- **`tareas`**: Permite a los usuarios registrar las horas trabajadas. Contiene una lógica de negocio sofisticada en `libs/Tarifa.js` para calcular el tiempo y el costo, aplicando diferentes factores según el horario (diurno, nocturno, feriado). Valida que no haya solapamiento de tareas para un mismo usuario.
- **`auditoria`**: Registra acciones importantes realizadas en el sistema, como la creación o modificación de tareas.
- **`clientes` y `responsables_clientes`**: Gestionan la información de los clientes y sus responsables, que es fundamental para la creación de proyectos.
- **`metricas`**: Provee endpoints para calcular y exponer métricas clave del sistema.
- **`notificaciones`**: Maneja el envío de notificaciones (presumiblemente por email a través de `nodemailer`).

## 5. Configuración y Entorno
El archivo `.env.example` revela las siguientes variables de entorno necesarias para el funcionamiento de la aplicación:

- **Aplicación:**
    - `PORT`: Puerto en el que corre el servidor.
    - `HOST`: Host del servidor.
    - `CORS_ORIGIN`: Orígenes permitidos para CORS.
    - `TOKEN_SECRET`: Clave secreta para firmar los JWT.
- **Base de Datos (HormiWatch):**
    - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_DIALECT`.
- **Base de Datos (Cliente):**
    - `DB_HOST_CLIENT`, `DB_PORT_CLIENT`, `DB_USER_CLIENT`, `DB_PASSWORD_CLIENT`, `DB_NAME_CLIENT`, `DB_DIALECT_CLIENT`.
- **Envío de Correo:**
    - `EMAIL`, `PASSWD`, `PORT_EMAIL`, `HOST_EMAIL`.
- **Firebase (Storage):**
    - `API_KEY`, `AUTH_DOMAIN`, `PROJECT_ID`, `STORAGE_BUCKET`, `MESSAGING_SENDER_ID`, `APP_ID`, `MEASUREMENT_ID`.
