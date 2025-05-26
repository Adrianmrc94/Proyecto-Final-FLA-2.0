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

    #favoritos = db.relationship('Favoritos', backref='user', lazy=True)

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
