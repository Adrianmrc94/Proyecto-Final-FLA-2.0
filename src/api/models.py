from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Boolean, Float, Date, ForeignKey

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    last_name: Mapped[str] = mapped_column(String(120), nullable=False)
    postal_code: Mapped[str] = mapped_column(String(10), nullable=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(128), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    favorites: Mapped[list["Favorite"]] = relationship("Favorite", back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "last_name": self.last_name,
            "postal_code": self.postal_code,
            "email": self.email,
            "is_active": self.is_active
        }


class Store(db.Model):
    __tablename__ = 'store'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    postal_code: Mapped[str] = mapped_column(String(10))
    product: Mapped[int] = mapped_column(Integer)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    favorites: Mapped[list["Favorite"]] = relationship("Favorite", back_populates="store")

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

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    image: Mapped[str] = mapped_column(String(255))
    rate: Mapped[float] = mapped_column(Float)
    category: Mapped[str] = mapped_column(String(100))
    created_at: Mapped[Date] = mapped_column(Date)
    stock: Mapped[bool] = mapped_column(Boolean, default=True)

    favorites: Mapped[list["Favorite"]] = relationship("Favorite", back_populates="product")

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

    id: Mapped[int] = mapped_column(primary_key=True)
    store_id: Mapped[int] = mapped_column(ForeignKey("store.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    product_id: Mapped[int] = mapped_column(ForeignKey("product.id"), nullable=False)
    date_ad: Mapped[Date] = mapped_column(Date)

    user: Mapped["User"] = relationship("User", back_populates="favorites")
    store: Mapped["Store"] = relationship("Store", back_populates="favorites")
    product: Mapped["Product"] = relationship("Product", back_populates="favorites")

    def serialize(self):
        return {
            "id": self.id,
            "store_id": self.store_id,
            "user_id": self.user_id,
            "product_id": self.product_id,
            "date_ad": self.date_ad
        }
