/**
 * ============================================
 * Database Setup & Seed Script
 * Asset Sale Real Estate Platform
 * ============================================
 * 
 * Usage:
 *   node setupDb.js          - Create tables only
 *   node setupDb.js --seed   - Create tables + insert sample data
 *   node setupDb.js --reset  - Drop all tables, recreate, and seed
 * 
 * Make sure to set your .env file first:
 *   DB_HOST=localhost
 *   DB_USER=root
 *   DB_PASSWORD=yourpassword
 *   DB_NAME=asset_sale
 * ============================================
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

const DB_NAME = process.env.DB_NAME || 'asset_sale';

// ============================================
// TABLE SCHEMAS
// ============================================

const TABLES = {
  users: `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            phone VARCHAR(50) DEFAULT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('user', 'admin', 'superadmin') DEFAULT 'user',
            status ENUM('pending', 'approved', 'blocked') DEFAULT 'pending',
            email_verified_at DATETIME DEFAULT NULL,
            reset_password_token VARCHAR(255) DEFAULT NULL,
            reset_password_expires DATETIME DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_email (email),
            INDEX idx_role (role),
            INDEX idx_status (status),
            INDEX idx_reset_token (reset_password_token)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `,

  pending_verifications: `
        CREATE TABLE IF NOT EXISTS pending_verifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            otp_code VARCHAR(10) NOT NULL,
            otp_expires DATETIME NOT NULL,
            otp_attempts INT DEFAULT 0,
            lockout_until DATETIME DEFAULT NULL,
            verified_at DATETIME DEFAULT NULL,
            registration_token VARCHAR(255) DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_email (email),
            INDEX idx_registration_token (registration_token),
            INDEX idx_verified_at (verified_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `,

  listings: `
        CREATE TABLE IF NOT EXISTS listings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(15, 2) NOT NULL,
            location VARCHAR(255),
            type VARCHAR(50),
            property_condition ENUM('new', 'used') DEFAULT 'new',
            images JSON,
            facilities JSON,
            nearby_places TEXT,
            google_map_link TEXT,
            province VARCHAR(100),
            district VARCHAR(100),
            subdistrict VARCHAR(100),
            postal_code VARCHAR(10),
            status ENUM('pending', 'active', 'rejected', 'sold', 'inactive') DEFAULT 'pending',
            is_pinned BOOLEAN DEFAULT FALSE,
            pinned_at DATETIME DEFAULT NULL,
            expires_at DATETIME,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_status (status),
            INDEX idx_type (type),
            INDEX idx_province (province),
            INDEX idx_price (price),
            INDEX idx_created_at (created_at),
            INDEX idx_is_pinned (is_pinned)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `,

  favorites: `
        CREATE TABLE IF NOT EXISTS favorites (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            listing_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_favorite (user_id, listing_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
            INDEX idx_user_id (user_id),
            INDEX idx_listing_id (listing_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `,

  ads: `
        CREATE TABLE IF NOT EXISTS ads (
            id INT AUTO_INCREMENT PRIMARY KEY,
            image VARCHAR(500),
            link VARCHAR(500),
            position ENUM('banner_top', 'bento_1', 'bento_2', 'bento_3', 'bento_4', 'sidebar') NOT NULL,
            active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_position (position),
            INDEX idx_active (active)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `,

  settings: `
        CREATE TABLE IF NOT EXISTS settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            setting_key VARCHAR(100) NOT NULL UNIQUE,
            setting_value TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_key (setting_key)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `,

  contact_messages: `
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            surname VARCHAR(255),
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50),
            subject VARCHAR(255),
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_is_read (is_read),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `
};

// ============================================
// SEED DATA
// ============================================

async function getSeedData() {
  const saltRounds = 10;

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', saltRounds);
  const userPassword = await bcrypt.hash('user123', saltRounds);

  return {
    users: [
      {
        username: 'superadmin',
        email: 'superadmin@assetsale.com',
        password_hash: adminPassword,
        role: 'superadmin',
        status: 'approved',
        email_verified_at: new Date()
      },
      {
        username: 'admin',
        email: 'admin@assetsale.com',
        password_hash: adminPassword,
        role: 'admin',
        status: 'approved',
        email_verified_at: new Date()
      },
      {
        username: 'demo_user',
        email: 'user@assetsale.com',
        password_hash: userPassword,
        role: 'user',
        status: 'approved',
        email_verified_at: new Date()
      }
    ],

    settings: [
      { key: 'site_name', value: 'AssetSale' },
      { key: 'site_description', value: 'แพลตฟอร์มซื้อขายอสังหาริมทรัพย์ชั้นนำ' },
      { key: 'site_logo', value: '' },
      { key: 'contact_email', value: 'contact@assetsale.com' },
      { key: 'contact_phone', value: '02-xxx-xxxx' },
      { key: 'contact_address', value: 'กรุงเทพมหานคร, ประเทศไทย' },
      { key: 'content_about_us', value: 'เราเชื่อว่าการซื้อบ้านไม่ใช่แค่การทำธุรกรรม แต่คือการเริ่มต้นบทใหม่ของชีวิต เราจึงพัฒนาเทคโนโลยีที่ช่วยให้การค้นหาบ้านเป็นเรื่องง่าย รวดเร็ว และตรงใจที่สุด' },
      { key: 'social_facebook', value: '' },
      { key: 'social_line', value: '' },
      { key: 'social_instagram', value: '' }
    ],

    listings: [
      {
        user_id: 3,
        title: 'คอนโดหรู ใจกลางเมือง ใกล้ BTS',
        description: 'คอนโดใหม่ ตกแต่งครบ พร้อมอยู่ วิวเมืองสวยงาม ใกล้ห้างสรรพสินค้า และสถานีรถไฟฟ้า',
        price: 3500000,
        location: 'สุขุมวิท 39',
        type: 'Condo',
        property_condition: 'new',
        images: JSON.stringify(['demo/condo1.jpg']),
        facilities: JSON.stringify(['สระว่ายน้ำ', 'ฟิตเนส', 'ที่จอดรถ', 'รปภ. 24 ชม.']),
        nearby_places: 'BTS พร้อมพงษ์, EmQuartier',
        province: 'กรุงเทพมหานคร',
        district: 'วัฒนา',
        subdistrict: 'คลองตันเหนือ',
        postal_code: '10110',
        status: 'active'
      },
      {
        user_id: 3,
        title: 'บ้านเดี่ยว 2 ชั้น หมู่บ้านหรู',
        description: 'บ้านเดี่ยว 4 ห้องนอน 3 ห้องน้ำ พร้อมสวนหลังบ้าน ในหมู่บ้านปิดล้อม รปภ. 24 ชม.',
        price: 8900000,
        location: 'รังสิต-นครนายก',
        type: 'House',
        property_condition: 'used',
        images: JSON.stringify(['demo/house1.jpg']),
        facilities: JSON.stringify(['สวน', 'ที่จอดรถ 2 คัน', 'ครัวไทย', 'ห้องนั่งเล่น']),
        nearby_places: 'ตลาดสด, โรงเรียน, โรงพยาบาล',
        province: 'ปทุมธานี',
        district: 'ธัญบุรี',
        subdistrict: 'ประชาธิปัตย์',
        postal_code: '12130',
        status: 'active'
      },
      {
        user_id: 3,
        title: 'ที่ดินเปล่า ติดถนนใหญ่',
        description: 'ที่ดินเปล่า 100 ตารางวา ติดถนน 4 เลน เหมาะสร้างบ้าน หรือทำธุรกิจ',
        price: 2500000,
        location: 'ถนนบางนา-ตราด',
        type: 'Land',
        property_condition: 'new',
        images: JSON.stringify(['demo/land1.jpg']),
        facilities: JSON.stringify([]),
        nearby_places: 'ใกล้ห้างบิ๊กซี, ตลาด',
        province: 'ชลบุรี',
        district: 'บางละมุง',
        subdistrict: 'นาจอมเทียน',
        postal_code: '20150',
        status: 'active'
      },
      {
        user_id: 3,
        title: 'อาคารพาณิชย์ 4 ชั้น ริมถนน',
        description: 'อาคารพาณิชย์ 4 ชั้น เหมาะทำออฟฟิศ หรือเปิดร้านค้า ทำเลดี ผู้คนพลุกพล่าน',
        price: 15000000,
        location: 'รัชดาภิเษก',
        type: 'Commercial',
        property_condition: 'used',
        images: JSON.stringify(['demo/commercial1.jpg']),
        facilities: JSON.stringify(['ที่จอดรถ', 'ลิฟท์', 'กล้องวงจรปิด']),
        nearby_places: 'MRT ลาดพร้าว, ห้างเซ็นทรัล',
        province: 'กรุงเทพมหานคร',
        district: 'จตุจักร',
        subdistrict: 'จอมพล',
        postal_code: '10900',
        status: 'active'
      }
    ],

    ads: [
      { image: 'ads/banner_top.png', link: 'https://example.com', position: 'banner_top', active: true },
      { image: 'ads/bento_1.png', link: 'https://example.com', position: 'bento_1', active: true },
      { image: 'ads/bento_2.png', link: 'https://example.com', position: 'bento_2', active: true },
      { image: 'ads/bento_3.png', link: 'https://example.com', position: 'bento_3', active: true },
      { image: 'ads/bento_4.png', link: 'https://example.com', position: 'bento_4', active: true }
    ]
  };
}

// ============================================
// SETUP FUNCTIONS
// ============================================

async function dropAllTables(db) {
  console.log('🗑️  Dropping all tables...');

  // Disable foreign key checks
  await db.query('SET FOREIGN_KEY_CHECKS = 0');

  const tableNames = Object.keys(TABLES).reverse();
  for (const table of tableNames) {
    await db.query(`DROP TABLE IF EXISTS ${table}`);
    console.log(`   Dropped: ${table}`);
  }

  // Re-enable foreign key checks
  await db.query('SET FOREIGN_KEY_CHECKS = 1');
}

async function createTables(db) {
  console.log('📦 Creating tables...');

  for (const [name, schema] of Object.entries(TABLES)) {
    await db.query(schema);
    console.log(`   ✓ Created: ${name}`);
  }
}

async function seedData(db) {
  console.log('🌱 Seeding data...');

  const data = await getSeedData();

  // Seed Users
  console.log('   → Inserting users...');
  for (const user of data.users) {
    await db.execute(
      'INSERT INTO users (username, email, password_hash, role, status, email_verified_at) VALUES (?, ?, ?, ?, ?, ?)',
      [user.username, user.email, user.password_hash, user.role, user.status, user.email_verified_at]
    );
  }
  console.log(`   ✓ ${data.users.length} users created`);

  // Seed Settings
  console.log('   → Inserting settings...');
  for (const setting of data.settings) {
    await db.execute(
      'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)',
      [setting.key, setting.value]
    );
  }
  console.log(`   ✓ ${data.settings.length} settings configured`);

  // Seed Listings
  console.log('   → Inserting sample listings...');
  for (const listing of data.listings) {
    await db.execute(
      `INSERT INTO listings (user_id, title, description, price, location, type, property_condition, images, facilities, nearby_places, province, district, subdistrict, postal_code, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        listing.user_id, listing.title, listing.description, listing.price,
        listing.location, listing.type, listing.property_condition,
        listing.images, listing.facilities, listing.nearby_places,
        listing.province, listing.district, listing.subdistrict, listing.postal_code, listing.status
      ]
    );
  }
  console.log(`   ✓ ${data.listings.length} sample listings created`);

  // Seed Ads
  console.log('   → Inserting ads...');
  for (const ad of data.ads) {
    await db.execute(
      'INSERT INTO ads (image, link, position, active) VALUES (?, ?, ?, ?)',
      [ad.image, ad.link, ad.position, ad.active]
    );
  }
  console.log(`   ✓ ${data.ads.length} ads configured`);
}

// ============================================
// MAIN
// ============================================

async function setupDatabase() {
  const args = process.argv.slice(2);
  const shouldSeed = args.includes('--seed');
  const shouldReset = args.includes('--reset');

  console.log('\n============================================');
  console.log('🏠 Asset Sale - Database Setup');
  console.log('============================================\n');

  try {
    // Connect without database first
    const connection = await mysql.createConnection(dbConfig);

    // Create Database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✓ Database "${DB_NAME}" ready.\n`);
    await connection.end();

    // Connect to the specific database
    const db = await mysql.createConnection({
      ...dbConfig,
      database: DB_NAME
    });

    if (shouldReset) {
      await dropAllTables(db);
      console.log('');
    }

    await createTables(db);
    console.log('');

    if (shouldSeed || shouldReset) {
      await seedData(db);
      console.log('');
    }

    console.log('============================================');
    console.log('✅ Database setup completed successfully!');
    console.log('============================================\n');

    if (shouldSeed || shouldReset) {
      console.log('📋 Default Accounts:');
      console.log('   Superadmin: superadmin@assetsale.com / admin123');
      console.log('   Admin:      admin@assetsale.com / admin123');
      console.log('   User:       user@assetsale.com / user123\n');
    }

    await db.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error setting up database:', error.message);
    console.error(error);
    process.exit(1);
  }
}

setupDatabase();
