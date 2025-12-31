-- ============================================
-- Asset Sale - Database Schema & Seed Data
-- ============================================
-- 
-- Usage:
--   mysql -u root -p < database/schema.sql
--
-- Or import via phpMyAdmin / MySQL Workbench
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS `asset_sale` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `asset_sale`;

-- ============================================
-- TABLE: users
-- ============================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('user', 'admin', 'superadmin') DEFAULT 'user',
    `status` ENUM('pending', 'approved', 'blocked') DEFAULT 'pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_email` (`email`),
    INDEX `idx_role` (`role`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: listings
-- ============================================
DROP TABLE IF EXISTS `listings`;
CREATE TABLE `listings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `price` DECIMAL(15, 2) NOT NULL,
    `location` VARCHAR(255),
    `type` VARCHAR(50),
    `property_condition` ENUM('new', 'used') DEFAULT 'new',
    `images` JSON,
    `facilities` JSON,
    `nearby_places` TEXT,
    `google_map_link` TEXT,
    `province` VARCHAR(100),
    `district` VARCHAR(100),
    `subdistrict` VARCHAR(100),
    `postal_code` VARCHAR(10),
    `status` ENUM('pending', 'active', 'rejected', 'sold', 'inactive') DEFAULT 'pending',
    `expires_at` DATETIME,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_status` (`status`),
    INDEX `idx_type` (`type`),
    INDEX `idx_province` (`province`),
    INDEX `idx_price` (`price`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: favorites
-- ============================================
DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `listing_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_favorite` (`user_id`, `listing_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON DELETE CASCADE,
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_listing_id` (`listing_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: ads
-- ============================================
DROP TABLE IF EXISTS `ads`;
CREATE TABLE `ads` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `image` VARCHAR(500),
    `link` VARCHAR(500),
    `position` ENUM('banner_top', 'bento_1', 'bento_2', 'bento_3', 'bento_4', 'sidebar') NOT NULL,
    `active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_position` (`position`),
    INDEX `idx_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: settings
-- ============================================
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `setting_key` VARCHAR(100) NOT NULL UNIQUE,
    `setting_value` TEXT,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: contact_messages
-- ============================================
DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `surname` VARCHAR(255),
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50),
    `subject` VARCHAR(255),
    `message` TEXT NOT NULL,
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_is_read` (`is_read`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SEED DATA
-- ============================================

-- Users (passwords: admin123 for admins, user123 for user)
-- Note: These are bcrypt hashes, you may need to regenerate using node setupDb.js --seed
INSERT INTO `users` (`username`, `email`, `password_hash`, `role`, `status`) VALUES
('superadmin', 'superadmin@assetsale.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin', 'approved'),
('admin', 'admin@assetsale.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'approved'),
('demo_user', 'user@assetsale.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'approved');

-- Settings
INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('site_name', 'AssetSale'),
('site_description', 'แพลตฟอร์มซื้อขายอสังหาริมทรัพย์ชั้นนำ'),
('site_logo', ''),
('contact_email', 'contact@assetsale.com'),
('contact_phone', '02-xxx-xxxx'),
('contact_address', 'กรุงเทพมหานคร, ประเทศไทย'),
('content_about_us', 'เราเชื่อว่าการซื้อบ้านไม่ใช่แค่การทำธุรกรรม แต่คือการเริ่มต้นบทใหม่ของชีวิต'),
('social_facebook', ''),
('social_line', ''),
('social_instagram', '');

-- Sample Listings
INSERT INTO `listings` (`user_id`, `title`, `description`, `price`, `location`, `type`, `property_condition`, `images`, `facilities`, `nearby_places`, `province`, `district`, `subdistrict`, `postal_code`, `status`) VALUES
(3, 'คอนโดหรู ใจกลางเมือง ใกล้ BTS', 'คอนโดใหม่ ตกแต่งครบ พร้อมอยู่ วิวเมืองสวยงาม', 3500000, 'สุขุมวิท 39', 'Condo', 'new', '["demo/condo1.jpg"]', '["สระว่ายน้ำ", "ฟิตเนส", "ที่จอดรถ"]', 'BTS พร้อมพงษ์, EmQuartier', 'กรุงเทพมหานคร', 'วัฒนา', 'คลองตันเหนือ', '10110', 'active'),
(3, 'บ้านเดี่ยว 2 ชั้น หมู่บ้านหรู', 'บ้านเดี่ยว 4 ห้องนอน 3 ห้องน้ำ พร้อมสวนหลังบ้าน', 8900000, 'รังสิต-นครนายก', 'House', 'used', '["demo/house1.jpg"]', '["สวน", "ที่จอดรถ 2 คัน"]', 'ตลาดสด, โรงเรียน, โรงพยาบาล', 'ปทุมธานี', 'ธัญบุรี', 'ประชาธิปัตย์', '12130', 'active'),
(3, 'ที่ดินเปล่า ติดถนนใหญ่', 'ที่ดินเปล่า 100 ตารางวา ติดถนน 4 เลน', 2500000, 'ถนนบางนา-ตราด', 'Land', 'new', '["demo/land1.jpg"]', '[]', 'ใกล้ห้างบิ๊กซี', 'ชลบุรี', 'บางละมุง', 'นาจอมเทียน', '20150', 'active'),
(3, 'อาคารพาณิชย์ 4 ชั้น ริมถนน', 'อาคารพาณิชย์ 4 ชั้น เหมาะทำออฟฟิศ หรือเปิดร้านค้า', 15000000, 'รัชดาภิเษก', 'Commercial', 'used', '["demo/commercial1.jpg"]', '["ที่จอดรถ", "ลิฟท์"]', 'MRT ลาดพร้าว', 'กรุงเทพมหานคร', 'จตุจักร', 'จอมพล', '10900', 'active');

-- Ads
INSERT INTO `ads` (`image`, `link`, `position`, `active`) VALUES
('ads/banner_top.png', 'https://example.com', 'banner_top', 1),
('ads/bento_1.png', 'https://example.com', 'bento_1', 1),
('ads/bento_2.png', 'https://example.com', 'bento_2', 1),
('ads/bento_3.png', 'https://example.com', 'bento_3', 1),
('ads/bento_4.png', 'https://example.com', 'bento_4', 1);

-- ============================================
-- DONE
-- ============================================
SELECT 'Database setup completed!' AS Status;
