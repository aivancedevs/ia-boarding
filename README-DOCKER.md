# 🐳 Docker Compose - IA Boarding Ecosystem

Configuración completa para levantar todo el ecosistema de microservicios.

## 📁 Estructura del Proyecto

```
ia-boarding/
├── docker-compose.yml          ← Archivo principal
├── .env                        ← Variables de entorno
├── README-DOCKER.md           ← Esta guía
├── api-gateway/
│   ├── Dockerfile
│   └── ...
├── auth-service/
│   ├── Dockerfile
│   └── ...
├── users-service/
│   ├── Dockerfile
│   └── ...
└── ia-service/
    ├── Dockerfile
    └── ...
```

## 🚀 Inicio Rápido

### 1. Verificar prerequisitos

```powershell
# Verificar Docker
docker --version

# Verificar Docker Compose
docker-compose --version
```

### 2. Configurar variables de entorno

```powershell
# Copiar el archivo .env de ejemplo (si existe)
cp .env.example .env

# O crear uno nuevo con tus valores
```

### 3. Construir las imágenes

```powershell
# Construir todas las imágenes
docker-compose build

# Ver las imágenes creadas
docker images
```

### 4. Levantar todos los servicios

```powershell
# Levantar en modo detached (background)
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f api-gateway
```

### 5. Verificar que todo funciona

```powershell
# Health check de cada servicio
curl http://localhost:4000/health  # API Gateway
curl http://localhost:3000/health  # Auth Service
curl http://localhost:3001/health  # Users Service
curl http://localhost:3002/health  # IA Service

# Ver estado de contenedores
docker-compose ps
```

## 🎯 Servicios y Puertos

| Servicio | Puerto | URL | Descripción |
|----------|--------|-----|-------------|
| **API Gateway** | 4000 | http://localhost:4000 | Punto de entrada principal |
| **Auth Service** | 3000 | http://localhost:3000 | Autenticación y autorización |
| **Users Service** | 3001 | http://localhost:3001 | Gestión de usuarios |
| **IA Service** | 3002 | http://localhost:3002 | Servicios de IA |
| **MongoDB** | 27017 | mongodb://localhost:27017 | Base de datos |
| **Redis** | 6379 | localhost:6379 | Cache y sesiones |
| **Mongo Express** | 8081 | http://localhost:8081 | UI de MongoDB (dev) |

## 📚 Documentación API

- **Swagger UI**: http://localhost:4000/api-docs
- **API Gateway**: http://localhost:4000/api-docs

## 🛠️ Comandos Útiles

### Gestión de servicios

```powershell
# Levantar todos los servicios
docker-compose up -d

# Levantar solo algunos servicios
docker-compose up -d api-gateway auth-service mongo redis

# Levantar con Mongo Express (perfil dev)
docker-compose --profile dev up -d

# Detener todos los servicios
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Detener, eliminar contenedores y volúmenes
docker-compose down -v
```

### Logs y debugging

```powershell
# Ver logs de todos los servicios
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f api-gateway

# Ver últimas 100 líneas
docker-compose logs --tail=100 auth-service

# Ver estado de servicios
docker-compose ps

# Ver uso de recursos
docker stats
```

### Reconstruir servicios

```powershell
# Reconstruir una imagen específica
docker-compose build api-gateway

# Reconstruir todas las imágenes
docker-compose build

# Reconstruir sin usar cache
docker-compose build --no-cache

# Reconstruir y levantar
docker-compose up -d --build
```

### Acceder a contenedores

```powershell
# Abrir terminal en un contenedor
docker-compose exec api-gateway sh

# Ejecutar comando en un contenedor
docker-compose exec mongo mongosh

# Ver archivos de un contenedor
docker-compose exec api-gateway ls -la
```

### Limpieza

```powershell
# Eliminar contenedores y redes
docker-compose down

# Eliminar contenedores, redes y volúmenes
docker-compose down -v

# Limpiar todo Docker (¡CUIDADO!)
docker system prune -a --volumes
```

## 🔧 Desarrollo

### Desarrollo con hot-reload

Para desarrollar con hot-reload, puedes usar volúmenes:

```yaml
# Agregar en docker-compose.yml para cada servicio
volumes:
  - ./api-gateway/src:/app/src
```

O mejor aún, usar `docker-compose.override.yml`:

```yaml
version: '3.8'

services:
  api-gateway:
    volumes:
      - ./api-gateway/src:/app/src
    environment:
      - NODE_ENV=development
```

### Levantar en modo desarrollo

```powershell
# El archivo docker-compose.override.yml se lee automáticamente
docker-compose up -d
```

## 🐛 Troubleshooting

### Los servicios no se conectan entre sí

```powershell
# Verificar que estén en la misma red
docker network inspect ia-boarding-network

# Ver conectividad desde un contenedor
docker-compose exec api-gateway ping auth-service
```

### Puerto ya en uso

```powershell
# Ver qué está usando el puerto
netstat -ano | findstr :4000

# Cambiar el puerto en docker-compose.yml
ports:
  - "4001:4000"  # Mapear 4001 externo -> 4000 interno
```

### Base de datos no persiste

```powershell
# Verificar volúmenes
docker volume ls

# Ver detalles del volumen
docker volume inspect ia-boarding-mongo-data

# Eliminar volumen (¡perderás los datos!)
docker volume rm ia-boarding-mongo-data
```

### Contenedor no arranca

```powershell
# Ver logs completos
docker-compose logs api-gateway

# Ver por qué falló
docker-compose ps

# Reiniciar servicio
docker-compose restart api-gateway
```

### Healthcheck falla

```powershell
# Ver estado del healthcheck
docker inspect api-gateway | grep -A 10 Health

# Probar el healthcheck manualmente
docker-compose exec api-gateway curl -f http://localhost:4000/health
```

## 🔐 Seguridad

### Antes de producción

1. ✅ Cambiar todos los passwords en `.env`
2. ✅ Usar secrets de Docker en lugar de variables de entorno
3. ✅ Deshabilitar Mongo Express
4. ✅ Configurar firewall y redes apropiadas
5. ✅ Usar HTTPS con certificados válidos

### Ejemplo de secrets

```yaml
secrets:
  mongo_password:
    file: ./secrets/mongo_password.txt
  
services:
  mongo:
    secrets:
      - mongo_password
    environment:
      - MONGO_INITDB_ROOT_PASSWORD_FILE=/run/secrets/mongo_password
```

## 📊 Monitoreo

### Ver uso de recursos

```powershell
# Stats en tiempo real
docker stats

# Uso de disco
docker system df

# Logs con timestamps
docker-compose logs -f --timestamps
```

### Health checks

```powershell
# Health de todos los servicios
for service in api-gateway auth-service users-service ia-service; do
  echo "=== $service ==="
  curl -s http://localhost:$(docker-compose port $service 3000 | cut -d: -f2)/health | jq
done
```

## 🎓 Recursos Adicionales

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Node.js Docker Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs: `docker-compose logs -f`
2. Verifica el estado: `docker-compose ps`
3. Revisa la red: `docker network inspect ia-boarding-network`
4. Consulta esta guía de troubleshooting

---

**¡Listo! 🚀 Todo el ecosistema levantado con un solo comando.**