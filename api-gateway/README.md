# 🚀 API Gateway - Microservicio

API Gateway completo y production-ready para gestionar y enrutar microservicios con autenticación JWT, rate limiting, documentación Swagger y Docker.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Documentación API](#-documentación-api)
- [Docker](#-docker)
- [Arquitectura](#-arquitectura)
- [Agregar Nuevos Microservicios](#-agregar-nuevos-microservicios)
- [Testing](#-testing)
- [Buenas Prácticas](#-buenas-prácticas)

## ✨ Características

- ✅ **Proxy/Router** hacia múltiples microservicios
- ✅ **Autenticación JWT** centralizada
- ✅ **Rate Limiting** configurable
- ✅ **CORS** y seguridad con Helmet
- ✅ **Documentación Swagger** (OpenAPI 3.0)
- ✅ **Logging** estructurado con Winston
- ✅ **Health Check** endpoint
- ✅ **Docker** ready
- ✅ **Rutas públicas/privadas** configurables
- ✅ **Arquitectura modular** y escalable

## 📦 Requisitos

- Node.js >= 18.x
- npm >= 9.x
- Docker (opcional)

## 🔧 Instalación

### Instalación local

```bash
# Clonar el repositorio
git clone <repository-url>
cd api-gateway

# Instalar dependencias
npm install

# Copiar archivo de entorno
cp .env.example .env

# Editar variables de entorno
nano .env
```

### Instalación con Docker

```bash
# Build de la imagen
docker build -t api-gateway .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env api-gateway
```

## ⚙️ Configuración

### Variables de Entorno

Edita el archivo `.env` con tus valores:

```bash
# Server
NODE_ENV=development
PORT=3000
API_GATEWAY_NAME=api-gateway

# JWT
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:4200
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutos
RATE_LIMIT_MAX_REQUESTS=100

# Microservices URLs
AUTH_SERVICE_URL=http://localhost:3001
USERS_SERVICE_URL=http://localhost:3002
IA_SERVICE_URL=http://localhost:3003

# Public Routes (separadas por comas)
PUBLIC_ROUTES=/auth/login,/auth/register,/health,/api-docs

# Logging
LOG_LEVEL=info
```

### Rutas Públicas vs Privadas

Las rutas públicas se configuran en `PUBLIC_ROUTES`:

- **Rutas públicas**: No requieren autenticación JWT
- **Rutas privadas**: Requieren token JWT válido en el header `Authorization: Bearer {token}`

Ejemplos de configuración:

```bash
# Rutas exactas
PUBLIC_ROUTES=/auth/login,/auth/register,/health

# Con wildcards
PUBLIC_ROUTES=/auth/*,/public/*,/health
```

## 🚀 Uso

### Modo Desarrollo

```bash
npm run dev
```

### Modo Producción

```bash
npm start
```

### Con Docker

```bash
# Build
npm run docker:build

# Run
npm run docker:run

# O usando docker-compose (crear docker-compose.yml)
docker-compose up -d
```

El servidor estará disponible en `http://localhost:3000`

## 📚 Documentación API

### Swagger UI

Accede a la documentación interactiva en:

```
http://localhost:3000/api-docs
```

### Endpoints Principales

#### Health Check

```bash
GET /health

# Response:
{
  "success": true,
  "status": "ok",
  "gateway": "api-gateway",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345.67
}
```

#### Autenticación (Proxy a auth-service)

```bash
# Login
POST /auth/login
Content-Type: application/json

{
  "email": "user@ejemplo.com",
  "password": "password123"
}

# Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

#### Usuarios (Proxy a users-service - Requiere Auth)

```bash
# Obtener usuarios
GET /users
Authorization: Bearer {token}

# Obtener usuario por ID
GET /users/{id}
Authorization: Bearer {token}
```

#### IA Service (Proxy a ia-service - Requiere Auth)

```bash
POST /ia/analyze
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "Sample text to analyze"
}
```

## 🐳 Docker

### Dockerfile

El proyecto incluye un Dockerfile optimizado con:

- Multi-stage build
- Usuario no-root para seguridad
- Health check integrado
- Node.js Alpine (imagen ligera)

### Build y Run

```bash
# Build
docker build -t api-gateway .

# Run
docker run -d \
  -p 3000:3000 \
  --name api-gateway \
  --env-file .env \
  api-gateway

# Logs
docker logs -f api-gateway

# Stop
docker stop api-gateway
```

### Docker Compose

Crea un archivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  api-gateway:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 3s
      retries: 3
```

## 🏗️ Arquitectura

### Estructura de Carpetas

```
src/
├── config/           # Configuraciones (env, cors, swagger)
├── middlewares/      # Middlewares (auth, rate limiter, logger, error handler)
├── proxies/          # Configuración de proxies a microservicios
├── routes/           # Definición de rutas
├── utils/            # Utilidades (logger, response handlers)
├── docs/             # Documentación Swagger
└── app.js            # Configuración de Express
```

### Flujo de Request

```
Request → Rate Limiter → Logger → Auth Middleware → Proxy → Microservice
                                        ↓
                                   JWT Validation
                                        ↓
                                  Add User Headers
```

### Middlewares

1. **Helmet**: Seguridad HTTP headers
2. **CORS**: Control de origen cruzado
3. **Rate Limiter**: Límite de requests
4. **Logger**: Logging de requests/responses
5. **Auth Middleware**: Validación JWT
6. **Error Handler**: Manejo centralizado de errores

## 🔌 Agregar Nuevos Microservicios

### Paso 1: Agregar URL del servicio

Edita `.env`:

```bash
# .env
NEW_SERVICE_URL=http://localhost:3004
```

### Paso 2: Agregar proxy en rutas

Edita `src/routes/index.js`:

```javascript
const { NEW_SERVICE_URL } = require('../config/env');

// Para rutas protegidas (requiere auth)
router.use(
  '/new-service',
  authenticateToken,
  createServiceProxy(NEW_SERVICE_URL, 'new-service')
);

// Para rutas públicas
router.use(
  '/public-service',
  createServiceProxy(PUBLIC_SERVICE_URL, 'public-service')
);
```

### Paso 3: Actualizar Swagger

Edita `src/docs/swagger.yaml`:

```yaml
tags:
  - name: NewService
    description: New service endpoints

paths:
  /new-service/endpoint:
    get:
      tags:
        - NewService
      summary: Example endpoint
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Success
```

### Paso 4: Reiniciar el gateway

```bash
npm start
```

¡Listo! Tu nuevo microservicio está integrado.

## 🧪 Testing

### Test Manual con curl

```bash
# Health check
curl http://localhost:3000/health

# Login (obtener token)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@ejemplo.com","password":"password123"}'

# Request autenticado
curl http://localhost:3000/users \
  -H "Authorization: Bearer {TOKEN}"
```

### Test con Postman

1. Importa la colección desde Swagger
2. Configura variable de entorno `token`
3. Ejecuta los requests

## 💡 Buenas Prácticas

### Seguridad

✅ **JWT Secret**: Usa una clave fuerte y única en producción
```bash
# Generar secret seguro
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

✅ **CORS**: Configura orígenes específicos, evita `*`
```bash
CORS_ORIGIN=https://tuapp.com,https://admin.tuapp.com
```

✅ **Rate Limiting**: Ajusta según tus necesidades
```bash
# Para APIs públicas: más restrictivo
RATE_LIMIT_MAX_REQUESTS=50

# Para APIs privadas: más permisivo
RATE_LIMIT_MAX_REQUESTS=200
```

✅ **HTTPS**: Siempre usa HTTPS en producción

### Performance

✅ **Keep-Alive**: El proxy usa keep-alive por defecto

✅ **Timeouts**: Configura timeouts apropiados
```javascript
// src/proxies/proxyConfig.js
timeout: 30000, // 30 segundos
proxyTimeout: 30000
```

✅ **Caching**: Implementa caching en los microservicios

### Logging

✅ **Niveles de Log**: Usa niveles apropiados
```bash
# Development
LOG_LEVEL=debug

# Production
LOG_LEVEL=info
```

✅ **Logs Estructurados**: Winston genera logs en formato JSON

### Monitoreo

✅ **Health Check**: Monitorea `/health` cada 30s

✅ **Métricas**: Considera agregar Prometheus/Grafana

✅ **Alertas**: Configura alertas para errores 5xx

### Variables de Entorno

✅ **Nunca commitees** el archivo `.env`

✅ **Documenta** todas las variables en `.env.example`

✅ **Usa** validación de variables al inicio

### Docker

✅ **Multi-stage builds**: Optimiza tamaño de imagen

✅ **Usuario no-root**: Por seguridad

✅ **Health checks**: Incluye health checks

## 🔍 Troubleshooting

### Error: ECONNREFUSED al proxear

**Problema**: El microservicio no está disponible

**Solución**: 
1. Verifica que el servicio esté corriendo
2. Verifica la URL en `.env`
3. Verifica conectividad de red

### Error: Token expired

**Problema**: JWT expirado

**Solución**: 
1. Obtén un nuevo token desde `/auth/login`
2. Ajusta `JWT_EXPIRES_IN` si es necesario

### Error: Too many requests

**Problema**: Rate limit excedido

**Solución**: 
1. Espera el tiempo de ventana
2. Ajusta `RATE_LIMIT_MAX_REQUESTS`

### Error: Not allowed by CORS

**Problema**: Origen no permitido

**Solución**: 
1. Agrega el origen a `CORS_ORIGIN`
2. Verifica que el origen incluya protocolo y puerto

## 📝 License

MIT

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Soporte

Para soporte, abre un issue en GitHub o contacta a support@ejemplo.com

---

**¡Hecho con ❤️ para la comunidad de microservicios!**