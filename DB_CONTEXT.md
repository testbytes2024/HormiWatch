# Contexto del Proyecto: HormiWatch

## 1. Modelo de Datos (Análisis Profundo)

El modelo de datos está implementado utilizando Sequelize como ORM sobre una base de datos MySQL. A continuación se detallan las entidades identificadas, sus atributos y tipos de datos inferidos del código fuente y la documentación del proyecto.

### Entidades Principales

#### **Usuarios**
Representa a los usuarios del sistema (técnicos, administradores, etc.).
| Atributo | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id_usuario` | `INTEGER` | `PK`, `AUTO_INCREMENT` | Identificador único del usuario. |
| `nombre` | `STRING` | `NOT NULL` | Nombre del usuario. |
| `apellido` | `STRING` | `NOT NULL` | Apellido del usuario. |
| `email` | `STRING` | `UNIQUE`, `NOT NULL` | Correo electrónico para autenticación. |
| `password` | `STRING` | `NOT NULL` | Hash de la contraseña (bcrypt). |
| `id_rol` | `INTEGER` | `FK` | Referencia a la tabla `Roles`. |
| `empresa` | `STRING` | `NULLABLE` | Empresa en la que trabaja |
| `cargo` | `STRING` | `NULLABLE` | Cargo en la empresa |
| `departamento` | `STRING` | `NULLABLE` | departamento de la empresa al que pertenece |
| `ultima_conexion` | `DATE` | `NULLABLE` | Timestamp de la ultima vez que inicio sesión |
| `cedula` | `STRING` | `UNIQUE` | tarjeta de identificacion venezolana (V-,E-,passaporte, RIF, etc) |
| `token` | `STRING` | `NULLABLE` | token para recuperar la contraseña |
| `estado` | `BOOLEAN` | `DEFAULT true` | Estado del usuario (activo/inactivo). |
| `foto_perfil` | `STRING` | `NULLABLE` | URL de la foto almacenada en Firebase. |

#### **Proyectos**
Proyectos asignados a los clientes.
| Atributo | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id_proyecto` | `INTEGER` | `PK`, `AUTO_INCREMENT` | Identificador único del proyecto. |
| `nombre_proyecto` | `STRING` | `NOT NULL` | Nombre descriptivo del proyecto. |
| `status` | `INTEGER` | `NULLABLE` | estado del proyecto |
| `tarifa` | `FLOAT/DECIMAL` | `NOT NULL` | Tarifa por hora o monto del proyecto. |
| `pool_horas` | `INTEGER` | `NOT NULL` | Total de horas trabajadas en el proyecto. |
| `pool_horas_contratadas` | `INTEGER` | `NOT NULL` | Total de horas asignadas al proyecto. |
| `facturable` | `BOOLEAN` | `NULLABLE` | Condicion de si el proyecto es facturable o no |
| `fecha_inicio` | `DATE` | `NOT NULL` | Fecha de inicio del proyecto. |
| `fecha_fin` | `DATE` | `NULLABLE` | Fecha estimada de finalización. |
| `id_responsable_cliente`| `INTEGER` | `FK` | Referencia a `Responsables_cliente`. |

#### **Tareas**
Registro de horas trabajadas por los usuarios.
| Atributo | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id_tarea` | `INTEGER` | `PK`, `AUTO_INCREMENT` | Identificador único de la tarea. |
| `id_usuario` | `INTEGER` | `FK` | Usuario que reporta la tarea. |
| `id_proyecto` | `INTEGER` | `FK` | Proyecto al que se imputan las horas. |
| `id_servicio` | `INTEGER` | `FK` | Tipo de servicio realizado. |
| `fecha` | `DATE` | `NOT NULL` | Fecha de ejecución de la tarea. |
| `hora_inicio` | `STRING` | `NOT NULL` | Hora en que empezó la tarea |
| `hora_fin` | `STRING` | `NOT NULL` | Hora en que finalizó la tarea |
| `tiempo_total` | `FLOAT` | `NOT NULL` | Cantidad de horas trabajadas. |
| `descripcion` | `TEXT` | `NULLABLE` | Detalles adicionales del trabajo. |
| `factor_tiempo_total` | `ENUM` | `('DIURNO', 'NOCTURNO', 'FERIADO')` | Factor para cálculo de costos. |
| `total_tarifa` | `FLOAT/DECIMAL` | `NOT NULL` | Costo calculado (horas * tarifa * factor). |

#### **Clientes**
Información de las empresas clientes.
| Atributo | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id_cliente` | `INTEGER` | `PK`, `AUTO_INCREMENT` | Identificador único del cliente. |
| `nombre_cliente` | `STRING` | `NOT NULL` | Razón social o nombre comercial. |
| `direccion` | `STRING` | `NULLABLE` | Dirección física. |

