from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, CartItem, Product
from app.schemas.schemas import CartItemResponse, CartItemCreate, CartItemUpdate
from app.services.auth_service import get_current_user
from typing import List

router = APIRouter(prefix="/cart", tags=["cart"])

@router.get("", response_model=List[CartItemResponse])
def get_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(CartItem).filter(CartItem.user_id == current_user.id).all()

@router.post("", response_model=CartItemResponse)
def add_to_cart(
    item_data: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == item_data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    # Create composite key format
    color_slug = item_data.selected_color.replace(" ", "-")
    size_slug = item_data.selected_size if item_data.selected_size else "NoSize"
    cart_item_id = f"{current_user.id}_{item_data.product_id}_{color_slug}_{size_slug}"

    # Check if item already exists in cart
    existing_item = db.query(CartItem).filter(CartItem.id == cart_item_id).first()
    if existing_item:
        existing_item.quantity += item_data.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item

    # Add new item
    new_item = CartItem(
        id=cart_item_id,
        user_id=current_user.id,
        product_id=item_data.product_id,
        quantity=item_data.quantity,
        selected_color=item_data.selected_color,
        selected_size=item_data.selected_size
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/{cart_item_id}", response_model=CartItemResponse)
def update_cart_item(
    cart_item_id: str,
    item_data: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart_item = db.query(CartItem).filter(
        CartItem.id == cart_item_id,
        CartItem.user_id == current_user.id
    ).first()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found.")

    if item_data.quantity <= 0:
        db.delete(cart_item)
        db.commit()
        return cart_item # will be empty or soft response

    cart_item.quantity = item_data.quantity
    db.commit()
    db.refresh(cart_item)
    return cart_item

@router.delete("/{cart_item_id}")
def remove_from_cart(
    cart_item_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart_item = db.query(CartItem).filter(
        CartItem.id == cart_item_id,
        CartItem.user_id == current_user.id
    ).first()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found.")

    db.delete(cart_item)
    db.commit()
    return {"message": "Item removed from cart successfully."}

@router.delete("/clear/all")
def clear_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Cart cleared successfully."}
