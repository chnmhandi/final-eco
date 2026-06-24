from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, Order, Shipment, Notification
from app.schemas.schemas import ShipmentResponse, ShipmentCreate, ShipmentStatusUpdate
from app.services.auth_service import get_current_user, get_current_admin
from datetime import datetime
import random
from typing import List

router = APIRouter(prefix="/shipping", tags=["shipping"])

@router.get("/orders/{order_id}/shipment", response_model=ShipmentResponse)
def get_order_shipment(
    order_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    
    # Check permissions: owner or admin
    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view this shipment.")
    
    shipment = db.query(Shipment).filter(Shipment.order_id == order_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment details not found for this order.")
    
    return shipment

@router.post("/orders/{order_id}/shipment", response_model=ShipmentResponse)
def create_order_shipment(
    order_id: str,
    shipment_data: ShipmentCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    
    existing_shipment = db.query(Shipment).filter(Shipment.order_id == order_id).first()
    if existing_shipment:
        raise HTTPException(status_code=400, detail="Shipment already exists for this order.")
    
    tracking_number = shipment_data.tracking_number
    if not tracking_number:
        tracking_number = f"TRK-{random.randint(100000000, 999999999)}"
        
    new_shipment = Shipment(
        order_id=order_id,
        courier=shipment_data.courier,
        tracking_number=tracking_number,
        status="Shipped"
    )
    
    db.add(new_shipment)
    
    # Update order details
    order.tracking_number = tracking_number
    order.courier_name = shipment_data.courier
    order.shipping_status = "Shipped"
    order.shipped_at = datetime.utcnow()
    order.status = "Shipped"
    
    # Create notification for user
    if order.user_id:
        notification = Notification(
            user_id=order.user_id,
            type="Order_Shipped",
            title="Your Order Has Been Shipped!",
            message=f"Order {order_id} has been handed over to {shipment_data.courier}. Tracking Number: {tracking_number}."
        )
        db.add(notification)
        
    db.commit()
    db.refresh(new_shipment)
    
    try:
        if order.user and order.user.email:
            from app.services.email_service import send_shipment_created_email, send_order_shipped_email
            send_shipment_created_email(new_shipment, order, order.user.email)
            send_order_shipped_email(new_shipment, order, order.user.email)
    except Exception as e:
        print(f"[EMAIL] Error sending shipment/shipping emails: {e}")
        
    return new_shipment

@router.put("/shipments/{tracking_number}/status", response_model=ShipmentResponse)
def update_shipment_status(
    tracking_number: str,
    status_data: ShipmentStatusUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    shipment = db.query(Shipment).filter(Shipment.tracking_number == tracking_number).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found.")
        
    new_status = status_data.status
    shipment.status = new_status
    
    # Update associated order
    order = db.query(Order).filter(Order.id == shipment.order_id).first()
    if order:
        order.shipping_status = new_status
        if new_status == "Shipped":
            order.shipped_at = datetime.utcnow()
            order.status = "Shipped"
        elif new_status == "Delivered":
            order.delivered_at = datetime.utcnow()
            order.status = "Delivered"
            
        # Create notification for user
        if order.user_id:
            title = "Order Shipped" if new_status == "Shipped" else "Order Delivered"
            msg = (
                f"Your order {order.id} is now on its way via {shipment.courier}."
                if new_status == "Shipped"
                else f"Your order {order.id} has been successfully delivered. Enjoy your AURA creations!"
            )
            
            notification = Notification(
                user_id=order.user_id,
                type=f"Order_{new_status}",
                title=title,
                message=msg
            )
            db.add(notification)
            
    db.commit()
    db.refresh(shipment)
    
    try:
        if order and order.user and order.user.email:
            if new_status == "Shipped":
                from app.services.email_service import send_order_shipped_email
                send_order_shipped_email(shipment, order, order.user.email)
            elif new_status == "Delivered":
                from app.services.email_service import send_order_delivered_email
                send_order_delivered_email(order, order.user.email)
    except Exception as e:
        print(f"[EMAIL] Error sending updated shipping status email: {e}")
        
    return shipment
