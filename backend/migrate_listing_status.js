
const db = require('./config/db');

async function migrate() {
    try {
        console.log('Adding status column to listings table...');

        // Check if column exists
        const [rows] = await db.execute("SHOW COLUMNS FROM listings LIKE 'status'");

        if (rows.length === 0) {
            await db.execute(`
                ALTER TABLE listings 
                ADD COLUMN status ENUM('pending', 'active', 'rejected', 'sold') NOT NULL DEFAULT 'pending'
            `);
            console.log('Status column added successfully');

            // Set existing listings to active (optional, but good for existing data)
            await db.execute("UPDATE listings SET status = 'active' WHERE status = 'pending'");
            console.log('Existing listings updated to active');
        } else {
            console.log('Status column already exists');
        }

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
