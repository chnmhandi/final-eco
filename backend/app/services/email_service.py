import json
import urllib.request
import urllib.error
import threading
from datetime import datetime
from app.config import settings

def is_real_email(email: str) -> bool:
    """Checks if the email is a real customer address, skipping dummy/test/example domains."""
    if not email:
        return False
    email = email.lower().strip()
    if "example.com" in email:
        return False
    if email.startswith("test@"):
        return False
    return True

def send_email(to_email: str, subject: str, html_content: str):
    """Sends email via Resend REST API."""
    if not is_real_email(to_email):
        print(f"[EMAIL] Skipping mock/sandbox recipient: {to_email} | Subject: '{subject}'")
        return None

    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {settings.RESEND_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "from": settings.FROM_EMAIL,
        "to": [to_email],
        "subject": subject,
        "html": html_content
    }
    
    print(f"[EMAIL] Dispatching email to {to_email} | Subject: '{subject}'")
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            print(f"[EMAIL] Resend response: {res_body}")
            return json.loads(res_body)
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        print(f"[EMAIL] Resend HTTP Error {e.code}: {err_body}")
        return None
    except Exception as e:
        print(f"[EMAIL] Resend error: {str(e)}")
        return None

def send_email_async(to_email: str, subject: str, html_content: str):
    """Dispatches email sending to a daemon thread to prevent API blocking."""
    thread = threading.Thread(target=send_email, args=(to_email, subject, html_content))
    thread.daemon = True
    thread.start()

