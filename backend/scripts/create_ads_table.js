const db = require('../config/db');

async function createTable() {
    try {
        console.log('Creating ads table...');
        await db.execute(`
            CREATE TABLE IF NOT EXISTS ads (
                id INT AUTO_INCREMENT PRIMARY KEY,
                image VARCHAR(255),
                link VARCHAR(255),
                position VARCHAR(50) DEFAULT 'banner',
                active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Table created or already exists.');

        console.log('Seeding demo data...');
        // Check if data exists
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM ads');
        if (rows[0].count === 0) {
            await db.execute(`
                INSERT INTO ads (image, link, position, active) VALUES 
                ('ads/demo_banner.jpg', '#', 'banner-top', 1),
                ('ads/demo_bento1.jpg', '#', 'bento-1', 1),
                ('ads/demo_bento2.jpg', '#', 'bento-2', 1),
                ('ads/demo_bento3.jpg', '#', 'bento-3', 1),
                ('ads/demo_bento4.jpg', '#', 'bento-4', 1)
            `);
            console.log('Demo data seeded.');
        } else {
            console.log('Data already exists, skipping seed.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createTable();
