# Users Service 👥

Microservicio de gestión de usuarios, clientes y proyectos construido con Node.js, Express, Prisma y PostgreSQL.

## 🚀 Características

- **Arquitectura Limpia**: Separación de capas (Domain, Application, Infrastructure)
- **Gestión de Usuarios**: CRUD completo con roles (ADMIN, CLIENT_ADMIN, USER)
- **Gestión de Clientes**: CRUD de organizaciones/empresas
- **Gestión de Proyectos**: CRUD de proyectos asociados a clientes
- **Autenticación**: Validación de headers JWT desde API Gateway
- **Autorización**: Control de permisos basado en roles
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Documentación**: Swagger/OpenAPI 3.0
- **Validación**: Joi para validación de datos
- **Logging**: Winston para logs estructurados
- **Dockerizado**: Docker y Docker Compose listos para usar
- **Health Checks**: Endpoints de salud para monitoreo

## 📋 Requisitos Previos

- Node.js 20+
- Docker y Docker Compose
- PostgreSQL 16+ (si no usas Docker)

## 🏗️ Arquitectura

```
users-service/
├── src/
│   ├── config/              # Configuración (env, db, logger)
│   ├── domain/              # Entidades y contratos de repositorios
│   ├── application/         # Casos de uso (lógica de negocio)
│   └── infrastructure/      # Implementaciones (HTTP, Prisma, etc.)
├── prisma/                  # Schema y migraciones
├── Dockerfile
└── docker-compose.yml
```

## 🗄️ Base de Datos

Este servicio usa **Supabase (PostgreSQL)** como base de datos. No necesitas levantar PostgreSQL localmente.

### Configuración de Supabase

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard/project/lvacipgdugrcehhdskoe
2. Ve a **Settings** > **Database**
3. Copia la **Connection String** (URI mode)
4. Usa tu contraseña de base de datos

**IMPORTANTE:** Supabase usa pgBouncer para connection pooling:
- `DATABASE_URL`: Puerto 6543 con `?pgbouncer=true` (para la app)
- `DIRECT_URL`: Puerto 5432 sin pgBouncer (para migraciones)

## 🚀 Inicio Rápido

### Opción 1: Con Docker (Recomendado)

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd users-service

# 2. Configurar variables de entorno
cp .env.example .env

# 3. IMPORTANTE: Editar .env y agregar tu contraseña de Supabase
# Reemplaza TU_PASSWORD en ambas líneas:
# - DATABASE_URL
# - DIRECT_URL

# 4. Levantar el servicio
docker-compose up -d

# 5. Ver logs
docker-compose logs -f users-service
```

El servicio estará disponible en:
- **API**: http://localhost:3002/api
- **Swagger**: http://localhost:3002/api-docs
- **Health**: http://localhost:3002/api/health

### Opción 2: Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar .env
cp .env.example .env
# EDITAR .env con tu password de Supabase

# 3. Ejecutar migraciones (se conecta a Supabase)
npm run migrate

# 4. Generar Prisma Client
npm run generate

# 5. (Opcional) Seed de datos
npm run seed

# 6. Iniciar en modo desarrollo
npm run dev
```

## 📝 Scripts Disponibles

```bash
npm start           # Iniciar en producción
npm run dev         # Iniciar en desarrollo con nodemon
npm run migrate     # Ejecutar migraciones
npm run generate    # Generar Prisma Client
npm run seed        # Poblar base de datos con datos iniciales
npm run studio      # Abrir Prisma Studio
npm test            # Ejecutar tests
```

## 🔑 Variables de Entorno

Ver `.env.example` para todas las variables disponibles. Las principales son:

```bash
NODE_ENV=production
PORT=3002
SERVICE_NAME=users-service

# Supabase Database (Connection Pooler - para la app)
DATABASE_URL="postgresql://postgres.lvacipgdugrcehhdskoe:TU_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase Direct Connection (para migraciones)
DIRECT_URL="postgresql://postgres.lvacipgdugrcehhdskoe:TU_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

LOG_LEVEL=info
API_GATEWAY_URL=http://api-gateway:4000
```

### 📍 Cómo obtener tu connection string de Supabase:

1. Ve a https://supabase.com/dashboard/project/lvacipgdugrcehhdskoe
2. Settings > Database
3. Copia "Connection string" en modo URI
4. Reemplaza `[YOUR-PASSWORD]` con tu contraseña
5. Para `DATABASE_URL`: usa puerto **6543** y agrega `?pgbouncer=true`
6. Para `DIRECT_URL`: usa puerto **5432** sin parámetros adicionales

