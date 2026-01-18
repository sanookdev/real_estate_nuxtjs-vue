/**
 * ============================================
 * Database Setup & Seed Script (PostgreSQL/Supabase)
 * Asset Sale Real Estate Platform
 * ============================================
 * 
 * Usage:
 *   node setupDb.js          - Create tables only
 *   node setupDb.js --seed   - Create tables + insert sample data
 *   node setupDb.js --reset  - Drop all tables, recreate, and seed
 * 
 * Make sure to set your .env file first:
 *   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
 * ============================================
 */

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// ============================================
// ENUM TYPES (PostgreSQL)
// ============================================

const ENUM_TYPES = `
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
`;

// ============================================
// TABLE SCHEMAS (PostgreSQL)
// ============================================

const TABLES = {
  users: `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            phone VARCHAR(20) DEFAULT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role user_role DEFAULT 'user',
            status user_status DEFAULT 'pending',
            email_verified_at TIMESTAMP DEFAULT NULL,
            verification_token VARCHAR(255) DEFAULT NULL,
            reset_password_token VARCHAR(255) DEFAULT NULL,
            reset_password_expires TIMESTAMP DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `,

  pending_verifications: `
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
        )
    `,

  listings: `
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
        )
    `,

  favorites: `
        CREATE TABLE IF NOT EXISTS favorites (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            listing_id INT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, listing_id)
        )
    `,

  ads: `
        CREATE TABLE IF NOT EXISTS ads (
            id SERIAL PRIMARY KEY,
            image VARCHAR(500),
            link VARCHAR(500),
            position ad_position NOT NULL,
            active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `,

  settings: `
        CREATE TABLE IF NOT EXISTS settings (
            id SERIAL PRIMARY KEY,
            setting_key VARCHAR(100) NOT NULL UNIQUE,
            setting_value TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `,

  contact_messages: `
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
        )
    `
};

// ============================================
// INDEXES
// ============================================

const INDEXES = [
  'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
  'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',
  'CREATE INDEX IF NOT EXISTS idx_users_status ON users(status)',
  'CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_password_token)',
  'CREATE INDEX IF NOT EXISTS idx_pending_email ON pending_verifications(email)',
  'CREATE INDEX IF NOT EXISTS idx_pending_reg_token ON pending_verifications(registration_token)',
  'CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status)',
  'CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type)',
  'CREATE INDEX IF NOT EXISTS idx_listings_province ON listings(province)',
  'CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price)',
  'CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at)',
  'CREATE INDEX IF NOT EXISTS idx_listings_is_pinned ON listings(is_pinned)',
  'CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id)',
  'CREATE INDEX IF NOT EXISTS idx_favorites_listing_id ON favorites(listing_id)',
  'CREATE INDEX IF NOT EXISTS idx_ads_position ON ads(position)',
  'CREATE INDEX IF NOT EXISTS idx_ads_active ON ads(active)',
  'CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(setting_key)',
  'CREATE INDEX IF NOT EXISTS idx_contact_is_read ON contact_messages(is_read)',
  'CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_messages(created_at)'
];

// ============================================
// TRIGGERS for updated_at
// ============================================

const TRIGGERS = `
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

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
`;

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

async function dropAllTables(client) {
  console.log('🗑️  Dropping all tables...');

  const tableNames = Object.keys(TABLES).reverse();
  for (const table of tableNames) {
    await client.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
    console.log(`   Dropped: ${table}`);
  }

  // Drop ENUM types
  console.log('   Dropping ENUM types...');
  await client.query(`
    DROP TYPE IF EXISTS user_role CASCADE;
    DROP TYPE IF EXISTS user_status CASCADE;
    DROP TYPE IF EXISTS property_condition CASCADE;
    DROP TYPE IF EXISTS listing_status CASCADE;
    DROP TYPE IF EXISTS ad_position CASCADE;
  `);
}

async function createTables(client) {
  console.log('📦 Creating ENUM types...');
  await client.query(ENUM_TYPES);

  console.log('📦 Creating tables...');
  for (const [name, schema] of Object.entries(TABLES)) {
    await client.query(schema);
    console.log(`   ✓ Created: ${name}`);
  }

  console.log('📦 Creating indexes...');
  for (const indexSql of INDEXES) {
    await client.query(indexSql);
  }
  console.log(`   ✓ ${INDEXES.length} indexes created`);

  console.log('📦 Creating triggers...');
  await client.query(TRIGGERS);
  console.log('   ✓ Triggers created');
}

async function seedData(client) {
  console.log('🌱 Seeding data...');

  const data = await getSeedData();

  // Seed Users
  console.log('   → Inserting users...');
  for (const user of data.users) {
    await client.query(
      'INSERT INTO users (username, email, password_hash, role, status, email_verified_at) VALUES ($1, $2, $3, $4, $5, $6)',
      [user.username, user.email, user.password_hash, user.role, user.status, user.email_verified_at]
    );
  }
  console.log(`   ✓ ${data.users.length} users created`);

  // Seed Settings
  console.log('   → Inserting settings...');
  for (const setting of data.settings) {
    await client.query(
      `INSERT INTO settings (setting_key, setting_value) VALUES ($1, $2) 
       ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value`,
      [setting.key, setting.value]
    );
  }
  console.log(`   ✓ ${data.settings.length} settings configured`);

  // Seed Listings
  console.log('   → Inserting sample listings...');
  for (const listing of data.listings) {
    await client.query(
      `INSERT INTO listings (user_id, title, description, price, location, type, property_condition, images, facilities, nearby_places, province, district, subdistrict, postal_code, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
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
    await client.query(
      'INSERT INTO ads (image, link, position, active) VALUES ($1, $2, $3, $4)',
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
  console.log('🏠 Asset Sale - Database Setup (PostgreSQL)');
  console.log('============================================\n');

  const client = await pool.connect();

  try {
    console.log('✓ Connected to PostgreSQL database.\n');

    if (shouldReset) {
      await dropAllTables(client);
      console.log('');
    }

    await createTables(client);
    console.log('');

    if (shouldSeed || shouldReset) {
      await seedData(client);
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

  } catch (error) {
    console.error('\n❌ Error setting up database:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
    process.exit(0);
  }
}

setupDatabase();
