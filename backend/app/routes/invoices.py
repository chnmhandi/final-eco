from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, Order, Invoice, OrderItem, Product
from app.schemas.schemas import InvoiceResponse
from app.services.auth_service import get_current_user
from datetime import datetime
import random

router = APIRouter(prefix="/invoices", tags=["invoices"])

def get_or_create_invoice(order_id: str, db: Session) -> Invoice:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
        
    invoice = db.query(Invoice).filter(Invoice.order_id == order_id).first()
    if not invoice:
        # Generate new invoice
        invoice_number = f"INV-{datetime.utcnow().strftime('%Y%m%d')}-{random.randint(1000, 9999)}"
        invoice = Invoice(
            order_id=order_id,
            invoice_number=invoice_number,
            subtotal=order.subtotal,
            tax=order.tax,
            total=order.total
        )
        db.add(invoice)
        db.commit()
        db.refresh(invoice)
        
        try:
            if order.user and order.user.email:
                from app.services.email_service import send_invoice_generated_email
                send_invoice_generated_email(invoice, order, order.user.email)
        except Exception as e:
            print(f"[EMAIL] Error sending invoice generated email: {e}")
            
    return invoice

@router.get("/orders/{order_id}/invoice", response_model=InvoiceResponse)
def get_order_invoice(
    order_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
        
    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view this invoice.")
        
    return get_or_create_invoice(order_id, db)

@router.get("/orders/{order_id}/invoice/html", response_class=HTMLResponse)
def get_order_invoice_html(
    order_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
        
    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view this invoice.")
        
    invoice = get_or_create_invoice(order_id, db)
    
    # Render items HTML rows
    items_rows = ""
    # Explicitly query order items with product details
    items = db.query(OrderItem).filter(OrderItem.order_id == order_id).all()
    
    for item in items:
        prod = db.query(Product).filter(Product.id == item.product_id).first()
        prod_name = prod.name if prod else "Premium Design Item"
        size_str = f" / {item.selected_size}" if item.selected_size else ""
        item_desc = f"{item.selected_color}{size_str}"
        line_total = float(item.price) * item.quantity
        
        items_rows += f"""
        <tr class="border-b border-slate-100 text-slate-700 text-xs">
            <td class="py-4 font-medium text-slate-900">{prod_name}<br><span class="text-[10px] text-slate-400 font-normal">{item_desc}</span></td>
            <td class="py-4 text-center">{item.quantity}</td>
            <td class="py-4 text-right">${float(item.price):.2f}</td>
            <td class="py-4 text-right font-semibold text-slate-900">${line_total:.2f}</td>
        </tr>
        """
        
    shipping_addr = order.shipping_address or {}
    fullName = shipping_addr.get("fullName", shipping_addr.get("full_name", "Valued Customer"))
    street = shipping_addr.get("street", "")
    city = shipping_addr.get("city", "")
    state = shipping_addr.get("state", "")
    zipCode = shipping_addr.get("zipCode", shipping_addr.get("zip_code", ""))
    country = shipping_addr.get("country", "")
    phone = shipping_addr.get("phone", "")

    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice {invoice.invoice_number} | AURA</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
        <style>
            body {{
                font-family: 'Inter', sans-serif;
                background-color: #f8fafc;
                margin: 0;
                padding: 40px 20px;
                -webkit-print-color-adjust: exact;
            }}
            .invoice-card {{
                max-width: 800px;
                margin: 0 auto;
                background: #ffffff;
                border: 1px solid #f1f5f9;
                border-radius: 24px;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
                overflow: hidden;
            }}
            .header-accent {{
                height: 6px;
                background: linear-gradient(90deg, #1e293b 0%, #d97706 100%);
            }}
            .brand-title {{
                font-family: 'Playfair Display', serif;
                font-size: 2.25rem;
                font-weight: 700;
                letter-spacing: 0.1em;
                color: #0f172a;
            }}
            .invoice-label {{
                font-size: 0.75rem;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.15em;
                color: #94a3b8;
            }}
            .invoice-value {{
                font-size: 0.875rem;
                font-weight: 700;
                color: #0f172a;
                margin-top: 4px;
            }}
            .border-slate-100 {{
                border-color: #f1f5f9;
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
            }}
            th {{
                font-size: 0.65rem;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.15em;
                color: #64748b;
                border-bottom: 2px solid #f1f5f9;
            }}
            .btn-print {{
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background-color: #0f172a;
                color: #ffffff;
                font-size: 0.75rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                padding: 10px 20px;
                border-radius: 9999px;
                border: none;
                cursor: pointer;
                transition: background-color 0.2s;
                margin-bottom: 20px;
                text-decoration: none;
            }}
            .btn-print:hover {{
                background-color: #1e293b;
            }}
            .print-container {{
                max-width: 800px;
                margin: 0 auto;
                text-align: right;
            }}
            @media print {{
                body {{
                    background-color: #ffffff;
                    padding: 0;
                }}
                .invoice-card {{
                    border: none;
                    box-shadow: none;
                    border-radius: 0;
                }}
                .btn-print {{
                    display: none;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="print-container">
            <button onclick="window.print()" class="btn-print">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                Print Receipt
            </button>
        </div>
        <div class="invoice-card">
            <div class="header-accent"></div>
            <div style="padding: 40px;">
                <!-- Header Section -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
                    <div>
                        <div class="brand-title">AURA</div>
                        <div style="font-size: 0.75rem; color: #64748b; font-weight: 500; margin-top: 4px;">
                            Premium E-Commerce Platform
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; color: #0f172a;">RECEIPT</div>
                        <div style="font-size: 0.75rem; font-weight: 600; color: #d97706; margin-top: 4px; letter-spacing: 0.05em;">{invoice.invoice_number}</div>
                    </div>
                </div>

                <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 24px; margin-bottom: 24px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
                    <div>
                        <div class="invoice-label">Invoice Date</div>
                        <div class="invoice-value">{invoice.created_at.strftime('%B %d, %Y')}</div>
                    </div>
                    <div>
                        <div class="invoice-label">Order ID</div>
                        <div class="invoice-value font-mono" style="letter-spacing: 0.05em;">{order_id}</div>
                    </div>
                    <div>
                        <div class="invoice-label">Payment Method</div>
                        <div class="invoice-value">Razorpay Secure</div>
                    </div>
                    <div>
                        <div class="invoice-label">Fulfillment</div>
                        <div class="invoice-value">{order.delivery_method}</div>
                    </div>
                </div>

                <!-- Customer Details -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;">
                    <div>
                        <div class="invoice-label" style="margin-bottom: 10px;">Billed To</div>
                        <div style="font-size: 0.825rem; color: #475569; line-height: 1.6; font-weight: 500;">
                            <strong style="color: #0f172a; font-size: 0.875rem;">{fullName}</strong><br>
                            {street}<br>
                            {city}, {state} {zipCode}<br>
                            {country}<br>
                            <span style="color: #94a3b8; font-size: 0.75rem;">Phone: {phone}</span>
                        </div>
                    </div>
                    <div>
                        <div class="invoice-label" style="margin-bottom: 10px;">Merchant Details</div>
                        <div style="font-size: 0.825rem; color: #475569; line-height: 1.6; font-weight: 500;">
                            <strong style="color: #0f172a; font-size: 0.875rem;">AURA E-Commerce Ltd.</strong><br>
                            100 Luxury Boulevard, Suite 500<br>
                            San Francisco, CA 94107<br>
                            United States<br>
                            <span style="color: #94a3b8; font-size: 0.75rem;">Support: support@aura.design</span>
                        </div>
                    </div>
                </div>

                <!-- Line Items Table -->
                <table style="margin-bottom: 40px;">
                    <thead>
                        <tr>
                            <th style="text-align: left; py-3">Description</th>
                            <th style="text-align: center; py-3; width: 80px;">Qty</th>
                            <th style="text-align: right; py-3; width: 120px;">Unit Price</th>
                            <th style="text-align: right; py-3; width: 120px;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items_rows}
                    </tbody>
                </table>

                <!-- Summary Section -->
                <div style="display: flex; justify-content: flex-end;">
                    <div style="width: 320px; font-size: 0.825rem;">
                        <div style="display: flex; justify-content: space-between; py-2; border-bottom: 1px solid #f8fafc; font-weight: 500; color: #475569;">
                            <span>Subtotal</span>
                            <span>${float(invoice.subtotal):.2f}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; py-2; border-bottom: 1px solid #f8fafc; font-weight: 500; color: #475569;">
                            <span>Shipping</span>
                            <span>${float(order.shipping):.2f}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; py-2; border-bottom: 1px solid #f8fafc; font-weight: 500; color: #475569;">
                            <span>Tax (8%)</span>
                            <span>${float(invoice.tax):.2f}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding-top: 12px; margin-top: 8px; border-top: 2px solid #0f172a; font-size: 1rem; font-weight: 800; color: #0f172a;">
                            <span>Total Paid</span>
                            <span>${float(invoice.total):.2f}</span>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 60px; border-t: 1px solid #f1f5f9; padding-top: 24px; text-align: center;">
                    <p style="font-family: 'Playfair Display', serif; font-style: italic; color: #64748b; font-size: 0.875rem; margin: 0;">
                        Thank you for your purchase. We appreciate your fine taste in design.
                    </p>
                    <p style="color: #94a3b8; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 8px;">
                        AURA &bull; Est. 2024 &bull; www.aura.design
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    return html_content
