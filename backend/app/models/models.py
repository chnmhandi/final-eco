from sqlalchemy import Column, String, Integer, Numeric, Boolean, DateTime, ForeignKey, ARRAY, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="user")
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    addresses = relationship("Address", back_populates="user", cascade="all, delete-orphan")
    cart_items = relationship("CartItem", back_populates="user", cascade="all, delete-orphan")
    wishlist_items = relationship("WishlistItem", back_populates="user", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    avatar_url = Column(String(500), default="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80")
    member_since = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")


class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    full_name = Column(String(255), nullable=False)
    street = Column(String, nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    zip_code = Column(String(20), nullable=False)
    country = Column(String(100), nullable=False)
    phone = Column(String(50), nullable=False)
    is_default = Column(Boolean, default=False)

    user = relationship("User", back_populates="addresses")


class Category(Base):
    __tablename__ = "categories"

    id = Column(String(100), primary_key=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(String, nullable=True)
    image = Column(String, nullable=True)
    item_count = Column(Integer, default=0)

    products = relationship("Product", back_populates="category_rel")


class Product(Base):
    __tablename__ = "products"

    id = Column(String(100), primary_key=True)
    name = Column(String(255), nullable=False)
    category = Column(String(255), nullable=False)  # string name of category for frontend compatibility
    category_slug = Column(String(255), ForeignKey("categories.slug", ondelete="SET NULL"), nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    original_price = Column(Numeric(10, 2), nullable=True)
    rating = Column(Numeric(3, 2), default=0.0)
    review_count = Column(Integer, default=0)
    images = Column(ARRAY(String), nullable=False)
    description = Column(String, nullable=False)
    long_description = Column(String, nullable=False)
    colors = Column(JSONB, nullable=False, default=[]) # list of color dicts: {name, hex}
    sizes = Column(ARRAY(String), default=[])
    specs = Column(JSONB, nullable=False, default=[])  # list of specs dicts: {label, value}
    stock = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    is_trending = Column(Boolean, default=False)
    is_bestseller = Column(Boolean, default=False)
    tag = Column(String(100), nullable=True)
    sku = Column(String(100), nullable=True)
    status = Column(String(50), default="active")
    featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    category_rel = relationship("Category", back_populates="products")
    cart_items = relationship("CartItem", back_populates="product", cascade="all, delete-orphan")
    wishlist_items = relationship("WishlistItem", back_populates="product", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="product")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")
    inventory = relationship("Inventory", back_populates="product", uselist=False, cascade="all, delete-orphan")


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(String(100), ForeignKey("products.id", ondelete="CASCADE"), unique=True, nullable=False)
    stock = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    product = relationship("Product", back_populates="inventory")


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(String(255), primary_key=True) # Composite key e.g. user_id_prod-1_Matte-Black_M
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(String(100), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Integer, nullable=False)
    selected_color = Column(String(100), nullable=False)
    selected_size = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    user = relationship("User", back_populates="cart_items")
    product = relationship("Product", back_populates="cart_items")


class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(String(100), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    user = relationship("User", back_populates="wishlist_items")
    product = relationship("Product", back_populates="wishlist_items")


class Order(Base):
    __tablename__ = "orders"

    id = Column(String(100), primary_key=True) # AUR-XXXXX
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    date = Column(String(100), nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)
    shipping = Column(Numeric(10, 2), nullable=False)
    tax = Column(Numeric(10, 2), nullable=False)
    total = Column(Numeric(10, 2), nullable=False)
    shipping_address = Column(JSONB, nullable=False) # nested dict
    delivery_method = Column(String(255), nullable=False)
    status = Column(String(50), default="Placed") # Placed, Processing, Shipped, Delivered
    tracking_number = Column(String(100), nullable=True)
    estimated_delivery = Column(String(100), nullable=True)
    razorpay_order_id = Column(String(255), nullable=True)
    razorpay_payment_id = Column(String(255), nullable=True)
    razorpay_signature = Column(String(255), nullable=True)
    order_status = Column(String(50), default="Placed")
    payment_status = Column(String(50), default="Pending")
    courier_name = Column(String(100), nullable=True)
    admin_notes = Column(String, nullable=True)
    shipping_status = Column(String(50), default="Placed")
    shipped_at = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    shipment = relationship("Shipment", back_populates="order", uselist=False, cascade="all, delete-orphan")
    invoice = relationship("Invoice", back_populates="order", uselist=False, cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(100), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(String(100), ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    quantity = Column(Integer, nullable=False)
    selected_color = Column(String(100), nullable=False)
    selected_size = Column(String(50), nullable=True)
    price = Column(Numeric(10, 2), nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(String(100), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    user_name = Column(String(255), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(String, nullable=True)
    helpful_count = Column(Integer, default=0)
    date = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    product = relationship("Product", back_populates="reviews")


class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(100), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    courier = Column(String(100), nullable=False)
    tracking_number = Column(String(100), unique=True, nullable=False)
    status = Column(String(50), default="Placed")
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    order = relationship("Order", back_populates="shipment")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    type = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(100), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    invoice_number = Column(String(100), unique=True, nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)
    tax = Column(Numeric(10, 2), nullable=False)
    total = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    order = relationship("Order", back_populates="invoice")
