#!/bin/sh
set -e

echo "🔍 Verificando conexión a la base de datos..."

# Esperar a que la base de datos esté lista
until npx prisma db pull 2>/dev/null; do
  echo "⏳ Esperando base de datos..."
  sleep 2
done

echo "✅ Base de datos lista"

# Ejecutar migraciones
echo "🔄 Ejecutando migraciones..."
npx prisma migrate deploy

# Ejecutar seed si es la primera vez
echo "🌱 Verificando si necesita seed..."
if ! npx prisma db seed --preview-feature 2>/dev/null; then
  echo "⚠️  Seed no necesario o ya ejecutado"
fi

echo "✅ Inicialización completada"