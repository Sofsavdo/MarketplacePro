-- DUBAYMALL Database Schema
-- Version: 1.0.0
-- Description: Complete database schema for DUBAYMALL platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('admin', 'seller', 'blogger', 'customer');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');
CREATE TYPE product_status AS ENUM ('pending', 'approved', 'rejected', 'out_of_stock');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'warehouse', 'shipped', 'delivered', 'cancelled', 'returned');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('click', 'payme', 'uzum', 'cash');
CREATE TYPE earning_status AS ENUM ('pending', 'available', 'paid');

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'customer',
    status user_status NOT NULL DEFAULT 'pending',
    avatar_url TEXT,
    telegram_id BIGINT UNIQUE,
    telegram_username VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_telegram_id ON users(telegram_id);

-- ============================================
-- SELLERS TABLE
-- ============================================
CREATE TABLE sellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    inn VARCHAR(50),
    legal_address TEXT,
    bank_name VARCHAR(255),
    bank_account VARCHAR(50),
    mfo VARCHAR(20),
    commission_rate DECIMAL(5,2) DEFAULT 20.00,
    total_sales DECIMAL(15,2) DEFAULT 0,
    total_products INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sellers_user_id ON sellers(user_id);
CREATE INDEX idx_sellers_verified ON sellers(verified);

-- ============================================
-- BLOGGERS TABLE
-- ============================================
CREATE TABLE bloggers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    promo_code VARCHAR(50) UNIQUE NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 20.00,
    telegram_channel VARCHAR(255),
    telegram_followers INTEGER DEFAULT 0,
    instagram_username VARCHAR(255),
    instagram_followers INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    total_earnings DECIMAL(15,2) DEFAULT 0,
    pending_earnings DECIMAL(15,2) DEFAULT 0,
    paid_earnings DECIMAL(15,2) DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bloggers_user_id ON bloggers(user_id);
CREATE INDEX idx_bloggers_promo_code ON bloggers(promo_code);
CREATE INDEX idx_bloggers_verified ON bloggers(verified);

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    image_url TEXT,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_active ON categories(active);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    
    -- Images and media
    images TEXT[] DEFAULT '{}',
    video_url TEXT,
    
    -- Pricing (all in UZS)
    cost_price DECIMAL(15,2) NOT NULL, -- Sotuvchi kiritgan tannarx
    base_price DECIMAL(15,2) NOT NULL, -- Asosiy narx (cost_price)
    bonus_value DECIMAL(15,2) DEFAULT 0, -- Bonus qiymat (Variant C)
    blogger_commission DECIMAL(15,2) NOT NULL, -- Bloger haqi
    platform_fee DECIMAL(15,2) NOT NULL, -- Platforma haqi
    final_price DECIMAL(15,2) NOT NULL, -- Yakuniy narx
    
    -- Inventory
    stock INTEGER DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    weight DECIMAL(10,2), -- kg
    dimensions VARCHAR(100), -- LxWxH cm
    
    -- Status and verification
    status product_status DEFAULT 'pending',
    ai_verified BOOLEAN DEFAULT FALSE,
    ai_verification_score DECIMAL(3,2),
    ai_verification_notes TEXT,
    admin_notes TEXT,
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT[],
    
    -- Stats
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    sales INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    
    -- Warehouse
    warehouse_location VARCHAR(100),
    warehouse_received_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_final_price ON products(final_price);

-- ============================================
-- PROMO CODES TABLE
-- ============================================
CREATE TABLE promo_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blogger_id UUID NOT NULL REFERENCES bloggers(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) DEFAULT 'percentage', -- percentage, fixed
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(15,2) DEFAULT 0,
    max_usage INTEGER,
    usage_count INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_promo_codes_blogger_id ON promo_codes(blogger_id);
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_active ON promo_codes(active);

