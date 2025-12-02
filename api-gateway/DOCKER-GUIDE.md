# 🐳 Guía de Docker Compose - API Gateway

Esta guía te ayudará a ejecutar todo el ecosistema de microservicios usando Docker Compose.

## 📋 Prerequisitos

- Docker Desktop instalado
- Docker Compose (viene incluido con Docker Desktop)

## 🚀 Inicio rápido

### 1. Crear estructura para mock services

```bash
# Desde la raíz del proyecto api-gateway
mkdir -p mock-services/auth-service
```

### 2. Copiar archivos mock

Copia estos archivos en `mock-services/auth-service/`:
- `server.js` (del artifact "mock-services/auth-service/server.js")
- `package.json` (del artifact "mock-services/auth-service/package.json")

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz (si no existe):

```bash
JWT_SECRET=tu_clave_super_secreta_para_jwt_tokens_12345
DATABASE_URL=postgresql://user:pass@localhost:5432/db
OPENAI_API_KEY=tu_openai_key_aqui
```

### 4. Construir y ejecutar

```bash
# Construir todas las imágenes
docker-compose build

# Ejecutar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f api-gateway
```

## 🔍 Verificar que todo funciona

### Health checks

```bash
# API Gateway
curl http://localhost:4000/health

# Auth Service
curl http://localhost:3000/health
```

### Swagger Documentation

Abre en tu navegador:
```
http://localhost:4000/api-docs
```

## 📦 Comandos útiles

### Ver servicios corriendo

```bash
docker-compose ps
```

### Detener servicios

```bash
# Detener sin eliminar contenedores
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Detener y eliminar contenedores + volúmenes
docker-compose down -v
```

### Reconstruir servicios

```bash
# Reconstruir todo
docker-compose build --no-cache

# Reconstruir un servicio específico
docker-compose build --no-cache api-gateway
```

### Ver logs en tiempo real

```bash
# Todos los servicios
docker-compose logs -f

# Solo API Gateway
docker-compose logs -f api-gateway

# Solo Auth Service
docker-compose logs -f auth-service

# Últimas 100 líneas
docker-compose logs --tail=100
```

### Entrar a un contenedor

```bash
# API Gateway
docker exec -it api-gateway sh

# Auth Service
docker exec -it auth-service sh
```

### Reiniciar un servicio

```bash
docker-compose restart api-gateway
```

## 🔧 Configuración de puertos

| Servicio       | Puerto Host | Puerto Container |
|----------------|-------------|------------------|
| API Gateway    | 4000        | 4000             |
| Auth Service   | 3000        | 3000             |
| Users Service  | 3001        | 3001             |
| IA Service     | 3002        | 3002             |

## 🌐 Arquitectura de red

Todos los servicios están en la red `microservices-network`, lo que permite:

- Comunicación entre contenedores usando nombres de servicio
- Aislamiento de la red externa
- DNS automático entre servicios

### URLs internas (dentro de Docker)

```bash
# Desde API Gateway a Auth Service
http://auth-service:3000

# Desde API Gateway a Users Service
http://users-service:3001

# Desde API Gateway a IA Service
http://ia-service:3002
```

### URLs externas (desde tu máquina)

```bash
# API Gateway
http://localhost:4000

# Auth Service (directo)
http://localhost:3000

# Users Service (directo)
http://localhost:3001

# IA Service (directo)
http://localhost:3002
```

## 🎯 Agregar servicios reales

Cuando tengas tus servicios reales (users-service, ia-service), edita el `docker-compose.yml`:

### 1. Comenta o elimina el mock auth-service

```yaml
# auth-service:
#   image: node:20-alpine
#   ...
```

### 2. Agrega tu auth-service real

```yaml
auth-service:
  build:
    context: ../auth-service
    dockerfile: Dockerfile
  container_name: auth-service
  ports:
    - "3000:3000"
  environment:
    - PORT=3000
    - JWT_SECRET=${JWT_SECRET}
    - DATABASE_URL=${DATABASE_URL}
  networks:
    - microservices-network
  restart: unless-stopped
```

### 3. Descomenta users-service e ia-service

Ya están preparados en el docker-compose.yml, solo descoméntalos cuando estén listos.

## 🐛 Troubleshooting

### Puerto ya en uso

```bash
Error: Bind for 0.0.0.0:4000 failed: port is already allocated
```

**Solución:**
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :4000
kill -9 <PID>
```

### Contenedor no inicia

```bash
# Ver logs detallados
docker-compose logs api-gateway

# Ver todos los eventos
docker-compose events
```

### Reconstruir desde cero

```bash
# Detener todo
docker-compose down -v

# Limpiar imágenes
docker system prune -a

# Reconstruir
docker-compose build --no-cache
docker-compose up -d
```

### Health check falla

```bash
# Verificar que el servicio responde
docker exec -it api-gateway wget -O- http://localhost:4000/health

# Ver logs del health check
docker inspect --format='{{json .State.Health}}' api-gateway | jq
```

## 📊 Monitoreo

### Ver uso de recursos

```bash
docker stats
```

### Ver redes

```bash
docker network ls
docker network inspect microservices-network
```

### Ver volúmenes

```bash
docker volume ls
```

## 🔒 Producción

Para producción, considera:

1. **Usar secrets de Docker** en lugar de variables de entorno
2. **Configurar reverse proxy** (Nginx, Traefik)
3. **Agregar limitación de recursos**:

```yaml
services:
  api-gateway:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

4. **Configurar logging centralizado**
5. **Usar registry privado** para imágenes
6. **Implementar CI/CD**

## 🎉 Todo listo

Tu ecosistema de microservicios debería estar funcionando:

✅ API Gateway: http://localhost:4000
✅ Swagger Docs: http://localhost:4000/api-docs
✅ Health Check: http://localhost:4000/health
✅ Auth Service: http://localhost:3000

¡Ahora puedes importar la colección de Postman y empezar a hacer pruebas! 🚀