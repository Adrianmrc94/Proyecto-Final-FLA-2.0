from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    lastname = db.Column(db.String(120), nullable=False)
    postal_code = db.Column(db.String(10), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False) #password hasheada bcrypt
    is_active = db.Column(db.Boolean, nullable=False, default=True)

    favorites = db.relationship('Favoritos', backref='user', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "lastname": self.lastname,
            "postal_code": self.postal_code,
            "email": self.email,
            "is_active": self.is_active
            # Nunca poner password por seguridad
        }


class Store(db.Model):
    __tablename__ = 'store'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    postal_code = db.Column(db.String(10))
    product = db.Column(db.Integer)
    is_active = db.Column(db.Boolean, default=True)

    favorites = db.relationship('Favoritos', backref='store', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "postal_code": self.postal_code,
            "productos": self.product,
            "is_active": self.is_active
        }


class Product(db.Model):
    __tablename__ = 'product'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(255))
    rate = db.Column(db.Float)
    category = db.Column(db.String(100))
    created_at = db.Column(db.Date)
    stock = db.Column(db.Boolean, default=true)

    favorites = db.relationship('Favorit', backref='product', lazy=True)
        
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "image": self.image,
            "rate": self.rate,
            "category": self.category,
            "created_at": self.created_at,
            "stock": self.stock
        }


class Favorite(db.Model):
    __tablename__ = 'favorite'

    id = db.Column(db.Integer, primary_key=True)
    store_id = db.Column(db.Integer, db.ForeignKey('store.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    date_ad = db.Column(db.Date)

    def serialize(self):
        return {
            "id": self.id,
            "store_id": self.store_id,
            "user_id": self.user_id,
            "product_id": self.product_id,
            "date_ad": self.date_ad
        }