#### **Responsables_cliente**
Personas de contacto en el cliente.
| Atributo | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id_responsable` | `INTEGER` | `PK`, `AUTO_INCREMENT` | Identificador único. |
| `id_cliente` | `INTEGER` | `FK` | Cliente al que pertenece. |
| `nombre` | `STRING` | `NOT NULL` | Nombre del contacto. |
| `cargo` | `STRING` | `NULLABLE` | Cargo en la empresa cliente. |
| `departamento` | `STRING` | `NULLABLE` | departamento en la empresa cliente. |
| `telefono` | `STRING` | `NULLABLE` | telefono de contacto. |
| `cedula` | `STRING` | `NULLABLE` | cedula del contacto. |

#### **Servicios**
Tipos de servicios facturables.
| Atributo | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id_servicio` | `INTEGER` | `PK`, `AUTO_INCREMENT` | Identificador único. |
| `nombre_servicio` | `STRING` | `NOT NULL` | Nombre del servicio (ej. Consultoría, Desarrollo). |
| `plataforma_servicio` | `STRING` | `NULLABLE` | plataforma del servicio. (ej. IBM, Microsoft, etc) |
| `categoria_servicio` | `STRING` | `NULLABLE` | categoria del servicio (ej. básico, avanzado, etc). |
| `tipo_servicio` | `STRING` | `NULLABLE` | Tipo del servicio (ej. correciones, rendimiento y monitoreo, etc). |
| `descripcion_servicio` | `STRING` | `NULLABLE` | Descripción del servicio. |


#### **Roles**
Roles y permisos de usuario.
| Atributo | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id_rol` | `INTEGER` | `PK`, `AUTO_INCREMENT` | Identificador único. |
| `nombre_rol` | `STRING` | `NOT NULL` | Nombre del rol (ej. Admin, Técnico). |

#### **Asignaciones**
Tabla pivote para asignar usuarios a proyectos.
| Atributo | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id_asignacion` | `INTEGER` | `PK`, `AUTO_INCREMENT` | Identificador único. |
| `id_usuario` | `INTEGER` | `FK` | Usuario asignado. |
| `id_proyecto` | `INTEGER` | `FK` | Proyecto asignado. |

#### **Notificaciones**
Gestión de avisos a usuarios.
| Atributo | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id_usuario` | `INTEGER` | `FK` | Destinatario de la notificación. |
| `id_proyecto` | `INTEGER` | `FK` | Proyecto relacionado (si aplica). |

#### **Auditoria**
Log de actividades críticas.
| Atributo | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id_auditoria` | `INTEGER` | `PK`, `AUTO_INCREMENT` | Identificador único. |
| `nombre_usuario` | `STRING` | `NOT NULL` | Nombre completo del actor. |
| `rol_usuario` | `STRING` | `NOT NULL` | Rol del actor en el momento. |
| `accion` | `STRING` | `NOT NULL` | Acción realizada (ej. "Crear Tarea"). |
| `datos` | `JSON/TEXT` | `NULLABLE` | Datos involucrados en la acción. |
| `createdAt` | `DATE` | `DEFAULT NOW` | Fecha y hora de la acción. |

## 2. Relaciones entre entidades

Las relaciones se definen principalmente en `src/database/hormiwatch/asociaciones.js`.

### Relaciones Uno a Muchos (1:N)
- **Roles -> Usuarios**: Un rol define los permisos de múltiples usuarios.
- **Usuarios -> Tareas**: Un usuario es responsable de múltiples registros de tareas.
- **Proyectos -> Tareas**: Un proyecto acumula múltiples tareas (horas trabajadas).
- **Servicios -> Tareas**: Un tipo de servicio se referencia en múltiples tareas.
- **Clientes -> Responsables_cliente**: Una empresa cliente tiene múltiples puntos de contacto.
- **Responsables_cliente -> Proyectos**: Un responsable puede estar a cargo de solicitar múltiples proyectos.

### Relaciones Muchos a Muchos (N:M)
- **Usuarios <-> Proyectos**:
  - Implementada a través de la tabla **Asignaciones**.
  - Un usuario puede estar asignado a varios proyectos simultáneamente.
  - Un proyecto requiere la asignación de varios usuarios (técnicos, líderes).
  - También existe una relación similar para **Notificaciones**, donde los usuarios se suscriben a eventos de proyectos.

### Relaciones de Auditoría
- La tabla **Auditoria** no mantiene claves foráneas estrictas (`FK`) para preservar el historial incluso si los usuarios o registros originales son eliminados, guardando copias de los nombres y roles en el momento del evento.
