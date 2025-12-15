# 🚀 Guía de Instalación - Users Service

Esta guía te llevará paso a paso para tener el `users-service` funcionando en minutos.

## ✅ Verificación de Requisitos

Antes de comenzar, asegúrate de tener instalado:

```bash
# Node.js 20+
node --version
# Debe mostrar v20.x.x o superior

# Docker y Docker Compose
docker --version
docker-compose --version
```

## 📦 Instalación Rápida (Docker)

### Paso 1: Descargar el código

```bash
# Si tienes el repositorio
git clone <repo-url>
cd users-service

# O si copiaste los archivos manualmente
cd users-service
```

### Paso 2: Configurar variables de entorno

```bash
cp .env.example .env
```

El archivo `.env` ya viene configurado para Docker, no necesitas modificarlo.

### Paso 3: Levantar los servicios

```bash
docker-compose up -d
```

Este comando:
- ✅ Descarga las imágenes de PostgreSQL y Node.js
- ✅ Construye la imagen del servicio
- ✅ Ejecuta las migraciones automáticamente
- ✅ Inicia el servicio en segundo plano

### Paso 4: Verificar que está funcionando

```bash
# Ver logs en tiempo real
docker-compose logs -f users-service

# Probar el health check
curl http://localhost:3002/api/health
```

Deberías ver:
```json
{
  "success": true,
  "service": "users-service",
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Paso 5: (Opcional) Poblar con datos de ejemplo

```bash
docker-compose exec users-service npm run seed
```

Esto crea:
- 1 usuario ADMIN (admin@example.com)
- 1 cliente de ejemplo (Example Corporation)
- 1 usuario CLIENT_ADMIN (clientadmin@example.com)
- 1 usuario regular (user@example.com)
- 2 proyectos de ejemplo

### Paso 6: Abrir Swagger

Abre tu navegador en:
```
http://localhost:3002/api-docs
```

¡Listo! 🎉

## 💻 Instalación para Desarrollo Local

### Paso 1: Instalar PostgreSQL

**Opción A - Con Docker (Recomendado):**
```bash
docker run --name users-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=users_db \
  -p 5432:5432 \
  -d postgres:16-alpine
```

**Opción B - Instalación nativa:**
- macOS: `brew install postgresql@16`
- Ubuntu: `sudo apt-get install postgresql-16`
- Windows: Descargar desde postgresql.org

### Paso 2: Clonar y configurar

```bash
cd users-service
npm install
cp .env.example .env
```

### Paso 3: Configurar .env

Edita `.env` con tu configuración de PostgreSQL:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/users_db?schema=public"
PORT=3002
NODE_ENV=development
LOG_LEVEL=debug
```

### Paso 4: Ejecutar migraciones

```bash
npm run migrate
```

Verás algo como:
```
✔ Generated Prisma Client
✔ Your database is now in sync with your schema
```

### Paso 5: Generar Prisma Client

```bash
npm run generate
```

### Paso 6: (Opcional) Seed de datos

```bash
npm run seed
```

### Paso 7: Iniciar en modo desarrollo

```bash
npm run dev
```

Verás:
```
🚀 users-service running on port 3002
📚 API Documentation: http://localhost:3002/api-docs
🏥 Health check: http://localhost:3002/api/health
Environment: development
```

## 🔍 Verificación de la Instalación

### Test 1: Health Check

```bash
curl http://localhost:3002/api/health
```

Respuesta esperada:
```json
{
  "success": true,
  "service": "users-service",
  "status": "healthy",
  "timestamp": "..."
}
```

### Test 2: Listar usuarios (con headers simulados)

```bash
curl -X GET http://localhost:3002/api/users \
  -H "X-User-Id: 00000000-0000-0000-0000-000000000000" \
  -H "X-User-Email: admin@example.com" \
  -H "X-User-Role: ADMIN"
```

### Test 3: Swagger UI

Abre en tu navegador:
```
http://localhost:3002/api-docs
```

Deberías ver la documentación interactiva de la API.

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar con nodemon (auto-reload)
npm start                # Iniciar en producción

# Base de datos
npm run migrate          # Ejecutar migraciones
npm run generate         # Generar Prisma Client
npm run seed             # Poblar con datos
npm run studio           # Abrir Prisma Studio (GUI)

# Docker
docker-compose up -d     # Iniciar servicios
docker-compose down      # Detener servicios
docker-compose logs -f   # Ver logs
docker-compose ps        # Ver estado

# Testing
npm test                 # Ejecutar tests
npm test -- --coverage   # Tests con cobertura
```

## 🐛 Solución de Problemas

### Error: "Port 3002 is already in use"

```bash
# Encontrar y matar el proceso
lsof -ti:3002 | xargs kill -9

# O cambiar el puerto en .env
PORT=3003
```

### Error: "Connection refused" (base de datos)

```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps postgres

# Si no está, iniciarlo
docker-compose up -d postgres

# Ver logs
docker-compose logs postgres
```

### Error: "Prisma Client not generated"

```bash
npm run generate
```

### Error: "Migration failed"

```bash
# Resetear la base de datos (⚠️ Cuidado: borra todos los datos)
npx prisma migrate reset

# Volver a migrar
npm run migrate
```

### Los cambios no se reflejan

```bash
# Si usas Docker, reconstruir la imagen
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 📊 Verificar Estado de los Servicios

### Docker Compose

```bash
# Ver todos los servicios
docker-compose ps

# Deberías ver:
# NAME               STATUS    PORTS
# users-service      Up        0.0.0.0:3002->3002/tcp
# users-service-db   Up        0.0.0.0:5432->5432/tcp
```

### Logs

```bash
# Ver logs del servicio
docker-compose logs users-service

# Ver logs de la base de datos
docker-compose logs postgres

# Seguir logs en tiempo real
docker-compose logs -f
```

### Salud de la base de datos

```bash
# Conectarse a PostgreSQL
docker-compose exec postgres psql -U postgres -d users_db

# Listar tablas
\dt

# Salir
\q
```

## 🎯 Próximos Pasos

Una vez instalado:

1. **Explora la API** en Swagger: http://localhost:3002/api-docs
2. **Lee la documentación** en `API-REFERENCE.md`
3. **Integra con API Gateway** siguiendo las instrucciones en `README.md`
4. **Desarrolla nuevas features** siguiendo la arquitectura limpia

## 🆘 Necesitas Ayuda?

- 📖 Lee el `README.md` completo
- 📚 Consulta `API-REFERENCE.md`
- 🐛 Revisa los logs: `docker-compose logs -f`
- 🔍 Verifica el estado: `docker-compose ps`

## ✅ Checklist de Instalación Exitosa

- [ ] Node.js 20+ instalado
- [ ] Docker y Docker Compose instalados
- [ ] `docker-compose up -d` ejecutado sin errores
- [ ] Health check responde OK
- [ ] Swagger accesible en `/api-docs`
- [ ] (Opcional) Seed ejecutado correctamente
- [ ] Logs no muestran errores

Si todos los puntos están marcados, ¡estás listo para usar el servicio! 🚀