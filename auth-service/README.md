### Error: "El email ya está registrado" pero no veo usuarios

- Ve a Supabase Dashboard → **Table Editor** → tabla `users`
- Verifica si hay usuarios duplicados
- Puedes limpiar la tabla con: `DELETE FROM users;`# 🔐 Auth Service

Microservicio de autenticación con arquitectura hexagonal, JWT y OAuth2 de Google.

## 🏗️ Arquitectura

Este proyecto implementa **arquitectura hexagonal (Ports & Adapters)** que separa claramente:

- **Domain**: Entidades y lógica de negocio pura (User, UserRepository)
- **Application**: Casos de uso y DTOs (RegisterUser, LoginUser, GoogleAuth)
- **Infrastructure**: Implementaciones técnicas (MongoDB, Express, JWT, OAuth)

### ¿Por qué Hexagonal?

- ✅ Independencia de frameworks y bases de datos
- ✅ Facilita testing y mantenibilidad
- ✅ Lógica de negocio aislada
- ✅ Fácil cambio de implementaciones (ej: Supabase → otro proveedor)
- ✅ Perfecto para microservicios

## 🚀 Características

- ✅ Registro de usuario con email/password
- ✅ Login con JWT
- ✅ Autenticación con Google OAuth2
- ✅ Validación robusta de datos
- ✅ Documentación automática con Swagger
- ✅ Dockerizado y listo para producción
- ✅ Seguridad con Helmet y bcrypt

## 📋 Requisitos Previos

