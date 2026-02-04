import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from src.app import app, db

with app.app_context():
    db.create_all()
    print("✅ Tablas creadas:", ', '.join(db.metadata.tables.keys()))
