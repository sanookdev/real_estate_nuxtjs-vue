const db = require('./config/db');

async function migrate() {
    try {
        console.log('Adding inactive status to listings table...');

        // Modify the ENUM to include 'inactive'
        await db.execute(`
            ALTER TABLE listings 
            MODIFY COLUMN status ENUM('pending', 'active', 'rejected', 'sold', 'inactive') NOT NULL DEFAULT 'pending'
        `);
        console.log('Status ENUM updated successfully - inactive status added');

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
