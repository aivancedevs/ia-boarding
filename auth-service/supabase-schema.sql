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

-- Crear índice para búsquedas rápidas por email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Crear índice para usuarios de Google OAuth
CREATE INDEX IF NOT EXISTS idx_users_oauth_google ON users(oauth_google) WHERE oauth_google = TRUE;

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: Solo el service role puede hacer operaciones
CREATE POLICY "Service role can do everything" ON users
  FOR ALL
  USING (auth.role() = 'service_role');

-- Comentarios para documentación
COMMENT ON TABLE users IS 'Tabla de usuarios del sistema de autenticación';
COMMENT ON COLUMN users.id IS 'ID único del usuario (UUID)';
COMMENT ON COLUMN users.email IS 'Email único del usuario';
COMMENT ON COLUMN users.password IS 'Contraseña hasheada (null para OAuth)';
COMMENT ON COLUMN users.name IS 'Nombre completo del usuario';
COMMENT ON COLUMN users.oauth_google IS 'Indica si el usuario se registró con Google OAuth';
COMMENT ON COLUMN users.created_at IS 'Fecha de creación del usuario';
COMMENT ON COLUMN users.updated_at IS 'Fecha de última actualización';