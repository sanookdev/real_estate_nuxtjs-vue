-- ============================================
-- PostgreSQL Schema for AssetSale Platform
-- Compatible with Supabase
-- ============================================

-- Enable UUID extension (optional, for future use)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Custom ENUM Types
-- ============================================

-- User roles
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin', 'superadmin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- User status
DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('pending', 'approved', 'blocked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Property condition
DO $$ BEGIN
    CREATE TYPE property_condition AS ENUM ('new', 'used');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Listing status
DO $$ BEGIN
    CREATE TYPE listing_status AS ENUM ('pending', 'active', 'rejected', 'sold', 'inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Ad position
DO $$ BEGIN
    CREATE TYPE ad_position AS ENUM ('banner_top', 'bento_1', 'bento_2', 'bento_3', 'bento_4', 'sidebar');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) DEFAULT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user',
    status user_status DEFAULT 'pending',
    email_verified_at TIMESTAMP DEFAULT NULL,
    reset_password_token VARCHAR(255) DEFAULT NULL,
    reset_password_expires TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_password_token);

-- ============================================
-- Pending Email Verifications (Pre-Register OTP)
-- ============================================
CREATE TABLE IF NOT EXISTS pending_verifications (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    otp_expires TIMESTAMP NOT NULL,
    otp_attempts INT DEFAULT 0,
    lockout_until TIMESTAMP DEFAULT NULL,
    registration_token VARCHAR(64) DEFAULT NULL,
    verified_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pending_email ON pending_verifications(email);
CREATE INDEX IF NOT EXISTS idx_pending_reg_token ON pending_verifications(registration_token);

-- ============================================
-- Listings Table
-- ============================================
CREATE TABLE IF NOT EXISTS listings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15, 2) NOT NULL,
    location VARCHAR(255),
    type VARCHAR(50),
    property_condition property_condition DEFAULT 'new',
    images JSONB,
    facilities JSONB,
    nearby_places TEXT,
    google_map_link TEXT,
    province VARCHAR(100),
    district VARCHAR(100),
    subdistrict VARCHAR(100),
    postal_code VARCHAR(10),
    status listing_status DEFAULT 'pending',
    is_pinned BOOLEAN DEFAULT FALSE,
    pinned_at TIMESTAMP DEFAULT NULL,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
CREATE INDEX IF NOT EXISTS idx_listings_province ON listings(province);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at);
CREATE INDEX IF NOT EXISTS idx_listings_is_pinned ON listings(is_pinned);

-- ============================================
-- Favorites Table
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id INT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, listing_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing_id ON favorites(listing_id);

-- ============================================
-- Ads Table
-- ============================================
CREATE TABLE IF NOT EXISTS ads (
    id SERIAL PRIMARY KEY,
    image VARCHAR(500),
    link VARCHAR(500),
    position ad_position NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ads_position ON ads(position);
CREATE INDEX IF NOT EXISTS idx_ads_active ON ads(active);

-- ============================================
-- Settings Table
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(setting_key);

-- ============================================
-- Contact Messages Table
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contact_is_read ON contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_messages(created_at);

-- ============================================
-- Function: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_listings_updated_at ON listings;
CREATE TRIGGER update_listings_updated_at
    BEFORE UPDATE ON listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ads_updated_at ON ads;
CREATE TRIGGER update_ads_updated_at
    BEFORE UPDATE ON ads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