## 📚 Endpoints

### Health Check
- `GET /api/health` - Verificar estado del servicio

### Users
- `GET /api/users` - Listar usuarios (con paginación)
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear usuario (ADMIN, CLIENT_ADMIN)
- `PUT /api/users/:id` - Actualizar usuario (ADMIN, CLIENT_ADMIN)
- `DELETE /api/users/:id` - Desactivar usuario (ADMIN)
- `PATCH /api/users/:id/role` - Actualizar rol (ADMIN)

### Clients
- `GET /api/clients` - Listar clientes
- `GET /api/clients/:id` - Obtener cliente por ID
- `POST /api/clients` - Crear cliente (ADMIN)
- `PUT /api/clients/:id` - Actualizar cliente (ADMIN, CLIENT_ADMIN)
- `DELETE /api/clients/:id` - Desactivar cliente (ADMIN)

### Projects
- `GET /api/clients/:clientId/projects` - Listar proyectos de un cliente
- `GET /api/projects/:id` - Obtener proyecto por ID
- `POST /api/projects` - Crear proyecto (ADMIN, CLIENT_ADMIN)
- `PUT /api/projects/:id` - Actualizar proyecto (ADMIN, CLIENT_ADMIN)
- `DELETE /api/projects/:id` - Archivar proyecto (ADMIN, CLIENT_ADMIN)

## 🔐 Autenticación

El servicio espera estos headers en cada request (excepto `/health`):

```
X-User-Id: <uuid>
X-User-Email: <email>
X-User-Role: <ADMIN|CLIENT_ADMIN|USER>
```

Estos headers son inyectados por el API Gateway después de validar el JWT.

## 👥 Roles y Permisos

- **ADMIN**: Acceso completo a todos los recursos
- **CLIENT_ADMIN**: Gestión de usuarios y proyectos de su cliente
- **USER**: Solo lectura de recursos

## 🗄️ Modelo de Datos

### User
```typescript
{
  id: UUID
  email: String (unique)
  firstName: String
  lastName: String
  role: ADMIN | CLIENT_ADMIN | USER
  status: ACTIVE | INACTIVE
  clientId: UUID (optional)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Client
```typescript
{
  id: UUID
  name: String
  description: String (optional)
  email: String (unique)
  phone: String (optional)
  address: String (optional)
  status: ACTIVE | INACTIVE
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Project
```typescript
{
  id: UUID
  name: String
  description: String (optional)
  status: ACTIVE | ARCHIVED
  clientId: UUID
  startDate: Date (optional)
  endDate: Date (optional)
  createdAt: DateTime
  updatedAt: DateTime
}
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm test -- --coverage
```

## 📊 Monitoreo

El servicio incluye:
- Health check endpoint
- Logging estructurado con Winston
- Rate limiting (100 req/15min por IP)
- Error handling centralizado

## 🐳 Docker

### Construir imagen
```bash
docker build -t users-service .
```

### Ejecutar con Docker Compose
```bash
docker-compose up -d          # Iniciar
docker-compose down           # Detener
docker-compose logs -f        # Ver logs
docker-compose ps             # Ver estado
```

## 🔧 Desarrollo

### Agregar nueva entidad

1. Crear entidad en `src/domain/entities/`
2. Definir repositorio en `src/domain/repositories/`
3. Implementar con Prisma en `src/infrastructure/repositories/`
4. Crear casos de uso en `src/application/use-cases/`
5. Crear controlador en `src/infrastructure/http/controllers/`
6. Agregar rutas en `src/infrastructure/http/routes/`
7. Actualizar `schema.prisma` y ejecutar migración

### Ejecutar migraciones

```bash
# Crear migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy
```

## 📖 Documentación API

La documentación completa está disponible en:
- **Swagger UI**: http://localhost:3002/api-docs
- **API Reference**: Ver `API-REFERENCE.md`

## 🤝 Integración con otros servicios

Este servicio está diseñado para trabajar con:
- **auth-service**: Genera los tokens JWT
- **api-gateway**: Valida tokens y enruta requests
- **Futuros servicios**: calls-service, leads-service, ia-service

## 🐛 Troubleshooting

### Error de conexión a base de datos
```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps

# Revisar logs
docker-compose logs postgres
```

### Prisma Client no generado
```bash
npm run generate
```

### Puerto 3002 en uso
```bash
# Cambiar PORT en .env
# O detener proceso:
lsof -ti:3002 | xargs kill -9
```

## 📄 Licencia

MIT

## 👨‍💻 Autor

Tu Nombre