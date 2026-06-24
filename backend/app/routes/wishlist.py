from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, WishlistItem, Product
from app.schemas.schemas import WishlistItemResponse
from app.services.auth_service import get_current_user
from typing import List

router = APIRouter(prefix="/wishlist", tags=["wishlist"])

@router.get("", response_model=List[WishlistItemResponse])
def get_wishlist(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(WishlistItem).filter(WishlistItem.user_id == current_user.id).all()

@router.post("/{product_id}", response_model=WishlistItemResponse)
def add_to_wishlist(
    product_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    # Check if already in wishlist
    existing = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == product_id
    ).first()
    
    if existing:
        return existing

    # Add to wishlist
    item = WishlistItem(user_id=current_user.id, product_id=product_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{product_id}")
def remove_from_wishlist(
    product_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == product_id
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not in wishlist.")

    db.delete(item)
    db.commit()
    return {"message": "Product removed from wishlist successfully."}
