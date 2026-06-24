from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.database.session import get_db
from app.models.models import Product, Review
from app.schemas.schemas import ProductResponse
from typing import List, Optional

router = APIRouter(prefix="/products", tags=["products"])

@router.get("", response_model=List[ProductResponse])
def get_products(
    category: Optional[str] = None,
    q: Optional[str] = None,
    sort: Optional[str] = None, # "price-asc", "price-desc", "rating", "newest"
    is_featured: Optional[bool] = None,
    is_trending: Optional[bool] = None,
    is_bestseller: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product)

    # 1. Filters
    if category and category.lower() != "all":
        query = query.filter(Product.category.ilike(category))
        
    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)
        
    if is_trending is not None:
        query = query.filter(Product.is_trending == is_trending)
        
    if is_bestseller is not None:
        query = query.filter(Product.is_bestseller == is_bestseller)

    # 2. Search query
    if q:
        search_filter = or_(
            Product.name.ilike(f"%{q}%"),
            Product.description.ilike(f"%{q}%"),
            Product.long_description.ilike(f"%{q}%"),
            Product.category.ilike(f"%{q}%"),
            Product.tag.ilike(f"%{q}%")
        )
        query = query.filter(search_filter)

    # 3. Sorting
    if sort == "price-asc":
        query = query.order_by(Product.price.asc())
    elif sort == "price-desc":
        query = query.order_by(Product.price.desc())
    elif sort == "rating":
        query = query.order_by(Product.rating.desc())
    elif sort == "newest":
        query = query.order_by(Product.created_at.desc())
    else:
        # Default order by ID
        query = query.order_by(Product.id.asc())

    return query.all()

@router.get("/{product_id}", response_model=ProductResponse)
def get_product_by_id(product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found."
        )
    return product
