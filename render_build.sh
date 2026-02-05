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