-- ============================================
-- REFERRAL LINKS TABLE
-- ============================================
CREATE TABLE referral_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blogger_id UUID NOT NULL REFERENCES bloggers(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    short_code VARCHAR(20) UNIQUE NOT NULL,
    full_url TEXT NOT NULL,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_referral_links_blogger_id ON referral_links(blogger_id);
CREATE INDEX idx_referral_links_product_id ON referral_links(product_id);
CREATE INDEX idx_referral_links_short_code ON referral_links(short_code);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    blogger_id UUID REFERENCES bloggers(id) ON DELETE SET NULL,
    promo_code VARCHAR(50),
    
    -- Pricing
    subtotal DECIMAL(15,2) NOT NULL,
    delivery_fee DECIMAL(15,2) DEFAULT 0,
    discount DECIMAL(15,2) DEFAULT 0,
    total DECIMAL(15,2) NOT NULL,
    
    -- Delivery
    delivery_address TEXT NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_region VARCHAR(100),
    delivery_phone VARCHAR(20) NOT NULL,
    delivery_notes TEXT,
    tracking_number VARCHAR(100),
    
    -- Status
    status order_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    payment_method payment_method,
    
    -- Timestamps
    confirmed_at TIMESTAMP WITH TIME ZONE,
    warehouse_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_blogger_id ON orders(blogger_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE RESTRICT,
    
    -- Product snapshot
    product_title VARCHAR(500) NOT NULL,
    product_image TEXT,
    
    -- Pricing
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(15,2) NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL,
    blogger_commission DECIMAL(15,2) DEFAULT 0,
    platform_fee DECIMAL(15,2) NOT NULL,
    seller_amount DECIMAL(15,2) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_order_items_seller_id ON order_items(seller_id);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    method payment_method NOT NULL,
    status payment_status DEFAULT 'pending',
    transaction_id VARCHAR(255),
    provider_response JSONB,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================
-- BLOGGER EARNINGS TABLE
-- ============================================
CREATE TABLE blogger_earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blogger_id UUID NOT NULL REFERENCES bloggers(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    status earning_status DEFAULT 'pending',
    available_at TIMESTAMP WITH TIME ZONE, -- 14 days after delivery
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_blogger_earnings_blogger_id ON blogger_earnings(blogger_id);
CREATE INDEX idx_blogger_earnings_order_id ON blogger_earnings(order_id);
CREATE INDEX idx_blogger_earnings_status ON blogger_earnings(status);
CREATE INDEX idx_blogger_earnings_available_at ON blogger_earnings(available_at);

-- ============================================
-- SELLER PAYOUTS TABLE
-- ============================================
CREATE TABLE seller_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    status earning_status DEFAULT 'pending',
    available_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_seller_payouts_seller_id ON seller_payouts(seller_id);
CREATE INDEX idx_seller_payouts_order_id ON seller_payouts(order_id);
CREATE INDEX idx_seller_payouts_status ON seller_payouts(status);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    images TEXT[],
    verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================
-- WAREHOUSE INVENTORY TABLE
-- ============================================
CREATE TABLE warehouse_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,
    location VARCHAR(100),
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_warehouse_inventory_product_id ON warehouse_inventory(product_id);
CREATE INDEX idx_warehouse_inventory_seller_id ON warehouse_inventory(seller_id);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ============================================
-- ACTIVITY LOGS TABLE
-- ============================================
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sellers_updated_at BEFORE UPDATE ON sellers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bloggers_updated_at BEFORE UPDATE ON bloggers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'DM' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(nextval('order_number_seq')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE SEQUENCE order_number_seq;
CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Calculate product final price
CREATE OR REPLACE FUNCTION calculate_product_price()
RETURNS TRIGGER AS $$
BEGIN
    NEW.final_price = NEW.base_price + NEW.blogger_commission + NEW.platform_fee;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_product_price_trigger BEFORE INSERT OR UPDATE ON products FOR EACH ROW EXECUTE FUNCTION calculate_product_price();

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default categories
INSERT INTO categories (name, slug, description, icon, sort_order) VALUES
('Elektronika', 'elektronika', 'Telefonlar, noutbuklar, aksessuarlar', '📱', 1),
('Moda', 'moda', 'Kiyim, poyabzal, aksessuarlar', '👗', 2),
('Uy va Bog''', 'uy-va-bog', 'Uy uchun mahsulotlar', '🏠', 3),
('Go''zallik', 'gozallik', 'Kosmetika va parfyumeriya', '💄', 4),
('Sport', 'sport', 'Sport buyumlari va aksessuarlar', '⚽', 5);

-- Insert admin user (password: admin123)
INSERT INTO users (email, phone, password_hash, full_name, role, status, email_verified, phone_verified) VALUES
('admin@dubaymall.uz', '+998901234567', '$2a$10$rKZLvXZvXZvXZvXZvXZvXe', 'Admin User', 'admin', 'active', TRUE, TRUE);

COMMENT ON DATABASE postgres IS 'DUBAYMALL - Premium E-commerce Platform Database';
