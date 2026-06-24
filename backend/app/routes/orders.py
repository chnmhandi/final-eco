from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, Order, OrderItem, CartItem, Product
from app.schemas.schemas import OrderResponse, OrderCreate, RazorpayOrderCreate, RazorpayOrderResponse
from app.services.auth_service import get_current_user
from datetime import datetime, timedelta
import random
from typing import List
import razorpay
from app.config import settings

router = APIRouter(prefix="/orders", tags=["orders"])

razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@router.get("", response_model=List[OrderResponse])
def get_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()

@router.get("/{order_id}", response_model=OrderResponse)
def get_order_details(
    order_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
        
    # Check permission (either owner or admin)
    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view this order.")
        
    return order

@router.post("/razorpay-order", response_model=RazorpayOrderResponse)
def create_razorpay_order(
    data: RazorpayOrderCreate,
    current_user: User = Depends(get_current_user)
):
    try:
        # Convert USD to INR (1 USD = 83 INR)
        # amount is in paise
        conversion_rate = 83.0
        amount_in_paise = int(round(data.total * conversion_rate * 100))
        
        order_data = {
            "amount": amount_in_paise,
            "currency": "INR",
            "receipt": f"rcpt_{current_user.email[:20]}_{int(datetime.utcnow().timestamp())}",
            "payment_capture": 1
        }
        
        razorpay_order = razorpay_client.order.create(data=order_data)
        
        return {
            "id": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "currency": razorpay_order["currency"],
            "key_id": settings.RAZORPAY_KEY_ID
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create Razorpay order: {str(e)}"
        )

@router.post("", response_model=OrderResponse)
def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify payment signature if provided
    if order_data.razorpay_order_id or order_data.razorpay_payment_id or order_data.razorpay_signature:
        if not (order_data.razorpay_order_id and order_data.razorpay_payment_id and order_data.razorpay_signature):
            raise HTTPException(
                status_code=400,
                detail="All Razorpay fields (order_id, payment_id, signature) must be provided."
            )
        try:
            params_dict = {
                'razorpay_order_id': order_data.razorpay_order_id,
                'razorpay_payment_id': order_data.razorpay_payment_id,
                'razorpay_signature': order_data.razorpay_signature
            }
            razorpay_client.utility.verify_payment_signature(params_dict)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Payment signature verification failed: {str(e)}"
            )

    # Fetch user's cart items
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cannot place order with an empty cart.")

    # Verify stock and calculate subtotal
    subtotal = 0.0
    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=400, detail=f"Product {item.product_id} no longer exists.")
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.name}. Available: {product.stock}"
            )
        subtotal += float(product.price) * item.quantity

    # Generate custom order parameters
    order_id = f"AUR-{random.randint(10000, 99000)}"
    tracking_number = None
    
    date_now = datetime.utcnow()
    # Format date string: "June 24, 2026"
    date_str = date_now.strftime("%B %d, %Y")
    
    # Calculate estimated delivery date
    delivery_days = 2 if order_data.shipping > 15 else 4
    est_delivery_date = date_now + timedelta(days=delivery_days)
    est_delivery_str = est_delivery_date.strftime("%B %d, %Y")

    # Create the Order
    new_order = Order(
        id=order_id,
        user_id=current_user.id,
        date=date_str,
        subtotal=order_data.subtotal,
        shipping=order_data.shipping,
        tax=order_data.tax,
        total=order_data.total,
        shipping_address=order_data.shipping_address,
        delivery_method=order_data.delivery_method,
        status="Placed",
        tracking_number=tracking_number,
        estimated_delivery=est_delivery_str,
        razorpay_order_id=order_data.razorpay_order_id,
        razorpay_payment_id=order_data.razorpay_payment_id,
        razorpay_signature=order_data.razorpay_signature,
        created_at=date_now
    )
    db.add(new_order)
    db.flush()

    # Move cart items to order items and update stock
    order_items_details = []
    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        
        # Deduct stock
        product.stock -= item.quantity
        
        # Create OrderItem
        order_item = OrderItem(
            order_id=order_id,
            product_id=item.product_id,
            quantity=item.quantity,
            selected_color=item.selected_color,
            selected_size=item.selected_size,
            price=product.price
        )
        db.add(order_item)
        order_items_details.append({
            "name": product.name if product else "Premium Product",
            "color": item.selected_color,
            "size": item.selected_size,
            "qty": item.quantity,
            "price": float(product.price) if product else 0.0
        })

    # Clear user's cart in database
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()

    db.commit()
    db.refresh(new_order)

    if new_order.razorpay_payment_id:
        try:
            from app.routes.invoices import get_or_create_invoice
            get_or_create_invoice(new_order.id, db)
        except Exception as invoice_err:
            print(f"[INVOICE] Error generating invoice on successful payment: {invoice_err}")

    return new_order

@router.get("/{order_id}/track")
def track_order_public(order_id: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    
    # Map items to minimal list with product details for thumbnails
    items_data = []
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        items_data.append({
            "id": item.id,
            "product_id": item.product_id,
            "name": product.name if product else "Premium Product",
            "images": product.images if product else ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"],
            "quantity": item.quantity,
            "selected_color": item.selected_color,
            "selected_size": item.selected_size,
            "price": float(item.price)
        })
        
    return {
        "id": order.id,
        "date": order.date,
        "status": order.status,
        "shipping_status": order.shipping_status or order.status,
        "tracking_number": order.tracking_number,
        "courier_name": order.courier_name,
        "estimated_delivery": order.estimated_delivery,
        "delivery_method": order.delivery_method,
        "items": items_data
    }
