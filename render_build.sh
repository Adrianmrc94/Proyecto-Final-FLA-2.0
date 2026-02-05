#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

pip install -r requirements.txt

# Run migrations
cd src
flask db upgrade || echo "Migration failed, creating tables manually..."
python -c "from app import app, db; app.app_context().push(); db.create_all(); print('✅ Tables created')"

# Import products automatically on deploy
echo "📦 Importando productos de Mercadona..."
flask import-mercadona -p 28020 || echo "⚠️ Mercadona import failed, continuing..."

echo "📦 Importando productos de DIA..."
flask import-dia-complete -p 28020 || echo "⚠️ DIA import failed, continuing..."

echo "✅ Build script completado"
