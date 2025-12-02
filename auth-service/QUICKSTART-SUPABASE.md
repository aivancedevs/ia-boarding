# 🚀 Quickstart: Auth Service con Supabase

Guía rápida para tener el microservicio funcionando en **5 minutos**.

## 📝 Paso 1: Crear proyecto en Supabase

1. Ve a https://supabase.com y crea una cuenta (gratis)
2. Click en **"New Project"**
3. Completa:
   - **Name**: auth-service
   - **Database Password**: (guarda esto, aunque no lo usaremos directamente)
   - **Region**: Elige la más cercana a ti
4. Espera 1-2 minutos mientras se crea el proyecto

## 🗄️ Paso 2: Crear la tabla de usuarios

1. En el dashboard de Supabase, ve a **SQL Editor** (icono de base de datos en el menú izquierdo)
2. Click en **"New Query"**
3. Copia y pega este SQL:

```sql
-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT,
  name VARCHAR(255),
  oauth_google BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_oauth_google ON users(oauth_google) WHERE oauth_google = TRUE;

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can do everything" ON users
  FOR ALL
  USING (auth.role() = 'service_role');
```

4. Click en **"Run"** (o F5)
5. Deberías ver: "Success. No rows returned"

## 🔑 Paso 3: Obtener las credenciales

1. Ve a **Settings** (⚙️ en el menú izquierdo)
2. Click en **API**
3. Copia estos valores:

   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **service_role key** (sección "Project API keys" → service_role)

⚠️ **IMPORTANTE**: Usa el `service_role`, NO el `anon` key.

## 📋 Paso 4: Configurar el proyecto

1. Clona el repo y entra a la carpeta:
```bash
cd auth-service
```

2. Instala dependencias:
```bash
npm install
```

3. Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

4. Edita `.env` y pega tus valores de Supabase:
```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=cambia-este-secreto-por-uno-aleatorio-muy-largo
```

## ▶️ Paso 5: Ejecutar

```bash
npm run dev
```

Deberías ver:
```
✅ Supabase cliente inicializado correctamente
🚀 Servidor corriendo en puerto 3000
📚 Documentación disponible en http://localhost:3000/api-docs
```

## ✅ Paso 6: Probar que funciona

### Opción A: Swagger UI (recomendado)

1. Abre http://localhost:3000/api-docs
2. Expande `POST /auth/register`
3. Click en **"Try it out"**
4. Edita el JSON:
```json
{
  "email": "test@ejemplo.com",
  "password": "password123",
  "name": "Usuario Prueba"
}
```
5. Click **"Execute"**
6. Deberías ver un `201` con el usuario creado y un token JWT

### Opción B: Con curl

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ejemplo.com",
    "password": "password123",
    "name": "Usuario Prueba"
  }'
```

### Verificar en Supabase

1. Ve a Supabase Dashboard → **Table Editor**
2. Click en la tabla `users`
3. Deberías ver tu usuario recién creado 🎉

## 🎉 ¡Listo!

Tu microservicio está funcionando. Ahora puedes:

- Probar login: `POST /auth/login`
- Obtener perfil: `GET /auth/me` (con token)
- Ver toda la documentación en `/api-docs`

## 🔧 (Opcional) Configurar Google OAuth

Si quieres habilitar login con Google:

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un proyecto
3. Habilita **Google+ API**
4. Crea credenciales OAuth 2.0
5. Copia Client ID y Client Secret a `.env`

```env
GOOGLE_CLIENT_ID=tu-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-secreto
```

6. Reinicia el servidor

## 🐳 Bonus: Ejecutar con Docker

```bash
# Construir
docker build -t auth-service .

# Ejecutar
docker run -p 3000:3000 \
  -e SUPABASE_URL="tu-url" \
  -e SUPABASE_SERVICE_KEY="tu-key" \
  -e JWT_SECRET="tu-secreto" \
  auth-service
```

## 📊 Monitorear en Supabase

Ve a **Dashboard** para ver:
- Número de usuarios
- Queries ejecutadas
- Logs en tiempo real
- Uso de almacenamiento

## ❓ Problemas comunes

**Error: "Supabase no ha sido inicializado"**
→ Verifica que `SUPABASE_URL` y `SUPABASE_SERVICE_KEY` estén en `.env`

**Error: "relation 'users' does not exist"**
→ Ejecuta el SQL del Paso 2 en Supabase SQL Editor

**Error: "Token inválido"**
→ Asegúrate de usar el `service_role` key, no el `anon` key

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [API Reference del proyecto](http://localhost:3000/api-docs)
- [Supabase Dashboard](https://app.supabase.com)

---

**¿Dudas?** Abre un issue en el repo.