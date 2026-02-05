import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from api.models import db, Store, Product
from flask import Flask

# Construir ruta absoluta a la base de datos
db_path = os.path.join(os.path.dirname(__file__), 'instance', 'database.db')

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    stores = Store.query.all()
    print('\n' + '='*80)
    print('PRODUCTOS POR TIENDA:')
    print('='*80)
    for s in stores:
        count = Product.query.filter_by(store_id=s.id).count()
        print(f'{s.name:<35} | CP: {s.postal_code} | Productos: {count:>6}')
    print('='*80)
    print(f'Total productos: {Product.query.count()}')
    print('='*80)
