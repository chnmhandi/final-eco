from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import auth, products, categories, cart, wishlist, orders, admin, shipping, notifications, invoices
from app.database.session import engine
from sqlalchemy import text

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

@app.on_event("startup")
def run_migrations():
    print("Running database migrations for orders and products tables...")
    try:
        with engine.begin() as conn:
            # Orders Razorpay and Admin updates
            conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(255);"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(255);"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_signature VARCHAR(255);"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_status VARCHAR(50) DEFAULT 'Placed';"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'Pending';"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS courier_name VARCHAR(100);"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_notes TEXT;"))
            
            # Phase 5 updates
            conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_status VARCHAR(50) DEFAULT 'Placed';"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE;"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;"))
            
            # Products Admin updates
            conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS sku VARCHAR(100);"))
            conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';"))
            conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;"))
            conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;"))
            
            # Create shipments table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS shipments (
                    id SERIAL PRIMARY KEY,
                    order_id VARCHAR(100) REFERENCES orders(id) ON DELETE CASCADE,
                    courier VARCHAR(100) NOT NULL,
                    tracking_number VARCHAR(100) UNIQUE NOT NULL,
                    status VARCHAR(50) DEFAULT 'Placed',
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """))

            # Create notifications table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS notifications (
                    id SERIAL PRIMARY KEY,
                    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                    type VARCHAR(50) NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    message TEXT NOT NULL,
                    is_read BOOLEAN DEFAULT false,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """))

            # Create invoices table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS invoices (
                    id SERIAL PRIMARY KEY,
                    order_id VARCHAR(100) REFERENCES orders(id) ON DELETE CASCADE,
                    invoice_number VARCHAR(100) UNIQUE NOT NULL,
                    subtotal NUMERIC(10, 2) NOT NULL,
                    tax NUMERIC(10, 2) NOT NULL,
                    total NUMERIC(10, 2) NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """))
            
        print("Database migrations completed successfully!")
    except Exception as e:
        print(f"Error running database migrations: {e}")

# Enable CORS middleware
# Frontend runs on http://localhost:3000, so we allow it specifically
origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
if settings.FRONTEND_URL:
    origins.append(settings.FRONTEND_URL)
    origins.append(settings.FRONTEND_URL.rstrip("/"))
    origins.append(settings.FRONTEND_URL.rstrip("/") + "/")

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(set(origins)),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers under prefix '/api'
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(products.router, prefix=settings.API_V1_STR)
app.include_router(categories.router, prefix=settings.API_V1_STR)
app.include_router(cart.router, prefix=settings.API_V1_STR)
app.include_router(wishlist.router, prefix=settings.API_V1_STR)
app.include_router(orders.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(shipping.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(invoices.router, prefix=settings.API_V1_STR)

@app.post("/api/test-email")
def test_email():
    import json
    import urllib.request
    import urllib.error
    from app.config import settings

    print("EMAIL START")
    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {settings.RESEND_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "from": settings.FROM_EMAIL,
        "to": ["gurushreeembroiderydesign@gmail.com"],
        "subject": "Test Email from AURA",
        "html": "<strong>This is a test email confirmation.</strong>"
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            print("EMAIL SUCCESS")
            return {"email_sent": True, "response": json.loads(res_body)}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        print(f"EMAIL FAILED with full error: HTTPError {e.code} - {err_body}")
        return {"email_sent": False, "error": f"HTTPError {e.code} - {err_body}"}
    except Exception as e:
        print(f"EMAIL FAILED with full error: {str(e)}")
        return {"email_sent": False, "error": str(e)}

@app.get("/")
def read_root():
    return {"message": "Welcome to AURA E-Commerce API. Visit /docs for documentation."}
