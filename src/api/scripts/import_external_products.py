import os
import sys
import requests
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from api.models import db, Product, Store


def fetch_dummyjson_products():
    url = 'https://dummyjson.com/products?limit=0'
    try:
        resp = requests.get(url)
        if resp.ok:
            data = resp.json()
            return data.get('products', [])
    except Exception as e:
        print("Error dummyjson:", e)
    return []

def fetch_fakestore_products():
    url = 'https://fakestoreapi.com/products'
    try:
        resp = requests.get(url)
        if resp.ok:
            data = resp.json()
            # Esta API devuelve directamente un array de productos
            return data if isinstance(data, list) else []
    except Exception as e:
        print("Error fakestore:", e)
    return []

def import_products(app):
    with app.app_context():
        # DummyJSON
        for p in fetch_dummyjson_products():
            desc = p.get("description", "")
            if desc and len(desc) > 500:
                desc = desc[:500]
            name = p.get("title", "")
            if name and len(name) > 120:
                name = name[:120]

            store_name = "DummyJSON Store"
            store = Store.query.filter_by(name=store_name).first()
            if not store:
                store = Store(name=store_name, postal_code="Unknown")
                db.session.add(store)
                db.session.flush()

            db.session.refresh(store)  # Esto asegura que el objeto esté actualizado

            if not Product.query.filter_by(external_id=f"dummyjson-{p['id']}").first():
                product = Product(
                    external_id=f"dummyjson-{p['id']}",
                    name=name,
                    price=p.get("price"),
                    description=desc,
                    category=p.get("category"),
                    image=p.get("images", [""])[0] if p.get("images") else "",
                    rate=p.get("rating", 0),
                    stock=p.get("stock", 0),
                    created_at=datetime.now(),
                    source="dummyjson",
                    store_id=store.id
                )
                print("Asignando store_id a producto dummyjson:", store.id)
                db.session.add(product)

        # FakeStore
        for p in fetch_fakestore_products():
            if isinstance(p, str):
                print(f"Unexpected string: {p}")
                continue

            desc = p.get("description", "")
            if desc and len(desc) > 500:
                desc = desc[:500]
            name = p.get("title", "")
            if name and len(name) > 120:
                name = name[:120]

            store_name = "FakeStore API"
            store = Store.query.filter_by(name=store_name).first()
            if not store:
                store = Store(name=store_name, postal_code="Unknown")
                db.session.add(store)
                db.session.flush()

            if not Product.query.filter_by(external_id=f"fakestore-{p['id']}").first():
                # La API fakestoreapi.com devuelve rating como objeto {rate, count}
                rating_data = p.get("rating", {})
                rate_value = rating_data.get("rate", 0) if isinstance(rating_data, dict) else 0
                
                product = Product(
                    external_id=f"fakestore-{p['id']}",
                    name=name,
                    price=p.get("price"),
                    description=desc,
                    category=p.get("category"),
                    image=p.get("image"),
                    rate=rate_value,
                    stock=100,  # FakeStoreAPI no provee stock, usamos valor por defecto
                    created_at=datetime.now(),
                    source="fakestore",
                    store_id=store.id
                )
                db.session.add(product)

        db.session.commit()
        print("Importación completada.")

if __name__ == "__main__":
    import_products()