def get_base_template(title: str, content_html: str) -> str:
    """Standard layout for all client emails."""
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
        <style>
            body {{
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                background-color: #f8fafc;
                margin: 0;
                padding: 40px 20px;
                color: #1e293b;
            }}
            .card {{
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 16px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
                overflow: hidden;
            }}
            .accent-bar {{
                height: 6px;
                background: linear-gradient(90deg, #1e293b 0%, #d97706 100%);
            }}
            .header {{
                padding: 30px 40px 20px 40px;
                border-bottom: 1px solid #f1f5f9;
            }}
            .brand {{
                font-family: 'Playfair Display', serif;
                font-size: 24px;
                font-weight: 700;
                letter-spacing: 0.1em;
                color: #0f172a;
                text-decoration: none;
            }}
            .body {{
                padding: 40px;
            }}
            .footer {{
                background-color: #f8fafc;
                border-top: 1px solid #f1f5f9;
                padding: 24px 40px;
                text-align: center;
                font-size: 11px;
                color: #94a3b8;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }}
            h2 {{
                font-size: 20px;
                font-weight: 700;
                color: #0f172a;
                margin-top: 0;
                margin-bottom: 20px;
            }}
            p {{
                font-size: 14px;
                line-height: 1.6;
                color: #475569;
                margin-top: 0;
                margin-bottom: 16px;
            }}
            .badge {{
                display: inline-block;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }}
            .badge-success {{
                background-color: #dcfce7;
                color: #15803d;
            }}
            .badge-info {{
                background-color: #e0f2fe;
                color: #0369a1;
            }}
            .btn {{
                display: inline-block;
                background-color: #0f172a;
                color: #ffffff !important;
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                padding: 12px 24px;
                border-radius: 9999px;
                text-decoration: none;
                margin-top: 20px;
            }}
            .details-table {{
                width: 100%;
                border-collapse: collapse;
                margin: 24px 0;
            }}
            .details-table th {{
                text-align: left;
                font-size: 11px;
                font-weight: 800;
                text-transform: uppercase;
                color: #64748b;
                border-bottom: 2px solid #f1f5f9;
                padding-bottom: 8px;
            }}
            .details-table td {{
                padding: 12px 0;
                border-bottom: 1px solid #f1f5f9;
                font-size: 13px;
                color: #334155;
            }}
            .total-row td {{
                font-weight: 700;
                color: #0f172a;
                border-top: 2px solid #0f172a;
                border-bottom: none;
                font-size: 15px;
            }}
        </style>
    </head>
    <body>
        <div class="card">
            <div class="accent-bar"></div>
            <div class="header">
                <div class="brand">AURA</div>
            </div>
            <div class="body">
                {content_html}
            </div>
            <div class="footer">
                AURA &bull; Est. 2024 &bull; www.aura.design
            </div>
        </div>
    </body>
    </html>
    """

def send_order_placed_email(order, items, email: str):
    """Triggers Order Placed notification."""
    items_html = ""
    for item in items:
        prod_name = item["name"]
        color = item["color"]
        size = f" / {item['size']}" if item["size"] else ""
        qty = item["qty"]
        price = item["price"]
        items_html += f"""
        <tr>
            <td>{prod_name}<br><span style="font-size: 11px; color: #94a3b8;">{color}{size}</span></td>
            <td style="text-align: center;">{qty}</td>
            <td style="text-align: right;">${float(price):.2f}</td>
        </tr>
        """
        
    content_html = f"""
    <h2>Order Placed Successfully <span class="badge badge-info">Processing</span></h2>
    <p>Dear Customer,</p>
    <p>Thank you for shopping at AURA. We have received your order and are currently preparing it.</p>
    <p><strong>Order ID:</strong> {order.id}</p>
    <p><strong>Date:</strong> {order.date}</p>
    <p><strong>Estimated Delivery:</strong> {order.estimated_delivery}</p>
    
    <table class="details-table">
        <thead>
            <tr>
                <th>Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
            </tr>
        </thead>
        <tbody>
            {items_html}
            <tr>
                <td colspan="2" style="text-align: right; font-weight: 600; padding-top: 15px;">Subtotal:</td>
                <td style="text-align: right; font-weight: 600; padding-top: 15px;">${float(order.subtotal):.2f}</td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: right; font-weight: 600;">Shipping:</td>
                <td style="text-align: right; font-weight: 600;">${float(order.shipping):.2f}</td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: right; font-weight: 600;">Tax:</td>
                <td style="text-align: right; font-weight: 600;">${float(order.tax):.2f}</td>
            </tr>
            <tr class="total-row">
                <td colspan="2" style="text-align: right; padding-top: 12px;">Total Paid:</td>
                <td style="text-align: right; padding-top: 12px;">${float(order.total):.2f}</td>
            </tr>
        </tbody>
    </table>
    
    <p>We appreciate your purchase and hope to serve you again soon.</p>
    """
    html_content = get_base_template("Order Confirmation | AURA", content_html)
    send_email_async(email, f"Order Placed successfully - {order.id}", html_content)

def send_payment_success_email(order, email: str):
    """Triggers Payment Success notification."""
    content_html = f"""
    <h2>Payment Successful <span class="badge badge-success">Paid</span></h2>
    <p>Dear Customer,</p>
    <p>Your payment for Order <strong>{order.id}</strong> has been successfully processed.</p>
    <p><strong>Payment Method:</strong> Razorpay Secure</p>
    <p><strong>Payment ID:</strong> {order.razorpay_payment_id}</p>
    <p><strong>Amount Paid:</strong> ${float(order.total):.2f}</p>
    <p>We are packing your items and will notify you when shipment starts.</p>
    """
    html_content = get_base_template("Payment Received | AURA", content_html)
    send_email_async(email, f"Payment Received for Order - {order.id}", html_content)

def send_shipment_created_email(shipment, order, email: str):
    """Triggers Shipment Created notification."""
    content_html = f"""
    <h2>Shipment Registered <span class="badge badge-info">Processing</span></h2>
    <p>Dear Customer,</p>
    <p>A shipment has been created for your order <strong>{order.id}</strong>.</p>
    <p><strong>Courier:</strong> {shipment.courier}</p>
    <p><strong>Tracking Number:</strong> {shipment.tracking_number}</p>
    <p>We will update you as soon as the package is picked up by the courier.</p>
    """
    html_content = get_base_template("Shipment Registered | AURA", content_html)
    send_email_async(email, f"Shipment Created for Order - {order.id}", html_content)

def send_order_shipped_email(shipment, order, email: str):
    """Triggers Order Shipped notification."""
    content_html = f"""
    <h2>Order Shipped <span class="badge badge-info">In Transit</span></h2>
    <p>Dear Customer,</p>
    <p>Great news! Your order <strong>{order.id}</strong> has been shipped and is on the way.</p>
    <p><strong>Courier:</strong> {shipment.courier}</p>
    <p><strong>Tracking Number:</strong> {shipment.tracking_number}</p>
    <p>You can track the progress of your shipment using the tracking details provided.</p>
    """
    html_content = get_base_template("Order Shipped | AURA", content_html)
    send_email_async(email, f"Your Order - {order.id} has been Shipped", html_content)

def send_order_delivered_email(order, email: str):
    """Triggers Order Delivered notification."""
    content_html = f"""
    <h2>Order Delivered <span class="badge badge-success">Delivered</span></h2>
    <p>Dear Customer,</p>
    <p>Your order <strong>{order.id}</strong> has been successfully delivered.</p>
    <p>We hope you enjoy your new AURA creations. Thank you for shopping with us!</p>
    """
    html_content = get_base_template("Order Delivered | AURA", content_html)
    send_email_async(email, f"Your Order - {order.id} has been Delivered", html_content)

def send_invoice_generated_email(invoice, order, email: str):
    """Triggers Invoice Generated notification."""
    invoice_date_str = invoice.created_at.strftime('%B %d, %Y') if hasattr(invoice.created_at, 'strftime') else str(invoice.created_at)
    content_html = f"""
    <h2>Invoice Generated</h2>
    <p>Dear Customer,</p>
    <p>An official invoice has been generated for your order <strong>{order.id}</strong>.</p>
    <p><strong>Invoice Number:</strong> {invoice.invoice_number}</p>
    <p><strong>Invoice Date:</strong> {invoice_date_str}</p>
    <p><strong>Total Amount:</strong> ${float(invoice.total):.2f}</p>
    <p>You can view and print the full receipt online at any time by clicking the button below:</p>
    <div style="text-align: center;">
        <a href="http://127.0.0.1:8000/api/invoices/orders/{order.id}/invoice/html" class="btn" style="color: #ffffff;">View Receipt</a>
    </div>
    """
    html_content = get_base_template("Invoice Generated | AURA", content_html)
    send_email_async(email, f"Invoice Generated - {invoice.invoice_number} for Order {order.id}", html_content)

def send_admin_order_shipped_email(order, email: str):
    """Triggers Order Shipped notification for admin update."""
    tracking_info = f"Tracking Number: {order.tracking_number}" if order.tracking_number else "Tracking details will be updated shortly."
    courier_info = f"via {order.courier_name}" if order.courier_name else ""
    content_html = f"""
    <h2>Order Shipped <span class="badge badge-info">In Transit</span></h2>
    <p>Dear Customer,</p>
    <p>Your order <strong>{order.id}</strong> has been shipped {courier_info}.</p>
    <p><strong>Status:</strong> Shipped</p>
    <p>{tracking_info}</p>
    <p>Thank you for choosing AURA!</p>
    """
    html_content = get_base_template("Order Shipped | AURA", content_html)
    send_email_async(email, f"Your Order - {order.id} has been Shipped", html_content)
