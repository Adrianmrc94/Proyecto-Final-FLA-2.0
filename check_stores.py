from src.api.models import db, Store
from src.app import create_app

app = create_app()
with app.app_context():
    stores = Store.query.all()
    print('\nTIENDAS EN LA BASE DE DATOS:')
    print('=' * 60)
    for s in stores:
        print(f'  ID: {s.id} | {s.name} | CP: {s.postal_code} | Active: {s.is_active}')
    print('=' * 60)
    print(f'Total: {len(stores)} tiendas\n')
