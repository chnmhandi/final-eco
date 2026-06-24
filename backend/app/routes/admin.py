from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, Order, Product, Category
from app.schemas.schemas import (
    OrderResponse, OrderStatusUpdate, ProductResponse, ProductCreate, ProductUpdate,
    CategoryResponse, UserLogin, Token
)
from app.services import auth_service
from app.services.auth_service import get_current_admin
from app.utils.cloudinary_utils import upload_image_to_cloudinary
from typing import List

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/login", response_model=Token)
def admin_login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not auth_service.verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
    
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not authorized as an administrator."
        )

    # Generate token
    token_data = {"sub": str(user.id), "email": user.email, "role": user.role}
    access_token = auth_service.create_access_token(data=token_data)
    
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

# Manage Orders
@router.get("/orders", response_model=List[OrderResponse])
def get_all_orders(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(Order).order_by(Order.created_at.desc()).all()

@router.put("/orders/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: str,
    status_data: OrderStatusUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
        
    order.status = status_data.status
    db.commit()
    db.refresh(order)
    
    try:
        if order.user and order.user.email:
            if order.status == "Shipped":
                from app.services.email_service import send_admin_order_shipped_email
                send_admin_order_shipped_email(order, order.user.email)
            elif order.status == "Delivered":
                from app.services.email_service import send_order_delivered_email
                send_order_delivered_email(order, order.user.email)
    except Exception as e:
        print(f"[EMAIL] Error sending admin order status email: {e}")
        
    return order

# Manage Products
@router.post("/products", response_model=ProductResponse)
def create_product(
    product_data: ProductCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(Product).filter(Product.id == product_data.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product ID already exists.")

    new_product = Product(
        id=product_data.id,
        name=product_data.name,
        category=product_data.category,
        category_slug=product_data.category_slug,
        price=product_data.price,
        original_price=product_data.original_price,
        rating=product_data.rating,
        review_count=product_data.review_count,
        images=product_data.images,
        description=product_data.description,
        long_description=product_data.long_description,
        colors=[c.dict() for c in product_data.colors],
        sizes=product_data.sizes,
        specs=[s.dict() for s in product_data.specs],
        stock=product_data.stock,
        is_featured=product_data.is_featured,
        is_trending=product_data.is_trending,
        is_bestseller=product_data.is_bestseller,
        tag=product_data.tag
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.put("/products/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str,
    product_data: ProductUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    for key, value in product_data.dict(exclude_unset=True).items():
        if key == "colors" and value is not None:
            setattr(product, key, [c.dict() for c in value])
        elif key == "specs" and value is not None:
            setattr(product, key, [s.dict() for s in value])
        else:
            setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product

@router.delete("/products/{product_id}")
def delete_product(
    product_id: str,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
        
    db.delete(product)
    db.commit()
    return {"message": f"Product {product_id} deleted successfully."}

# Cloudinary Upload
@router.post("/upload")
def upload_file(
    file: UploadFile = File(...),
    admin: User = Depends(get_current_admin)
):
    try:
        url = upload_image_to_cloudinary(file.file)
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {e}")
