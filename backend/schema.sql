-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (for clean initialization)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users table (Internal FastAPI Auth credentials)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Profiles table (User metadata)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(50),
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    member_since TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Addresses table (Multiple addresses per user)
CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    street TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    is_default BOOLEAN DEFAULT false
);

-- 4. Categories table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(100) PRIMARY KEY, -- e.g. cat-1
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    item_count INT DEFAULT 0
);

-- 5. Products table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY, -- e.g. prod-1
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL, -- string name matching current frontend
    category_slug VARCHAR(255) REFERENCES categories(slug) ON DELETE SET NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    rating NUMERIC(3, 2) DEFAULT 0.0,
    review_count INT DEFAULT 0,
    images TEXT[] NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    colors JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of {name: string, hex: string}
    sizes TEXT[] DEFAULT '{}',
    specs JSONB NOT NULL DEFAULT '[]'::jsonb,  -- Array of {label: string, value: string}
    stock INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_trending BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    tag VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE UNIQUE,
    stock INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Cart Items table
CREATE TABLE IF NOT EXISTS cart_items (
    id VARCHAR(255) PRIMARY KEY, -- Composite key like: user_id_prod-1_Matte-Black_M
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    selected_color VARCHAR(100) NOT NULL,
    selected_size VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Wishlist Items table
CREATE TABLE IF NOT EXISTS wishlist_items (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- 9. Orders table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100) PRIMARY KEY, -- e.g. AUR-92834
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    date VARCHAR(100) NOT NULL, -- e.g. "June 14, 2026"
    subtotal NUMERIC(10, 2) NOT NULL,
    shipping NUMERIC(10, 2) NOT NULL,
    tax NUMERIC(10, 2) NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    shipping_address JSONB NOT NULL, -- Full address details JSON
    delivery_method VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Placed', -- Placed, Processing, Shipped, Delivered
    tracking_number VARCHAR(100),
    estimated_delivery VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Order Items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(100) REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(100) REFERENCES products(id) ON DELETE SET NULL,
    quantity INT NOT NULL,
    selected_color VARCHAR(100) NOT NULL,
    selected_size VARCHAR(50),
    price NUMERIC(10, 2) NOT NULL
);

-- 11. Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    helpful_count INT DEFAULT 0,
    date VARCHAR(100) NOT NULL, -- Formatted string for UI compatibility
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
