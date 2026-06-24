from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from decimal import Decimal
import uuid

# Helper schemas for Product
class ColorSchema(BaseModel):
    name: str
    hex: str

class SpecSchema(BaseModel):
    label: str
    value: str

class ReviewSchema(BaseModel):
    id: Optional[int] = None
    userName: str = Field(..., alias="user_name")
    rating: int
    date: str
    comment: str
    helpfulCount: int = Field(0, alias="helpful_count")

    class Config:
        populate_by_name = True
        from_attributes = True

# Product Schemas
class ProductBase(BaseModel):
    id: str
    name: str
    category: str
    category_slug: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    rating: float
    review_count: int
    images: List[str]
    description: str
    long_description: str
    colors: List[ColorSchema]
    sizes: List[str] = []
    specs: List[SpecSchema]
    stock: int
    is_featured: bool = False
    is_trending: bool = False
    is_bestseller: bool = False
    tag: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    category_slug: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    images: Optional[List[str]] = None
    description: Optional[str] = None
    long_description: Optional[str] = None
    colors: Optional[List[ColorSchema]] = None
    sizes: Optional[List[str]] = None
    specs: Optional[List[SpecSchema]] = None
    stock: Optional[int] = None
    is_featured: Optional[bool] = None
    is_trending: Optional[bool] = None
    is_bestseller: Optional[bool] = None
    tag: Optional[str] = None

class ProductResponse(ProductBase):
    reviews: List[ReviewSchema] = []

    class Config:
        from_attributes = True

# Category Schemas
class CategoryBase(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    image: Optional[str] = None
    item_count: int = 0

class CategoryResponse(CategoryBase):
    class Config:
        from_attributes = True

# Auth & User Schemas
class UserSignUp(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None

class ProfileResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    member_since: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None

# Cart Schemas
class CartItemCreate(BaseModel):
    product_id: str
    quantity: int
    selected_color: str
    selected_size: Optional[str] = None

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemResponse(BaseModel):
    id: str
    product_id: str
    product: ProductBase
    quantity: int
    selected_color: str
    selected_size: Optional[str] = None

    class Config:
        from_attributes = True

# Wishlist Schemas
class WishlistItemResponse(BaseModel):
    id: int
    product_id: str
    product: ProductBase

    class Config:
        from_attributes = True

# Address Schemas
class AddressBase(BaseModel):
    full_name: str
    street: str
    city: str
    state: str
    zip_code: str
    country: str
    phone: str
    is_default: bool = False

class AddressCreate(AddressBase):
    pass

class AddressResponse(AddressBase):
    id: int
    user_id: uuid.UUID

    class Config:
        from_attributes = True

# Order Schemas
class OrderItemResponse(BaseModel):
    id: int
    product_id: str
    product: Optional[ProductBase] = None
    quantity: int
    selected_color: str
    selected_size: Optional[str] = None
    price: float

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    subtotal: float
    shipping: float
    tax: float
    total: float
    shipping_address: Dict[str, Any]
    delivery_method: str
    estimated_delivery: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    razorpay_signature: Optional[str] = None

class OrderResponse(BaseModel):
    id: str
    user_id: Optional[uuid.UUID] = None
    date: str
    subtotal: float
    shipping: float
    tax: float
    total: float
    shipping_address: Dict[str, Any]
    delivery_method: str
    status: str
    tracking_number: Optional[str] = None
    estimated_delivery: Optional[str] = None
    items: List[OrderItemResponse] = []
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    razorpay_signature: Optional[str] = None

    class Config:
        from_attributes = True
        
class OrderStatusUpdate(BaseModel):
    status: str

class RazorpayOrderCreate(BaseModel):
    total: float

class RazorpayOrderResponse(BaseModel):
    id: str
    amount: int
    currency: str
    key_id: str

# Shipment Schemas
class ShipmentBase(BaseModel):
    order_id: str
    courier: str
    tracking_number: str
    status: str

class ShipmentCreate(BaseModel):
    courier: str
    tracking_number: Optional[str] = None

class ShipmentResponse(ShipmentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ShipmentStatusUpdate(BaseModel):
    status: str

# Notification Schemas
class NotificationBase(BaseModel):
    type: str
    title: str
    message: str
    is_read: bool = False

class NotificationCreate(NotificationBase):
    user_id: Optional[uuid.UUID] = None

class NotificationResponse(NotificationBase):
    id: int
    user_id: Optional[uuid.UUID] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Invoice Schemas
class InvoiceBase(BaseModel):
    order_id: str
    invoice_number: str
    subtotal: float
    tax: float
    total: float

class InvoiceResponse(InvoiceBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

