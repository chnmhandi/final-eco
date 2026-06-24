import requests
import json
import random
import hmac
import hashlib
import os
from dotenv import load_dotenv

# Load env variables from backend folder
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

BASE_URL = "http://127.0.0.1:8000/api"

def run_tests():
    print("--- Starting API Validation Tests ---")
    session = requests.Session()
    
    # 1. Check Product Listings
    print("\n[TEST] Getting all products...")
    res = session.get(f"{BASE_URL}/products")
    assert res.status_code == 200, f"Failed products fetch: {res.text}"
    products = res.json()
    print(f"Success: Fetched {len(products)} products.")
    assert len(products) > 0, "No products found in DB."
    
    # Keep track of a product to test cart
    test_product = products[0]
    print(f"Using test product: {test_product['name']} (ID: {test_product['id']})")
    
    # 2. Get categories
    print("\n[TEST] Getting categories...")
    res = session.get(f"{BASE_URL}/categories")
    assert res.status_code == 200, f"Failed categories fetch: {res.text}"
    categories = res.json()
    print(f"Success: Fetched {len(categories)} categories.")
    assert len(categories) > 0, "No categories found in DB."

    # 3. User Signup
    email = f"test_user_{random.randint(1000, 9999)}@example.com"
    signup_data = {
        "email": email,
        "password": "Password123!",
        "full_name": "Testy McTestface"
    }
    print(f"\n[TEST] Signing up new user: {email}...")
    res = session.post(f"{BASE_URL}/auth/signup", json=signup_data)
    assert res.status_code == 200, f"Signup failed: {res.text}"
    auth_response = res.json()
    token = auth_response["access_token"]
    print("Success: User signed up and received access token.")
    
    # Set Auth Header for subsequent tests
    session.headers.update({"Authorization": f"Bearer {token}"})
    
    # 4. Get User Profile
    print("\n[TEST] Fetching user profile...")
    res = session.get(f"{BASE_URL}/auth/profile")
    assert res.status_code == 200, f"Profile fetch failed: {res.text}"
    profile = res.json()
    print(f"Success: Profile fetched. Name: {profile['full_name']}")
    assert profile["email"] == email
    
    # 5. Add to Cart
    print("\n[TEST] Adding product to cart...")
    cart_data = {
        "product_id": test_product["id"],
        "quantity": 2,
        "selected_color": test_product["colors"][0]["name"],
        "selected_size": test_product["sizes"][0] if test_product["sizes"] else "M"
    }
    res = session.post(f"{BASE_URL}/cart", json=cart_data)
    assert res.status_code == 200, f"Add to cart failed: {res.text}"
    cart_item = res.json()
    print(f"Success: Added {cart_item['quantity']}x {test_product['name']} to cart.")
    
    # 6. Retrieve Cart
    print("\n[TEST] Retrieving cart...")
    res = session.get(f"{BASE_URL}/cart")
    assert res.status_code == 200, f"Get cart failed: {res.text}"
    cart = res.json()
    print(f"Success: Cart has {len(cart)} items.")
    assert len(cart) == 1
    assert cart[0]["quantity"] == 2
    
    # 7. Create Order (with Razorpay signature validation)
    print("\n[TEST] Creating Razorpay order...")
    total_val = (float(test_product["price"]) * 2) + 15.0 + (float(test_product["price"]) * 2 * 0.08)
    rp_res = session.post(f"{BASE_URL}/orders/razorpay-order", json={"total": total_val})
    assert rp_res.status_code == 200, f"Razorpay order creation failed: {rp_res.text}"
    rp_order = rp_res.json()
    print(f"Success: Created Razorpay order {rp_order['id']} for {rp_order['currency']} {rp_order['amount'] / 100}")

    mock_payment_id = f"pay_test_{random.randint(100000, 999999)}"
    secret = os.getenv("RAZORPAY_KEY_SECRET", "RF3wFOu3Mz2mTxwusF459VWv")
    
    # Calculate cryptographically valid signature
    msg = f"{rp_order['id']}|{mock_payment_id}".encode("utf-8")
    sig = hmac.new(secret.encode("utf-8"), msg, hashlib.sha256).hexdigest()

    print("\n[TEST] Placing e-commerce order with Razorpay signature verification...")
    order_data = {
        "subtotal": float(test_product["price"]) * 2,
        "shipping": 15.0,
        "tax": float(test_product["price"]) * 2 * 0.08,
        "total": total_val,
        "shipping_address": {
            "fullName": "Testy McTestface",
            "street": "123 Test St",
            "city": "Testville",
            "state": "TS",
            "zipCode": "12345",
            "country": "Testland",
            "phone": "+15551234567"
        },
        "delivery_method": "Standard Delivery",
        "razorpay_order_id": rp_order["id"],
        "razorpay_payment_id": mock_payment_id,
        "razorpay_signature": sig
    }
    res = session.post(f"{BASE_URL}/orders", json=order_data)
    assert res.status_code == 200, f"Order placement failed: {res.text}"
    order = res.json()
    print(f"Success: Order placed with signature verification. ID: {order['id']}, Status: {order['status']}")
    
    # 8. Check Cart Cleared
    print("\n[TEST] Checking if cart was cleared after checkout...")
    res = session.get(f"{BASE_URL}/cart")
    assert res.status_code == 200, f"Get cart failed: {res.text}"
    cart = res.json()
    print(f"Success: Cart has {len(cart)} items.")
    assert len(cart) == 0, "Cart was not cleared after order placement."
    
    # 9. Get user orders
    print("\n[TEST] Getting user orders...")
    res = session.get(f"{BASE_URL}/orders")
    assert res.status_code == 200, f"Orders fetch failed: {res.text}"
    orders = res.json()
    print(f"Success: User has {len(orders)} orders.")
    assert len(orders) == 1
    assert orders[0]["id"] == order["id"]
    
    print("\n--- All Backend API Validation Tests Passed Successfully! ---")

if __name__ == "__main__":
    try:
        run_tests()
    except AssertionError as e:
        print(f"\n[ERROR] Test failed: {e}")
    except Exception as e:
        print(f"\n[ERROR] Unexpected error: {e}")