- Node.js 18+ ([Descargar](https://nodejs.org/))
- Cuenta en Supabase ([Crear cuenta gratis](https://supabase.com))
- Docker y Docker Compose (opcional)
- Cuenta de Google Cloud para OAuth2

## 🔧 Configuración Inicial

### 1. Clonar el repositorio

```bash
git clone <tu-repo>
cd auth-service
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y edita las variables:

```bash
cp .env.example .env
```

Edita `.env`:

```env
NODE_ENV=development
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=tu-secreto-super-seguro-cambiar-en-produccion
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=tu-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-google-client-secret
CORS_ORIGIN=*
```

### 4. Configurar Supabase

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Crea un nuevo proyecto (gratis)
3. Ve a **SQL Editor** y ejecuta el script `supabase-schema.sql` que está en la raíz del proyecto:

```sql
-- Copia y pega el contenido de supabase-schema.sql
```

4. Ve a **Settings** → **API** y copia:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** (secret) → `SUPABASE_SERVICE_KEY`

⚠️ **Importante**: Usa el `service_role` key (no el `anon` key) ya que necesitamos bypass de RLS.

5. Pega estos valores en tu `.env`

### 5. Configurar Google OAuth2

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ 
4. Ve a **Credenciales** → **Crear credenciales** → **ID de cliente de OAuth 2.0**
5. Configura:
   - Tipo: Aplicación web
   - URIs de redireccionamiento autorizados: `http://localhost:3000` (desarrollo)
6. Copia el **Client ID** y **Client Secret** a tu `.env`

## 🏃 Ejecución Local

### Opción 1: Directo con Node.js

Asegúrate de haber configurado Supabase y las variables de entorno:

```bash
# Desarrollo (con hot reload)
npm run dev

# Producción
npm start
```

### Opción 2: Con Docker (recomendado si no quieres instalar nada local)

```bash
# Construir y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f auth-service

# Detener
docker-compose down
```

**Nota**: Con Supabase no necesitas levantar una base de datos local, todo está en la nube.

### Verificar que funciona

```bash
# Health check
curl http://localhost:3000/health

# Respuesta esperada:
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 📚 Documentación API (Swagger)

Una vez que el servicio esté corriendo, accede a:

**http://localhost:3000/api-docs**

Ahí encontrarás la documentación interactiva completa de todos los endpoints.

## 🔌 Endpoints

### 1. **POST** `/auth/register` - Registrar usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123",
    "name": "Juan Pérez"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "usuario@example.com",
      "name": "Juan Pérez",
      "oauthGoogle": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. **POST** `/auth/login` - Iniciar sesión

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'
```

### 3. **POST** `/auth/google` - Login con Google

```bash
curl -X POST http://localhost:3000/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "token": "token-de-google-oauth2-obtenido-del-frontend"
  }'
```

**Nota**: El token de Google se obtiene desde el frontend usando la librería `@react-oauth/google` o `gapi`.

### 4. **GET** `/auth/me` - Obtener perfil (requiere autenticación)

```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "oauthGoogle": false
  }
}
```

## 🐳 Producción con Docker

### Build de la imagen

```bash
docker build -t auth-service:latest .
```

### Ejecutar el contenedor

```bash
docker run -d \
  --name auth-service \
  -p 3000:3000 \
  -e SUPABASE_URL="https://your-project.supabase.co" \
  -e SUPABASE_SERVICE_KEY="your-service-key" \
  -e JWT_SECRET="tu-secreto-produccion" \
  -e GOOGLE_CLIENT_ID="tu-client-id" \
  -e GOOGLE_CLIENT_SECRET="tu-client-secret" \
  auth-service:latest
```

## 🧪 Testing

Para probar rápidamente todos los endpoints:

```bash
# 1. Registrar usuario
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"Test User"}'

# 2. Guardar el token de la respuesta anterior
TOKEN="<pegar-token-aqui>"

# 3. Obtener perfil
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ JWT con expiración configurable
- ✅ Validación de datos con express-validator
- ✅ Helmet para headers de seguridad HTTP
- ✅ CORS configurable
- ✅ Usuario no-root en Docker

### Recomendaciones para Producción

1. **Cambia `JWT_SECRET`** por un string aleatorio fuerte (64+ caracteres)
2. **Usa HTTPS** (configura un reverse proxy como Nginx)
3. **Limita CORS** a tus dominios específicos
4. **Configura rate limiting** (ej: express-rate-limit)
5. **Usa variables de entorno seguras** (AWS Secrets Manager, etc.)
6. **Monitorea logs** (ej: Winston + CloudWatch)

## 📁 Estructura del Proyecto

```
auth-service/
├── src/
│   ├── domain/              # Lógica de negocio pura
│   │   ├── entities/        # User
│   │   ├── repositories/    # Interfaces
│   │   └── services/        # Servicios de dominio
│   ├── application/         # Casos de uso
│   │   ├── use-cases/       # RegisterUser, LoginUser, etc.
│   │   └── dto/             # Data Transfer Objects
│   ├── infrastructure/      # Implementaciones técnicas
│   │   ├── database/        # Supabase
│   │   ├── repositories/    # SupabaseUserRepository
│   │   ├── security/        # JWT, bcrypt, OAuth
│   │   └── http/            # Express, routes, controllers
│   ├── config/              # Configuración centralizada
│   └── server.js            # Punto de entrada
├── supabase-schema.sql      # Script SQL para crear tablas
├── Dockerfile
├── docker-compose.yml
├── QUICKSTART-SUPABASE.md   # Guía rápida de setup
└── README.md
```

## 🛠️ Tecnologías Utilizadas

- **Node.js** 18+ - Runtime
- **Express** - Framework web
- **Supabase** (PostgreSQL) - Base de datos
- **JWT** - Autenticación stateless
- **bcryptjs** - Hash de contraseñas
- **Google Auth Library** - OAuth2 de Google
- **Swagger** - Documentación automática
- **Helmet** - Seguridad HTTP
- **Docker** - Containerización

## 📝 Scripts Disponibles

```bash
npm start          # Ejecutar en producción
npm run dev        # Ejecutar en desarrollo (con nodemon)
npm run docker:build  # Construir imagen Docker
npm run docker:run    # Ejecutar con docker-compose
```

## 🐛 Troubleshooting

### Error: "Supabase no ha sido inicializado"

- Verifica que `SUPABASE_URL` y `SUPABASE_SERVICE_KEY` estén en `.env`
- Asegúrate de usar el `service_role` key, no el `anon` key
- Revisa que la URL sea correcta (sin barra al final)

### Error: "relation 'users' does not exist"

- Ejecuta el script SQL `supabase-schema.sql` en el SQL Editor de Supabase
- Verifica que estés conectado al proyecto correcto

### Error: "Token de Google inválido"

- Verifica que `GOOGLE_CLIENT_ID` sea correcto
- Asegúrate que el token no haya expirado
- Confirma que el token sea generado para tu Client ID

### Puerto 3000 ya en uso

Cambia el puerto en `.env`:
```env
PORT=4000
```

## 📄 Licencia

MIT

## 👤 Autor

Tu nombre o equipo

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

---

**¿Preguntas o problemas?** Abre un issue en GitHub.

⭐ Si te sirvió este proyecto, dale una estrella!