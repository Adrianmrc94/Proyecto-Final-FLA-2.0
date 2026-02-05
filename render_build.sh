#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

pip install -r requirements.txt

# Run migrations from src directory
cd src && python -c "from api.extensions import db; from app import app; from flask_migrate import upgrade; app.app_context().push(); upgrade()" || echo "Skipping migrations"
